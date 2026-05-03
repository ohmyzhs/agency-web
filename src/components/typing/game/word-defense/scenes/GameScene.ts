/**
 * Phaser GameScene — falling Korean words, jamo-by-jamo destruction.
 * Sprite assets are missing in /public/typing/sprites; this scene generates
 * its own textures procedurally (parallax stars, meteor halo, ship, particles)
 * so it stays self-contained but visually richer than raw primitives.
 */
import * as Phaser from 'phaser';
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
  haloObj: Phaser.GameObjects.Image;
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
  private bgFar?: Phaser.GameObjects.TileSprite;
  private bgNear?: Phaser.GameObjects.TileSprite;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;

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

    this.buildTextures();

    // Parallax: two scrolling star tile layers.
    this.bgFar = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'wd-stars-far')
      .setAlpha(0.6);
    this.bgNear = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'wd-stars-near')
      .setAlpha(0.9);

    // Floor defense line + ship sprite.
    this.add.rectangle(WIDTH / 2, HEIGHT - FLOOR_Y_OFFSET / 2, WIDTH, 4, 0xff5b1f, 0.6);
    this.add.image(WIDTH / 2, HEIGHT - 38, 'wd-ship').setOrigin(0.5, 1);
    this.add.text(WIDTH / 2, HEIGHT - 16, 'oh-my-zhs · DEFENSE LINE', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ff5b1f',
    }).setOrigin(0.5);

    // Particle emitter for explosion effects (manual emit on destroy).
    this.particles = this.add.particles(0, 0, 'wd-particle', {
      speed: { min: 80, max: 220 },
      lifespan: 420,
      alpha: { start: 1, end: 0 },
      scale: { start: 0.9, end: 0.1 },
      blendMode: 'ADD',
      emitting: false,
    });

    // Listen for jamo input from React via the bus
    this.bus.on('jamo', this.onJamoInput, this);
    this.bus.on('reset', this.scene.restart.bind(this.scene));

    this.bus.emit('hud', { wave: 1, hp: 100, score: 0, combo: 1 });
  }

  update(_time: number, delta: number) {
    // Parallax scroll runs even while paused-by-hp; keeps the scene alive.
    if (this.bgFar) this.bgFar.tilePositionY -= delta * 0.02;
    if (this.bgNear) this.bgNear.tilePositionY -= delta * 0.06;

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

    const haloRadius = Math.max(w, h) * 0.95;
    const haloObj = this.add.image(0, 0, 'wd-halo')
      .setDisplaySize(haloRadius * 2, haloRadius * 2)
      .setTint(tint)
      .setAlpha(0.55)
      .setBlendMode(Phaser.BlendModes.ADD);

    const container = this.add.container(x, -40, [haloObj, bgObj, textObj]);
    container.setSize(w, h);

    const speed = cfg.fallSpeed * (1 + (this.waveIdx - 1) * 0.08);

    this.meteors.push({
      id: this.nextId++,
      word, jamoSeq, matched: 0, special,
      container, textObj, bgObj, haloObj, speed,
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
    this.bus.emit('hit', { jamo, special: matched.special });
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

    if (this.particles) {
      this.particles.emitParticleAt(m.container.x, m.container.y, byPlayer ? 14 : 22);
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
    this.bus.emit('boom', { word: m.word });

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

  // ─── Procedural textures ───────────────────────────────────────────────────
  private buildTextures() {
    if (!this.textures.exists('wd-stars-far')) {
      this.makeStarTileTexture('wd-stars-far', 256, 70, 1, 0.5);
    }
    if (!this.textures.exists('wd-stars-near')) {
      this.makeStarTileTexture('wd-stars-near', 256, 30, 2, 0.85);
    }
    if (!this.textures.exists('wd-halo')) {
      this.makeHaloTexture('wd-halo', 128);
    }
    if (!this.textures.exists('wd-ship')) {
      this.makeShipTexture('wd-ship');
    }
    if (!this.textures.exists('wd-particle')) {
      this.makeParticleTexture('wd-particle');
    }
  }

  private makeStarTileTexture(key: string, size: number, count: number, dotSize: number, alpha: number) {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, alpha);
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, size);
      const y = Phaser.Math.Between(0, size);
      g.fillCircle(x, y, dotSize);
    }
    g.generateTexture(key, size, size);
    g.destroy();
  }

  private makeHaloTexture(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    const cx = size / 2;
    const cy = size / 2;
    // Soft radial falloff in concentric rings.
    for (let r = size / 2; r > 0; r--) {
      const a = Math.pow(r / (size / 2), 2);
      g.fillStyle(0xffffff, (1 - a) * 0.05);
      g.fillCircle(cx, cy, r);
    }
    g.generateTexture(key, size, size);
    g.destroy();
  }

  private makeShipTexture(key: string) {
    const w = 96;
    const h = 32;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0x1f1f24, 1);
    g.fillRoundedRect(0, h - 14, w, 12, 4);
    g.fillStyle(0xff5b1f, 1);
    g.fillTriangle(w / 2 - 22, h - 14, w / 2 + 22, h - 14, w / 2, 0);
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(w / 2, h - 12, 3);
    g.fillCircle(w / 2 - 18, h - 8, 2);
    g.fillCircle(w / 2 + 18, h - 8, 2);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private makeParticleTexture(key: string) {
    const size = 8;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(size / 2, size / 2, size / 2);
    g.generateTexture(key, size, size);
    g.destroy();
  }
}
