/**
 * 타이핑 설정 — wa-sqlite settings 테이블에 영속화.
 * 초기값은 하드코딩 기본값 사용, DB에서 로드 후 덮어씀.
 */
import { create } from 'zustand';

type TypingSettingsState = {
  // 음량 채널 (0~1)
  volumeKeySound: number;    // 타건음
  volumeEffect: number;      // 효과음 (오타/완료/신기록)
  volumeBgm: number;         // BGM

  // UI 표시
  showKeyboard: boolean;
  showHands: boolean;

  // 자판 설정
  keymap: 'dubeolsik' | 'sebeolsik-final';

  // 게임플레이
  countdownEnabled: boolean;
  autoNextContent: boolean;

  // DB 동기화 상태
  isSynced: boolean;
};

type TypingSettingsActions = {
  setVolumeKeySound: (v: number) => void;
  setVolumeEffect: (v: number) => void;
  setVolumeBgm: (v: number) => void;
  setShowKeyboard: (v: boolean) => void;
  setShowHands: (v: boolean) => void;
  setKeymap: (v: TypingSettingsState['keymap']) => void;
  setCountdownEnabled: (v: boolean) => void;
  setAutoNextContent: (v: boolean) => void;
  hydrate: (partial: Partial<TypingSettingsState>) => void;
  setSynced: () => void;
};

const defaults: TypingSettingsState = {
  volumeKeySound: 0.6,
  volumeEffect: 0.8,
  volumeBgm: 0.3,
  showKeyboard: true,
  showHands: true,
  keymap: 'dubeolsik',
  countdownEnabled: true,
  autoNextContent: true,
  isSynced: false,
};

// DB key 매핑 (settings 테이블 key 이름)
export const SETTINGS_DB_KEYS: Record<
  keyof Omit<TypingSettingsState, 'isSynced'>,
  string
> = {
  volumeKeySound:    'vol_key',
  volumeEffect:      'vol_effect',
  volumeBgm:         'vol_bgm',
  showKeyboard:      'show_keyboard',
  showHands:         'show_hands',
  keymap:            'keymap',
  countdownEnabled:  'countdown',
  autoNextContent:   'auto_next',
};

export const useTypingSettings = create<TypingSettingsState & TypingSettingsActions>((set) => ({
  ...defaults,

  setVolumeKeySound:   (volumeKeySound)   => set({ volumeKeySound }),
  setVolumeEffect:     (volumeEffect)     => set({ volumeEffect }),
  setVolumeBgm:        (volumeBgm)        => set({ volumeBgm }),
  setShowKeyboard:     (showKeyboard)     => set({ showKeyboard }),
  setShowHands:        (showHands)        => set({ showHands }),
  setKeymap:           (keymap)           => set({ keymap }),
  setCountdownEnabled: (countdownEnabled) => set({ countdownEnabled }),
  setAutoNextContent:  (autoNextContent)  => set({ autoNextContent }),
  hydrate:             (partial)          => set(partial),
  setSynced:           ()                 => set({ isSynced: true }),
}));
