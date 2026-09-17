import { Client, Account, Databases, Storage, Query, ID, Messaging, Avatars, Locale, Realtime } from "appwrite";

// Use Vite env (import.meta.env) in the browser instead of node's process.env
const VITE_APPWRITE_ENDPOINT = import.meta.env.VITE_PUBLIC_APPWRITE_ENDPOINT || '';
const VITE_APPWRITE_PROJECT_ID = import.meta.env.VITE_PUBLIC_APPWRITE_PROJECT_ID || '';

// Check if Appwrite is configured
export const isAppwriteConfigured = !!(VITE_APPWRITE_ENDPOINT && VITE_APPWRITE_PROJECT_ID);

// Export database and bucket IDs
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_PUBLIC_APPWRITE_DATABASE_ID || '';
export const APPWRITE_BUCKET_ID = import.meta.env.VITE_PUBLIC_APPWRITE_BUCKET_ID || '';

// Collection IDs for the CMS
export const COLLECTIONS = {
  HIGHLIGHTS: 'highlights',
  SITE_PHOTOS: 'site_photos',
  SPONSORS: 'sponsors',
  TEAM: 'team',
  SPEAKERS: 'speakers',
  PANELISTS: 'panelists',
  TESTIMONIALS: 'testimonials',
  ABOUT: 'about',
  FAQ: 'faq',
  ANNOUNCEMENTS: 'announcements',
  COMMUNITY_APPLICATIONS: 'community_applications',
} as const;

const client = new Client();

if (VITE_APPWRITE_ENDPOINT && VITE_APPWRITE_PROJECT_ID) {
  client.setEndpoint(VITE_APPWRITE_ENDPOINT).setProject(VITE_APPWRITE_PROJECT_ID);
}

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const messaging = new Messaging(client);
const avatars = new Avatars(client);
const locale = new Locale(client);
const realtime = new Realtime(client);

// Helper to get image URL. Returns the `view` URL so we do not rely on server-side
// image transformations (width/height) which may be blocked by the Appwrite plan.
// This keeps behavior simple and reliable: the returned URL is always the file `view` URL.
export const getImageUrl = (fileId: string) => {
  if (!APPWRITE_BUCKET_ID || !fileId) return '';

  try {
    return storage.getFileView(APPWRITE_BUCKET_ID, fileId).toString();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('getFileView failed for fileId:', fileId, err);
    return '';
  }
};

// Backwards-compatible wrapper: keep the old helper but delegate to getImageUrl
// NOTE: width/height support has been removed—size should be handled on the client side.
export const getFilePreview = (fileId: string) => {
  return getImageUrl(fileId);
};

// Helper function to get file view URL
export const getFileView = (fileId: string) => {
  if (!APPWRITE_BUCKET_ID || !fileId) return '';
  return storage.getFileView(APPWRITE_BUCKET_ID, fileId).toString();
};



export { client, account, databases, storage, Query, ID, messaging, avatars, locale };