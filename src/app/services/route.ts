import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/posts?type=tool-guide", "https://oh-my-zhs.com"), 308);
}

export function HEAD() {
  return new NextResponse(null, {
    status: 308,
    headers: { Location: "/posts?type=tool-guide" },
  });
}
