/**
 * 音源データ定義
 *
 * 40音源の定義と、デフォルトのパッド割り当てを管理
 */

// 音源カテゴリ
export const SOUND_CATEGORIES = {
  DRUMS: 'drums',
  SYNTH: 'synth',
  FX: 'fx',
};

// 40音源の定義
export const SOUNDS = [
  // ドラムキット（20音）
  { id: 'kick-deep', name: 'Kick Deep', file: '/sounds/drums/kick-deep.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'kick-tight', name: 'Kick Tight', file: '/sounds/drums/kick-tight.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'kick-808', name: 'Kick 808', file: '/sounds/drums/kick-808.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'snare-acoustic', name: 'Snare Acoustic', file: '/sounds/drums/snare-acoustic.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'snare-electronic', name: 'Snare Electronic', file: '/sounds/drums/snare-electronic.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'snare-rim', name: 'Snare Rim', file: '/sounds/drums/snare-rim.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'clap', name: 'Clap', file: '/sounds/drums/clap.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'hihat-closed', name: 'Hi-Hat Closed', file: '/sounds/drums/hihat-closed.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'hihat-open', name: 'Hi-Hat Open', file: '/sounds/drums/hihat-open.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'hihat-pedal', name: 'Hi-Hat Pedal', file: '/sounds/drums/hihat-pedal.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'crash', name: 'Crash', file: '/sounds/drums/crash.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'ride', name: 'Ride', file: '/sounds/drums/ride.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'tom-high', name: 'Tom High', file: '/sounds/drums/tom-high.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'tom-mid', name: 'Tom Mid', file: '/sounds/drums/tom-mid.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'tom-low', name: 'Tom Low', file: '/sounds/drums/tom-low.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'floor-tom', name: 'Floor Tom', file: '/sounds/drums/floor-tom.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'cowbell', name: 'Cowbell', file: '/sounds/drums/cowbell.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'tambourine', name: 'Tambourine', file: '/sounds/drums/tambourine.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'shaker', name: 'Shaker', file: '/sounds/drums/shaker.mp3', category: SOUND_CATEGORIES.DRUMS },
  { id: 'cross-stick', name: 'Cross Stick', file: '/sounds/drums/cross-stick.mp3', category: SOUND_CATEGORIES.DRUMS },

  // シンセ・ベース（12音）
  { id: 'bass-808', name: 'Bass 808', file: '/sounds/synth/bass-808.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'bass-sub', name: 'Bass Sub', file: '/sounds/synth/bass-sub.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'bass-wobble', name: 'Bass Wobble', file: '/sounds/synth/bass-wobble.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'synth-lead', name: 'Synth Lead', file: '/sounds/synth/synth-lead.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'synth-pluck', name: 'Synth Pluck', file: '/sounds/synth/synth-pluck.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'synth-stab', name: 'Synth Stab', file: '/sounds/synth/synth-stab.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'synth-pad', name: 'Synth Pad', file: '/sounds/synth/synth-pad.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'synth-arp', name: 'Synth Arp', file: '/sounds/synth/synth-arp.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'piano-hit', name: 'Piano Hit', file: '/sounds/synth/piano-hit.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'organ-stab', name: 'Organ Stab', file: '/sounds/synth/organ-stab.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'brass-hit', name: 'Brass Hit', file: '/sounds/synth/brass-hit.mp3', category: SOUND_CATEGORIES.SYNTH },
  { id: 'string-hit', name: 'String Hit', file: '/sounds/synth/string-hit.mp3', category: SOUND_CATEGORIES.SYNTH },

  // パーカッション・FX（8音）
  { id: 'conga-high', name: 'Conga High', file: '/sounds/fx/conga-high.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'conga-low', name: 'Conga Low', file: '/sounds/fx/conga-low.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'bongo', name: 'Bongo', file: '/sounds/fx/bongo.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'djembe', name: 'Djembe', file: '/sounds/fx/djembe.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'fx-rise', name: 'FX Rise', file: '/sounds/fx/fx-rise.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'fx-down', name: 'FX Down', file: '/sounds/fx/fx-down.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'fx-noise', name: 'FX Noise', file: '/sounds/fx/fx-noise.mp3', category: SOUND_CATEGORIES.FX },
  { id: 'fx-laser', name: 'FX Laser', file: '/sounds/fx/fx-laser.mp3', category: SOUND_CATEGORIES.FX },
];

// デフォルトのパッド割り当て（16パッド）
export const DEFAULT_PAD_ASSIGNMENTS = [
  'kick-deep',        // Pad 1
  'kick-tight',       // Pad 2
  'snare-acoustic',   // Pad 3
  'snare-electronic', // Pad 4
  'hihat-closed',     // Pad 5
  'hihat-open',       // Pad 6
  'clap',             // Pad 7
  'crash',            // Pad 8
  'bass-808',         // Pad 9
  'bass-sub',         // Pad 10
  'synth-lead',       // Pad 11
  'synth-stab',       // Pad 12
  'conga-high',       // Pad 13
  'conga-low',        // Pad 14
  'fx-rise',          // Pad 15
  'fx-laser',         // Pad 16
];

/**
 * 音源IDから音源情報を取得
 * @param {string} soundId 音源ID
 * @returns {object|null} 音源情報
 */
export function getSoundById(soundId) {
  return SOUNDS.find(sound => sound.id === soundId) || null;
}

/**
 * カテゴリ別に音源を取得
 * @param {string} category カテゴリ
 * @returns {array} 音源リスト
 */
export function getSoundsByCategory(category) {
  return SOUNDS.filter(sound => sound.category === category);
}
