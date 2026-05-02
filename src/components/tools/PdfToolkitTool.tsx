"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import ImageToPdfTool from "@/components/tools/ImageToPdfTool";
import PdfAdvancedTool from "@/components/tools/PdfAdvancedTool";
import PdfPageImageTool from "@/components/tools/PdfPageImageTool";
import PdfWorkspaceTool from "@/components/tools/PdfWorkspaceTool";

type PdfMode = "merge" | "to-image" | "image-to-pdf" | "advanced";

export default function PdfToolkitTool() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<PdfMode>("merge");

  const copy = useMemo(
    () =>
      locale === "ko"
        ? {
            intro:
              "PDF 관련 작업을 한 페이지에서 처리합니다. 병합/분할/재정렬, PDF 페이지 이미지 변환, 이미지 여러 장 PDF 생성, 텍스트 추출/페이지 삭제/2쪽 모아찍기를 탭으로 전환하세요.",
            local:
              "기본 PDF/이미지 처리는 브라우저 안에서 수행됩니다. 대용량 파일, 암호화 PDF, 손상된 PDF는 브라우저 메모리 또는 라이브러리 제한으로 실패할 수 있습니다.",
            modes: [
              {
                id: "merge" as const,
                label: "PDF 병합·분할·재정렬",
                description: "여러 PDF를 합치고 페이지 범위를 골라 새 PDF로 저장합니다.",
              },
              {
                id: "to-image" as const,
                label: "PDF 페이지 to 이미지",
                description: "PDF 페이지를 PNG/JPG 이미지로 렌더링합니다.",
              },
              {
                id: "image-to-pdf" as const,
                label: "이미지 to PDF",
                description: "PNG/JPG 여러 장을 순서대로 PDF로 묶습니다.",
              },
              {
                id: "advanced" as const,
                label: "텍스트 추출·페이지 삭제",
                description: "PDF 텍스트를 TXT로 추출하고 페이지 삭제/2쪽 모아찍기를 수행합니다.",
              },
            ],
          }
        : {
            intro:
              "Handle PDF-related workflows from one page: merge/split/reorder PDFs, render PDF pages to images, combine images into a PDF, extract text, delete pages, or create 2-up PDFs.",
            local:
              "Core PDF/image processing runs in the browser. Large files, encrypted PDFs, and damaged PDFs may fail because of browser memory or library limits.",
            modes: [
              {
                id: "merge" as const,
                label: "Merge, split, reorder",
                description: "Combine PDFs and select page ranges for a new PDF.",
              },
              {
                id: "to-image" as const,
                label: "PDF pages to images",
                description: "Render selected PDF pages to PNG/JPG images.",
              },
              {
                id: "image-to-pdf" as const,
                label: "Images to PDF",
                description: "Combine PNG/JPG images into one PDF.",
              },
              {
                id: "advanced" as const,
                label: "Text/delete/2-up",
                description: "Extract text, delete pages, or merge two pages onto one sheet.",
              },
            ],
          },
    [locale],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-accent p-4">
        <p className="text-sm leading-relaxed text-muted">{copy.intro}</p>
        <p className="mt-2 text-xs leading-relaxed text-fg-3">{copy.local}</p>
      </div>

      <div className="grid gap-2 md:grid-cols-4" role="tablist" aria-label={locale === "ko" ? "PDF 도구 선택" : "PDF tool selection"}>
        {copy.modes.map((item) => {
          const active = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMode(item.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground"
              }`}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className={`mt-1 block text-xs leading-relaxed ${active ? "text-background/75" : "text-muted"}`}>
                {item.description}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="rounded-xl border border-border p-4 md:p-5">
        {mode === "merge" && <PdfWorkspaceTool />}
        {mode === "to-image" && <PdfPageImageTool />}
        {mode === "image-to-pdf" && <ImageToPdfTool />}
        {mode === "advanced" && <PdfAdvancedTool />}
      </div>
    </div>
  );
}
