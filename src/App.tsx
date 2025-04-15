
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TonConnectProvider } from "./contexts/TonConnectContext";
import { TelegramProvider } from "./contexts/TelegramContext";
import Index from "./pages/Index";
import Earnings from "./pages/Earnings";
import Memepad from "./pages/Memepad";
import CreateToken from "./pages/CreateToken";
import TokenSuccess from "./pages/TokenSuccess";
import TokenDetails from "./pages/TokenDetails";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TelegramProvider>
        <TonConnectProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/memepad" element={<Memepad />} />
              <Route path="/create-token" element={<CreateToken />} />
              <Route path="/token-success" element={<TokenSuccess />} />
              <Route path="/token/:id" element={<TokenDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TonConnectProvider>
      </TelegramProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
