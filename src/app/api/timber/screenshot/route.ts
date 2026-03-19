import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Screenshots are captured client-side" },
    { status: 501 },
  );
}
