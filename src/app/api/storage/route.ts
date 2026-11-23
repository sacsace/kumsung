import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { ensureSeedUploads, storageSummary } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const seed = await ensureSeedUploads();
  return NextResponse.json({
    ...storageSummary(),
    seedUploads: seed,
  });
}
