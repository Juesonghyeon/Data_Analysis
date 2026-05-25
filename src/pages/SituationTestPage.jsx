import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 5개 진입 카드 (이유 선택)
const PERSONAS = [
  { id: 1, tag: '공부가 너무 힘들어서', title: '교과? 의미 없다!', emoji: '🙄',
    accentColor: '#F59E0B', accentBg: '#FFFBEB', comfort: '공부 말고도 잘하는 게 분명히 있어. 지금 그걸 찾는 중이야.' },
  { id: 2, tag: '뭘 좋아하는지 몰라서', title: '꿈이 없어도 괜찮아', emoji: '😮‍💨',
    accentColor: '#6366F1', accentBg: '#EEF2FF', comfort: '"아직 모른다"는 게 이상한 게 아니야. 모두가 처음엔 몰라.' },
  { id: 3, tag: '잘하는 게 없는 것 같아서', title: '친구들이 이미 알고 있어', emoji: '💪',
    accentColor: '#10B981', accentBg: '#ECFDF5', comfort: '네 재능은 네가 제일 늦게 알아챈다. 친구들한테 물어봐.' },
  { id: 4, tag: '현실이 너무 막막해서', title: '제약 없는 하루, 넌 뭐 해?', emoji: '🌅',
    accentColor: '#EC4899', accentBg: '#FDF2F8', comfort: '제약이 없을 때 선택하는 게 네 진짜 모습이야.' },
  { id: 5, tag: '남들이 다 잘 나가 보여서', title: 'SNS 말고, 진짜 나는?', emoji: '📵',
    accentColor: '#8B5CF6', accentBg: '#F5F3FF', comfort: '남들 피드가 아닌 네 현실에서 찾아야 해.' },
]

// 3파트 × 4문제 = 총 12문제
const PARTS = [
  {
    label: 'Part 1', title: '취미·흥미 탐색', subtitle: '평소 뭘 좋아하는지 알아볼게', emoji: '🎯',
    questions: [
      {
        text: '주말에 혼자 있을 때, 자연스럽게 손이 가는 건?',
        choices: [
          { emoji: '🔧', text: '뭔가 만들거나 수리하기', sub: '손으로 뭔가 완성하는 게 좋음',
            delta: { interest: { R: 25 }, aptitude: { 손재능: 15 }, values: {} } },
          { emoji: '🔍', text: '궁금한 거 검색하고 분석하기', sub: '하나 알면 더 알고 싶어짐',
            delta: { interest: { I: 25 }, aptitude: { 수리논리력: 15 }, values: {} } },
          { emoji: '🎨', text: '그림·음악·영상 창작하기', sub: '내 감각대로 만드는 게 재밌음',
            delta: { interest: { A: 25 }, aptitude: { 창의력: 15 }, values: {} } },
          { emoji: '💬', text: '친구 만나거나 연락하기', sub: '사람이랑 있으면 에너지가 충전됨',
            delta: { interest: { S: 20, E: 5 }, aptitude: { 대인관계능력: 15 }, values: {} } },
        ],
      },
      {
        text: '유튜브 알고리즘이 추천하는 영상 중 가장 자주 보는 건?',
        choices: [
          { emoji: '🏗️', text: '만들기·실험·DIY 채널', sub: '직접 만드는 과정을 보는 게 즐거움',
            delta: { interest: { R: 25 }, aptitude: { 공간지각력: 15 }, values: {} } },
          { emoji: '📊', text: '지식·다큐·사건 분석 채널', sub: '진짜 정보가 담긴 걸 봐야 직성이 풀림',
            delta: { interest: { I: 25 }, aptitude: { 자기관리능력: 15 }, values: {} } },
          { emoji: '🎭', text: 'K-pop·게임·예술·예능 채널', sub: '감각적이고 재밌는 콘텐츠에 끌림',
            delta: { interest: { A: 25 }, aptitude: { 예술시각능력: 15 }, values: {} } },
          { emoji: '🎙️', text: '인터뷰·토크·브이로그 채널', sub: '사람들 이야기 듣는 게 질리지 않음',
            delta: { interest: { S: 15, E: 10 }, aptitude: { 언어능력: 15 }, values: {} } },
        ],
      },
      {
        text: '시험이 끝났어. 완전히 자유야. 뭐 하고 싶어?',
        choices: [
          { emoji: '🛠️', text: '뭔가 직접 만들거나 체험하러 나감', sub: '결과물이 눈에 보여야 뿌듯함',
            delta: { interest: { R: 20 }, aptitude: { 손재능: 10 }, values: { 즐거움: 15, 도전성: 10 } } },
          { emoji: '📚', text: '오래 파보고 싶었던 거 혼자 탐구', sub: '하나를 깊게 알아갈 때 가장 즐거움',
            delta: { interest: { I: 20 }, aptitude: { 자기관리능력: 10 }, values: { 자기계발: 15, 성취: 10 } } },
          { emoji: '🎬', text: '창작 활동에 온종일 빠져들기', sub: '뭔가를 만들어낼 때 시간이 빨리 감',
            delta: { interest: { A: 20 }, aptitude: { 창의력: 10 }, values: { 자율성: 15, 즐거움: 10 } } },
          { emoji: '🎉', text: '친구들이랑 놀거나 여행 가기', sub: '함께하는 순간에 가장 에너지가 넘침',
            delta: { interest: { S: 15, E: 5 }, aptitude: { 대인관계능력: 10 }, values: { 즐거움: 15, 일과삶의균형: 10 } } },
        ],
      },
      {
        text: '용돈이 갑자기 생겼어. 어디에 쓰는 편이야?',
        choices: [
          { emoji: '⚙️', text: '도구·재료·장비 (뭔가 만들려고)', sub: '재료비 아끼다 포기한 것들이 있음',
            delta: { interest: { R: 20 }, aptitude: { 손재능: 10 }, values: { 성취: 15 } } },
          { emoji: '📖', text: '책·강의·배움 관련', sub: '돈 써서라도 알고 싶은 게 있음',
            delta: { interest: { I: 20 }, aptitude: { 자기관리능력: 10 }, values: { 자기계발: 15, 성취: 10 } } },
          { emoji: '🎵', text: '음악·미술·콘텐츠 관련', sub: '내가 만들고 감상하는 데 쓰고 싶음',
            delta: { interest: { A: 20 }, aptitude: { 예술시각능력: 10 }, values: { 즐거움: 15, 자율성: 10 } } },
          { emoji: '🍔', text: '친구랑 먹거나 같이 노는 것', sub: '돈은 함께 쓸 때 제일 잘 쓰는 거임',
            delta: { interest: { S: 15, E: 5 }, aptitude: { 대인관계능력: 10 }, values: { 즐거움: 15, 일과삶의균형: 10 } } },
        ],
      },
    ],
  },
  {
    label: 'Part 2', title: '강점·적성 탐색', subtitle: '네가 잘하는 게 뭔지 알아볼게', emoji: '💪',
    questions: [
      {
        text: '모둠 과제에서 내가 맡으면 제일 잘 나오는 게 뭐야?',
        choices: [
          { emoji: '🔩', text: '손으로 직접 만들거나 시연하기', sub: '실제로 뭔가 보여주는 게 특기임',
            delta: { interest: { R: 10 }, aptitude: { 손재능: 20, 공간지각력: 10 }, values: {} } },
          { emoji: '📋', text: '자료 정리하고 논리적으로 설명', sub: '복잡한 걸 깔끔하게 정리하는 능력',
            delta: { interest: { I: 5, C: 5 }, aptitude: { 수리논리력: 20, 자기관리능력: 10 }, values: {} } },
          { emoji: '🖼️', text: '발표 자료·영상·디자인 예쁘게', sub: '눈에 띄게 만드는 감각이 있음',
            delta: { interest: { A: 10 }, aptitude: { 창의력: 15, 예술시각능력: 15 }, values: {} } },
          { emoji: '🗣️', text: '팀 분위기 이끌고 발표·설득', sub: '앞에 서서 이야기하는 게 두렵지 않음',
            delta: { interest: { E: 10, S: 5 }, aptitude: { 대인관계능력: 15, 언어능력: 15 }, values: {} } },
        ],
      },
      {
        text: '친구들이 나한테 자주 부탁하는 게 뭐야?',
        choices: [
          { emoji: '🔧', text: '"이거 고쳐줘 / 만들어줘"', sub: '뭔가 망가진 거 보면 내가 먼저 나섬',
            delta: { interest: { R: 10 }, aptitude: { 손재능: 20, 공간지각력: 10 }, values: {} } },
          { emoji: '💡', text: '"이거 설명해줘 / 어떻게 해?"', sub: '복잡한 거 쉽게 알려주는 걸 잘함',
            delta: { interest: { I: 5, C: 5 }, aptitude: { 수리논리력: 15, 언어능력: 15 }, values: {} } },
          { emoji: '🎨', text: '"디자인 해줘 / 편집해줘"', sub: '뭔가 만들어달라는 부탁이 자주 들어옴',
            delta: { interest: { A: 10 }, aptitude: { 창의력: 15, 예술시각능력: 15 }, values: {} } },
          { emoji: '🤝', text: '"같이 있어줘 / 고민 들어줘"', sub: '내 옆에 있으면 마음이 편해진대',
            delta: { interest: { S: 15 }, aptitude: { 대인관계능력: 20, 언어능력: 10 }, values: {} } },
        ],
      },
      {
        text: '이런 상황이 생기면 저절로 몰입하게 돼:',
        choices: [
          { emoji: '🔍', text: '원인 파악하고 해결 방법 찾기', sub: '뭔가 이유가 있어야 직성이 풀림',
            delta: { interest: { I: 10, C: 5 }, aptitude: { 수리논리력: 20, 자기관리능력: 10 }, values: {} } },
          { emoji: '🛠️', text: '뭔가 실제로 만들고 완성하기', sub: '완성됐을 때 뿌듯함이 엄청남',
            delta: { interest: { R: 15 }, aptitude: { 손재능: 20, 공간지각력: 10 }, values: {} } },
          { emoji: '✍️', text: '내 생각을 표현하고 창작하기', sub: '표현했을 때 기분이 시원해짐',
            delta: { interest: { A: 15 }, aptitude: { 창의력: 20, 예술시각능력: 10 }, values: {} } },
          { emoji: '📢', text: '사람들과 함께 뭔가 이뤄내기', sub: '같이 해냈을 때 더 짜릿함',
            delta: { interest: { E: 10, S: 5 }, aptitude: { 대인관계능력: 20, 언어능력: 10 }, values: {} } },
        ],
      },
      {
        text: '새로운 걸 배울 때 나는 주로:',
        choices: [
          { emoji: '🏃', text: '직접 해보면서 몸으로 익힌다', sub: '설명보다 한 번 해보는 게 빠름',
            delta: { interest: { R: 15 }, aptitude: { 손재능: 15, 공간지각력: 10 }, values: { 도전성: 10 } } },
          { emoji: '🧠', text: '원리부터 이해하고 논리적으로', sub: '왜 그런지 알아야 납득이 됨',
            delta: { interest: { I: 10, C: 5 }, aptitude: { 수리논리력: 15, 자기관리능력: 10 }, values: { 자기계발: 10 } } },
          { emoji: '👁️', text: '감각으로 느끼고 직관으로 파악', sub: '이론보다 느낌이 더 잘 와 닿음',
            delta: { interest: { A: 15 }, aptitude: { 창의력: 15, 예술시각능력: 10 }, values: { 자율성: 10 } } },
          { emoji: '👥', text: '누군가한테 물어보거나 같이 한다', sub: '혼자보다 같이 배우면 더 잘 됨',
            delta: { interest: { S: 10, E: 5 }, aptitude: { 대인관계능력: 15, 언어능력: 10 }, values: { 사회적기여: 10 } } },
        ],
      },
    ],
  },
  {
    label: 'Part 3', title: '가치관·동기 탐색', subtitle: '무엇이 너를 움직이는지 알아볼게', emoji: '✨',
    questions: [
      {
        text: '일할 때 가장 중요하게 여기는 게 뭐야?',
        choices: [
          { emoji: '🏠', text: '안정적인 수입과 편안한 환경', sub: '흔들리지 않는 기반이 있어야 안심됨',
            delta: { interest: { C: 10 }, aptitude: {}, values: { 안정성: 20, 보수: 15 } } },
          { emoji: '📈', text: '계속 성장하고 새로운 걸 배우는 것', sub: '제자리에 머물면 답답함을 느낌',
            delta: { interest: { I: 10 }, aptitude: {}, values: { 자기계발: 20, 성취: 15 } } },
          { emoji: '🌟', text: '좋아하는 걸 하는 자유와 즐거움', sub: '억지로 하면 오래 못 버팀',
            delta: { interest: { A: 10 }, aptitude: {}, values: { 자율성: 20, 즐거움: 15 } } },
          { emoji: '❤️', text: '사람들에게 도움이 되는 것', sub: '누군가에게 필요한 사람이 되고 싶음',
            delta: { interest: { S: 10 }, aptitude: {}, values: { 사회적기여: 20, 일과삶의균형: 10 } } },
        ],
      },
      {
        text: '10년 후 내 모습으로 가장 끌리는 건?',
        choices: [
          { emoji: '⚒️', text: '전문 기술을 가진 장인·전문직', sub: '손으로 만든 것이 세상에 남음',
            delta: { interest: { R: 10 }, aptitude: {}, values: { 성취: 20, 자기계발: 10, 안정성: 10 } } },
          { emoji: '🔬', text: '뭔가를 연구하는 전문가·연구원', sub: '모르는 걸 파헤쳐서 답을 찾는 삶',
            delta: { interest: { I: 10 }, aptitude: {}, values: { 자기계발: 20, 성취: 10, 도전성: 10 } } },
          { emoji: '🎭', text: '내 작품으로 인정받는 창작자', sub: '내가 만든 것으로 사람들에게 감동 줌',
            delta: { interest: { A: 10 }, aptitude: {}, values: { 자율성: 15, 즐거움: 15, 성취: 10 } } },
          { emoji: '🌍', text: '사람들과 함께 일하는 리더·활동가', sub: '여러 사람과 함께 세상을 바꾸고 싶음',
            delta: { interest: { E: 10, S: 5 }, aptitude: {}, values: { 사회적기여: 15, 도전성: 15, 성취: 10 } } },
        ],
      },
      {
        text: '힘들어도 버티게 해주는 원동력이 뭐야?',
        choices: [
          { emoji: '👀', text: '결과물이 눈에 보이고 손에 잡힐 때', sub: '완성된 걸 보면 다시 힘이 남',
            delta: { interest: { R: 5 }, aptitude: {}, values: { 성취: 20, 즐거움: 15 } } },
          { emoji: '💭', text: '어려운 문제를 해결했을 때의 쾌감', sub: '풀렸을 때 그 짜릿함이 계속 하게 만듦',
            delta: { interest: { I: 5 }, aptitude: {}, values: { 성취: 15, 자기계발: 10, 도전성: 15 } } },
          { emoji: '🎨', text: '내가 만들고 싶은 걸 표현할 수 있을 때', sub: '표현의 자유가 없으면 못 버팀',
            delta: { interest: { A: 5 }, aptitude: {}, values: { 자율성: 20, 즐거움: 15 } } },
          { emoji: '🙏', text: '누군가가 진심으로 고마워할 때', sub: '내가 도움이 됐다는 걸 알 때 보람을 느낌',
            delta: { interest: { S: 5 }, aptitude: {}, values: { 사회적기여: 20, 일과삶의균형: 10, 즐거움: 10 } } },
        ],
      },
      {
        text: '어떤 환경에서 일하고 싶어?',
        choices: [
          { emoji: '🌄', text: '현장·야외·직접 만들고 체험하는 곳', sub: '사무실보다 몸 쓰는 환경이 맞음',
            delta: { interest: { R: 10 }, aptitude: {}, values: { 자율성: 10, 즐거움: 15, 도전성: 15 } } },
          { emoji: '🖥️', text: '혼자 집중해서 깊이 파는 환경', sub: '방해받지 않고 집중할 수 있으면 충분',
            delta: { interest: { I: 5, C: 5 }, aptitude: {}, values: { 자기계발: 15, 안정성: 10, 성취: 15 } } },
          { emoji: '🎪', text: '자유롭게 아이디어 내는 창의적 공간', sub: '틀에 박힌 환경에서는 창의력이 안 나옴',
            delta: { interest: { A: 10 }, aptitude: {}, values: { 자율성: 20, 즐거움: 10, 도전성: 10 } } },
          { emoji: '🏢', text: '사람들과 협력하고 소통하는 팀', sub: '혼자보다 같이할 때 더 잘 되는 타입',
            delta: { interest: { E: 10, S: 5 }, aptitude: {}, values: { 사회적기여: 10, 일과삶의균형: 15, 성취: 10 } } },
        ],
      },
    ],
  },
]

const INIT_SCORES = {
  interest: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  aptitude: { 언어능력: 0, 수리논리력: 0, 창의력: 0, 대인관계능력: 0, 자기관리능력: 0, 공간지각력: 0, 손재능: 0, 예술시각능력: 0 },
  values: { 안정성: 0, 보수: 0, 일과삶의균형: 0, 즐거움: 0, 자기계발: 0, 도전성: 0, 사회적기여: 0, 자율성: 0, 성취: 0 },
}

function addDelta(acc, delta) {
  const result = { ...acc }
  for (const [k, v] of Object.entries(delta)) result[k] = (result[k] || 0) + v
  return result
}

function normalizeGroup(obj) {
  const max = Math.max(...Object.values(obj), 1)
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, Math.round((v / max) * 100)]))
}

// 5개 카드 허브 화면
function HubView({ onSelect }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F3FF', padding: '28px 16px 60px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' }}>
            상황 선택형 검사
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#111827', marginBottom: 10, lineHeight: 1.3 }}>
            지금 네 상황과 가장 가까운 게 뭐야?
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>
            하나를 클릭하면 12개 질문으로 네 진로를 찾아줄게.<br />
            정답 없어. 솔직하게 골라봐.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 20px', borderRadius: 18,
                border: `1.5px solid #E9E7F8`, background: '#fff',
                cursor: 'pointer', textAlign: 'left',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${p.accentColor}`; e.currentTarget.style.background = p.accentBg; }}
              onMouseLeave={e => { e.currentTarget.style.border = '1.5px solid #E9E7F8'; e.currentTarget.style.background = '#fff'; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: p.accentBg, border: `1.5px solid ${p.accentColor}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>
                {p.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 3, textTransform: 'uppercase' }}>
                  {p.tag}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: 1.3 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.4 }}>
                  {p.comfort}
                </div>
              </div>
              <div style={{ fontSize: 20, color: '#D1D5DB', flexShrink: 0 }}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 12문제 설문 화면
function SurveyView({ persona, onComplete, onBack }) {
  const [partIdx, setPartIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [acc, setAcc] = useState(INIT_SCORES)

  const part = PARTS[partIdx]
  const question = part.questions[qIdx]
  const totalQ = PARTS.reduce((s, p) => s + p.questions.length, 0)
  const doneQ = PARTS.slice(0, partIdx).reduce((s, p) => s + p.questions.length, 0) + qIdx
  const progressPct = (doneQ / totalQ) * 100

  // 파트 전환 스플래시
  const [showSplash, setShowSplash] = useState(partIdx === 0)

  function handleNext() {
    if (!selected) return
    const newAcc = {
      interest: addDelta(acc.interest, selected.delta.interest),
      aptitude: addDelta(acc.aptitude, selected.delta.aptitude),
      values: addDelta(acc.values, selected.delta.values),
    }

    const isLastQ = qIdx === part.questions.length - 1
    const isLastPart = partIdx === PARTS.length - 1

    if (isLastQ && isLastPart) {
      onComplete(newAcc)
    } else if (isLastQ) {
      setAcc(newAcc)
      setPartIdx(partIdx + 1)
      setQIdx(0)
      setSelected(null)
      setShowSplash(true)
    } else {
      setAcc(newAcc)
      setQIdx(qIdx + 1)
      setSelected(null)
    }
  }

  // 파트 스플래시 화면
  if (showSplash) {
    return (
      <div style={{ minHeight: '100vh', background: persona.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>{part.emoji}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: persona.accentColor, letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' }}>
            {part.label} · {partIdx + 1}/{PARTS.length}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#111827', marginBottom: 10 }}>
            {part.title}
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, marginBottom: 32 }}>
            {part.subtitle}
          </p>
          <button
            onClick={() => setShowSplash(false)}
            style={{
              padding: '14px 40px', borderRadius: 14, border: 'none',
              background: persona.accentColor, color: '#fff',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
            }}
          >
            시작하기 →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3FF', padding: '20px 16px 48px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* 상단 네비 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer', fontWeight: 600, padding: 0 }}
          >
            ← 처음으로
          </button>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {PARTS.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 3 }}>
                {p.questions.map((_, j) => {
                  const done = i < partIdx || (i === partIdx && j < qIdx)
                  const current = i === partIdx && j === qIdx
                  return (
                    <div key={j} style={{
                      width: current ? 16 : 8, height: 8, borderRadius: 4,
                      background: done ? persona.accentColor : current ? persona.accentColor : '#E5E7EB',
                      opacity: done ? 0.5 : 1,
                      transition: 'all 0.3s',
                    }} />
                  )
                })}
                {i < PARTS.length - 1 && <div style={{ width: 4 }} />}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF' }}>
            {doneQ + 1}/{totalQ}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {/* 파트 헤더 */}
          <div style={{ background: persona.accentBg, borderBottom: `3px solid ${persona.accentColor}`, padding: '14px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{part.emoji}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: persona.accentColor, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {part.label} · {part.title}
                </div>
                <div style={{ height: 4, background: `${persona.accentColor}22`, borderRadius: 2, marginTop: 4, width: 120, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${((qIdx + 1) / part.questions.length) * 100}%`, background: persona.accentColor, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: persona.accentColor }}>
                {qIdx + 1}/{part.questions.length}
              </div>
            </div>
          </div>

          {/* 질문 + 선택지 */}
          <div style={{ padding: '22px 22px 20px' }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#1F2937', marginBottom: 20, lineHeight: 1.5 }}>
              {question.text}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              {question.choices.map((choice, ci) => {
                const isSelected = selected === choice
                return (
                  <button
                    key={ci}
                    onClick={() => setSelected(choice)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 14,
                      border: `2px solid ${isSelected ? persona.accentColor : '#F3F4F6'}`,
                      background: isSelected ? persona.accentBg : '#FAFAFA',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.18s',
                      transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                    }}
                  >
                    <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{choice.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: isSelected ? '#111827' : '#374151', marginBottom: 2, lineHeight: 1.4 }}>
                        {choice.text}
                      </p>
                      <p style={{ fontSize: 12, color: isSelected ? persona.accentColor : '#9CA3AF', fontWeight: 500 }}>
                        {choice.sub}
                      </p>
                    </div>
                    {isSelected && (
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%', background: persona.accentColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: '#fff', fontSize: 13, fontWeight: 900,
                      }}>✓</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 전체 진행바 */}
            <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: persona.accentColor, borderRadius: 2, transition: 'width 0.4s' }} />
            </div>

            <button
              onClick={handleNext}
              disabled={!selected}
              style={{
                width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                background: selected ? persona.accentColor : '#E5E7EB',
                color: selected ? '#fff' : '#9CA3AF',
                fontSize: 15, fontWeight: 800,
                cursor: selected ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {partIdx === PARTS.length - 1 && qIdx === part.questions.length - 1
                ? '내 진로 분석하기 →'
                : '다음 →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SituationTestPage() {
  const navigate = useNavigate()
  const [persona, setPersona] = useState(null)

  function handleComplete(finalAcc) {
    navigate('/result', {
      state: {
        inputMode: 'situation',
        scores: {
          interest: finalAcc.interest,
          aptitude: normalizeGroup(finalAcc.aptitude),
          values: normalizeGroup(finalAcc.values),
        },
      },
    })
  }

  if (!persona) {
    return <HubView onSelect={setPersona} />
  }

  return (
    <SurveyView
      persona={persona}
      onComplete={handleComplete}
      onBack={() => setPersona(null)}
    />
  )
}
