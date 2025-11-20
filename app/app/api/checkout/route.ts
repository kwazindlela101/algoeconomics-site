// app/api/checkout/route.ts
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: 'https://algoeconomics.org/success',
    cancel_url: 'https://algoeconomics.org/pricing',
    client_reference_id: user.id,
    metadata: { priceId }, // ← important for the webhook
  });

  return Response.json({ url: session.url });
}
