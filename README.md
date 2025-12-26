# 🎵 Web Drum Pad

ブラウザ上で動作する音楽パッドコントローラー。16パッド（4×4グリッド）で最大8音同時発音、16ステップシーケンサー、録音機能を搭載。

## 📋 機能

- ✅ **16パッドコントローラー** - タップ/クリック/キーボードで演奏
- ✅ **16ステップシーケンサー** - 16トラック × 16ステップのパターン作成
- ✅ **録音機能** - WebM形式で録音・ダウンロード
- ✅ **40音源対応** - ドラム、シンセ、FXカテゴリ
- ✅ **キーボードショートカット** - PC操作に最適化
- ✅ **レスポンシブデザイン** - スマホ・タブレット・PC対応
- ✅ **localStorage保存** - 設定を自動保存

## 🚀 クイックスタート

### 1. インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd web-drum-pad

# 依存関係をインストール
npm install
```

### 2. 音源のダウンロード

#### オプションA: 自動ダウンロード（推奨）

Pixabay API を使用して音源を自動ダウンロードします。

```bash
# 1. Pixabay API キーを取得
# https://pixabay.com/api/docs/ にアクセスしてサインアップ

# 2. 環境変数を設定
export PIXABAY_API_KEY=your_api_key_here

# 3. 音源をダウンロード
npm run download-sounds
```

**ダウンロードされる音源:**
- ドラムキット: 11種類（キック、スネア、ハイハット等）
- シンセ・ベース: 4種類（808ベース、シンセリード等）
- FX: 4種類（ライザー、レーザー等）

**合計: 約19音源** が自動ダウンロードされます。

#### オプションB: 手動ダウンロード

[docs/web-drum-pad-sound-sources.md](docs/web-drum-pad-sound-sources.md) を参照して、手動で音源をダウンロードしてください。

音源は以下のディレクトリに配置します：

```
public/sounds/
├── drums/
│   ├── kick-deep.mp3
│   ├── snare-acoustic.mp3
│   └── ...
├── synth/
│   ├── bass-808.mp3
│   └── ...
└── fx/
    ├── fx-rise.mp3
    └── ...
```

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開きます。

### 4. 本番ビルド

```bash
npm run build
npm run preview
```

## ⌨️ キーボードショートカット

### パッド操作

```
┌───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │  ← パッド 1-4
├───┼───┼───┼───┤
│ Q │ W │ E │ R │  ← パッド 5-8
├───┼───┼───┼───┤
│ A │ S │ D │ F │  ← パッド 9-12
├───┼───┼───┼───┤
│ Z │ X │ C │ V │  ← パッド 13-16
└───┴───┴───┴───┘
```

### コントロール

| キー | 機能 |
|------|------|
| `Space` | 再生 / 停止 |
| `Enter` | 録音開始 / 停止 |
| `←` / `→` | BPM -1 / +1 |
| `↑` / `↓` | BPM -10 / +10 |

## 🛠️ 技術スタック

- **フレームワーク**: React 18 + Vite
- **スタイリング**: Tailwind CSS v4
- **音声処理**: Tone.js
- **録音**: Tone.Recorder (WebM)
- **状態管理**: React Hooks + localStorage

## 📁 プロジェクト構成

```
web-drum-pad/
├── public/
│   └── sounds/           # 音源ファイル（.gitignore）
│       ├── drums/
│       ├── synth/
│       └── fx/
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── Pad.jsx
│   │   ├── PadGrid.jsx
│   │   ├── Sequencer.jsx
│   │   ├── Controls.jsx
│   │   ├── Recorder.jsx
│   │   └── Settings.jsx
│   ├── hooks/            # カスタムフック
│   │   ├── useAudio.js
│   │   ├── useSequencer.js
│   │   ├── useRecorder.js
│   │   ├── useKeyboard.js
│   │   └── useLocalStorage.js
│   ├── utils/            # ユーティリティ
│   │   ├── soundData.js
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── scripts/
│   └── download-sounds.js  # 音源自動ダウンロード
├── docs/                   # ドキュメント
│   ├── web-drum-pad-specification.md
│   ├── web-drum-pad-sound-sources.md
│   └── implementation-plan.md
└── package.json
```

## 🎹 音源について

### ライセンス

- すべての音源はロイヤリティフリー
- Pixabay License（著作権表記不要、商用利用可能）
- 詳細: [docs/web-drum-pad-sound-sources.md](docs/web-drum-pad-sound-sources.md)

### 音源の追加

1. MP3ファイルを `public/sounds/{category}/` に配置
2. `src/utils/soundData.js` に定義を追加
3. 設定画面から各パッドに割り当て

### 推奨フォーマット

| 項目 | 仕様 |
|------|------|
| フォーマット | MP3（128-320kbps） |
| サンプルレート | 44.1kHz |
| 長さ | 0.1秒〜2秒 |
| ファイルサイズ | 50KB〜500KB |

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルドプレビュー
npm run preview

# リントチェック
npm run lint

# 音源ダウンロード（Pixabay API）
npm run download-sounds
```

## 📱 対応ブラウザ

| ブラウザ | バージョン |
|---------|-----------|
| Chrome | 最新版 ✅ |
| Safari | 最新版 ✅ |
| Edge | 最新版 ✅ |
| Firefox | 最新版 ✅ |

**注意**: Web Audio API と AudioContext の制限により、iOS Safari では追加の操作が必要な場合があります。

## 🚧 既知の制限

### Web Audio API

- **自動再生禁止**: ユーザー操作（クリック等）後に AudioContext を開始
- **モバイル対応**: iOS Safari では追加の対応が必要な場合あり

### 音源ファイル

- 音源ファイルが存在しない場合、エラーメッセージを表示
- アプリは動作しますが音は再生されません

### localStorage

- 容量制限: 約5MB
- パターンデータが大きくなりすぎないよう注意

## 📝 ライセンス

MIT License

## 🙏 クレジット

音源提供:
- [Pixabay](https://pixabay.com/) - Pixabay License
- [99Sounds](https://99sounds.org/) - Royalty Free
- [SampleFocus](https://samplefocus.com/) - Standard License

## 🔗 リンク

- [仕様書](docs/web-drum-pad-specification.md)
- [音源入手ガイド](docs/web-drum-pad-sound-sources.md)
- [実装計画](docs/implementation-plan.md)

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

---

**Web Drum Pad v1.0.0** - ブラウザで楽しむドラムパッド体験 🎵
