import { NextRequest, NextResponse } from "next/server";
import { getStripe, prices } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { plan } = (await req.json()) as { plan: string };

  if (plan !== "pro" && plan !== "lifetime") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = prices[plan]();
  if (!priceId) {
    return NextResponse.json(
      { error: "Price not configured" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/pricing?success=true`,
    cancel_url: `${origin}/pricing?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
