import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  buildBossMeteorWord,
  shouldSpawnBossAfterWaveTimer,
  resolveWaveAfterBossClear,
} from './word-defense-boss';

test('buildBossMeteorWord creates a boss phrase with at least five words', () => {
  const boss = buildBossMeteorWord({
    pool: ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'],
    recentWords: [],
  });

  assert.ok(boss.split(/\s+/).length >= 5);
});

test('boss phrase avoids recently used words when the pool allows it', () => {
  const boss = buildBossMeteorWord({
    pool: ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'],
    recentWords: ['alpha'],
  });

  assert.equal(boss.includes('alpha'), false);
  assert.ok(boss.split(/\s+/).length >= 5);
});

test('each normal wave timer ends by spawning a boss before the next wave', () => {
  assert.equal(shouldSpawnBossAfterWaveTimer({ waveIdx: 1, wavesToClear: 9, bossActive: false }), true);
  assert.equal(shouldSpawnBossAfterWaveTimer({ waveIdx: 9, wavesToClear: 9, bossActive: false }), true);
  assert.equal(shouldSpawnBossAfterWaveTimer({ waveIdx: 10, wavesToClear: 9, bossActive: false }), false);
  assert.equal(shouldSpawnBossAfterWaveTimer({ waveIdx: 1, wavesToClear: 9, bossActive: true }), false);
});

test('clearing a boss advances wave or clears the game after the final boss', () => {
  assert.deepEqual(resolveWaveAfterBossClear({ waveIdx: 1, wavesToClear: 9 }), {
    nextWaveIdx: 2,
    cleared: false,
  });
  assert.deepEqual(resolveWaveAfterBossClear({ waveIdx: 9, wavesToClear: 9 }), {
    nextWaveIdx: 10,
    cleared: true,
  });
});
