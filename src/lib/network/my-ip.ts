export type IpHeaderResult = {
  ip: string;
  source: string;
};

const TRUSTED_CLIENT_IP_HEADERS = [
  "cf-connecting-ip",
  "true-client-ip",
  "x-real-ip",
  "x-vercel-forwarded-for",
  "x-forwarded-for",
  "forwarded",
] as const;

const NON_PUBLIC_IPV4_RANGES = [
  ["0.0.0.0", "0.255.255.255"],
  ["10.0.0.0", "10.255.255.255"],
  ["100.64.0.0", "100.127.255.255"],
  ["127.0.0.0", "127.255.255.255"],
  ["169.254.0.0", "169.254.255.255"],
  ["172.16.0.0", "172.31.255.255"],
  ["192.0.0.0", "192.0.0.255"],
  ["192.0.2.0", "192.0.2.255"],
  ["192.168.0.0", "192.168.255.255"],
  ["198.18.0.0", "198.19.255.255"],
  ["198.51.100.0", "198.51.100.255"],
  ["203.0.113.0", "203.0.113.255"],
  ["224.0.0.0", "255.255.255.255"],
] as const;

function ipv4ToNumber(ip: string): number | null {
  const octets = ip.split(".").map((part) => Number(part));
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return null;
  }
  return octets.reduce((value, octet) => value * 256 + octet, 0);
}

function isPublicIp(ip: string): boolean {
  const ipv4 = ipv4ToNumber(ip);
  if (ipv4 !== null) {
    return !NON_PUBLIC_IPV4_RANGES.some(([start, end]) => {
      const startNumber = ipv4ToNumber(start);
      const endNumber = ipv4ToNumber(end);
      return startNumber !== null && endNumber !== null && ipv4 >= startNumber && ipv4 <= endNumber;
    });
  }

  const lower = ip.toLowerCase();
  return !(lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80"));
}

function normalizeIpCandidate(candidate: string): string | null {
  const cleaned = candidate
    .trim()
    .replace(/^for=/i, "")
    .replace(/^\"|\"$/g, "")
    .replace(/^\[|\]$/g, "");

  if (!cleaned) return null;
  if (cleaned.includes(".")) {
    const ipv4 = cleaned.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)?.[0];
    if (ipv4) return ipv4;
  }
  if (/^[0-9a-f:]+$/i.test(cleaned) && cleaned.includes(":")) {
    return cleaned;
  }
  return null;
}

function firstIpFromHeader(value: string, headerName: string): string | null {
  const parts = headerName === "forwarded" ? value.split(/[;,]/) : value.split(",");
  for (const part of parts) {
    const ip = normalizeIpCandidate(part);
    if (ip && isPublicIp(ip)) return ip;
  }
  return null;
}

export function pickClientIpFromHeaders(headers: Headers): IpHeaderResult | null {
  for (const headerName of TRUSTED_CLIENT_IP_HEADERS) {
    const value = headers.get(headerName);
    if (!value) continue;
    const ip = firstIpFromHeader(value, headerName);
    if (ip) return { ip, source: headerName };
  }
  return null;
}
