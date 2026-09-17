import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { account, databases, isAppwriteConfigured, APPWRITE_DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Models, ID, OAuthProvider } from 'appwrite';

export type UserRole = 'admin' | 'member' | 'guest';

interface User extends Models.User<Models.Preferences> { }

interface UserProfile {
  $id: string;
  userId: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  birthday?: string;
  gender?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  role: UserRole;
  isAdmin: boolean;
  isMember: boolean;
  needsProfileCompletion: boolean;
  hasRole: (role: UserRole) => boolean;

  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithOAuth: (redirectPath?: string) => Promise<void>;

  // Password management
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  deleteSessions: () => Promise<void>;

  // Profile management
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateEmail: (email: string, password: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  completeProfile: (data: ProfileData) => Promise<void>;

  // Account verification
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<void>;

  // Preferences
  updatePreferences: (prefs: Models.Preferences) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_COLLECTION_ID = 'user_profiles'; // Configure in Appwrite

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive role from user labels
  const role: UserRole = useMemo(() => {
    if (!user) return 'guest';
    if (user.labels?.includes('admin')) return 'admin';
    return 'member';
  }, [user]);

  const isAdmin = role === 'admin';
  const isMember = role === 'member';

  const hasRole = (r: UserRole) => role === r;

  // Check if user needs to complete their profile (birthday/gender)
  const needsProfileCompletion = useMemo(() => {
    if (!user) return false;
    return !(user.prefs as Record<string, unknown>)?.['profileComplete'];
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!isAppwriteConfigured) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await account.get();
      setUser(currentUser);
      await fetchProfile(currentUser.$id);
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        PROFILE_COLLECTION_ID,
        userId
      );
      setProfile(response as unknown as UserProfile);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await account.createEmailPasswordSession({ email, password });
      const currentUser = await account.get();
      setUser(currentUser);
      await fetchProfile(currentUser.$id);
    } catch (err: any) {
      // Detect Appwrite "route not found" or HTML error page and provide
      // a helpful message pointing to common misconfiguration causes.
      let message = err?.message || 'Login failed';

      const bodyType = err?.response?.body?.type || err?.type || '';
      const isRouteNotFound = bodyType === 'general_route_not_found' || /Page not found/i.test(message) || /general_route_not_found/i.test(message) || err?.response?.status === 404;

      if (isRouteNotFound) {
        message = 'Appwrite route not found (404). Verify VITE_PUBLIC_APPWRITE_ENDPOINT is the base URL (no /v1) and VITE_PUBLIC_APPWRITE_PROJECT_ID is set in production, then rebuild.';
      }

      setError(message);
      // Re-throw an Error with the friendly message so callers (pages) can display it
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setError(null);
    try {
      const userId = ID.unique();
      await account.create({userId, email, password, name});
      await account.createEmailPasswordSession({email, password});

      // Create user profile
      const profileData: Partial<UserProfile> = {
        userId,
        displayName: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await databases.createDocument(
          APPWRITE_DATABASE_ID,
          PROFILE_COLLECTION_ID,
          userId,
          profileData
        );
      } catch (profileErr) {
        console.error('Profile creation error:', profileErr);
      }


      const currentUser = await account.get();
      setUser(currentUser);
      await fetchProfile(currentUser.$id);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await account.deleteSession({ sessionId: 'current' });
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  const loginWithOAuth = async (redirectPath: string = '/dashboard') => {
    setError(null);
    try {
      // Allow overriding the success redirect (e.g., '/' for homepage prompt)
      const successURL = `${window.location.origin}${redirectPath}`;
      const failureURL = `${window.location.origin}/dashboard/login`;
      account.createOAuth2Session({
        provider: OAuthProvider.Google,
        success: successURL,
        failure: failureURL,
      });
    } catch (err: any) {
      setError(err.message || 'OAuth login failed');
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    setError(null);
    try {
      const url = `${window.location.origin}/auth/reset-password`;
      await account.createRecovery({email, url});
    } catch (err: any) {
      setError(err.message || 'Password recovery failed');
      throw err;
    }
  };

  const resetPassword = async (userId: string, secret: string, password: string) => {
    setError(null);
    try {
      await account.updateRecovery({ userId, secret, password });
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    setError(null);
    try {
      await account.updatePassword({ password: newPassword, oldPassword });
    } catch (err: any) {
      setError(err.message || 'Password update failed');
      throw err;
    }
  };

  const refreshSession = async () => {
    setError(null);
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      await fetchProfile(currentUser.$id);
    } catch (err: any) {
      setError(err.message || 'Session refresh failed');
      setUser(null);
      setProfile(null);
      throw err;
    }
  };

  const deleteSession = async (sessionId: string) => {
    setError(null);
    try {
      await account.deleteSession({ sessionId });
      if (sessionId === 'current') {
        setUser(null);
        setProfile(null);
      }
    } catch (err: any) {
      setError(err.message || 'Session deletion failed');
      throw err;
    }
  };

  const deleteSessions = async () => {
    setError(null);
    try {
      await account.deleteSessions();
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message || 'Sessions deletion failed');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setError(null);
    if (!user) throw new Error('No user logged in');

    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      const response = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        PROFILE_COLLECTION_ID,
        user.$id,
        updatedData
      );

      setProfile(response as unknown as UserProfile);
    } catch (err: any) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  const updateEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await account.updateEmail({ email, password });
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Email update failed');
      throw err;
    }
  };

  const updateName = async (name: string) => {
    setError(null);
    try {
      await account.updateName({ name });
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Name update failed');
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    setError(null);
    try {
      const redirectUrl = `${window.location.origin}/auth/verify`;
      await account.createVerification({ url: redirectUrl });
    } catch (err: any) {
      setError(err.message || 'Verification email failed');
      throw err;
    }
  };

  const verifyEmail = async (userId: string, secret: string) => {
    setError(null);
    try {
      await account.updateVerification({ userId, secret });
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Email verification failed');
      throw err;
    }
  };

  const updatePreferences = async (prefs: Models.Preferences) => {
    setError(null);
    try {
      await account.updatePrefs({ prefs });
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Preferences update failed');
      throw err;
    }
  };

  /** Save birthday, gender, picture and mark profile as complete */
  const completeProfile = async (data: ProfileData) => {
    setError(null);
    if (!user) throw new Error('No user logged in');

    try {
      const currentPrefs = (user.prefs || {}) as Record<string, unknown>;
      await account.updatePrefs({
        prefs: {
          ...currentPrefs,
          birthday: data.birthday || currentPrefs['birthday'] || '',
          gender: data.gender || currentPrefs['gender'] || '',
          picture: data.picture || currentPrefs['picture'] || '',
          profileComplete: true,
          profileCompletedAt: new Date().toISOString(),
        }
      });
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (err: any) {
      setError(err.message || 'Profile completion failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        role,
        isAdmin,
        isMember,
        needsProfileCompletion,
        hasRole,
        login,
        register,
        logout,
        loginWithOAuth,
        forgotPassword,
        resetPassword,
        updatePassword,
        refreshSession,
        deleteSession,
        deleteSessions,
        updateProfile,
        updateEmail,
        updateName,
        completeProfile,
        sendVerificationEmail,
        verifyEmail,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};