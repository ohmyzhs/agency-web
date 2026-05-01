"use client";

import { useLocale } from "@/components/providers";

export default function PrivacyPage() {
  const { locale } = useLocale();

  if (locale === "en") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-foreground/60">Last updated: April 2, 2026</p>

        <h2>1. Overview</h2>
        <p>
          oh-my-zhs (Zero Human Studio) operates mobile applications distributed through
          the Apps in Toss (앱인토스) platform. This policy describes how we handle user
          data in our apps.
        </p>

        <h2>2. Data We Collect</h2>
        <p>
          Our utility apps (<strong>Weekly Planner</strong>, <strong>Quick Unit Converter</strong>)
          are designed to work offline. We do not collect, transmit, or store any personal
          information on external servers.
        </p>
        <ul>
          <li>All data (to-dos, favorites, preferences) is stored locally on your device.</li>
          <li>We do not use analytics, tracking pixels, or advertising SDKs.</li>
          <li>We do not access your contacts, camera, location, or other device features.</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>
          Our apps run within the Toss (토스) platform environment. The Toss app itself
          may collect data per its own privacy policy. We do not share any data with
          third parties.
        </p>

        <h2>4. Data Storage</h2>
        <p>
          All app data is stored using the device&apos;s native storage API provided by the
          앱인토스 platform. Uninstalling the app removes all stored data.
        </p>

        <h2>5. Children&apos;s Privacy</h2>
        <p>
          Our apps are rated for all ages and do not knowingly collect data from children.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Changes will be posted on this page
          with an updated date.
        </p>

        <h2>7. Contact</h2>
        <p>
          For questions about this privacy policy, contact us at{" "}
          <a href="mailto:contact@ohmyzhs.com">contact@ohmyzhs.com</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose dark:prose-invert">
      <h1>개인정보 처리방침</h1>
      <p className="text-sm text-foreground/60">최종 수정일: 2026년 4월 2일</p>

      <h2>1. 개요</h2>
      <p>
        oh-my-zhs (Zero Human Studio)는 앱인토스 플랫폼을 통해 모바일 애플리케이션을
        배포합니다. 본 방침은 당사 앱에서 사용자 데이터를 처리하는 방식을 설명합니다.
      </p>

      <h2>2. 수집하는 데이터</h2>
      <p>
        당사의 유틸리티 앱(<strong>주간 플래너</strong>, <strong>빠른 단위 변환기</strong>)은
        오프라인으로 작동하도록 설계되었습니다. 외부 서버로 개인정보를 수집, 전송 또는
        저장하지 않습니다.
      </p>
      <ul>
        <li>모든 데이터(할 일, 즐겨찾기, 설정)는 기기에 로컬로 저장됩니다.</li>
        <li>분석 도구, 추적 픽셀, 광고 SDK를 사용하지 않습니다.</li>
        <li>연락처, 카메라, 위치 등 기기 기능에 접근하지 않습니다.</li>
      </ul>

      <h2>3. 제3자 서비스</h2>
      <p>
        당사 앱은 토스 플랫폼 환경 내에서 실행됩니다. 토스 앱 자체는 자체 개인정보
        처리방침에 따라 데이터를 수집할 수 있습니다. 당사는 제3자와 데이터를 공유하지
        않습니다.
      </p>

      <h2>4. 데이터 저장</h2>
      <p>
        모든 앱 데이터는 앱인토스 플랫폼이 제공하는 기기의 네이티브 스토리지 API를
        사용하여 저장됩니다. 앱을 삭제하면 저장된 모든 데이터가 제거됩니다.
      </p>

      <h2>5. 아동 개인정보</h2>
      <p>
        당사 앱은 전체 연령가 등급이며, 아동의 데이터를 의도적으로 수집하지 않습니다.
      </p>

      <h2>6. 방침 변경</h2>
      <p>
        본 방침은 수시로 업데이트될 수 있습니다. 변경 사항은 이 페이지에 업데이트된
        날짜와 함께 게시됩니다.
      </p>

      <h2>7. 문의</h2>
      <p>
        본 개인정보 처리방침에 대한 문의사항은{" "}
        <a href="mailto:contact@ohmyzhs.com">contact@ohmyzhs.com</a>으로
        연락해 주세요.
      </p>
    </div>
  );
}
