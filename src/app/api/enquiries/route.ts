// POST /api/enquiries
//
// This route receives enquiry form data from the frontend,
// validates it, protects against simple bot submissions,
// and sends the enquiry to the agent by email using Resend.

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Describes the JSON data that the enquiry form
 * is allowed to send to this API route.
 *
 * All fields are optional at the type level because
 * incoming request data cannot be trusted until it
 * has been validated inside the POST handler.
 */
type Payload = {
  // Hidden honeypot field used to catch simple bots.
  // Real users should never fill this in.
  honey?: string;

  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

// Create a Resend client using the private API key
// stored in the server's environment variables.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    /**
     * Read the JSON request body sent by the enquiry form
     * and treat it as the expected Payload shape.
     */
    const body = (await req.json()) as Payload;

    /**
     * BOT PROTECTION
     *
     * The frontend contains a hidden "honey" field.
     * Normal users should leave it empty, but automated
     * bots may fill in every available input field.
     *
     * If the honeypot contains a value, pretend the request
     * succeeded without actually sending an email.
     */
    if (body.honey) {
      return NextResponse.json({ ok: true });
    }

    /**
     * CLEAN AND VALIDATE REQUIRED FIELDS
     *
     * trim() removes unnecessary spaces from the beginning
     * and end of the submitted values.
     */
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    /**
     * Name, email and message are required.
     *
     * If any are missing or empty after trimming,
     * return HTTP 400 because the client sent
     * incomplete enquiry data.
     */
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Get the agent/contact email address from the
     * server's environment variables.
     *
     * This is kept out of the frontend so the destination
     * address can be configured privately on the server.
     */
    const to = process.env.CONTACT_TO_EMAIL;

    /**
     * If the server has not been configured with a
     * destination email address, the enquiry cannot be sent.
     *
     * This is a server configuration error, so return 500.
     */
    if (!to) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing CONTACT_TO_EMAIL env var.",
        },
        {
          status: 500,
        }
      );
    }

    /**
     * Use the property-specific subject supplied by the
     * frontend when available.
     *
     * Otherwise create a fallback subject using the
     * enquirer's name and email address.
     */
    const subj =
      body.subject?.trim() ||
      `New enquiry from ${name} (${email})`;

    /**
     * Build the plain-text email body that the agent
     * will receive.
     *
     * Phone is optional, so display "-" if it was not supplied.
     */
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${body.phone || "-"}`,
      "",
      message,
    ].join("\n");

    /**
     * EMAIL SENDER
     *
     * Resend only allows emails to be sent from:
     * - its default onboarding address, or
     * - an address belonging to a verified domain.
     *
     * For now Homefinder uses Resend's default sender.
     */
    const from = "Homefinder <onboarding@resend.dev>";

    /**
     * Send the enquiry email through Resend.
     *
     * replyTo is set to the user's email address so
     * the agent can simply press Reply and respond
     * directly to the person who submitted the enquiry.
     */
    const result = await resend.emails.send({
      from,
      to,
      subject: subj,
      replyTo: email,
      text,
    });

    /**
     * Return a successful JSON response to the frontend.
     *
     * Resend may also return an email ID, which can be
     * useful later for logging or debugging.
     */
    return NextResponse.json({
      ok: true,
      id: result.data?.id,
    });
  } catch (err) {
    /**
     * Catch unexpected failures such as:
     * - invalid JSON
     * - Resend/network errors
     * - other server-side exceptions
     */
    console.error("Contact POST error:", err);

    return NextResponse.json(
      {
        ok: false,
        error: "Server error. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}