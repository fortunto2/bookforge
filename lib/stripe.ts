import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    (process.env.STRIPE_BOOK_PRICE_ID || process.env.STRIPE_LIFETIME_PRICE_ID)
  );
}

export const prices = {
  pro: () => process.env.STRIPE_BOOK_PRICE_ID ?? "",
  lifetime: () => process.env.STRIPE_LIFETIME_PRICE_ID ?? "",
} as const;
