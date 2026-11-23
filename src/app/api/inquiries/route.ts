import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import type { Inquiry } from "@/lib/inquiry";
import { sendInquiryEmail } from "@/lib/mail";
import { ensureRuntimeInquiriesFile } from "@/lib/storage";

export const runtime = "nodejs";

async function readInquiries(): Promise<Inquiry[]> {
  try {
    const filePath = await ensureRuntimeInquiriesFile();
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

async function writeInquiries(items: Inquiry[]) {
  const filePath = await ensureRuntimeInquiriesFile();
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await readInquiries();
  return NextResponse.json(items);
}

const MAX_FILES = 3;
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "pdf"]);

function extensionOf(name: string) {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function safeFilename(name: string) {
  return name.replace(/[^\w.\-()\s가-힣]/g, "_").slice(0, 120) || "attachment";
}

async function readPayload(request: Request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("multipart/form-data")) {
    const form = await request.formData();
    const files = form
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);
    return {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      location: String(form.get("location") || ""),
      service: String(form.get("service") || ""),
      schedule: String(form.get("schedule") || ""),
      message: String(form.get("message") || ""),
      files,
    };
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return null;
  return {
    name: String(body.name || ""),
    email: String(body.email || ""),
    phone: String(body.phone || ""),
    company: String(body.company || ""),
    location: String(body.location || ""),
    service: String(body.service || ""),
    schedule: String(body.schedule || ""),
    message: String(body.message || ""),
    files: [] as File[],
  };
}

export async function POST(request: Request) {
  const payload = await readPayload(request);
  if (!payload) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const phone = payload.phone.trim();
  const company = payload.company.trim();
  const location = payload.location.trim();
  const service = payload.service.trim();
  const schedule = payload.schedule.trim();
  const message = payload.message.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  if (payload.files.length > MAX_FILES) {
    return NextResponse.json({ error: "Too many files" }, { status: 400 });
  }

  const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];
  for (const file of payload.files) {
    const ext = extensionOf(file.name);
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    attachments.push({
      filename: safeFilename(file.name),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || (ext === "pdf" ? "application/pdf" : "application/octet-stream"),
    });
  }

  const inquiry: Inquiry = {
    id: `${Date.now()}-${randomBytes(3).toString("hex")}`,
    name: name.slice(0, 100),
    email: email.slice(0, 120),
    phone: phone.slice(0, 40),
    company: company.slice(0, 120),
    location: location.slice(0, 160),
    service: service.slice(0, 160),
    schedule: schedule.slice(0, 160),
    files: attachments.map((file) => file.filename),
    message: message.slice(0, 2000),
    createdAt: new Date().toISOString(),
  };

  const items = await readInquiries();
  items.unshift(inquiry);
  await writeInquiries(items.slice(0, 500));

  const mail = await sendInquiryEmail(inquiry, attachments);

  return NextResponse.json({
    ok: true,
    mailed: mail.ok,
    ...(mail.ok ? {} : { mailError: mail.error }),
  });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const items = await readInquiries();
  await writeInquiries(items.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
