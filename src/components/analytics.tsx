import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-8YESYTEEEJ";

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
    </>
  );
}
