import {NextResponse} from "next/server";
import {buildContactEmail} from "@/lib/contact";
import {contactSchema} from "@/lib/contact-schema";

export const runtime = "nodejs";

const MAX_REQUESTS_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

type RateLimitStore = Map<string, number[]>;
const globalRateLimit = globalThis as typeof globalThis & {contactRateLimit?: RateLimitStore};
const rateLimit = globalRateLimit.contactRateLimit ?? new Map<string, number[]>();
globalRateLimit.contactRateLimit = rateLimit;

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const requests = (rateLimit.get(ip) ?? []).filter((timestamp) => timestamp > windowStart);
  if (requests.length >= MAX_REQUESTS_PER_HOUR) {
    rateLimit.set(ip, requests);
    return true;
  }
  requests.push(now);
  rateLimit.set(ip, requests);
  return false;
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({secret, response: token});
  if (ip !== "unknown") body.set("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const result = await response.json() as {success?: boolean};
    return result.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ok: false, error: "Invalid request."}, {status: 400});
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ok: false, error: "Invalid form submission."}, {status: 400});
  }

  if (parsed.data.website) {
    return NextResponse.json({ok: false, error: "Submission rejected."}, {status: 403});
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ok: false, error: "Too many requests."}, {status: 429});
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ok: false, error: "Submission rejected."}, {status: 403});
  }

  // Mail is intentionally never sent from local, preview or test environments.
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview") {
    return NextResponse.json({ok: false, error: "Delivery is unavailable in this environment."}, {status: 503});
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
  if (!apiKey || !from || !recipient) {
    return NextResponse.json({ok: false, error: "Delivery is not configured."}, {status: 503});
  }

  const {text, html} = buildContactEmail(parsed.data);

  try {
    const {Resend} = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: recipient,
      replyTo: parsed.data.email,
      subject: "New portfolio enquiry",
      text,
      html,
    });

    if (result.error || !result.data?.id) {
      return NextResponse.json({ok: false, error: "Delivery failed."}, {status: 500});
    }
  } catch {
    return NextResponse.json({ok: false, error: "Delivery failed."}, {status: 500});
  }

  return NextResponse.json({ok: true}, {status: 201});
}
