
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import TokenLogo from './TokenLogo';
import { useTonConnect } from '@/contexts/TonConnectContext';
import { useTelegram } from '@/contexts/TelegramContext';
import useTelegramAuth from '@/hooks/useTelegramAuth';
import { hapticFeedback } from '@/utils/telegram';

const formSchema = z.object({
  name: z.string().min(1, "Token name is required").max(30, "Maximum 30 characters"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Maximum 10 characters"),
  description: z.string().max(500, "Maximum 500 characters").optional(),
  amount: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Must be a positive number"),
});

const TokenForm = () => {
  const navigate = useNavigate();
  const { connected, deployToken } = useTonConnect();
  const { isInTelegram } = useTelegram();
  const { isAuthenticated: isTelegramAuthenticated } = useTelegramAuth();
  const [logo, setLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      amount: "1000000",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!connected && !isInTelegram) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (isInTelegram && !isTelegramAuthenticated) {
      toast.error("Telegram authentication required");
      return;
    }

    setIsSubmitting(true);
    if (isInTelegram) {
      hapticFeedback.impact('medium');
    }

    try {
      // Ensure all required fields are included in tokenParams
      const tokenParams = {
        name: values.name,
        symbol: values.symbol,
        description: values.description || "",
        amount: values.amount,
        image: logo,
      };

      // Call deploy function from context
      // For Telegram users, we would handle this differently
      const result = isInTelegram 
        ? { success: true, jettonAddress: "telegram-mock-address" } 
        : await deployToken(tokenParams);

      if (result.success && result.jettonAddress) {
        if (isInTelegram) {
          hapticFeedback.notification('success');
        }
        
        // Navigate to success page with the result
        navigate("/token-success", { 
          state: { 
            token: {
              ...values, 
              logoUrl: logo ? URL.createObjectURL(logo) : null
            },
            deploymentResult: result 
          } 
        });
      } else {
        if (isInTelegram) {
          hapticFeedback.notification('error');
        }
        toast.error(result.error || "Failed to deploy token");
      }
    } catch (error) {
      console.error("Error during token deployment:", error);
      if (isInTelegram) {
        hapticFeedback.notification('error');
      }
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <TokenLogo 
            logo={logo} 
            onChange={setLogo} 
            className="mb-6"
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Awesome Token" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Symbol</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MAT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Supply</FormLabel>
              <FormControl>
                <Input type="number" min="1" step="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your token..."
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full token-gradient" 
          disabled={isSubmitting || (!connected && !isTelegramAuthenticated)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Token...
            </>
          ) : (
            "Create Token"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TokenForm;
