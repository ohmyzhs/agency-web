---
type: blog-draft
status: published
authoring_harness: obsidian-blog-draft-harness
created: 2026-05-01
updated: 2026-05-01
title: DST 사고 없이 KST와 해외 회의 시간 맞추는 법
slug: kst-global-meeting-time
kind: guide
category: korea-living
locale: ko
publishedAt: 2026-05-01
updatedAt: 2026-05-01
readingMinutes: 5
keyword_primary: KST 시간 변환
tags:
  - blog
  - guide
  - kst
  - timezone
related_tools:
  - kst-timezone-converter
  - cron-explainer
  - timestamp-converter
sourceLinks: []
canonical: https://oh-my-zhs.com/posts/kst-global-meeting-time
quality_gate: passed
share_url:
telegram_handoff: false
---
# DST 사고 없이 KST와 해외 회의 시간 맞추는 법

한국 표준시(KST)는 연중 UTC+9로 고정되어 있습니다. 문제는 한국 시간이 아니라 상대 도시의 시간이 계절에 따라 바뀐다는 점입니다.

## 한줄 요약
- KST는 움직이지 않지만 뉴욕, 런던, 베를린 같은 도시는 DST 전환으로 한국과의 시차가 1시간씩 달라질 수 있습니다.

## 검색 의도
해외 미팅을 잡거나 자동화 알림 시간을 정할 때 “한국 시간 오전 10시가 상대에게 몇 시인가”를 확인하려는 상황이 많습니다. 이때 날짜 없이 시간만 비교하면 DST 경계에서 실수가 납니다.

## DST 사고가 생기는 이유
DST를 적용하는 도시는 봄과 가을에 시계를 한 시간 이동합니다. 예를 들어 런던은 겨울에는 UTC+0, 여름에는 BST(UTC+1)를 사용합니다. 그래서 같은 KST 10:00이라도 상대 도시의 표시 시간은 계절에 따라 달라집니다.

## 실무 규칙
- 회의는 시간만이 아니라 날짜와 도시를 함께 지정합니다.
- 캘린더 초대에는 KST와 상대 도시 시간을 같이 적습니다.
- 자동화 작업은 가능하면 UTC로 저장하고 화면에서 KST로 변환합니다.
- DST 전환 주간에는 반복 회의를 한 번 더 확인합니다.

> “KST 10시”는 한국에서는 항상 같은 시간이지만, 상대 도시의 벽시계 시간은 고정되어 있지 않습니다.

## 도구로 확인하기
KST 시간 변환기는 실시간 토글, 초 표시, 도시 선택 칩을 제공하므로 지금 시각과 특정 도시의 시간을 빠르게 비교할 수 있습니다. 회의나 배포 알림처럼 실수가 비용으로 이어지는 일정은 도구 결과와 캘린더 표시를 함께 확인하는 편이 안전합니다.
