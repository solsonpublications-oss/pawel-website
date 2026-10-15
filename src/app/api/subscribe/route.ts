import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/subscribe
 * Body: { email: string }
 *
 * Captures a newsletter signup ("Join the administration"). Validates email
 * format, dedupes on the Subscriber.email unique constraint. Returns 201 on
 * new signup, 200 on already-subscribed, 400 on invalid input, 500 on error.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // Create new subscriber; if email already exists, Prisma throws P2002
    // (unique constraint) — treat as already-subscribed (idempotent).
    try {
      const subscriber = await db.subscriber.create({
        data: { email },
        select: { id: true, email: true },
      });
      return NextResponse.json(
        { ok: true, email: subscriber.email, isNew: true },
        { status: 201 },
      );
    } catch (err: unknown) {
      const code =
        (err as { code?: string } | null)?.code ?? "";
      if (code === "P2002") {
        // already subscribed — idempotent success
        return NextResponse.json(
          { ok: true, email, isNew: false },
          { status: 200 },
        );
      }
      throw err;
    }
  } catch (err) {
    console.error("[subscribe] error", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const count = await db.subscriber.count();
    return NextResponse.json({
      ok: true,
      count,
      message: "Join the administration — POST your email to subscribe.",
    });
  } catch {
    return NextResponse.json({
      ok: true,
      count: 0,
      message: "Join the administration — POST your email to subscribe.",
    });
  }
}
