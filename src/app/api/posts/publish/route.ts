import { handleContentIntakeRequest } from "@/lib/content-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleContentIntakeRequest(request);
}
