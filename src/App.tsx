import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/hooks/useI18n";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Reviews from "./pages/Reviews";
import ReviewVerify from "./pages/ReviewVerify";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResetSlots from "./pages/AdminResetSlots";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Barrierefreiheit from "./pages/Barrierefreiheit";
import Bewerbungshilfe from "./pages/Bewerbungshilfe";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <SecurityHeaders />
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/review-verify" element={<ReviewVerify />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reset-slots" element={<AdminResetSlots />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/barrierefreiheit" element={<Barrierefreiheit />} />
          <Route path="/bewerbungshilfe" element={<Bewerbungshilfe />} />
          <Route path="/tools" element={<Tools />} />
          {/* Redirects for old routes */}
          <Route path="/bewerbungshilfe-anfragen" element={<Bewerbungshilfe />} />
          <Route path="/termin-buchen" element={<Bewerbungshilfe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
