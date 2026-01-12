export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";

type Payload = {
  honey?: string; // honeypot
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // 1) Bot trap
    if (body.honey) return NextResponse.json({ ok: true });

    // 2) Basic validation
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_TO_EMAIL;
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Missing CONTACT_TO_EMAIL env var." },
        { status: 500 }
      );
    }

    const subj = body.subject?.trim() || `New enquiry from ${name} (${email})`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${body.phone || "-"}`,
      "",
      message,
    ].join("\n");

    // IMPORTANT:
    // Use Resend's default sender until you set up a domain.
    // This "from" MUST be either onboarding@resend.dev (default)
    // or an email on a verified domain.
    const from = "Homefinder <onboarding@resend.dev>";

    const result = await resend.emails.send({
      from,
      to,
      subject: subj,
      replyTo: email,
      text,
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("Contact POST error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}