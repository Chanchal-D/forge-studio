
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Brands from "./pages/Brands";
import Manufacturers from "./pages/Manufacturers";
import Inventory from "./pages/Inventory";
import POD from "./pages/POD";
import RequireAuth from "./components/RequireAuth";

const App = () => {
  // Create a client instance with useState to ensure it's properly initialized
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected routes */}
              <Route path="/brands" element={
                <RequireAuth userType="brand">
                  <Brands />
                </RequireAuth>
              } />
              
              <Route path="/manufacturers" element={
                <RequireAuth userType="manufacturer">
                  <Manufacturers />
                </RequireAuth>
              } />
              
              <Route path="/inventory" element={
                <RequireAuth>
                  <Inventory />
                </RequireAuth>
              } />
              
              <Route path="/pod" element={<POD />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
