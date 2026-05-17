import type { StageLevel, TypingLanguage } from '../../../../lib/typing/types';
import { getWordsForStage } from '../../../../lib/typing/packs-staged';

const EXTRA_KOREAN_WORDS: Record<StageLevel, string[]> = {
  100: [
    '빛', '밤', '낮', '숲', '섬', '문', '별빛', '새벽', '바람', '구름', '초원', '우산', '지도', '연필', '시계', '버튼', '화면', '소리', '박수', '미소',
  ],
  200: [
    '우주선', '행성', '로켓', '레이저', '방패', '미사일', '격납고', '관제탑', '연료', '항로', '신호', '경보', '좌표', '엔진', '궤도', '기지', '임무', '정찰', '요격', '탈출',
  ],
  400: [
    '인터페이스', '사용자', '반응속도', '정확도', '집중력', '키보드', '단축키', '입력흐름', '실시간', '자동완성', '프론트엔드', '백엔드', '데이터베이스', '알고리즘', '시뮬레이션', '프로토타입', '해상도', '네트워크', '업데이트', '최적화', '미사일',
  ],
  600: [
    '플라즈마포', '궤도방어망', '위성관제소', '에너지실드', '전술데이터', '미사일제어', '목표추적', '자동조준', '긴급회피', '기동전략', '전파교란', '재장전시간', '집중훈련', '반응훈련', '손가락리듬', '자모분해', '문장처리', '오류복구', '실전모드', '콤보유지',
  ],
  800: [
    '초고속요격시스템', '다중목표추적', '전술입력인터페이스', '실시간위협분석', '자동방어프로토콜', '연쇄폭발보너스', '고밀도운석지대', '플라즈마과열경고', '키보드반응최적화', '자모단위정밀타격', '집중력한계돌파', '콤보증폭장치',
  ],
  1000: [
    '행성방위통합관제시스템', '초정밀레이저유도미사일', '다층에너지실드재생프로토콜', '실시간운석궤도예측엔진', '고속자모입력동기화모듈', '복합위협우선순위분석', '전술데이터링크복구작전', '연쇄요격점수증폭장치',
  ],
  1100: [
    '심우주방어사령부긴급출격명령', '차세대무인요격기편대운용체계', '초고밀도운석폭풍대응시뮬레이션', '분산형행성방어네트워크복구', '키보드반응속도극한훈련프로토콜', '전술입력오류최소화집중훈련',
  ],
  1200: [
    '은하권초장거리정밀요격통합작전계획', '행성방위사령부실시간위협분석플랫폼', '초고속자모입력기반다중목표동시격파훈련', '양자레이더연동미사일방어시스템긴급가동', '최종방어선붕괴직전전술데이터복구작전',
  ],
};

const ENGLISH_WORDS: Record<StageLevel, string[]> = {
  100: ['sky', 'sun', 'moon', 'star', 'ship', 'beam', 'code', 'data', 'key', 'type', 'zone', 'word', 'fast', 'calm', 'focus', 'orbit', 'radar', 'laser', 'pilot', 'boost', 'guard', 'storm'],
  200: ['rocket', 'planet', 'meteor', 'comet', 'target', 'shield', 'engine', 'signal', 'launch', 'rescue', 'vector', 'typing', 'syntax', 'buffer', 'memory', 'canvas', 'module', 'binary', 'packet', 'server', 'cursor', 'attack'],
  400: ['missile', 'asteroid', 'keyboard', 'accuracy', 'reaction', 'defense', 'protocol', 'firewall', 'database', 'interface', 'function', 'variable', 'terminal', 'component', 'navigator', 'operator', 'sequence', 'training', 'overdrive', 'aircraft'],
  600: ['starfighter', 'hyperdrive', 'interceptor', 'plasma-cannon', 'target-lock', 'combo-chain', 'shield-core', 'input-vector', 'orbital-rail', 'missile-bay', 'syntax-error', 'cache-burst', 'threat-map', 'rapid-response', 'defense-grid', 'keyboard-flow'],
  800: ['multi-target', 'reaction-window', 'precision-strike', 'meteor-cluster', 'plasma-overload', 'adaptive-shield', 'tactical-input', 'missile-guidance', 'orbital-defense', 'velocity-control', 'combo-amplifier', 'emergency-vector'],
  1000: ['high-velocity-interceptor', 'real-time-threat-analysis', 'orbital-defense-network', 'precision-guided-missile', 'adaptive-target-priority', 'keyboard-response-protocol', 'multi-stage-combo-system', 'plasma-reactor-overload'],
  1100: ['deep-space-defense-command', 'autonomous-interceptor-squadron', 'multi-vector-threat-simulation', 'emergency-target-acquisition', 'keyboard-precision-overdrive', 'distributed-shield-regeneration'],
  1200: ['galactic-defense-command-protocol', 'quantum-radar-guided-missile-system', 'simultaneous-multi-target-elimination', 'last-defense-line-recovery-operation', 'ultra-high-speed-typing-response-drill'],
};

export function getWordDefenseWords(stage: StageLevel, language: TypingLanguage): string[] {
  const base = language === 'en' ? ENGLISH_WORDS[stage] : getWordsForStage(stage);
  const extra = language === 'ko' ? EXTRA_KOREAN_WORDS[stage] : [];
  return Array.from(new Set([...base, ...extra])).filter(Boolean);
}

export function pickWordWithoutRecent(pool: string[], recent: string[], random = Math.random): string {
  if (pool.length === 0) return '';
  const blocked = new Set(recent);
  const candidates = pool.filter((word) => !blocked.has(word));
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(random() * source.length) % source.length];
}
