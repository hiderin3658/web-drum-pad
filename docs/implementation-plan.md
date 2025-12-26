# Web Drum Pad 実装計画書

## 概要

本ドキュメントは、Web Drum Pad プロジェクトの詳細な実装計画を記載しています。
設計書（web-drum-pad-specification.md）に基づき、10フェーズに分けて実装を進めます。

---

## フェーズ一覧

| Phase | 内容 | 主要タスク | 依存関係 |
|-------|------|-----------|----------|
| Phase 1 | プロジェクトセットアップ | Vite + React + Tailwind CSS 初期設定 | なし |
| Phase 2 | パッドUI + 音再生 | 16パッドの表示、Tone.jsで音再生 | Phase 1 |
| Phase 3 | 音源選択 + 設定画面 | 40音源の選択UI、パッド設定 | Phase 2 |
| Phase 4 | localStorage保存 | 設定の保存・読み込み | Phase 3 |
| Phase 5 | シーケンサー機能 | 16ステップシーケンサー、パターン保存 | Phase 2, 4 |
| Phase 6 | 録音機能 | MP3録音・ダウンロード | Phase 2 |
| Phase 7 | キーボードショートカット | PC用ショートカット実装 | Phase 2, 5 |
| Phase 8 | レスポンシブ対応 | スマホ・タブレット最適化 | Phase 2-7 |
| Phase 9 | テスト + バグ修正 | 各デバイスでの動作確認 | Phase 1-8 |
| Phase 10 | Vercelデプロイ | 本番環境デプロイ | Phase 9 |

---

## Phase 1: プロジェクトセットアップ ✅ 完了

### 目標
開発環境の構築と基本的なプロジェクト構成の確立

### タスク
- [x] Vite + React プロジェクト作成
- [x] Tailwind CSS v4 のインストール・設定
- [x] Tone.js / lamejs のインストール
- [x] ディレクトリ構造の作成
- [x] 基本的なレイアウト（App.jsx）の作成
- [x] ビルド確認

### 成果物
- `package.json` - 依存関係定義
- `vite.config.js` - Vite設定
- `src/index.css` - Tailwind CSSエントリーポイント
- `src/App.jsx` - 基本レイアウト
- `public/sounds/` - 音源ディレクトリ（drums, synth, fx）

---

## Phase 2: パッドUI + 音再生

### 目標
16個のパッドを表示し、タップ/クリックで音を再生できるようにする

### タスク
1. **Padコンポーネントの作成** (`src/components/Pad.jsx`)
   - パッド1つ分のUI
   - タップ時のビジュアルフィードバック（光るアニメーション）
   - onClick / onTouchStart イベント処理

2. **PadGridコンポーネントの作成** (`src/components/PadGrid.jsx`)
   - 4×4グリッドレイアウト
   - 16個のPadコンポーネントを配置

3. **useAudioフックの作成** (`src/hooks/useAudio.js`)
   - Tone.js Players を使った音源管理
   - 音源のプリロード
   - playSound(soundId, volume) 関数
   - 同時発音数の制限（最大8音）

4. **音源データの定義** (`src/utils/soundData.js`)
   - 40音源の定義（id, name, file, category）
   - デフォルトパッド割り当て

5. **定数の定義** (`src/utils/constants.js`)
   - MAX_POLYPHONY: 8
   - DEFAULT_BPM: 120
   - その他の定数

6. **サンプル音源の配置**
   - 最低4-8個のサンプル音源を配置（テスト用）

### コンポーネント設計

```jsx
// Pad.jsx
export const Pad = ({
  padId,
  soundId,
  soundName,
  color,
  volume,
  onPlay
}) => { ... }

// PadGrid.jsx
export const PadGrid = ({
  pads,
  onPadPlay
}) => { ... }
```

### フック設計

```jsx
// useAudio.js
export const useAudio = () => {
  return {
    isLoaded,      // 音源ロード完了フラグ
    loadProgress,  // ロード進捗（0-100）
    playSound,     // (soundId, volume) => void
    stopAll,       // () => void
  }
}
```

### 成果物
- `src/components/Pad.jsx`
- `src/components/PadGrid.jsx`
- `src/hooks/useAudio.js`
- `src/utils/soundData.js`
- `src/utils/constants.js`

---

## Phase 3: 音源選択 + 設定画面

### 目標
各パッドに割り当てる音源を選択できるようにする

### タスク
1. **Settingsコンポーネントの作成** (`src/components/Settings.jsx`)
   - モーダル形式の設定画面
   - パッドごとの音源選択
   - 音量調整スライダー
   - パッドカラー選択

2. **SoundSelectorコンポーネントの作成** (`src/components/SoundSelector.jsx`)
   - カテゴリ別音源リスト（ドラム/シンセ/FX）
   - 音源プレビュー再生
   - 検索・フィルタ機能

3. **状態管理の実装**
   - パッド設定の状態（soundId, volume, color）
   - 設定変更時の即時反映

### コンポーネント設計

```jsx
// Settings.jsx
export const Settings = ({
  isOpen,
  onClose,
  pads,
  onPadUpdate
}) => { ... }

// SoundSelector.jsx
export const SoundSelector = ({
  currentSoundId,
  onSelect,
  onPreview
}) => { ... }
```

### 成果物
- `src/components/Settings.jsx`
- `src/components/SoundSelector.jsx`
- 状態管理ロジック（App.jsx に統合）

---

## Phase 4: localStorage保存

### 目標
ユーザー設定をブラウザに保存し、リロード後も復元できるようにする

### タスク
1. **useLocalStorageフックの作成** (`src/hooks/useLocalStorage.js`)
   - 設定の保存・読み込み
   - データ構造のバージョン管理
   - デフォルト設定へのリセット機能

2. **保存データ構造の実装**
   - バージョン情報
   - グローバル設定（BPM, volume, metronome, loop）
   - パッド設定（16個分）
   - パターン設定（8個分）

3. **App.jsx への統合**
   - 初期ロード時の設定復元
   - 設定変更時の自動保存
   - リセットボタンの実装

### フック設計

```jsx
// useLocalStorage.js
export const useLocalStorage = () => {
  return {
    settings,       // 現在の設定
    updateSettings, // (key, value) => void
    updatePad,      // (padId, updates) => void
    savePattern,    // (patternId, data) => void
    loadPattern,    // (patternId) => data
    reset,          // () => void
  }
}
```

### 成果物
- `src/hooks/useLocalStorage.js`
- 永続化ロジック

---

## Phase 5: シーケンサー機能

### 目標
16ステップのシーケンサーを実装し、パターンを作成・再生できるようにする

### タスク
1. **Sequencerコンポーネントの作成** (`src/components/Sequencer.jsx`)
   - 16ステップ × 16トラック（パッド）のグリッド
   - ステップのON/OFF切り替え
   - 現在の再生位置のハイライト表示
   - パターン選択（1-8）

2. **Controlsコンポーネントの作成** (`src/components/Controls.jsx`)
   - 再生/停止ボタン
   - BPM調整（60-200）
   - メトロノームON/OFF
   - ループON/OFF

3. **useSequencerフックの作成** (`src/hooks/useSequencer.js`)
   - Tone.Transport を使ったシーケンス制御
   - Tone.Sequence でステップ再生
   - BPM変更の即時反映
   - パターンの保存・読み込み

### コンポーネント設計

```jsx
// Sequencer.jsx
export const Sequencer = ({
  pattern,
  currentStep,
  onStepToggle,
  onPatternChange
}) => { ... }

// Controls.jsx
export const Controls = ({
  isPlaying,
  bpm,
  isLooping,
  isMetronomeOn,
  onPlay,
  onStop,
  onBpmChange,
  onLoopToggle,
  onMetronomeToggle
}) => { ... }
```

### フック設計

```jsx
// useSequencer.js
export const useSequencer = (playSound) => {
  return {
    isPlaying,      // 再生中フラグ
    currentStep,    // 現在のステップ（0-15）
    bpm,            // 現在のBPM
    pattern,        // パターンデータ
    start,          // () => void
    stop,           // () => void
    setBpm,         // (bpm) => void
    toggleStep,     // (padId, step) => void
    setPattern,     // (patternData) => void
  }
}
```

### 成果物
- `src/components/Sequencer.jsx`
- `src/components/Controls.jsx`
- `src/hooks/useSequencer.js`

---

## Phase 6: 録音機能

### 目標
演奏を録音し、MP3ファイルとしてダウンロードできるようにする

### タスク
1. **Recorderコンポーネントの作成** (`src/components/Recorder.jsx`)
   - 録音開始/停止ボタン
   - 録音時間表示（最大5分）
   - ダウンロードボタン
   - 録音状態のインジケータ

2. **useRecorderフックの作成** (`src/hooks/useRecorder.js`)
   - Tone.Recorder を使った録音
   - lamejs を使ったMP3エンコード
   - Blob生成とダウンロード処理

### フック設計

```jsx
// useRecorder.js
export const useRecorder = () => {
  return {
    isRecording,    // 録音中フラグ
    recordingTime,  // 録音時間（秒）
    startRecording, // () => Promise<void>
    stopRecording,  // () => Promise<Blob>
    downloadMp3,    // (blob, filename) => void
  }
}
```

### 成果物
- `src/components/Recorder.jsx`
- `src/hooks/useRecorder.js`

---

## Phase 7: キーボードショートカット

### 目標
PCユーザー向けにキーボードでパッドを叩けるようにする

### タスク
1. **useKeyboardフックの作成** (`src/hooks/useKeyboard.js`)
   - パッド操作キー（1-4, Q-R, A-F, Z-V）
   - コントロールキー（Space, Enter, 矢印, M, L）
   - キーリピート防止

2. **App.jsx への統合**
   - グローバルキーイベントリスナー
   - フォーカス管理

### キーマッピング

```javascript
const PAD_KEYS = {
  '1': 0, '2': 1, '3': 2, '4': 3,
  'q': 4, 'w': 5, 'e': 6, 'r': 7,
  'a': 8, 's': 9, 'd': 10, 'f': 11,
  'z': 12, 'x': 13, 'c': 14, 'v': 15,
}

const CONTROL_KEYS = {
  ' ': 'togglePlay',
  'Enter': 'toggleRecord',
  'ArrowLeft': 'bpmDown',
  'ArrowRight': 'bpmUp',
  'ArrowUp': 'bpmUp10',
  'ArrowDown': 'bpmDown10',
  'm': 'toggleMetronome',
  'l': 'toggleLoop',
}
```

### 成果物
- `src/hooks/useKeyboard.js`

---

## Phase 8: レスポンシブ対応

### 目標
スマホ・タブレットでも快適に使用できるようにする

### タスク
1. **レスポンシブレイアウトの調整**
   - PC（1024px以上）: パッド100px、横並びレイアウト
   - タブレット（768-1023px）: パッド80px、コンパクトレイアウト
   - スマホ（767px以下）: パッド70px、縦並びレイアウト

2. **タッチ操作の最適化**
   - タッチイベントの処理改善
   - マルチタッチ対応
   - ダブルタップ防止

3. **モバイル向けUI調整**
   - シーケンサーのスクロール表示
   - 設定画面のモバイル対応
   - ヘッダー・フッターの調整

### ブレークポイント

```css
/* スマホ */
@media (max-width: 767px) { ... }

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* PC */
@media (min-width: 1024px) { ... }
```

### 成果物
- 各コンポーネントのレスポンシブ対応
- Tailwind CSS クラスの調整

---

## Phase 9: テスト + バグ修正

### 目標
各デバイス・ブラウザでの動作確認とバグ修正

### テスト項目

#### 機能テスト
- [ ] 全16パッドの発音確認
- [ ] キーボードショートカットの動作確認
- [ ] シーケンサーの再生・停止
- [ ] BPM変更の反映
- [ ] パターン保存・読み込み
- [ ] 録音・ダウンロード
- [ ] localStorage保存・復元
- [ ] 設定画面の操作

#### ブラウザテスト
- [ ] Chrome（最新版）
- [ ] Safari（最新版）
- [ ] Edge（最新版）
- [ ] Firefox（最新版）

#### デバイステスト
- [ ] PC（Windows / Mac）
- [ ] タブレット（iPad）
- [ ] スマートフォン（iPhone / Android）

#### パフォーマンステスト
- [ ] 音源ロード時間
- [ ] 同時発音時のレイテンシ
- [ ] シーケンサー再生時のタイミング精度

### 成果物
- バグ修正
- パフォーマンス最適化

---

## Phase 10: Vercelデプロイ

### 目標
本番環境へのデプロイと公開

### タスク
1. **GitHubリポジトリの設定**
   - README.md の更新
   - .gitignore の確認
   - ライセンスファイルの追加

2. **Vercel設定**
   - GitHubリポジトリ連携
   - ビルド設定の確認
   - 環境変数の設定（必要に応じて）

3. **デプロイ確認**
   - 本番環境での動作確認
   - HTTPS の確認
   - パフォーマンス確認

### 成果物
- 本番URL
- デプロイ自動化

---

## 次のアクション

**Phase 2 の実装を開始する**

1. `src/utils/constants.js` を作成
2. `src/utils/soundData.js` を作成
3. `src/hooks/useAudio.js` を作成
4. `src/components/Pad.jsx` を作成
5. `src/components/PadGrid.jsx` を作成
6. テスト用のサンプル音源を配置
7. App.jsx に統合してテスト

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-12-23 | 初版作成 |
