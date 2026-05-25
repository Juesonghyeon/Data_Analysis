import { chromium } from 'playwright';

const SCORES = {
  interest: { R: 60, I: 80, A: 70, S: 50, E: 75, C: 40 },
  aptitude: { 언어능력: 70, 수리논리력: 80, 창의력: 75, 대인관계능력: 60, 자기관리능력: 65, 공간지각력: 50, 손재능: 45, 예술시각능력: 55 },
  values: { 안정성: 50, 보수: 60, 일과삶의균형: 70, 즐거움: 65, 자기계발: 80, 도전성: 75, 사회적기여: 55, 자율성: 70, 성취: 85 },
};
const SESSION = JSON.stringify({
  sessionId: 'playwright-test',
  userId: 'tester',
  name: '테스트',
  expiresAt: '2099-12-31T00:00:00.000Z',
});

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();

// 모든 페이지 로드 전에 실행: 세션 세팅 + React Router state 주입
await ctx.addInitScript(({ session, scores }) => {
  localStorage.setItem('app_session', session);
  // React Router v6는 history.state.usr을 location.state로 사용
  // addInitScript는 React 실행 전에 동작하므로 replaceState로 미리 세팅
  window.history.replaceState(
    { idx: 0, usr: { inputMode: 'situation', scores }, key: 'result' },
    '',
    window.location.pathname  // 현재 경로 유지 (/result)
  );
}, { session: SESSION, scores: SCORES });

// 인증 API mocking (500 에러 방지)
await ctx.route('**/api/auth/**', route => {
  route.fulfill({ status: 200, contentType: 'application/json',
    body: JSON.stringify({ sessionId: 'playwright-test', userId: 'tester', name: '테스트', expiresAt: '2099-12-31T00:00:00.000Z' }) });
});

const page = await ctx.newPage();
const errors = [];
const apiCalls = [];
const allResponses = [];

page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('response', resp => {
  allResponses.push({ url: resp.url(), status: resp.status() });
  if (resp.url().includes('/api/model')) apiCalls.push({ url: resp.url(), status: resp.status() });
});

// /result 로 직접 goto (addInitScript가 먼저 실행되어 session + state 주입)
await page.goto('http://localhost:1573/result');

// 직업 추천 API 응답 대기 (최대 6초)
await page.waitForTimeout(6000);
await page.screenshot({ path: 'verify_result_page.png' });

const html = await page.content();
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// 500 에러 소스 확인
const failedReqs = allResponses.filter(r => r.status >= 400);

console.log('\n=== 검증 결과 ===');
console.log('URL:', page.url());
console.log('실패 요청:', JSON.stringify(failedReqs.slice(0, 5)));
console.log('/api/model 호출:', JSON.stringify(apiCalls));
console.log('콘솔 에러:', errors.slice(0, 3).join('\n  '));
console.log('');
console.log('✅ 흥미 분석 섹션:', html.includes('Holland') || html.includes('흥미 분석'));
console.log('✅ 적성 분석 섹션:', html.includes('적성 분석') || html.includes('주요 적성'));
console.log('✅ 가치관 섹션:', html.includes('가치관 분석') || html.includes('핵심 가치관'));
console.log('✅ 진로 추천 섹션:', html.includes('탐색해볼') || html.includes('추천 진로'));
console.log('✅ 로딩 중 상태:', html.includes('분석 중') || html.includes('⏳'));
console.log('✅ % 점수들:', (text.match(/\d+\.?\d*%/g) || []).slice(0, 6).join(', '));
console.log('✅ 관련 대학/학과:', html.includes('관련 대학') || html.includes('학과명'));
console.log('');
console.log('텍스트 샘플:', text.slice(0, 600));

await browser.close();
