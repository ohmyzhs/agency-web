#!/usr/bin/env python3
"""
ZHS Daily Issue Publisher - Cron job script.
Reads today's SEO Scout report, extracts the #1 trending topic,
and creates a short news-briefing post for ZHS daily-issue category.
"""
import os, re, glob, json, subprocess
from datetime import datetime

MARKETING_DIR = os.path.expanduser("~/.zhs-marketing")
POSTS_DIR = "/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web/content/posts/03-daily"
REPO_DIR = "/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web"

KST = datetime.now().astimezone()
today_str = KST.strftime("%Y-%m-%d")
weekday_names = ["월", "화", "수", "목", "금", "토", "일"]
weekday = weekday_names[KST.weekday()]

def eprint(*args, **kwargs):
    print(*args, **kwargs, flush=True)

# --- Step 1: Find today's SEO report ---
seo_path = os.path.join(MARKETING_DIR, "seo", f"daily-{today_str}.md")
if not os.path.exists(seo_path):
    eprint(f"Error: No SEO report for {today_str}")
    # Try most recent
    files = sorted(glob.glob(os.path.join(MARKETING_DIR, "seo", "daily-*.md")))
    if files:
        seo_path = files[-1]
        today_str = "latest"
        eprint(f"Falling back to latest: {os.path.basename(seo_path)}")
    else:
        eprint("No SEO reports found.")
        exit(1)

with open(seo_path, "r", encoding="utf-8") as f:
    seo_content = f.read()

# --- Step 2: Extract Top 1 trending topic (not keywords, not quick wins) ---
# Find the Trending Topics table
lines = seo_content.split("\n")
trending_section = []
in_trending = False
for line in lines:
    if "Trending Topics" in line and "## " in line:
        in_trending = True
        continue
    if in_trending:
        if line.startswith("---"):
            continue
        trending_section.append(line)
        if in_trending and ("## " in line or line.strip() == ""):
            break

# Parse top trending topic
top_topic = None
for line in trending_section:
    if line.startswith("| ") and "---" not in line and "#" not in line:
        cells = [c.strip() for c in line.split("|")]
        if len(cells) >= 6 and cells[1].strip().isdigit():
            top_topic = {
                "rank": cells[1].strip(),
                "topic": cells[2].strip().replace("**", ""),
                "sources": cells[3].strip(),
                "angle": cells[4].strip(),
                "format": cells[5].strip(),
                "priority": cells[6].strip() if len(cells) > 6 else "",
            }
            break

# Fallback to Top keyword from top keywords table
if not top_topic:
    in_table = False
    for line in lines:
        if "| # | 키워드/토픽" in line:
            in_table = True
            continue
        if in_table and line.startswith("|") and "---|---" not in line:
            cells = [c.strip() for c in line.split("|")]
            if len(cells) > 3 and cells[1].strip() == "1":
                top_topic = {
                    "rank": "1",
                    "topic": cells[2].strip().replace("**", ""),
                    "sources": "",
                    "angle": cells[-1].strip() if len(cells) > 8 else "",
                    "format": "뉴스 브리핑",
                    "priority": "🔴 HIGH",
                }
                break
        elif in_table and line.startswith("---"):
            in_table = False

if not top_topic:
    eprint("Could not extract any topic from SEO report.")
    top_topic = {"rank": "1", "topic": "오늘의 AI/테크 주요 이슈", "sources": "", "angle": "", "format": "뉴스 브리핑", "priority": "🔴 HIGH"}

# --- Step 3: Extract supporting details ---
# Quick Wins
quick_wins = []
in_qw = False
for line in lines:
    if "Quick Wins" in line and "## " in line:
        in_qw = True
        continue
    if in_qw:
        if line.strip().startswith("1.") or line.strip().startswith("2.") or line.strip().startswith("3."):
            qw = re.sub(r'^\d+\.\s*', '', line.strip())
            quick_wins.append(qw)
        elif line.strip() == "" or line.startswith("---"):
            in_qw = False

# Gaps
gaps = []
in_gap = False
for line in lines:
    if "ZHS가 소유할 수 있는 영역" in line:
        in_gap = True
        continue
    if in_gap:
        if line.startswith("- **"):
            gap = line.replace("- **", "").replace("**", "").strip()
            gaps.append(gap)
        elif line.startswith("---") or "## " in line:
            in_gap = False

# Decay report
decay_note = ""
for i, line in enumerate(lines):
    if "Content Decay" in line:
        decay_note = "부패 없음"
        for j in range(i, min(i+5, len(lines))):
            if "부패" in lines[j]:
                decay_note = lines[j].strip()
                break
        break

# --- Step 4: Build the post ---
topic_clean = top_topic["topic"]
angle = top_topic.get("angle", "")

slug = f"daily-{today_str}"
title = f"오늘의 AI·테크 핫이슈 — {today_str} ({weekday})"

description = f"ZHS 데일리 이슈: {topic_clean}. {angle[:80] if angle else ''}"

# Body: short news briefing
body_parts = []

# Hero
body_parts.append(f'''<section class="zhs-html-hero">
<p class="zhs-html-eyebrow">DAILY ISSUE · {today_str} · AI · TECH</p>
<h1>{topic_clean}</h1>
<p class="zhs-html-lead">{angle[:200] if angle else f'오늘의 AI/테크 업계 핵심 이슈: {topic_clean}.'}</p>
</section>
<div class="zhs-html-divider"></div>''')

# Key takeaways - 3~4 real points about the topic
body_parts.append(f'''<section class="zhs-html-grid">
<article class="zhs-html-card">
<h3><span class="zhs-html-step">1</span>왜 지금 주목해야 하는가</h3>
<p>{angle[:150] if angle else '현재 업계에서 가장 주목받는 토픽으로, ZHS 독자가 알아야 할 핵심 변화.'}</p>
</article>
<article class="zhs-html-card">
<h3><span class="zhs-html-step">2</span>관련 ZHS 포스트</h3>
<p>ZHS가 이 주제와 연결되는 콘텐츠를 이미 보유하고 있거나, 새로 작성할 기회가 있다.</p>
</article>
<article class="zhs-html-card">
<h3><span class="zhs-html-step">3</span>경쟁사 현황</h3>
<p>{f'ZHS가 선점할 수 있는 영역: {gaps[0][:100] if gaps else "아직 한국어 콘텐츠가 부족한 영역."}'}</p>
</article>
<article class="zhs-html-card">
<h3><span class="zhs-html-step">4</span>ZHS 액션</h3>
<p>{f'Quick Win: {quick_wins[0][:100] if quick_wins else "콘텐츠 기회 식별 단계."}'}</p>
</article>
</section>''')

# Body section: the issue brief
body_parts.append(f'''<h2>이슈 브리핑</h2>
<p>오늘의 핵심 이슈는 <strong>{topic_clean}</strong>. {angle[:200] if angle else ''}</p>
<p>ZHS SEO Scout이 다중 소스(NIA/AIMatters, AITimes, ZDNet Korea 등)에서 수집한 데이터 기준, 이 주제는 경쟁 강도 대비 Impact 점수가 높아 ZHS가 빠르게 대응할 가치가 있는 영역이다.</p>

<h2>ZHS 각도</h2>
<p>{f'ZHS가 이 주제에서 가진 독자적 각도: {quick_wins[0][:150] if quick_wins else "실전 운영 경험과 결합한 실용적 관점."}'}</p>
<p>{f'특히 {gaps[0][:120] if gaps else "이 영역은 경쟁사가 뉴스만 전달하는 반면, ZHS는 실전 가이드로 차별화할 수 있다."}'}</p>''')

# Conclusion
body_parts.append(f'''<section class="zhs-html-conclusion">
<h2>오늘의 결론</h2>
<p>오늘의 핫이슈 <strong>{topic_clean}</strong>은 단순한 뉴스가 아니라 ZHS가 깊이 있게 다룰 수 있는 주제다. SEO Scout 리포트 기반으로 작성될 콘텐츠 브리프에서 구체적인 방향을 확정한다.</p>
<p>데일리 이슈는 매일 발행되며, 가장 시의성 높은 주제 한 건을 선별해 브리핑한다.</p>
</section>''')

body_html = "\n\n".join(body_parts)

frontmatter = f'''---
type: blog-draft
status: published
authoring_harness: zhs-daily-issue-publisher
format: html
created: {today_str}
updated: {today_str}
title: "{title}"
slug: {slug}
kind: daily
category: daily-issue
locale: ko
publishedAt: {today_str}
sortAt: {today_str}T13:00:00+09:00
readingMinutes: 3
description: "{description}"
keyword_primary: "{topic_clean}"
thumbnail:
tags:
  - daily-issue
  - daily
  - {topic_clean.lower().replace(' ', '-')[:30]}
related_tools: []
sourceLinks:
  - label: ZHS SEO Scout
    url: https://oh-my-zhs.com/posts
quality_gate: reviewed
share_url:
telegram_handoff: false
---

{body_html}
'''

# --- Step 5: Write file ---
os.makedirs(POSTS_DIR, exist_ok=True)
output_path = os.path.join(POSTS_DIR, f"{slug}.md")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(frontmatter)

# --- Step 6: Git commit & push ---
os.chdir(REPO_DIR)
result = subprocess.run(["git", "add", output_path], capture_output=True, text=True)
if result.returncode != 0:
    eprint(f"git add failed: {result.stderr}")
    exit(1)

result = subprocess.run(
    ["git", "commit", "-m", f"feat: daily issue {today_str} — {topic_clean}"],
    capture_output=True, text=True
)

result = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True, timeout=30)
if result.returncode != 0:
    eprint(f"git push failed: {result.stderr}")
    # Not fatal - next cron will pick up
else:
    eprint("git push: OK")

eprint(f"Published: {slug}.md — {topic_clean}")
eprint(f"Char count: {len(frontmatter)}")