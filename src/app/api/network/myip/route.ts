import { NextResponse } from "next/server";
import { pickClientIpFromHeaders } from "../../../../lib/network/my-ip";

export async function GET(request: Request) {
  const clientIp = pickClientIpFromHeaders(request.headers);
  if (clientIp) {
    return NextResponse.json(clientIp, { headers: { "Cache-Control": "no-store" } });
  }

  const providers = ["https://api.ipify.org?format=json", "https://ifconfig.me/all.json"];
  for (const url of providers) {
    try {
      const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(5000) });
      if (!response.ok) continue;
      const data = await response.json();
      return NextResponse.json({ ip: data.ip_addr || data.ip, source: url }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      // Try next provider.
    }
  }
  return NextResponse.json({ error: "Unable to resolve public IP" }, { status: 502, headers: { "Cache-Control": "no-store" } });
}
