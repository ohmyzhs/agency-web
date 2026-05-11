import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/tool-page-shell";
import ColorContrastChecker from "@/components/tools/ColorContrastChecker";
import CookingMeasurementConverter from "@/components/tools/CookingMeasurementConverter";
import CronExplainer from "@/components/tools/CronExplainer";
import IconFaviconGenerator from "@/components/tools/IconFaviconGenerator";
import DeveloperTextToolkit from "@/components/tools/DeveloperTextToolkit";
import ImageEditingToolkit from "@/components/tools/ImageEditingToolkit";
import ImageFormatConverter from "@/components/tools/ImageFormatConverter";
import ImageToAsciiArtTool from "@/components/tools/ImageToAsciiArtTool";
import JsonYamlValidator from "@/components/tools/JsonYamlValidator";
import LifeCalculatorSuite from "@/components/tools/LifeCalculatorSuite";
import NetworkDiagnosticsTool from "@/components/tools/NetworkDiagnosticsTool";
import OgImageGeneratorTool from "@/components/tools/OgImageGeneratorTool";
import PdfToolkitTool from "@/components/tools/PdfToolkitTool";
import QrBarcodeGeneratorTool from "@/components/tools/QrBarcodeGeneratorTool";
import KoreanShoeSizeConverter from "@/components/tools/KoreanShoeSizeConverter";
import KrwCurrencyCalculator from "@/components/tools/KrwCurrencyCalculator";
import KstTimezoneConverter from "@/components/tools/KstTimezoneConverter";
import MarkdownTableGenerator from "@/components/tools/MarkdownTableGenerator";
import PyeongConverter from "@/components/tools/PyeongConverter";
import SlugGenerator from "@/components/tools/SlugGenerator";
import TextCaseConverter from "@/components/tools/TextCaseConverter";
import TimestampConverter from "@/components/tools/TimestampConverter";
import TwoFactorCodeGenerator from "@/components/tools/TwoFactorCodeGenerator";
import UnitConverter from "@/components/tools/UnitConverter";
import UtmBuilder from "@/components/tools/UtmBuilder";
import WebhookPayloadFormatter from "@/components/tools/WebhookPayloadFormatter";
import WebhookRequestSimulatorTool from "@/components/tools/WebhookRequestSimulatorTool";
import { getPostsByRelatedTool } from "@/lib/posts";
import { getAllTools, getToolBySlug } from "@/lib/tools";
import { createPageMetadata } from "@/lib/seo";

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

  return createPageMetadata({
    title: tool.seoTitle,
    description: tool.seoDescription,
    path: `/tools/${tool.slug}`,
    type: "article",
  });
}

const widgetMap: Record<string, React.ReactNode> = {
  "developer-text-toolkit": <DeveloperTextToolkit />,
  "image-editing-toolkit": <ImageEditingToolkit />,
  "life-calculator-suite": <LifeCalculatorSuite />,
  "pdf-toolkit": <PdfToolkitTool />,
  "og-image-generator": <OgImageGeneratorTool />,
  "qr-barcode-generator": <QrBarcodeGeneratorTool />,
  "image-to-ascii-art": <ImageToAsciiArtTool />,
  "webhook-request-simulator": <WebhookRequestSimulatorTool />,
  "two-factor-code-generator": <TwoFactorCodeGenerator />,
  "network-diagnostics": <NetworkDiagnosticsTool />,
  "icon-favicon-generator": <IconFaviconGenerator />,
  "image-format-converter": <ImageFormatConverter />,
  "pyeong-converter": <PyeongConverter />,
  "korean-shoe-size-converter": <KoreanShoeSizeConverter />,
  "cooking-measurement-converter": <CookingMeasurementConverter />,
  "kst-timezone-converter": <KstTimezoneConverter />,
  "krw-currency-calculator": <KrwCurrencyCalculator />,
  "unit-converter": <UnitConverter />,
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

  return (
    <ToolPageShell tool={tool} guidePosts={getPostsByRelatedTool(tool.slug, 4)}>
      {widgetMap[tool.slug]}
    </ToolPageShell>
  );
}
