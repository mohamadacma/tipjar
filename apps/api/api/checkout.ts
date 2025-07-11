import { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";


export default async function handler(req: VercelRequest, res: VercelResponse) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  // CORS headers
  const allowedOrigins = [
    "https://motipjar-web.vercel.app",
    "https://motipjar-24uhf2mu0--moes-projects-97e5bdff.vercel.app"
  ];
  
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
   // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // debugging log
  console.log("STRIPE_SECRET_KEY loaded:", !!process.env.STRIPE_SECRET_KEY);

  if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!req.body) {
    res.status(400).json({ error: "Missing request body" });
    return;
  }
  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-06-30.basil" });

  const { amount, message } = req.body as { amount?: number, message?: string};
  console.log("received amount", amount, "message from Tipper", message);

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
      metadata: {
        message: message || "",
      },
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

