import { useEffect, useRef } from 'react';

/**
 * キーボードショートカットを管理するカスタムフック
 *
 * パッド操作キー: 1-4, Q-R, A-F, Z-V
 * コントロールキー: Space, Enter, 矢印キー
 */

// パッド操作キーマッピング（4×4グリッド）
const PAD_KEYS = {
  '1': 0, '2': 1, '3': 2, '4': 3,
  'q': 4, 'w': 5, 'e': 6, 'r': 7,
  'a': 8, 's': 9, 'd': 10, 'f': 11,
  'z': 12, 'x': 13, 'c': 14, 'v': 15,
};

/**
 * キーボードショートカットフック
 *
 * @param {function} onPadTrigger パッド操作コールバック (padIndex) => void
 * @param {function} onTogglePlay 再生/停止トグル () => void
 * @param {function} onToggleRecord 録音トグル () => void
 * @param {function} onBpmChange BPM変更 (delta) => void
 * @param {boolean} isRecording 録音中フラグ（録音中は操作を制限）
 */
export const useKeyboard = ({
  onPadTrigger,
  onTogglePlay,
  onToggleRecord,
  onBpmChange,
  isRecording = false,
}) => {
  // キーリピート防止用
  const pressedKeysRef = useRef(new Set());

  useEffect(() => {
    /**
     * キーダウンハンドラ
     */
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      // キーリピート防止
      if (pressedKeysRef.current.has(key)) {
        return;
      }
      pressedKeysRef.current.add(key);

      // 入力フィールドにフォーカスがある場合はスキップ
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      // パッド操作キー
      if (key in PAD_KEYS) {
        event.preventDefault();
        const padIndex = PAD_KEYS[key];
        onPadTrigger(padIndex);
        return;
      }

      // コントロールキー（録音中は無効）
      if (!isRecording) {
        // Space: 再生/停止トグル
        if (key === ' ') {
          event.preventDefault();
          onTogglePlay();
          return;
        }

        // Enter: 録音トグル
        if (key === 'enter') {
          event.preventDefault();
          onToggleRecord();
          return;
        }

        // 矢印キー: BPM変更
        if (key === 'arrowleft') {
          event.preventDefault();
          onBpmChange(-1);
          return;
        }
        if (key === 'arrowright') {
          event.preventDefault();
          onBpmChange(1);
          return;
        }
        if (key === 'arrowup') {
          event.preventDefault();
          onBpmChange(10);
          return;
        }
        if (key === 'arrowdown') {
          event.preventDefault();
          onBpmChange(-10);
          return;
        }
      }
    };

    /**
     * キーアップハンドラ（キーリピート防止用）
     */
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      pressedKeysRef.current.delete(key);
    };

    // イベントリスナー登録
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // クリーンアップ
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      pressedKeysRef.current.clear();
    };
  }, [onPadTrigger, onTogglePlay, onToggleRecord, onBpmChange, isRecording]);
};
