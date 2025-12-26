import { useRef, useState, useCallback, useEffect } from 'react';
import * as Tone from 'tone';
import { SOUNDS } from '../utils/soundData';
import { MAX_POLYPHONY } from '../utils/constants';

/**
 * 音声再生を管理するカスタムフック
 *
 * Tone.js を使用して音源の読み込みと再生を管理します。
 * 音源ファイルが存在しない場合でもエラーにならないよう、
 * 適切なエラーハンドリングを実装しています。
 */
export const useAudio = () => {
  const playersRef = useRef({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadErrors, setLoadErrors] = useState([]);
  const activeVoicesRef = useRef([]);

  /**
   * 音源のロード
   */
  useEffect(() => {
    let isMounted = true;

    const loadSounds = async () => {
      try {
        console.log('音源のロードを開始します...');
        const errors = [];
        let loadedCount = 0;

        // 各音源をロード
        for (const sound of SOUNDS) {
          try {
            // Tone.Player でロード
            const player = new Tone.Player({
              url: sound.file,
              onload: () => {
                if (!isMounted) return;
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / SOUNDS.length) * 100));
                console.log(`✓ ${sound.name} (${sound.file})`);
              },
            }).toDestination();

            playersRef.current[sound.id] = player;
          } catch (error) {
            console.warn(`✗ ${sound.name} のロードに失敗: ${error.message}`);
            errors.push({ soundId: sound.id, name: sound.name, error: error.message });
          }
        }

        // すべてのロード完了を待つ（タイムアウト付き）
        const timeout = setTimeout(() => {
          if (!isMounted) return;
          console.log('音源ロードがタイムアウトしました（一部の音源が読み込めませんでした）');
          setIsLoaded(true);
          if (errors.length > 0) {
            setLoadErrors(errors);
          }
        }, 5000);

        // Tone.js の Buffer が全てロードされるまで待機
        await Tone.loaded();

        if (!isMounted) return;
        clearTimeout(timeout);

        console.log(`音源のロードが完了しました（${loadedCount}/${SOUNDS.length}）`);
        setIsLoaded(true);
        setLoadProgress(100);

        if (errors.length > 0) {
          console.warn(`${errors.length}個の音源がロードに失敗しました:`, errors);
          setLoadErrors(errors);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('音源のロード中にエラーが発生しました:', error);
        setIsLoaded(true); // エラーでも isLoaded を true にしてUIをブロックしない
      }
    };

    loadSounds();

    // クリーンアップ
    return () => {
      isMounted = false;
      Object.values(playersRef.current).forEach(player => {
        try {
          player.dispose();
        } catch (error) {
          console.warn('Player の dispose に失敗:', error);
        }
      });
      playersRef.current = {};
    };
  }, []);

  /**
   * 音を再生
   * @param {string} soundId 音源ID
   * @param {number} volume 音量（0.0-1.0）
   */
  const playSound = useCallback((soundId, volume = 1.0) => {
    try {
      const player = playersRef.current[soundId];

      if (!player) {
        console.warn(`音源が見つかりません: ${soundId}`);
        return;
      }

      if (!player.loaded) {
        console.warn(`音源がまだロードされていません: ${soundId}`);
        return;
      }

      // ポリフォニー制限チェック
      if (activeVoicesRef.current.length >= MAX_POLYPHONY) {
        // 最も古い音声情報を削除
        const oldestVoiceInfo = activeVoicesRef.current.shift();
        if (oldestVoiceInfo && oldestVoiceInfo.timeoutId) {
          // タイムアウトをクリア
          clearTimeout(oldestVoiceInfo.timeoutId);
        }
      }

      // 音量設定（dB変換）
      const volumeDb = Tone.gainToDb(volume);
      player.volume.value = volumeDb;

      // 再生
      player.start();

      // 再生終了後にリストから削除するタイムアウトを設定
      const duration = player.buffer.duration;
      const timeoutId = setTimeout(() => {
        const index = activeVoicesRef.current.findIndex(v => v.timeoutId === timeoutId);
        if (index !== -1) {
          activeVoicesRef.current.splice(index, 1);
        }
      }, duration * 1000);

      // アクティブ音声リストに追加（タイムアウトIDも保存）
      activeVoicesRef.current.push({ timeoutId });
    } catch (error) {
      console.error(`音の再生に失敗しました (${soundId}):`, error);
    }
  }, []);

  /**
   * すべての音を停止
   */
  const stopAll = useCallback(() => {
    try {
      // すべてのタイムアウトをクリア
      activeVoicesRef.current.forEach(voiceInfo => {
        if (voiceInfo.timeoutId) {
          clearTimeout(voiceInfo.timeoutId);
        }
      });
      activeVoicesRef.current = [];
    } catch (error) {
      console.error('音の停止中にエラーが発生しました:', error);
    }
  }, []);

  /**
   * AudioContext を初期化（ユーザー操作後に呼び出す）
   */
  const initAudio = useCallback(async () => {
    try {
      await Tone.start();
      console.log('AudioContext が開始されました');
      return true;
    } catch (error) {
      console.error('AudioContext の開始に失敗しました:', error);
      return false;
    }
  }, []);

  return {
    isLoaded,
    loadProgress,
    loadErrors,
    playSound,
    stopAll,
    initAudio,
  };
};
