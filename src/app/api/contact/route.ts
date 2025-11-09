// Ensure this runs on the Node.js runtime (not edge)
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Payload = {
  honey?: string; // honeypot
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // 1) Bot trap
    if (body.honey) {
      // Pretend success to avoid tipping off bots
      return NextResponse.json({ ok: true });
    }

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

    // 3) Create transporter (Gmail with App Password)
    //    Generate an App Password in your Google Account:
    //    Google Account → Security → 2-Step Verification → App passwords → "Mail" on "Other"
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,         // your full Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
      },
    });

    const to = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER!;
    const subj =
      body.subject?.trim() ||
      `New enquiry from ${name} (${email})`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${body.phone || "-"}`,
      "",
      message,
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(body.phone || "-")}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.GMAIL_USER}>`,
      to,
      subject: subj,
      replyTo: email,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact POST error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Tiny HTML escaper to avoid HTML injection in the email
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
