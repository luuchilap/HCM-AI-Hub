import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Team from "./pages/Team";
import TeamMemberDetail from "./pages/TeamMemberDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Collaborate from "./pages/Collaborate";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import ContactsAdmin from "./pages/admin/ContactsAdmin";
import NewsletterAdmin from "./pages/admin/NewsletterAdmin";
import EventsAdmin from "./pages/admin/EventsAdmin";
import EventForm from "./pages/admin/EventForm";
import RegistrationsAdmin from "./pages/admin/RegistrationsAdmin";
import CollaborationsAdmin from "./pages/admin/CollaborationsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:memberId" element={<TeamMemberDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/collaborate" element={<Collaborate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="contacts" element={<ContactsAdmin />} />
              <Route path="newsletter" element={<NewsletterAdmin />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/:id/edit" element={<EventForm />} />
              <Route path="events/:eventId/registrations" element={<RegistrationsAdmin />} />
              <Route path="collaborations" element={<CollaborationsAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
