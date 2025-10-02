import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import Team from "./pages/Team";
import EnhancedTeam from "./pages/EnhancedTeam";
import Videos from "./pages/Videos";
import EnhancedVideos from "./pages/EnhancedVideos";
import Tasks from "./pages/Tasks";
import Resources from "./pages/Resources";
import EnhancedResources from "./pages/EnhancedResources";
import EmployeeProfile from "./pages/EmployeeProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="tomo-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<EnhancedDashboard />} />
            <Route path="/dashboard/classic" element={<Dashboard />} />
            <Route path="/team" element={<EnhancedTeam />} />
            <Route path="/team/classic" element={<Team />} />
            <Route path="/videos" element={<EnhancedVideos />} />
            <Route path="/videos/classic" element={<Videos />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/resources" element={<EnhancedResources />} />
            <Route path="/resources/classic" element={<Resources />} />
            <Route path="/profile/:employeeId" element={<EmployeeProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
