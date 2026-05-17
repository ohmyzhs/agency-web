import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getWordDefenseWords, pickWordWithoutRecent } from './word-defense-words';

describe('word defense word pools', () => {
  it('has a much larger Korean pool after game-specific expansion', () => {
    const words = getWordDefenseWords(400, 'ko');
    assert.ok(words.length >= 90);
    assert.ok(words.includes('미사일제어') || words.includes('미사일'));
  });

  it('supports English mode with real game words', () => {
    const words = getWordDefenseWords(400, 'en');
    assert.ok(words.length >= 20);
    assert.ok(words.includes('missile'));
    assert.ok(words.includes('keyboard'));
  });

  it('avoids recently used words when alternatives exist', () => {
    const word = pickWordWithoutRecent(['alpha', 'bravo', 'charlie', 'delta'], ['alpha', 'bravo'], () => 0);
    assert.equal(word, 'charlie');
  });
});
