# 이음선배 (Eum Senior) — 프로토타입

세대가 만나 지혜가 이어지는 곳. 은퇴 어르신의 경험을 아이들의 지혜로 잇는
**화상 1:1 + 동네 거점 하이브리드 시니어 멘토링** 모바일 웹 프로토타입입니다.

- 배포: https://dinegroupcorp-star.github.io/dain-crafted-journeys/senior/
- 벤치마크: Eldera.ai(미국, 화상 결연·신원검증·AI 대화 모니터링), 다세대 하우스(독일), Grandmentors(영국)
- 사용자 비전: 은퇴 어르신의 경험 전수 + '평생 시니어 멘토' 직업군

## 구성

| 탭 | 내용 |
| --- | --- |
| 멘토 찾기 | 검색 · 분야 칩 5종 · 방식 필터(화상/거점) · 멘토 12명 · 상세 바텀시트 · 첫 만남 신청 |
| 동네 거점 | Leaflet + OpenStreetMap 지도(키 불필요) · 수도권 거점 8곳 · 주간 프로그램 · 참여 예약 |
| 화상·안전실 | AI 대화 안전 모니터링 데모 · 세대 공감 대화 카드 · 3단계 신원검증 타임라인 · 주간 리포트 |
| 시니어 지원 | 주니어→전문→수석 직무 사다리 · 월 활동비 시뮬레이터 · 멘토 지원 폼 |

## 기술

- 정적 HTML/CSS/JS (빌드 없음). 모든 경로는 상대 경로(`./`)만 사용해 `gh-pages` 하위 `/senior/`에서 동작.
- 지도: Leaflet 1.9.4 (unpkg CDN) + OpenStreetMap 타일. 타일 실패 시 Esri 타일로 자동 대체, 라이브러리 로드 실패 시 간이 지도로 대체.
- 신청/예약 내역은 `localStorage`(`eumseonbae.v1`)에 저장됩니다.

## 로컬 실행

```bash
cd senior-app
python3 -m http.server 8811
# http://localhost:8811/  (모바일 390x844 권장)
```
