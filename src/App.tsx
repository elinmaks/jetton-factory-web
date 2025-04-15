
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { TonConnectProvider } from "./contexts/TonConnectContext";
import { TelegramProvider } from "./contexts/TelegramContext";
import { useEffect } from "react";
import { telegramBackButton } from "@/utils/telegram";
import Index from "./pages/Index";
import Earnings from "./pages/Earnings";
import Memepad from "./pages/Memepad";
import CreateToken from "./pages/CreateToken";
import TokenSuccess from "./pages/TokenSuccess";
import TokenDetails from "./pages/TokenDetails";
import Friends from "./pages/Friends";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Route listener component for Telegram back button
const RouteListener = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Track navigation for back button
    const isRootPath = location.pathname === '/';
    
    if (isRootPath) {
      telegramBackButton.hide();
    } else {
      telegramBackButton.show();
      telegramBackButton.onClick(() => {
        navigate(-1);
      });
    }
    
    return () => {
      telegramBackButton.offClick(() => navigate(-1));
    };
  }, [location.pathname, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TelegramProvider>
        <TonConnectProvider>
          <BrowserRouter>
            <RouteListener />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/memepad" element={<Memepad />} />
              <Route path="/create-token" element={<CreateToken />} />
              <Route path="/token-success" element={<TokenSuccess />} />
              <Route path="/token/:id" element={<TokenDetails />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TonConnectProvider>
      </TelegramProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
