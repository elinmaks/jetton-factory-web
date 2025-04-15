
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
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

interface TokenFormProps {
  onSubmit: (values: z.infer<typeof formSchema> & { logoUrl?: string }) => void;
}

const TokenForm = ({ onSubmit }: TokenFormProps) => {
  const { connected } = useTonConnect();
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
      let logoUrl: string | undefined = undefined;
      
      if (logo) {
        // Here you could upload the logo to storage
        // and get back a URL, for now we'll just create a blob URL
        logoUrl = URL.createObjectURL(logo);
      }
      
      // Call the onSubmit callback with the form values and logo URL
      onSubmit({ 
        ...values, 
        logoUrl 
      });
      
    } catch (error) {
      console.error("Error during form submission:", error);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              Processing...
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
