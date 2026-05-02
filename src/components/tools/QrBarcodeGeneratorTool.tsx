"use client";

import bwipjs from "bwip-js";
import QRCode from "qrcode";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob } from "@/lib/browser-download";

type Mode = "url" | "text" | "wifi" | "vcard";
type BarcodeType = "code128" | "ean13" | "upca";

type Result = { ok: true; qrSvg: string; barcodePng: string } | { ok: false; error: string } | null;

function escapeWifi(value: string) {
  return value.replace(/[\\;,:"]/g, (match) => `\\${match}`);
}

function textToBlob(text: string, type: string) {
  return new Blob([text], { type });
}

function dataUrlToBlob(dataUrl: string) {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);/)?.[1] || "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export default function QrBarcodeGeneratorTool() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("url");
  const [text, setText] = useState("https://oh-my-zhs.com");
  const [ssid, setSsid] = useState("My WiFi");
  const [password, setPassword] = useState("password1234");
  const [wifiType, setWifiType] = useState("WPA");
  const [name, setName] = useState("Zero Human Studio");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("hello@example.com");
  const [barcodeText, setBarcodeText] = useState("123456789012");
  const [barcodeType, setBarcodeType] = useState<BarcodeType>("code128");
  const [result, setResult] = useState<Result>(null);

  const t = useMemo(() => locale === "ko" ? {
    mode: "QR 유형",
    content: "내용",
    generate: "QR/Barcode 생성",
    qrDownload: "QR SVG 다운로드",
    barcodeDownload: "Barcode PNG 다운로드",
    barcode: "바코드",
    local: "QR과 바코드는 브라우저에서 생성됩니다. 결제/공식 라벨용 바코드는 실제 리더기로 검증하세요.",
  } : {
    mode: "QR type",
    content: "Content",
    generate: "Generate QR/Barcode",
    qrDownload: "Download QR SVG",
    barcodeDownload: "Download Barcode PNG",
    barcode: "Barcode",
    local: "QR and barcode images are generated in the browser. Validate payment or official labels with a real scanner.",
  }, [locale]);

  function qrValue() {
    if (mode === "wifi") return `WIFI:T:${wifiType};S:${escapeWifi(ssid)};P:${escapeWifi(password)};;`;
    if (mode === "vcard") return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    return text;
  }

  async function generate() {
    try {
      const qrSvg = await QRCode.toString(qrValue(), { type: "svg", errorCorrectionLevel: "M", margin: 2, width: 512 });
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, { bcid: barcodeType, text: barcodeText, scale: 3, height: 12, includetext: true, textxalign: "center" });
      setResult({ ok: true, qrSvg, barcodePng: canvas.toDataURL("image/png") });
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "생성에 실패했습니다." });
    }
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-accent p-4 text-sm text-muted">{t.local}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">{t.mode}</span>
          <select value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="url">URL</option><option value="text">Text</option><option value="wifi">Wi-Fi</option><option value="vcard">vCard</option>
          </select>
        </label>
        {(mode === "url" || mode === "text") && <label className="space-y-1"><span className="text-sm font-medium">{t.content}</span><textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>}
        {mode === "wifi" && <><input value={ssid} onChange={(event) => setSsid(event.target.value)} placeholder="SSID" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><select value={wifiType} onChange={(event) => setWifiType(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm"><option>WPA</option><option>WEP</option><option>nopass</option></select></>}
        {mode === "vcard" && <><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /></>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1"><span className="text-sm font-medium">{t.barcode}</span><input value={barcodeText} onChange={(event) => setBarcodeText(event.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
        <label className="space-y-1"><span className="text-sm font-medium">Type</span><select value={barcodeType} onChange={(event) => setBarcodeType(event.target.value as BarcodeType)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"><option value="code128">Code 128</option><option value="ean13">EAN-13</option><option value="upca">UPC-A</option></select></label>
      </div>
      <button type="button" onClick={() => void generate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.generate}</button>
      {result?.ok === false && <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</output>}
      {result?.ok && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4 text-center">
            <div className="mx-auto max-w-[260px]" dangerouslySetInnerHTML={{ __html: result.qrSvg }} />
            <button type="button" onClick={() => downloadBlob(textToBlob(result.qrSvg, "image/svg+xml"), "qr-code.svg")} className="mt-3 text-sm font-semibold text-primary hover:underline">{t.qrDownload}</button>
          </div>
          <div className="rounded-xl border border-border p-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.barcodePng} alt="Barcode" className="mx-auto max-w-full rounded bg-white p-3" />
            <button type="button" onClick={() => downloadBlob(dataUrlToBlob(result.barcodePng), "barcode.png")} className="mt-3 text-sm font-semibold text-primary hover:underline">{t.barcodeDownload}</button>
          </div>
        </div>
      )}
    </div>
  );
}
