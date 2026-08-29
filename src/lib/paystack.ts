import { createServerFn } from "@tanstack/react-start";

/**
 * PAYSTACK INTEGRATION
 * ---------------------------------------------------------------
 * Client side: the Checkout page loads Paystack's own Inline JS
 * (https://js.paystack.co/v1/inline.js) and opens the popup with
 * the PUBLIC test key (VITE_PAYSTACK_PUBLIC_KEY). No package needed.
 *
 * Server side: once the popup reports success, we send the
 * transaction reference here. This function calls Paystack's
 * verify endpoint using the SECRET key (PAYSTACK_SECRET_KEY),
 * which only ever lives on the server / in your deploy platform's
 * env vars — never in client code or committed to git.
 *
 * There is still no database: this only confirms with Paystack
 * that the reference is real and was actually paid, then the
 * client goes on to save the order in localStorage as before.
 * ---------------------------------------------------------------
 */

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    gateway_response: string;
  };
};

export const verifyPaystackTransaction = createServerFn({ method: "POST" })
  .validator((data: { reference: string }) => data)
  .handler(async ({ data }) => {
    const secretKey = process.env["PAYSTACK_SECRET_KEY"];

    if (!secretKey) {
      return {
        verified: false,
        error: "PAYSTACK_SECRET_KEY is not set on the server.",
      } as const;
    }

    if (!data.reference) {
      return { verified: false, error: "Missing transaction reference." } as const;
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );

    if (!res.ok) {
      return { verified: false, error: `Paystack responded with ${res.status}` } as const;
    }

    const json = (await res.json()) as PaystackVerifyResponse;
    const verified = json.status === true && json.data?.status === "success";

    return {
      verified,
      amountPesewas: json.data?.amount ?? null,
      currency: json.data?.currency ?? null,
      reference: json.data?.reference ?? data.reference,
      error: verified ? null : (json.data?.gateway_response ?? json.message),
    } as const;
  });
