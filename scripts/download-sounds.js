/**
 * Pixabay API を使用した音源自動ダウンロードスクリプト
 *
 * 使用方法:
 * 1. Pixabay API キーを取得: https://pixabay.com/api/docs/
 * 2. 環境変数を設定: export PIXABAY_API_KEY=your_api_key
 * 3. スクリプトを実行: node scripts/download-sounds.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pixabay API キー（環境変数から取得）
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// 音源保存先ディレクトリ
const SOUNDS_DIR = path.join(__dirname, '../public/sounds');

// 音源リスト（ドキュメントに基づく）
const SOUND_LIST = {
  drums: [
    { name: 'kick-deep', query: 'kick drum deep', type: 'audio' },
    { name: 'kick-tight', query: 'kick drum tight', type: 'audio' },
    { name: 'kick-808', query: '808 kick', type: 'audio' },
    { name: 'snare-acoustic', query: 'acoustic snare drum', type: 'audio' },
    { name: 'snare-electronic', query: 'electronic snare', type: 'audio' },
    { name: 'clap', query: 'clap percussion', type: 'audio' },
    { name: 'hihat-closed', query: 'closed hi-hat', type: 'audio' },
    { name: 'hihat-open', query: 'open hi-hat', type: 'audio' },
    { name: 'crash', query: 'crash cymbal', type: 'audio' },
    { name: 'cowbell', query: 'cowbell', type: 'audio' },
    { name: 'tambourine', query: 'tambourine', type: 'audio' },
  ],
  synth: [
    { name: 'bass-808', query: '808 bass sub', type: 'audio' },
    { name: 'synth-lead', query: 'synth lead', type: 'audio' },
    { name: 'synth-pad', query: 'synth pad ambient', type: 'audio' },
    { name: 'piano-hit', query: 'piano stab hit', type: 'audio' },
  ],
  fx: [
    { name: 'fx-rise', query: 'riser sound effect', type: 'audio' },
    { name: 'fx-down', query: 'downer sound effect', type: 'audio' },
    { name: 'fx-noise', query: 'noise sweep whoosh', type: 'audio' },
    { name: 'fx-laser', query: 'laser sound effect', type: 'audio' },
  ],
};

/**
 * ディレクトリを作成（存在しない場合）
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 ディレクトリを作成: ${dirPath}`);
  }
}

/**
 * Pixabay API で音源を検索
 */
async function searchSound(query) {
  return new Promise((resolve, reject) => {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&audio_type=sound_effect&per_page=3`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`JSONパースエラー: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * ファイルをダウンロード
 */
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https.get(url, (response) => {
      // リダイレクト処理
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', (error) => {
          fs.unlink(destPath, () => {});
          reject(error);
        });
      } else {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (error) => {
      fs.unlink(destPath, () => {});
      reject(error);
    });
  });
}

/**
 * 音源をダウンロード
 */
async function downloadSound(category, soundInfo) {
  const destDir = path.join(SOUNDS_DIR, category);
  const destPath = path.join(destDir, `${soundInfo.name}.mp3`);

  // すでにファイルが存在する場合はスキップ
  if (fs.existsSync(destPath)) {
    console.log(`⏭️  スキップ（既存）: ${category}/${soundInfo.name}.mp3`);
    return { success: true, skipped: true };
  }

  try {
    console.log(`🔍 検索中: "${soundInfo.query}"...`);
    const result = await searchSound(soundInfo.query);

    if (!result.hits || result.hits.length === 0) {
      console.error(`❌ 検索結果なし: ${soundInfo.query}`);
      return { success: false, error: '検索結果なし' };
    }

    // 最初の結果を使用（previewURL は MP3 プレビュー）
    const audioUrl = result.hits[0].previewURL;

    console.log(`⬇️  ダウンロード中: ${category}/${soundInfo.name}.mp3...`);
    await downloadFile(audioUrl, destPath);

    console.log(`✅ 完了: ${category}/${soundInfo.name}.mp3`);
    return { success: true, skipped: false };
  } catch (error) {
    console.error(`❌ エラー: ${soundInfo.query} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * すべての音源をダウンロード
 */
async function downloadAllSounds() {
  console.log('🎵 音源ダウンロードスクリプトを開始します\n');

  // API キーチェック
  if (!PIXABAY_API_KEY) {
    console.error('❌ エラー: PIXABAY_API_KEY 環境変数が設定されていません');
    console.log('\n使用方法:');
    console.log('1. Pixabay API キーを取得: https://pixabay.com/api/docs/');
    console.log('2. 環境変数を設定: export PIXABAY_API_KEY=your_api_key');
    console.log('3. スクリプトを再実行: npm run download-sounds\n');
    process.exit(1);
  }

  // ディレクトリ作成
  ensureDirectoryExists(SOUNDS_DIR);
  Object.keys(SOUND_LIST).forEach((category) => {
    ensureDirectoryExists(path.join(SOUNDS_DIR, category));
  });

  let totalSuccess = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  // カテゴリごとにダウンロード
  for (const [category, sounds] of Object.entries(SOUND_LIST)) {
    console.log(`\n📂 カテゴリ: ${category}`);
    console.log('─'.repeat(50));

    for (const soundInfo of sounds) {
      const result = await downloadSound(category, soundInfo);

      if (result.success) {
        if (result.skipped) {
          totalSkipped++;
        } else {
          totalSuccess++;
        }
      } else {
        totalFailed++;
      }

      // APIレート制限対策（1秒待機）
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(50));
  console.log('📊 ダウンロード結果');
  console.log('='.repeat(50));
  console.log(`✅ 成功: ${totalSuccess}件`);
  console.log(`⏭️  スキップ: ${totalSkipped}件`);
  console.log(`❌ 失敗: ${totalFailed}件`);
  console.log(`📁 保存先: ${SOUNDS_DIR}\n`);

  if (totalFailed > 0) {
    console.log('⚠️  一部のファイルのダウンロードに失敗しました');
    console.log('   手動でダウンロードするか、異なる検索クエリを試してください\n');
  }
}

// スクリプト実行
downloadAllSounds().catch((error) => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
