import { useState, useCallback } from 'react';
import { PAD_COLORS } from '../utils/constants';

/**
 * 個別パッドコンポーネント
 *
 * @param {number} padId パッドID（0-15）
 * @param {string} soundId 音源ID
 * @param {string} soundName 音源名
 * @param {number} colorIndex カラーインデックス
 * @param {number} volume 音量（0.0-1.0）
 * @param {function} onPlay パッド再生時のコールバック
 */
export const Pad = ({
  padId,
  soundId,
  soundName,
  colorIndex = 0,
  volume = 1.0,
  onPlay,
}) => {
  const [isActive, setIsActive] = useState(false);

  /**
   * パッドをタップ/クリック
   */
  const handleTap = useCallback(() => {
    // ビジュアルフィードバック
    setIsActive(true);
    setTimeout(() => setIsActive(false), 150);

    // 音再生
    if (onPlay) {
      onPlay(soundId, volume);
    }
  }, [soundId, volume, onPlay]);

  /**
   * タッチイベント処理（モバイル対応）
   */
  const handleTouchStart = useCallback((e) => {
    e.preventDefault(); // デフォルトのタッチ動作を防止
    handleTap();
  }, [handleTap]);

  // カラー取得
  const color = PAD_COLORS[colorIndex % PAD_COLORS.length];

  return (
    <button
      className={`
        relative
        aspect-square
        w-full
        rounded-lg
        shadow-lg
        flex flex-col items-center justify-center
        text-sm font-medium
        transition-all duration-150
        ${isActive ? 'scale-95 shadow-xl' : 'scale-100'}
        hover:brightness-110
        active:scale-95
        select-none
        touch-none
      `}
      style={{
        backgroundColor: color,
        boxShadow: isActive
          ? `0 0 20px ${color}80`
          : `0 4px 6px -1px rgba(0, 0, 0, 0.3)`,
      }}
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      aria-label={`Pad ${padId + 1}: ${soundName}`}
    >
      {/* パッド番号 */}
      <div className="text-xs opacity-70 mb-1">
        {padId + 1}
      </div>

      {/* 音源名 */}
      <div className="text-center px-2 leading-tight">
        {soundName}
      </div>

      {/* アクティブ状態のインジケータ */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            animation: 'pad-pulse 0.3s ease-out',
          }}
        />
      )}
    </button>
  );
};
