/**
 * アプリケーション全体で使用する定数定義
 */

// 音声関連
export const MAX_POLYPHONY = 8; // 最大同時発音数
export const DEFAULT_VOLUME = 0.8; // デフォルト音量（0.0-1.0）

// BPM関連
export const DEFAULT_BPM = 120;
export const MIN_BPM = 60;
export const MAX_BPM = 200;
export const BPM_STEP = 1;
export const BPM_STEP_LARGE = 10;

// シーケンサー関連
export const STEPS_PER_PATTERN = 16; // 1パターンのステップ数
export const MAX_PATTERNS = 8; // 保存可能なパターン数
export const DEFAULT_PATTERN_ID = 1;

// パッド関連
export const TOTAL_PADS = 16; // パッド総数
export const GRID_COLUMNS = 4; // グリッド列数
export const GRID_ROWS = 4; // グリッド行数

// 録音関連
export const MAX_RECORDING_TIME = 300; // 最大録音時間（秒） = 5分

// localStorage関連
export const STORAGE_KEY = 'webDrumPad';
export const STORAGE_VERSION = '1.0.0';

// カラーパレット（パッド用）
export const PAD_COLORS = [
  '#8B5CF6', // purple-600
  '#EC4899', // pink-600
  '#F59E0B', // amber-600
  '#10B981', // emerald-600
  '#3B82F6', // blue-600
  '#EF4444', // red-600
  '#F97316', // orange-600
  '#06B6D4', // cyan-600
];

// デフォルトパッドカラーマップ（パッドID -> カラーインデックス）
export const DEFAULT_PAD_COLORS = {
  0: 0, 1: 0, 2: 0, 3: 0,  // Row 1: purple
  4: 1, 5: 1, 6: 1, 7: 1,  // Row 2: pink
  8: 2, 9: 2, 10: 2, 11: 2, // Row 3: amber
  12: 3, 13: 3, 14: 3, 15: 3, // Row 4: emerald
};
