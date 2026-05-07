---
type: blog-draft
status: published
authoring_harness: obsidian-blog-draft-harness
created: 2026-05-01
updated: 2026-05-01
title: 스케줄에서 cron 표현식 만들기
slug: cron-expression-from-schedule
kind: guide
category: automation
locale: ko
publishedAt: 2026-05-01
updatedAt: 2026-05-01
readingMinutes: 4
keyword_primary: cron 표현식 생성
tags:
  - blog
  - guide
  - cron
  - automation
related_tools:
  - cron-explainer
  - kst-timezone-converter
sourceLinks: []
canonical: https://oh-my-zhs.com/posts/cron-expression-from-schedule
quality_gate: passed
share_url:
telegram_handoff: false
---
# 스케줄에서 cron 표현식 만들기

Cron 표현식은 짧지만 실수하기 쉽습니다. “매일 9시”, “평일 18시”, “5분마다” 같은 의도에서 출발해 표현식을 만드는 방식이 더 안전합니다.

## 한줄 요약
- Cron은 직접 외우기보다 스케줄 패턴을 먼저 정하고, 생성된 표현식과 다음 실행 시각을 확인하는 흐름이 안전합니다.

## 자주 쓰는 패턴
- N분마다 — `*/5 * * * *`는 5분마다 실행됩니다.
- 매 시 N분 — `30 * * * *`는 매시 30분에 실행됩니다.
- 매일 HH:mm — `0 9 * * *`는 매일 09:00에 실행됩니다.
- 평일 HH:mm — `0 9 * * 1-5`는 월요일부터 금요일까지 09:00에 실행됩니다.
- 매주 — `0 9 * * 1`은 매주 월요일 09:00에 실행됩니다.
- 매월 — `0 9 1 * *`는 매월 1일 09:00에 실행됩니다.

## 시간대 주의
서버 cron은 서버의 로컬 시간대를 따르는 경우가 많습니다. 한국 사용자에게 매일 오전 7시에 보내야 하는 알림이라면 서버 시간대와 KST가 일치하는지 확인해야 합니다.

## 배포 전 체크리스트
- 다음 5회 실행 시각이 의도와 맞는가
- 일요일/월요일 숫자 해석이 사용하는 시스템과 맞는가
- DST가 있는 지역의 로컬 시간을 직접 기준으로 삼고 있지 않은가
- 실패 시 재시도나 알림이 있는가

> 운영 cron의 가장 흔한 사고는 자정 경계, 요일 숫자, 서버 시간대에서 생깁니다.

## 도구로 생성하기
oh-my-zhs의 cron 도구는 표현식을 해석하는 데서 끝나지 않고, 스케줄을 고르면 cron expression을 생성하는 흐름을 우선합니다. 복사하기 전에 설명과 시간대 주의사항을 함께 확인하세요.
