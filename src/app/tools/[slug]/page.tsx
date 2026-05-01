import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tool-page-shell";
import ColorContrastChecker from "@/components/tools/ColorContrastChecker";
import CookingMeasurementConverter from "@/components/tools/CookingMeasurementConverter";
import AutomationRoiCalculator from "@/components/tools/AutomationRoiCalculator";
import CronExplainer from "@/components/tools/CronExplainer";
import JsonYamlValidator from "@/components/tools/JsonYamlValidator";
import KoreanShoeSizeConverter from "@/components/tools/KoreanShoeSizeConverter";
import KrwCurrencyCalculator from "@/components/tools/KrwCurrencyCalculator";
import KstTimezoneConverter from "@/components/tools/KstTimezoneConverter";
import LlmCostCalculator from "@/components/tools/LlmCostCalculator";
import MarkdownTableGenerator from "@/components/tools/MarkdownTableGenerator";
import PyeongConverter from "@/components/tools/PyeongConverter";
import SlugGenerator from "@/components/tools/SlugGenerator";
import TextCaseConverter from "@/components/tools/TextCaseConverter";
import TimestampConverter from "@/components/tools/TimestampConverter";
import UnitConverter from "@/components/tools/UnitConverter";
import UtmBuilder from "@/components/tools/UtmBuilder";
import WebhookPayloadFormatter from "@/components/tools/WebhookPayloadFormatter";
import { getAllTools, getToolBySlug } from "@/lib/tools";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      type: "article",
      url: `/tools/${tool.slug}`,
    },
  };
}

const widgetMap: Record<string, React.ReactNode> = {
  "pyeong-converter": <PyeongConverter />,
  "korean-shoe-size-converter": <KoreanShoeSizeConverter />,
  "cooking-measurement-converter": <CookingMeasurementConverter />,
  "kst-timezone-converter": <KstTimezoneConverter />,
  "krw-currency-calculator": <KrwCurrencyCalculator />,
  "unit-converter": <UnitConverter />,
  "llm-cost-calculator": <LlmCostCalculator />,
  "automation-roi-calculator": <AutomationRoiCalculator />,
  "json-yaml-validator": <JsonYamlValidator />,
  "webhook-payload-formatter": <WebhookPayloadFormatter />,
  "cron-explainer": <CronExplainer />,
  "text-case-converter": <TextCaseConverter />,
  "slug-generator": <SlugGenerator />,
  "utm-builder": <UtmBuilder />,
  "markdown-table-generator": <MarkdownTableGenerator />,
  "timestamp-converter": <TimestampConverter />,
  "color-contrast-checker": <ColorContrastChecker />,
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) notFound();

  return <ToolPageShell tool={tool}>{widgetMap[tool.slug]}</ToolPageShell>;
}
