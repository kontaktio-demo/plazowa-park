import { NextResponse } from "next/server";
import { SITE } from "@/lib/data/site";

export const runtime = "nodejs";

type Lead = {
  name?: string;
  phone?: string;
  email?: string;
  unit?: string;
  message?: string;
  rodo?: string;
  company?: string; // honeypot
};

function valid(l: Lead) {
  if (l.company) return false; // bot
  if (!l.name || l.name.trim().length < 2) return false;
  if (!l.phone && !l.email) return false;
  if (l.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email)) return false;
  return true;
}

export async function POST(req: Request) {
  let body: Lead;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  if (!valid(body)) {
    return NextResponse.json({ error: "Uzupełnij wymagane pola" }, { status: 422 });
  }

  const lead = {
    name: String(body.name).slice(0, 200),
    phone: String(body.phone || "").slice(0, 60),
    email: String(body.email || "").slice(0, 200),
    unit: String(body.unit || "").slice(0, 120),
    message: String(body.message || "").slice(0, 2000),
    receivedAt: new Date().toISOString(),
  };

  // Ready for a real provider: set RESEND_API_KEY + LEAD_TO to enable email delivery.
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO || SITE.email;
  if (key) {
    try {
      const html = `<h2>Nowe zapytanie — Plażowa Park</h2>
        <p><b>Imię:</b> ${escape(lead.name)}</p>
        <p><b>Telefon:</b> ${escape(lead.phone)}</p>
        <p><b>E-mail:</b> ${escape(lead.email)}</p>
        <p><b>Apartament:</b> ${escape(lead.unit)}</p>
        <p><b>Wiadomość:</b> ${escape(lead.message)}</p>
        <p style="color:#888">${lead.receivedAt}</p>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Plażowa Park <lead@plazowa-park.pl>",
          to: [to],
          reply_to: lead.email || undefined,
          subject: `Zapytanie: ${lead.unit || "Plażowa Park"} — ${lead.name}`,
          html,
        }),
      });
      if (!r.ok) throw new Error("provider");
    } catch {
      // fall through — still acknowledge to the user; lead is logged below
    }
  }

  // Always log so leads are recoverable from server logs even without a provider.
  console.log("[LEAD]", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}

function escape(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));
}
