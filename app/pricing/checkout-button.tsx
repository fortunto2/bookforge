"use client";

import { useState } from "react";

export function CheckoutButton({
  plan,
  children,
  className,
  disabled,
}: {
  plan: "pro" | "lifetime";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? "Redirecting..." : children}
    </button>
  );
}
