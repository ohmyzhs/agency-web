"use client";

import { useLocale } from "@/components/providers";

export default function PrivacyPage() {
  const { locale } = useLocale();

  if (locale === "en") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-foreground/60">Last updated: 2026-05-01</p>

        <h2>1. About this site</h2>
        <p>
          ohmyzhs.com (Zero Human Studio, &ldquo;ZHS&rdquo;) publishes practical web tools:
          calculators, converters, validators, and small automation utilities. This policy
          explains what data the site handles when you use those tools and the contact form.
        </p>

        <h2>2. Browser-local tools</h2>
        <p>
          Most tools on this site run entirely in your browser. Inputs you type into JSON /
          YAML validation, text case, slug generation, UTM building, markdown table,
          timestamp, color contrast, cron, webhook, pyeong, KRW, KST, shoe size, cooking,
          unit, LLM cost, and ROI tools are processed locally and are not sent to any
          server operated by ZHS.
        </p>

        <h2>3. Contact form</h2>
        <p>
          The contact form collects the name, email, topic, and message that you provide.
          That information is used only to respond to your request — for example to fix a
          bug you reported, evaluate a tool suggestion, or answer a privacy question. It
          is not sold, shared with advertisers, or used for marketing.
        </p>

        <h2>4. Cookies and local storage</h2>
        <p>
          The site uses local storage to remember your theme preference (light / dark /
          system) and your language preference (Korean / English). It does not use
          tracking cookies and does not run advertising or analytics SDKs at this time.
          If that changes in the future, this page will be updated and the relevant pages
          will say so.
        </p>

        <h2>5. Hosting and server logs</h2>
        <p>
          The site is served by a hosting provider that may record standard web request
          metadata (IP address, user agent, timestamp) for security and reliability
          purposes. ZHS does not connect those logs to individual users or the contents
          of tool inputs.
        </p>

        <h2>6. Third-party links</h2>
        <p>
          Some pages link to external resources or vendor documentation. Those external
          sites are governed by their own privacy policies, and ZHS is not responsible
          for their data practices.
        </p>

        <h2>7. Children&apos;s privacy</h2>
        <p>
          The site is suitable for general audiences. ZHS does not knowingly collect
          information from children under 13.
        </p>

        <h2>8. Changes to this policy</h2>
        <p>
          This policy may be updated as the site evolves. The &ldquo;last updated&rdquo;
          date at the top of the page reflects the latest revision.
        </p>

        <h2>9. Contact</h2>
        <p>
          For questions about this privacy policy, write to{" "}
          <a href="mailto:contact@ohmyzhs.com">contact@ohmyzhs.com</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose dark:prose-invert">
      <h1>개인정보 처리방침</h1>
      <p className="text-sm text-foreground/60">최종 수정일: 2026-05-01</p>

      <h2>1. 사이트 개요</h2>
      <p>
        ohmyzhs.com(Zero Human Studio, 이하 “ZHS”)은 일상에서 쓸 만한 웹 도구
        — 계산기, 변환기, 검증기, 작은 자동화 유틸리티 — 를 공개하는 사이트입니다.
        본 방침은 도구 이용과 연락 양식 사용 시 처리되는 데이터에 대해 설명합니다.
      </p>

      <h2>2. 브라우저 내 처리 도구</h2>
      <p>
        본 사이트의 대부분의 도구는 브라우저 안에서만 동작합니다. JSON·YAML 검증,
        텍스트 케이스 변환, 슬러그 생성, UTM 빌더, 마크다운 표, 타임스탬프, 색상 대비,
        크론, 웹훅, 평수, KRW, KST, 신발 사이즈, 요리, 단위, LLM 비용, ROI 도구에
        입력한 값은 ZHS가 운영하는 어떤 서버로도 전송되지 않습니다.
      </p>

      <h2>3. 연락 양식</h2>
      <p>
        연락 양식은 입력하신 이름, 이메일, 문의 유형, 메시지를 수집합니다. 해당 정보는
        오직 답변 — 오류 수정, 도구 요청 검토, 개인정보 관련 답변 — 을 위한
        목적으로만 사용되며, 제3자에게 판매하거나 광고 목적으로 활용하지 않습니다.
      </p>

      <h2>4. 쿠키 및 로컬 스토리지</h2>
      <p>
        본 사이트는 사용자의 테마 선택(라이트/다크/시스템)과 언어 선택(한국어/영어)을
        기억하기 위해 브라우저 로컬 스토리지를 사용합니다. 추적용 쿠키, 광고 SDK,
        분석 SDK는 현재 사용하지 않습니다. 향후 변경 시 본 페이지와 관련 도구
        페이지에 명확히 표시합니다.
      </p>

      <h2>5. 호스팅 및 서버 로그</h2>
      <p>
        사이트는 외부 호스팅 서비스에서 운영되며, 보안과 안정성을 위한 표준 웹 요청
        메타데이터(IP 주소, 사용자 에이전트, 시각)가 호스팅 사업자에 의해 기록될 수
        있습니다. ZHS는 이러한 로그를 개별 이용자나 도구 입력 내용과 연결해 분석하지
        않습니다.
      </p>

      <h2>6. 외부 링크</h2>
      <p>
        일부 페이지는 외부 자료나 공급사 문서 링크를 포함합니다. 외부 사이트는 자체
        개인정보 처리방침을 따르며, ZHS는 외부 사이트의 데이터 처리에 책임을 지지
        않습니다.
      </p>

      <h2>7. 아동 개인정보</h2>
      <p>
        본 사이트는 전 연령 대상으로 운영되며, 만 13세 미만 아동의 개인정보를
        의도적으로 수집하지 않습니다.
      </p>

      <h2>8. 방침 변경</h2>
      <p>
        본 방침은 사이트 운영 변화에 따라 갱신될 수 있으며, 갱신 시 페이지 상단의
        “최종 수정일”이 반영됩니다.
      </p>

      <h2>9. 문의</h2>
      <p>
        본 개인정보 처리방침 관련 문의는{" "}
        <a href="mailto:contact@ohmyzhs.com">contact@ohmyzhs.com</a> 으로 보내주세요.
      </p>
    </div>
  );
}
