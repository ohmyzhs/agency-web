"use client";

import bwipjs from "bwip-js";
import QRCode from "qrcode";
import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob } from "@/lib/browser-download";

type GeneratorKind = "qr" | "barcode";
type QrMode = "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "phone" | "geo" | "event";
type BarcodeType = "code128" | "ean13" | "upca" | "qrcode" | "pdf417" | "datamatrix";
type EcLevel = "L" | "M" | "Q" | "H";

type QrResult = { kind: "qr"; svg: string; png: string; value: string };
type BarcodeResult = { kind: "barcode"; png: string };
type Result = QrResult | BarcodeResult | { kind: "error"; error: string } | null;

function escapeWifi(value: string) {
  return value.replace(/[\\;,:"]/g, (match) => `\\${match}`);
}

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
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

function drawLogo(canvas: HTMLCanvasElement, logoDataUrl: string, logoRatio: number, logoPadding: number) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve();
        return;
      }
      const size = Math.round(canvas.width * logoRatio);
      const x = Math.round((canvas.width - size) / 2);
      const y = Math.round((canvas.height - size) / 2);
      const radius = Math.max(8, Math.round(size * 0.16));
      const pad = Math.round(logoPadding);

      ctx.save();
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, x - pad, y - pad, size + pad * 2, size + pad * 2, radius + pad);
      ctx.fill();
      ctx.clip();
      ctx.drawImage(image, x, y, size, size);
      ctx.restore();
      resolve();
    };
    image.onerror = () => reject(new Error("Logo image could not be loaded."));
    image.src = logoDataUrl;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export default function QrBarcodeGeneratorTool() {
  const { locale } = useLocale();
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [kind, setKind] = useState<GeneratorKind>("qr");
  const [qrMode, setQrMode] = useState<QrMode>("url");
  const [text, setText] = useState("https://oh-my-zhs.com");
  const [ssid, setSsid] = useState("My WiFi");
  const [password, setPassword] = useState("password1234");
  const [wifiType, setWifiType] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [name, setName] = useState("Zero Human Studio");
  const [org, setOrg] = useState("Zero Human Studio");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("hello@example.com");
  const [address, setAddress] = useState("");
  const [subject, setSubject] = useState("Hello");
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState("37.5665");
  const [longitude, setLongitude] = useState("126.9780");
  const [eventTitle, setEventTitle] = useState("Event");
  const [eventStart, setEventStart] = useState("20260508T090000");
  const [eventEnd, setEventEnd] = useState("20260508T100000");
  const [eventLocation, setEventLocation] = useState("");

  const [qrSize, setQrSize] = useState(768);
  const [margin, setMargin] = useState(3);
  const [errorCorrection, setErrorCorrection] = useState<EcLevel>("H");
  const [darkColor, setDarkColor] = useState("#111827");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoRatio, setLogoRatio] = useState(0.18);
  const [logoPadding, setLogoPadding] = useState(10);

  const [barcodeText, setBarcodeText] = useState("123456789012");
  const [barcodeType, setBarcodeType] = useState<BarcodeType>("code128");
  const [barcodeScale, setBarcodeScale] = useState(3);
  const [barcodeHeight, setBarcodeHeight] = useState(14);
  const [includeBarcodeText, setIncludeBarcodeText] = useState(true);
  const [result, setResult] = useState<Result>(null);

  const t = useMemo(() => locale === "ko" ? {
    qrTab: "QR 코드",
    barcodeTab: "바코드 / 2D 코드",
    qrType: "QR 내용 유형",
    content: "내용",
    generateQr: "QR 생성",
    generateBarcode: "바코드 생성",
    qrSvgDownload: "QR SVG 다운로드",
    qrPngDownload: "QR PNG 다운로드",
    barcodeDownload: "바코드 PNG 다운로드",
    barcode: "바코드 값",
    settings: "QR 옵션",
    size: "크기(px)",
    margin: "여백",
    ec: "오류 복원율",
    dark: "전경색",
    light: "배경색",
    logo: "가운데 로고",
    logoSize: "로고 크기",
    logoPadding: "로고 여백",
    removeLogo: "로고 제거",
    local: "QR과 바코드는 각각 따로 생성됩니다. QR은 URL, 텍스트, Wi‑Fi, 명함, 이메일, SMS, 전화, 위치, 일정과 색상/여백/복원율/중앙 로고 옵션을 지원합니다. 로고를 넣을 때는 높은 오류 복원율(H)을 권장합니다.",
    barcodeNote: "상업용 라벨/결제/물류 바코드는 실제 스캐너와 발급 규격으로 반드시 검증하세요.",
  } : {
    qrTab: "QR code",
    barcodeTab: "Barcode / 2D code",
    qrType: "QR content type",
    content: "Content",
    generateQr: "Generate QR",
    generateBarcode: "Generate barcode",
    qrSvgDownload: "Download QR SVG",
    qrPngDownload: "Download QR PNG",
    barcodeDownload: "Download barcode PNG",
    barcode: "Barcode value",
    settings: "QR options",
    size: "Size (px)",
    margin: "Quiet zone",
    ec: "Error correction",
    dark: "Foreground",
    light: "Background",
    logo: "Center logo",
    logoSize: "Logo size",
    logoPadding: "Logo padding",
    removeLogo: "Remove logo",
    local: "QR and barcode generation are separate. QR supports URL, text, Wi‑Fi, contact card, email, SMS, phone, geo, event, colors, quiet zone, error correction, and optional centered logo. Use high error correction (H) when adding a logo.",
    barcodeNote: "For commercial labels, payment, or logistics, validate the symbol with real scanners and the issuing specification.",
  }, [locale]);

  function qrValue() {
    if (qrMode === "wifi") return `WIFI:T:${wifiType};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${wifiHidden ? "true" : "false"};;`;
    if (qrMode === "vcard") {
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${escapeVCard(name)}`,
        org ? `ORG:${escapeVCard(org)}` : "",
        phone ? `TEL:${escapeVCard(phone)}` : "",
        email ? `EMAIL:${escapeVCard(email)}` : "",
        address ? `ADR:;;${escapeVCard(address)};;;;` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    }
    if (qrMode === "email") return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    if (qrMode === "sms") return `SMSTO:${phone}:${message}`;
    if (qrMode === "phone") return `tel:${phone}`;
    if (qrMode === "geo") return `geo:${latitude},${longitude}`;
    if (qrMode === "event") {
      return [
        "BEGIN:VEVENT",
        `SUMMARY:${escapeVCard(eventTitle)}`,
        `DTSTART:${eventStart}`,
        `DTEND:${eventEnd}`,
        eventLocation ? `LOCATION:${escapeVCard(eventLocation)}` : "",
        "END:VEVENT",
      ].filter(Boolean).join("\n");
    }
    return text;
  }

  async function generateQr() {
    try {
      const value = qrValue().trim();
      if (!value) throw new Error(locale === "ko" ? "QR에 담을 내용을 입력하세요." : "Enter content for the QR code.");
      const options = {
        errorCorrectionLevel: errorCorrection,
        margin,
        width: qrSize,
        color: { dark: darkColor, light: lightColor },
      };
      const svg = await QRCode.toString(value, { ...options, type: "svg" });
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, value, options);
      if (logoDataUrl) await drawLogo(canvas, logoDataUrl, logoRatio, logoPadding);
      setResult({ kind: "qr", svg, png: canvas.toDataURL("image/png"), value });
    } catch (error) {
      setResult({ kind: "error", error: error instanceof Error ? error.message : "Generation failed." });
    }
  }

  async function generateBarcode() {
    try {
      const canvas = document.createElement("canvas");
      bwipjs.toCanvas(canvas, {
        bcid: barcodeType,
        text: barcodeText,
        scale: barcodeScale,
        height: barcodeHeight,
        includetext: includeBarcodeText,
        textxalign: "center",
      });
      setResult({ kind: "barcode", png: canvas.toDataURL("image/png") });
    } catch (error) {
      setResult({ kind: "error", error: error instanceof Error ? error.message : "Generation failed." });
    }
  }

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    setLogoDataUrl(await readFileAsDataUrl(file));
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-accent p-4 text-sm text-muted">{kind === "qr" ? t.local : t.barcodeNote}</p>

      <div className="inline-flex rounded-lg border border-border bg-card p-1 text-sm">
        <button type="button" onClick={() => setKind("qr")} className={`rounded-md px-3 py-2 ${kind === "qr" ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}>{t.qrTab}</button>
        <button type="button" onClick={() => setKind("barcode")} className={`rounded-md px-3 py-2 ${kind === "barcode" ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}>{t.barcodeTab}</button>
      </div>

      {kind === "qr" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">{t.qrType}</span>
              <select value={qrMode} onChange={(event) => setQrMode(event.target.value as QrMode)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="url">URL</option><option value="text">Text</option><option value="wifi">Wi‑Fi</option><option value="vcard">vCard</option><option value="email">Email</option><option value="sms">SMS</option><option value="phone">Phone</option><option value="geo">Geo location</option><option value="event">Calendar event</option>
              </select>
            </label>
            {(qrMode === "url" || qrMode === "text") && <label className="space-y-1"><span className="text-sm font-medium">{t.content}</span><textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>}
            {qrMode === "wifi" && <><input value={ssid} onChange={(event) => setSsid(event.target.value)} placeholder="SSID" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><select value={wifiType} onChange={(event) => setWifiType(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm"><option>WPA</option><option>WEP</option><option>nopass</option></select><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={wifiHidden} onChange={(event) => setWifiHidden(event.target.checked)} /> Hidden network</label></>}
            {qrMode === "vcard" && <><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={org} onChange={(event) => setOrg(event.target.value)} placeholder="Organization" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Address" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" /></>}
            {(qrMode === "email" || qrMode === "sms" || qrMode === "phone") && <><input value={qrMode === "email" ? email : phone} onChange={(event) => qrMode === "email" ? setEmail(event.target.value) : setPhone(event.target.value)} placeholder={qrMode === "email" ? "Email" : "Phone"} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />{qrMode === "email" && <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />}{qrMode !== "phone" && <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message" rows={3} className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />}</>}
            {qrMode === "geo" && <><input value={latitude} onChange={(event) => setLatitude(event.target.value)} placeholder="Latitude" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={longitude} onChange={(event) => setLongitude(event.target.value)} placeholder="Longitude" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /></>}
            {qrMode === "event" && <><input value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} placeholder="Title" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={eventStart} onChange={(event) => setEventStart(event.target.value)} placeholder="Start: 20260508T090000" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={eventEnd} onChange={(event) => setEventEnd(event.target.value)} placeholder="End: 20260508T100000" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={eventLocation} onChange={(event) => setEventLocation(event.target.value)} placeholder="Location" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /></>}
          </div>

          <fieldset className="rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold">{t.settings}</legend>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1"><span className="text-sm font-medium">{t.size}</span><input type="number" min={256} max={2048} step={64} value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.margin}</span><input type="number" min={0} max={8} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.ec}</span><select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value as EcLevel)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"><option value="L">L · 7%</option><option value="M">M · 15%</option><option value="Q">Q · 25%</option><option value="H">H · 30%</option></select></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.dark}</span><input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background p-1" /></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.light}</span><input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background p-1" /></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.logo}</span><input type="file" accept="image/*" onChange={(e) => void handleLogo(e.target.files?.[0])} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.logoSize}: {Math.round(logoRatio * 100)}%</span><input type="range" min={8} max={28} value={Math.round(logoRatio * 100)} onChange={(e) => setLogoRatio(Number(e.target.value) / 100)} className="w-full" /></label>
              <label className="space-y-1"><span className="text-sm font-medium">{t.logoPadding}</span><input type="number" min={0} max={40} value={logoPadding} onChange={(e) => setLogoPadding(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
              {logoDataUrl && <button type="button" onClick={() => setLogoDataUrl(null)} className="self-end rounded-lg border border-border px-3 py-2 text-sm hover:bg-card">{t.removeLogo}</button>}
            </div>
          </fieldset>

          <button type="button" onClick={() => void generateQr()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.generateQr}</button>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1"><span className="text-sm font-medium">{t.barcode}</span><input value={barcodeText} onChange={(event) => setBarcodeText(event.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Type</span><select value={barcodeType} onChange={(event) => setBarcodeType(event.target.value as BarcodeType)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"><option value="code128">Code 128</option><option value="ean13">EAN-13</option><option value="upca">UPC-A</option><option value="qrcode">QR Code (barcode engine)</option><option value="pdf417">PDF417</option><option value="datamatrix">Data Matrix</option></select></label>
            <label className="space-y-1"><span className="text-sm font-medium">Scale</span><input type="number" min={1} max={8} value={barcodeScale} onChange={(e) => setBarcodeScale(Number(e.target.value))} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
            <label className="space-y-1"><span className="text-sm font-medium">Height</span><input type="number" min={4} max={60} value={barcodeHeight} onChange={(e) => setBarcodeHeight(Number(e.target.value))} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={includeBarcodeText} onChange={(event) => setIncludeBarcodeText(event.target.checked)} /> Include human-readable text</label>
          </div>
          <button type="button" onClick={() => void generateBarcode()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.generateBarcode}</button>
        </>
      )}

      {result?.kind === "error" && <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</output>}
      {result?.kind === "qr" && (
        <div className="rounded-xl border border-border p-4 text-center">
          <div
            className="mx-auto max-w-[260px] [&_svg]:h-auto [&_svg]:max-h-[260px] [&_svg]:w-full [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: result.svg }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.png} alt="QR code with selected options" className="mx-auto mt-4 h-auto max-h-[260px] w-full max-w-[260px] rounded bg-white p-3" />
          <canvas ref={qrCanvasRef} className="hidden" />
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => downloadBlob(textToBlob(result.svg, "image/svg+xml"), "qr-code.svg")} className="text-sm font-semibold text-primary hover:underline">{t.qrSvgDownload}</button>
            <button type="button" onClick={() => downloadBlob(dataUrlToBlob(result.png), "qr-code.png")} className="text-sm font-semibold text-primary hover:underline">{t.qrPngDownload}</button>
          </div>
        </div>
      )}
      {result?.kind === "barcode" && (
        <div className="rounded-xl border border-border p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.png} alt="Barcode" className="mx-auto max-w-full rounded bg-white p-3" />
          <button type="button" onClick={() => downloadBlob(dataUrlToBlob(result.png), "barcode.png")} className="mt-3 text-sm font-semibold text-primary hover:underline">{t.barcodeDownload}</button>
        </div>
      )}
    </div>
  );
}
