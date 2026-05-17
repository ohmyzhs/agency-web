import assert from 'node:assert/strict';
import { test } from 'node:test';

import { LONGFORM_CATEGORIES, getPassagesForCategory } from './packs-staged';
import { englishSentences } from './packs';

const hasHangul = (value: string) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(value);

test('sentence practice has a substantial English prompt pool', () => {
  assert.ok(englishSentences.length >= 20);
});

test('longform English mode returns English passages for every visible category', () => {
  for (const category of LONGFORM_CATEGORIES) {
    const passages = getPassagesForCategory(category, 'en');
    assert.ok(passages.length > 0, `${category} should have English longform passages`);
    assert.equal(passages.some((passage) => hasHangul(`${passage.title} ${passage.text}`)), false);
  }
});
