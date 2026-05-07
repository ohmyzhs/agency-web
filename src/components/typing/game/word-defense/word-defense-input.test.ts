import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { diffCaptureJamo, displayTypedProgress } from './word-defense-input';

describe('word defense input helpers', () => {
  it('emits only appended jamo from normal IME progress', () => {
    assert.deepEqual(diffCaptureJamo('', 'ㄱ'), {
      emitted: ['ㄱ'],
      nextPrevious: 'ㄱ',
      shouldClearInput: false,
    });
    assert.deepEqual(diffCaptureJamo('ㄱ', 'ㄱㅏ'), {
      emitted: ['ㅏ'],
      nextPrevious: 'ㄱㅏ',
      shouldClearInput: false,
    });
  });

  it('resyncs instead of replaying stale jamo when IME rewrites or deletes input', () => {
    assert.deepEqual(diffCaptureJamo('ㄱㅏ', 'ㄱ'), {
      emitted: [],
      nextPrevious: 'ㄱ',
      shouldClearInput: false,
    });
    assert.deepEqual(diffCaptureJamo('ㄱㅏ', ''), {
      emitted: [],
      nextPrevious: '',
      shouldClearInput: true,
    });
  });

  it('falls back to plain stroke text when es-hangul cannot assemble a mixed sequence', () => {
    assert.equal(displayTypedProgress(['ㄱ', 'ㅏ']), '가');
    assert.equal(displayTypedProgress(['a']), 'a');
  });
});
