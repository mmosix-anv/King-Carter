import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminProvider } from "./contexts/AdminContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ServicePage from "./pages/ServicePage";
import Experience from "./pages/Experience";
import BecomeAMember from "./pages/BecomeAMember";
import ClientLogin from "./pages/ClientLogin";
import Reservations from "./pages/Reservations";
import Test from "./pages/Test";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Fleet from "./pages/Fleet";

// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Services from "./pages/admin/Services";
import ServiceEditor from "./pages/admin/ServiceEditor";
import FleetAdmin from "./pages/admin/Fleet";
import FleetEditor from "./pages/admin/FleetEditor";
import Media from "./pages/admin/Media";
import Settings from "./pages/admin/Settings";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import Newsletter from "./pages/admin/Newsletter";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/experience" component={Experience} />
      <Route path="/become-a-member" component={BecomeAMember} />
      <Route path="/login" component={ClientLogin} />
      <Route path="/reservations" component={Reservations} />
      <Route path="/test" component={Test} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/fleet" component={Fleet} />
      <Route path="/services/:slug" component={ServicePage} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/services" component={() => (
        <ProtectedRoute>
          <Services />
        </ProtectedRoute>
      )} />
      <Route path="/admin/services/:id" component={() => (
        <ProtectedRoute>
          <ServiceEditor />
        </ProtectedRoute>
      )} />
      <Route path="/admin/fleet" component={() => (
        <ProtectedRoute>
          <FleetAdmin />
        </ProtectedRoute>
      )} />
      <Route path="/admin/fleet/:id" component={() => (
        <ProtectedRoute>
          <FleetEditor />
        </ProtectedRoute>
      )} />
      <Route path="/admin/media">
        <ProtectedRoute>
          <Media />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/contact-submissions">
        <ProtectedRoute>
          <ContactSubmissions />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/newsletter">
        <ProtectedRoute>
          <Newsletter />
        </ProtectedRoute>
      </Route>
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AdminProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
