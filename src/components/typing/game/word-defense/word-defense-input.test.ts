import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { diffCaptureJamo, displayTypedProgress, resolveWordDefenseInput } from './word-defense-input';

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

  it('treats the whole visible input as editable text so backspace preserves target progress', () => {
    const state = resolveWordDefenseInput({
      input: '프로',
      meteors: [
        { id: 1, word: '프로그램', matched: 0 },
        { id: 2, word: '데이터', matched: 0 },
      ],
      activeTargetId: null,
    });

    assert.deepEqual(state, {
      activeTargetId: 1,
      matchedById: new Map([[1, 4], [2, 0]]),
      pendingInput: '프로',
      completeTargetId: null,
    });

    const afterBackspace = resolveWordDefenseInput({
      input: '프',
      meteors: [
        { id: 1, word: '프로그램', matched: 5 },
        { id: 2, word: '데이터', matched: 0 },
      ],
      activeTargetId: 1,
    });

    assert.equal(afterBackspace.activeTargetId, 1);
    assert.equal(afterBackspace.matchedById.get(1), 2);
    assert.equal(afterBackspace.completeTargetId, null);
  });

  it('does not reset or release the current word when the editable input is temporarily wrong', () => {
    const state = resolveWordDefenseInput({
      input: '프x',
      meteors: [{ id: 1, word: '프로그램', matched: 3 }],
      activeTargetId: 1,
    });

    assert.equal(state.activeTargetId, 1);
    assert.equal(state.matchedById.get(1), 2);
    assert.equal(state.pendingInput, '프x');
    assert.equal(state.completeTargetId, null);
  });

  it('reports completion when the normal input equals the target word', () => {
    const state = resolveWordDefenseInput({
      input: 'program',
      meteors: [{ id: 7, word: 'program', matched: 0 }],
      activeTargetId: null,
    });

    assert.equal(state.activeTargetId, 7);
    assert.equal(state.matchedById.get(7), 7);
    assert.equal(state.completeTargetId, 7);
  });
});
