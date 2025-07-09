import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { PrismaClient } from '../generated/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No stripe signature found');
    return res.status(400).send('No stripe signature found');
  }

  let buf: Buffer;
  try {
    buf = await buffer(req);
  } catch (err) {
    console.error('Error reading request body:', err);
    return res.status(400).send('Error reading request body');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook received:', event.type);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const amount = session.amount_total;
      const message = session.metadata?.message || '';
      
      if (amount) {
        await prisma.tip.create({
          data: {
            amount,
            message,
          },
        });
        console.log('Tip saved to database:', { amount, message });
      }
    }
  } catch (dbError) {
    console.error('Database error:', dbError);
    return res.status(500).send('Database error');
  } finally {
    await prisma.$disconnect();
  }

  res.json({ received: true });
}