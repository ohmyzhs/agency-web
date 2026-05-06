/**
 * Phaser GameScene — falling Korean words, jamo-by-jamo destruction.
 * Wires keyed PNG assets (space bg, ship, meteors, explosion sheet) and emits
 * aim state to React so the input overlay and ship can track the active word.
 */
import * as Phaser from 'phaser';
import { disassemble, assemble } from 'es-hangul';
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
  jamoSeq: string;
  matched: number;
  special: SpecialKind;
  container: Phaser.GameObjects.Container;
  textObj: Phaser.GameObjects.Text;
  bgObj: Phaser.GameObjects.Rectangle;
  spriteObj: Phaser.GameObjects.Image;
  speed: number;
};

export type AimState = {
  x: number;
  y: number;
  typed: string;
  active: boolean;
};

const FLOOR_Y_OFFSET = 80;
const WIDTH = 800;
const HEIGHT = 600;
const SHIP_BASE_Y = HEIGHT - 56;
const INPUT_OFFSET_Y = -82; // input overlay above ship sprite
const SHIP_LERP = 8;        // ship glide speed (units / sec)
const SHIP_IDLE_RETURN_MS = 3000;

const ASSET_BASE = '/typing/game/word-defense/sprites/keyed';
const BG_PATH = '/typing/illustrations/space-bg.png';

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
  private ship!: Phaser.GameObjects.Image;
  private shipTargetX = WIDTH / 2;
  private lastInputAt = 0;
  private activeTargetId: number | null = null;
  private pendingInput = '';
  private lastAim: AimState = { x: WIDTH / 2, y: SHIP_BASE_Y + INPUT_OFFSET_Y, typed: '', active: false };

  private bus!: Phaser.Events.EventEmitter;

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
    this.activeTargetId = null;
    this.pendingInput = '';
    this.shipTargetX = WIDTH / 2;
  }

  preload() {
    this.load.image('wd-bg-space', BG_PATH);
    this.load.image('wd-ship-img', `${ASSET_BASE}/ship.png`);
    this.load.image('wd-meteor-large', `${ASSET_BASE}/meteor-large.png`);
    this.load.image('wd-meteor-medium', `${ASSET_BASE}/meteor-medium.png`);
    this.load.image('wd-meteor-small', `${ASSET_BASE}/meteor-small.png`);
    this.load.image('wd-meteor-gem', `${ASSET_BASE}/gem.png`);
    this.load.spritesheet('wd-explosion', `${ASSET_BASE}/explosion-sheet.png`, {
      frameWidth: 256,
      frameHeight: 256,
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#05060c');

    this.buildProceduralTextures();

    // Background image — stretched to canvas; subtle parallax stars float over it.
    if (this.textures.exists('wd-bg-space')) {
      this.add.image(WIDTH / 2, HEIGHT / 2, 'wd-bg-space')
        .setDisplaySize(WIDTH, HEIGHT)
        .setAlpha(0.95);
    }
    this.bgFar = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'wd-stars-far').setAlpha(0.35);
    this.bgNear = this.add.tileSprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 'wd-stars-near').setAlpha(0.55);

    // Defense line.
    this.add.rectangle(WIDTH / 2, HEIGHT - FLOOR_Y_OFFSET / 2, WIDTH, 2, 0xff5b1f, 0.55);
    this.add.text(WIDTH / 2, HEIGHT - 14, 'oh-my-zhs · DEFENSE LINE', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ff5b1f',
    }).setOrigin(0.5);

    this.ship = this.add.image(WIDTH / 2, SHIP_BASE_Y, 'wd-ship-img')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(96, 96);

    // Explosion animation from the normalized mixed-grid sheet:
    // source top area is 16 small 128px frames, bottom area is 12 large 256px frames,
    // all repacked into uniform 256px frames for Phaser spritesheet playback.
    if (!this.anims.exists('wd-boom')) {
      this.anims.create({
        key: 'wd-boom',
        frames: this.anims.generateFrameNumbers('wd-explosion', { start: 0, end: 27 }),
        frameRate: 34,
        repeat: 0,
      });
    }

    this.particles = this.add.particles(0, 0, 'wd-particle', {
      speed: { min: 80, max: 220 },
      lifespan: 420,
      alpha: { start: 1, end: 0 },
      scale: { start: 0.9, end: 0.1 },
      blendMode: 'ADD',
      emitting: false,
    });

    this.bus.on('jamo', this.onJamoInput, this);
    this.bus.on('reset', this.scene.restart, this.scene);

    this.bus.emit('hud', { wave: 1, hp: 100, score: 0, combo: 1 });
    this.emitAim();
  }

  update(_time: number, delta: number) {
    if (this.bgFar) this.bgFar.tilePositionY -= delta * 0.02;
    if (this.bgNear) this.bgNear.tilePositionY -= delta * 0.06;

    if (this.hp <= 0) return;

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
        this.activeTargetId = null;
        this.emitAim();
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

    // Ship glides toward a locked target, but does not snap back immediately
    // after a hit/miss. Keep the last position while the player is actively
    // typing, then return to center only after 3s of keypress inactivity.
    const active = this.getActiveMeteor();
    if (active) {
      this.shipTargetX = active.container.x;
    } else if (!this.lastInputAt || this.time.now - this.lastInputAt >= SHIP_IDLE_RETURN_MS) {
      this.shipTargetX = WIDTH / 2;
    }
    const t = Math.min(1, dt * SHIP_LERP);
    this.ship.x = Phaser.Math.Linear(this.ship.x, this.shipTargetX, t);

    this.emitAim();
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
    const padding = 10;

    const textObj = this.add.text(0, 0, word, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: `${fontSize}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const w = textObj.width + padding * 2;
    const h = textObj.height + padding * 1.2;

    // Pick meteor sprite by word length; gold special always uses the gem.
    const spriteKey = this.pickMeteorSpriteKey(word.length, special);
    const tint = this.specialColor(special);
    const spriteSize = Math.max(96, Math.min(160, w + 40));
    const spriteObj = this.add.image(0, 0, spriteKey)
      .setDisplaySize(spriteSize, spriteSize)
      .setOrigin(0.5);
    if (special && special !== 'gold') spriteObj.setTint(tint);

    // Slim plate behind text for legibility against meteor texture.
    const bgObj = this.add.rectangle(0, 0, w, h, 0x05060c, 0.55)
      .setStrokeStyle(1, tint, 0.7);

    const container = this.add.container(x, -40, [spriteObj, bgObj, textObj]);
    container.setSize(w, h);

    const speed = cfg.fallSpeed * (1 + (this.waveIdx - 1) * 0.08);

    this.meteors.push({
      id: this.nextId++,
      word, jamoSeq, matched: 0, special,
      container, textObj, bgObj, spriteObj, speed,
    });
  }

  private pickMeteorSpriteKey(wordLen: number, special: SpecialKind): string {
    if (special === 'gold' && this.textures.exists('wd-meteor-gem')) return 'wd-meteor-gem';
    if (wordLen >= 4 && this.textures.exists('wd-meteor-large')) return 'wd-meteor-large';
    if (wordLen >= 2 && this.textures.exists('wd-meteor-medium')) return 'wd-meteor-medium';
    if (this.textures.exists('wd-meteor-small')) return 'wd-meteor-small';
    return 'wd-particle';
  }

  // ─── Input ─────────────────────────────────────────────────────────────────
  private onJamoInput(jamo: string) {
    if (this.hp <= 0) return;
    if (!jamo) return;
    this.lastInputAt = this.time.now;

    let matched: Meteor | null = null;

    // Lock-on: prefer the active target if its next jamo matches.
    if (this.activeTargetId !== null) {
      const cur = this.meteors.find(m => m.id === this.activeTargetId);
      if (cur && cur.jamoSeq[cur.matched] === jamo) {
        matched = cur;
      }
    }
    // Strict miss when locked: if active target exists but didn't match, treat as miss
    // and release the lock. Otherwise look for a fresh meteor to acquire.
    if (!matched && this.activeTargetId === null) {
      for (const m of this.meteors) {
        if (m.jamoSeq[m.matched] === jamo) {
          matched = m;
          break;
        }
      }
    }

    if (!matched) {
      this.combo = Math.max(1, this.combo * 0.5);
      // Reset progress on the released meteor so its visual matches.
      if (this.activeTargetId !== null) {
        const released = this.meteors.find(m => m.id === this.activeTargetId);
        if (released) {
          released.matched = 0;
          released.bgObj.fillAlpha = 0.55;
          released.textObj.setColor('#ffffff');
        }
        this.activeTargetId = null;
      }
      this.pendingInput = assemble((this.pendingInput + jamo).slice(-5).split(''));
      this.bus.emit('hud', { wave: this.waveIdx, hp: this.hp, score: this.score, combo: this.combo });
      this.bus.emit('miss', { jamo });
      this.emitAim();
      return;
    }

    if (this.activeTargetId !== matched.id) {
      this.pendingInput = '';
      this.shipTargetX = matched.container.x;
    }
    matched.matched += 1;
    this.pendingInput = '';
    matched.bgObj.fillAlpha = 0.85;
    matched.textObj.setColor('#ff5b1f');
    this.activeTargetId = matched.id;
    this.bus.emit('hit', { jamo, special: matched.special });
    this.tweens.add({
      targets: matched.container,
      scale: { from: 1.06, to: 1 },
      duration: 120,
    });

    if (matched.matched >= matched.jamoSeq.length) {
      this.destroyMeteor(matched, true);
    }
    this.emitAim();
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

    // Sprite-sheet explosion at meteor position.
    if (this.anims.exists('wd-boom') && this.textures.exists('wd-explosion')) {
      const boom = this.add.sprite(m.container.x, m.container.y, 'wd-explosion', 0)
        .setDisplaySize(160, 160)
        .setBlendMode(Phaser.BlendModes.ADD);
      boom.play('wd-boom');
      boom.once('animationcomplete', () => boom.destroy());
    }

    this.tweens.add({
      targets: m.container,
      alpha: 0,
      scale: 1.4,
      duration: 160,
      onComplete: () => m.container.destroy(),
    });
    this.meteors = this.meteors.filter(x => x.id !== m.id);
    if (this.activeTargetId === m.id) {
      this.activeTargetId = null;
    }
    this.pendingInput = '';

    this.bus.emit('hud', { wave: this.waveIdx, hp: this.hp, score: this.score, combo: this.combo });
    this.emitAim();
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
      this.activeTargetId = null;
      this.emitAim();
      this.scene.pause();
    }
  }

  private getActiveMeteor(): Meteor | null {
    if (this.activeTargetId === null) return null;
    return this.meteors.find(m => m.id === this.activeTargetId) ?? null;
  }

  private emitAim() {
    const active = this.getActiveMeteor();
    const x = active ? active.container.x : WIDTH / 2;
    const y = SHIP_BASE_Y + INPUT_OFFSET_Y;
    const typed = active ? assemble(active.jamoSeq.slice(0, active.matched).split('')) : this.pendingInput;
    const isActive = !!active;

    if (
      this.lastAim.x === x &&
      this.lastAim.y === y &&
      this.lastAim.typed === typed &&
      this.lastAim.active === isActive
    ) {
      return;
    }
    this.lastAim = { x, y, typed, active: isActive };
    this.bus.emit('aim', this.lastAim);
  }

  private specialColor(s: SpecialKind): number {
    switch (s) {
      case 'red':    return 0xff4040;
      case 'purple': return 0xa855f7;
      case 'gold':   return 0xfacc15;
      default:       return 0xc2c2c2;
    }
  }

  // ─── Procedural textures (stars + particle only; bg/ship/meteors come from PNGs) ─
  private buildProceduralTextures() {
    if (!this.textures.exists('wd-stars-far')) {
      this.makeStarTileTexture('wd-stars-far', 256, 70, 1, 0.5);
    }
    if (!this.textures.exists('wd-stars-near')) {
      this.makeStarTileTexture('wd-stars-near', 256, 30, 2, 0.85);
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

  private makeParticleTexture(key: string) {
    const size = 8;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(size / 2, size / 2, size / 2);
    g.generateTexture(key, size, size);
    g.destroy();
  }
}
