import { VercelRequest, VercelResponse } from "@vercel/node";

import Stripe from "stripe";



console.log("STRIPE_SECRET_KEY loaded:", !!process.env.STRIPE_SECRET_KEY);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-06-30.basil" });
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { amount } = req.body as { amount?: number };

  if (!amount || typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Invalid 'amount' parameter" });
    return;
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: "Tip" }, unit_amount: amount }, quantity: 1 }],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    // Check if session.url exists
    if (!session.url) {
      throw new Error("Stripe session URL is missing");
    }

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating Stripe checkout session:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

