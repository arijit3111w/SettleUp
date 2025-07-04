import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { paymentRemainders } from "@/lib/inngest/payment-remainders";
import { spendingInsights } from "@/lib/inngest/spending-insights";


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    paymentRemainders,
    spendingInsights,
  ],
});
