import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { reactQueryCacheConfig } from "@/lib/cache";
import { useUserMonitoring } from "@/hooks/useUserMonitoring";
import { useAdminMonitoring } from "@/hooks/useAdminMonitoring";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMonitoring from "./pages/AdminMonitoring";
import SiteMonitoringDashboard from "./pages/SiteMonitoringDashboard";
import EnhancedTeamV2 from "./pages/EnhancedTeamV2";
import Videos from "./pages/Videos";
import EnhancedVideos from "./pages/EnhancedVideos";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import EnhancedResources from "./pages/EnhancedResources";
import EmployeeProfile from "./pages/EmployeeProfile";
import TestProfile from "./pages/TestProfile";
import ProductionAnalytics from "./pages/ProductionAnalytics";
import HealthCheck from "./pages/HealthCheck";
import UserMonitoring from "./pages/UserMonitoring";
import { PhotoDebugPage } from "./pages/PhotoDebug";
import SimplePhotoTest from "./pages/SimplePhotoTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient(reactQueryCacheConfig);

// Component to handle user monitoring
const AppWithMonitoring = () => {
  // Initialize user monitoring for all page visits
  useUserMonitoring({
    enabled: true,
    trackPageViews: true,
    trackClicks: false // Can be enabled for detailed click tracking
  });

  // Initialize admin monitoring (only tracks when admin is logged in)
  useAdminMonitoring();

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/monitoring" element={<AdminMonitoring />} />
        <Route path="/admin/site-monitoring" element={<SiteMonitoringDashboard />} />
        <Route path="/dashboard" element={<EnhancedDashboard />} />
        <Route path="/dashboard/classic" element={<Dashboard />} />
        <Route path="/team" element={<EnhancedTeamV2 />} />
        <Route path="/videos" element={<EnhancedVideos />} />
        <Route path="/videos/classic" element={<Videos />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/resources" element={<EnhancedResources />} />
        <Route path="/resources/classic" element={<Resources />} />
        <Route path="/profile/:employeeId" element={<EmployeeProfile />} />
        <Route path="/test-profile" element={<TestProfile />} />
        <Route path="/analytics" element={<ProductionAnalytics />} />
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/monitoring" element={<UserMonitoring />} />
        <Route path="/photo-debug" element={<PhotoDebugPage />} />
        <Route path="/photo-test" element={<SimplePhotoTest />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="tomo-ui-theme">
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppWithMonitoring />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
