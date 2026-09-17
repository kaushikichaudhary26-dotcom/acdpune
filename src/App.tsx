import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import Preloader from "@/components/Preloader";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WomenInTechPage from "./pages/WomenInTech";
import { initFirebase, trackPageView } from "@/lib/firebase";
import NotificationPrompt from "@/components/NotificationPrompt";
import LoginPrompt from "@/components/LoginPrompt";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";
import { useAuth } from "@/hooks/use-auth";

const queryClient = new QueryClient();

/** Tracks page views on every route change via Firebase Analytics */
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [hasSeenPreloader, setHasSeenPreloader] = useState(false);

  useEffect(() => {
    // Check if user has already seen the preloader in this session
    const seen = sessionStorage.getItem('preloaderSeen');
    if (seen) {
      setShowPreloader(false);
      setHasSeenPreloader(true);
    }
  }, []);

  // Initialise Firebase services once on mount
  useEffect(() => {
    initFirebase();
  }, []);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    setHasSeenPreloader(true);
    sessionStorage.setItem('preloaderSeen', 'true');
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              {showPreloader && !hasSeenPreloader && (
                <Preloader onComplete={handlePreloaderComplete} />
              )}
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteTracker />
                <AppShell />
              </BrowserRouter>
              <NotificationPrompt preloaderDone={hasSeenPreloader} />
              <LoginPrompt preloaderDone={hasSeenPreloader} />
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

/** Inner shell that has access to AuthProvider context */
const AppShell = () => {
  const { needsProfileCompletion, user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Show profile completion modal after login if needed
  useEffect(() => {
    if (user && needsProfileCompletion) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setShowProfileModal(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowProfileModal(false);
    }
  }, [user, needsProfileCompletion]);

  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/her-tech-era" element={<WomenInTechPage />} />
          <Route path="/dashboard/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <ProfileCompletionModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default App;

