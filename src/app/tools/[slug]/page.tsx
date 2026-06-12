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
import HousingPensionCalculator from "@/components/tools/HousingPensionCalculator";
import JsonYamlValidator from "@/components/tools/JsonYamlValidator";
import LoanInterestCalculator from "@/components/tools/LoanInterestCalculator";
import DepositInterestCalculator from "@/components/tools/DepositInterestCalculator";
import SavingsInterestCalculator from "@/components/tools/SavingsInterestCalculator";
import MilitarySavingsCalculator from "@/components/tools/MilitarySavingsCalculator";
import YouthAccountCalculator from "@/components/tools/YouthAccountCalculator";
import DollarExchangeCalculator from "@/components/tools/DollarExchangeCalculator";
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
import { getAllTools, getToolBySlug, getToolContent, type Tool } from "@/lib/tools";
import { createPageMetadata } from "@/lib/seo";

function ToolNoScriptFallback({ tool }: { tool: Tool }) {
  const content = tool.ko ?? getToolContent(tool, "ko");

  return (
    <noscript>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <h2>도구 설명</h2>
        {content.explanation.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2>입력값과 결과</h2>
        <ul>
          {content.inputs.map((input) => (
            <li key={input.label}><strong>{input.label}</strong>: {input.description}</li>
          ))}
          {content.outputs.map((output) => (
            <li key={output.label}><strong>{output.label}</strong>: {output.description}</li>
          ))}
        </ul>
        <h2>사용 예시</h2>
        <ul>
          {content.examples.map((example) => (
            <li key={example.label}><strong>{example.label}</strong>: {example.input} → {example.output}</li>
          ))}
        </ul>
        <h2>자주 묻는 질문</h2>
        {content.faqs.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </noscript>
  );
}

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
  "loan-interest-calculator": <LoanInterestCalculator />,
  "deposit-interest-calculator": <DepositInterestCalculator />,
  "savings-interest-calculator": <SavingsInterestCalculator />,
  "housing-pension-calculator": <HousingPensionCalculator />,
  "military-savings-calculator": <MilitarySavingsCalculator />,
  "youth-account-calculator": <YouthAccountCalculator />,
  "dollar-exchange-calculator": <DollarExchangeCalculator />,
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
    <>
      <ToolNoScriptFallback tool={tool} />
      <ToolPageShell tool={tool} guidePosts={getPostsByRelatedTool(tool.slug, 4)}>
        {widgetMap[tool.slug]}
      </ToolPageShell>
    </>
  );
}
