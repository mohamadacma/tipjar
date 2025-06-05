import express, { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { config } from "dotenv";

config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-05-28.basil" });

const router = express.Router();

interface CheckoutBody { amount: number }
router.use(express.json());

router.post("/", async (req: Request<{}, any, CheckoutBody>, res: Response, next: NextFunction): Promise<void> => {
  const { amount } = req.body;

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
});

export default router;