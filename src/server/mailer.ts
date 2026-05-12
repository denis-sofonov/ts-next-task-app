import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/server/env";

// In development the SMTP transport points at Mailhog; in tests/CI the "json"
// transport captures messages instead of sending them. Either way the rest of
// the app calls the same `sendMail`.
let transporter: Transporter | null = null;

function getTransport(): Transporter {
  if (transporter) return transporter;
  transporter =
    env.MAIL_TRANSPORT === "json"
      ? nodemailer.createTransport({ jsonTransport: true })
      : nodemailer.createTransport({
          host: env.MAIL_HOST,
          port: env.MAIL_PORT,
          secure: false,
        });
  return transporter;
}

interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail(mail: Mail): Promise<void> {
  await getTransport().sendMail({ from: env.MAIL_FROM, ...mail });
}

function layout(title: string, body: string, cta: { url: string; label: string }): string {
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>${title}</h2>
      ${body}
      <p style="margin: 24px 0;">
        <a href="${cta.url}" style="background:#171717;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">${cta.label}</a>
      </p>
      <p style="color:#666;font-size:13px;">If the button doesn't work, copy this link:<br>${cta.url}</p>
    </div>`;
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const url = `${env.APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
  await sendMail({
    to,
    subject: "Verify your email",
    text: `Verify your email: ${url}`,
    html: layout(
      "Confirm your email",
      "<p>Welcome to TaskFlow. Confirm your email address to finish setting up your account.</p>",
      { url, label: "Verify email" },
    ),
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const url = `${env.APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail({
    to,
    subject: "Reset your password",
    text: `Reset your password: ${url}`,
    html: layout(
      "Reset your password",
      "<p>We received a request to reset your password. This link expires in 30 minutes.</p>",
      { url, label: "Reset password" },
    ),
  });
}
