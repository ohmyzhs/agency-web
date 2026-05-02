/**
 * Phaser GameScene — falling Korean words, jamo-by-jamo destruction.
 * Renders only with primitives (no sprites) so it works without external assets.
 */
import Phaser from 'phaser';
import { disassemble } from 'es-hangul';
import type { StageLevel } from '@/lib/typing/types';
import { getWordsForStage } from '@/lib/typing/packs-staged';
import {
  STAGE_CONFIG,
  WAVES_TO_CLEAR,
  WAVE_DURATION_MS,
  SPECIAL_PROBABILITY,
} from '../config';

type SpecialKind = null | 'red' | 'purple' | 'gold';

type Meteor = {
  id: number;
  word: string;
  jamoSeq: string;        // full decomposed jamo string
  matched: number;        // jamos matched so far
  special: SpecialKind;
  container: Phaser.GameObjects.Container;
  textObj: Phaser.GameObjects.Text;
  bgObj: Phaser.GameObjects.Rectangle;
  speed: number;
};

const FLOOR_Y_OFFSET = 80;
const WIDTH = 800;
const HEIGHT = 600;

export class GameScene extends Phaser.Scene {
  private meteors: Meteor[] = [];
  private nextId = 1;
  private spawnTimer = 0;
  private waveTimer = 0;
  private slowFactor = 1;
  private slowUntil = 0;
  private wordPool: string[] = [];
  private stageLevel: StageLevel = 400;

  // External event bus (Phaser → React)
  private bus!: Phaser.Events.EventEmitter;

  // HUD
  private waveIdx = 1;
  private hp = 100;
  private score = 0;
  private combo = 1;
  private comboMax = 1;

  constructor() {
    super('GameScene');
  }

  init(data: { stage: StageLevel; bus: Phaser.Events.EventEmitter }) {
    this.stageLevel = data.stage;
    this.bus = data.bus;
    this.wordPool = getWordsForStage(this.stageLevel);
    this.meteors = [];
    this.nextId = 1;
    this.spawnTimer = 0;
    this.waveTimer = 0;
    this.slowFactor = 1;
    this.slowUntil = 0;
    this.waveIdx = 1;
    this.hp = 100;
    this.score = 0;
    this.combo = 1;
    this.comboMax = 1;
  }

  create() {
    this.cameras.main.setBackgroundColor('#0c0c0e');

    // simple parallax-ish star field
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.4);
    for (let i = 0; i < 60; i++) {
      g.fillCircle(Phaser.Math.Between(0, WIDTH), Phaser.Math.Between(0, HEIGHT), 1);
    }
    g.fillStyle(0xffffff, 0.2);
    for (let i = 0; i < 30; i++) {
      g.fillCircle(Phaser.Math.Between(0, WIDTH), Phaser.Math.Between(0, HEIGHT), 2);
    }

    // floor / spaceship line
    this.add.rectangle(WIDTH / 2, HEIGHT - FLOOR_Y_OFFSET / 2, WIDTH, 4, 0xff5b1f, 0.6);
    this.add.text(WIDTH / 2, HEIGHT - 30, 'oh-my-zhs · DEFENSE LINE', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ff5b1f',
    }).setOrigin(0.5);

    // Listen for jamo input from React via the bus
    this.bus.on('jamo', this.onJamoInput, this);
    this.bus.on('reset', this.scene.restart.bind(this.scene));

    this.bus.emit('hud', { wave: 1, hp: 100, score: 0, combo: 1 });
  }

  update(_time: number, delta: number) {
    if (this.hp <= 0) return;

    // slow-mo expiry
    if (this.slowUntil && this.time.now > this.slowUntil) {
      this.slowUntil = 0;
      this.slowFactor = 1;
    }

    const cfg = STAGE_CONFIG[this.stageLevel];
    const dt = delta / 1000;

    // spawn
    this.spawnTimer += delta;
    const interval = cfg.spawnIntervalMs * (this.slowFactor === 1 ? 1 : 1 / this.slowFactor);
    if (this.spawnTimer >= interval && this.meteors.length < cfg.maxConcurrent) {
      this.spawnTimer = 0;
      this.spawnMeteor();
    }

    // wave timer
    this.waveTimer += delta;
    if (this.waveTimer >= WAVE_DURATION_MS) {
      this.waveTimer = 0;
      this.waveIdx += 1;
      this.bus.emit('hud', { wave: this.waveIdx, hp: this.hp, score: this.score, combo: this.combo });
      if (this.waveIdx > WAVES_TO_CLEAR) {
        this.bus.emit('clear', { score: this.score, wave: this.waveIdx, comboMax: this.comboMax });
        this.scene.pause();
        return;
      }
    }

    // fall
    for (const m of this.meteors) {
      m.container.y += m.speed * dt * this.slowFactor;
      if (m.container.y >= HEIGHT - FLOOR_Y_OFFSET) {
        this.onMeteorReachFloor(m);
      }
    }
  }

  // ─── Spawning ──────────────────────────────────────────────────────────────
  private spawnMeteor() {
    const word = Phaser.Math.RND.pick(this.wordPool);
    const jamoSeq = disassemble(word);
    const cfg = STAGE_CONFIG[this.stageLevel];

    let special: SpecialKind = null;
    const r = Math.random();
    if (r < SPECIAL_PROBABILITY.red) special = 'red';
    else if (r < SPECIAL_PROBABILITY.red + SPECIAL_PROBABILITY.purple) special = 'purple';
    else if (r < SPECIAL_PROBABILITY.red + SPECIAL_PROBABILITY.purple + SPECIAL_PROBABILITY.gold) special = 'gold';

    const x = Phaser.Math.Between(60, WIDTH - 60);
    const fontSize = Phaser.Math.Clamp(28 - word.length * 1.2, 16, 28);
    const padding = 12;

    const tint = this.specialColor(special);
    const bgFill = special ? tint : 0x1f1f24;

    const textObj = this.add.text(0, 0, word, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: `${fontSize}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const w = textObj.width + padding * 2;
    const h = textObj.height + padding * 1.2;

    const bgObj = this.add.rectangle(0, 0, w, h, bgFill, 0.85)
      .setStrokeStyle(2, tint, 0.9);

    const container = this.add.container(x, -40, [bgObj, textObj]);
    container.setSize(w, h);

    const speed = cfg.fallSpeed * (1 + (this.waveIdx - 1) * 0.08);

    this.meteors.push({
      id: this.nextId++,
      word, jamoSeq, matched: 0, special,
      container, textObj, bgObj, speed,
    });
  }

  // ─── Input ─────────────────────────────────────────────────────────────────
  private onJamoInput(jamo: string) {
    if (this.hp <= 0) return;
    if (!jamo) return;

    // First find any meteor whose next jamo matches.
    let matched: Meteor | null = null;
    for (const m of this.meteors) {
      if (m.jamoSeq[m.matched] === jamo) {
        matched = m;
        break;
      }
    }

    if (!matched) {
      // Wrong key — combo break.
      this.combo = Math.max(1, this.combo * 0.5);
      this.bus.emit('hud', { wave: this.waveIdx, hp: this.hp, score: this.score, combo: this.combo });
      this.bus.emit('miss', { jamo });
      return;
    }

    matched.matched += 1;
    matched.bgObj.fillAlpha = 1;
    matched.textObj.setColor('#ff5b1f');
    this.tweens.add({
      targets: matched.container,
      scale: { from: 1.06, to: 1 },
      duration: 120,
    });

    if (matched.matched >= matched.jamoSeq.length) {
      this.destroyMeteor(matched, true);
    }
  }

  private destroyMeteor(m: Meteor, byPlayer: boolean) {
    if (byPlayer) {
      const goldMul = m.special === 'gold' ? 2 : 1;
      const base = m.word.length * 100 * (this.stageLevel / 200);
      const earned = Math.round(base * this.combo * goldMul);
      this.score += earned;
      this.combo = Math.min(3.0, this.combo + 0.5);
      this.comboMax = Math.max(this.comboMax, this.combo);

      if (m.special === 'purple') {
        this.slowFactor = 0.5;
        this.slowUntil = this.time.now + 3000;
      }
    }

    this.tweens.add({
      targets: m.container,
      alpha: 0,
      scale: 1.4,
      duration: 160,
      onComplete: () => m.container.destroy(),
    });
    this.meteors = this.meteors.filter(x => x.id !== m.id);

    this.bus.emit('hud', { wave: this.waveIdx, hp: this.hp, score: this.score, combo: this.combo });
  }

  private onMeteorReachFloor(m: Meteor) {
    const cfg = STAGE_CONFIG[this.stageLevel];
    const dmg = m.special === 'red' ? cfg.hpPenalty * 1.5 : cfg.hpPenalty;
    this.hp = Math.max(0, this.hp - dmg);
    this.combo = 1;

    this.cameras.main.shake(180, 0.005);

    this.destroyMeteor(m, false);

    if (this.hp <= 0) {
      this.bus.emit('gameover', { score: this.score, wave: this.waveIdx, comboMax: this.comboMax });
      this.scene.pause();
    }
  }

  private specialColor(s: SpecialKind): number {
    switch (s) {
      case 'red':    return 0xff4040;
      case 'purple': return 0xa855f7;
      case 'gold':   return 0xfacc15;
      default:       return 0xc2c2c2;
    }
  }
}
