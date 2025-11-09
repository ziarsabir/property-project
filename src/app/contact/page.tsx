import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch about listings, valuations, and viewings.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-slate-600">
        Questions about a listing, valuations, or booking a viewing? Send us a message and we’ll get back to you.
      </p>
      <ContactForm />

      <section className="mt-10 rounded border p-4">
        <h2 className="text-lg font-semibold">Other ways to reach us</h2>
        <ul className="mt-2 space-y-1 text-slate-700">
          <li>Email: <a className="underline" href="mailto:hello@yourdomain.com">hello@yourdomain.com</a></li>
          <li>Phone: <a className="underline" href="tel:+442071234567">+44 20 7123 4567</a></li>
          <li>Office: 12 Bayswater Rd, London W2 2UH</li>
        </ul>
      </section>
    </main>
  );
}
