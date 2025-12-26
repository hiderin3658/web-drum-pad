import { MIN_BPM, MAX_BPM, BPM_STEP, BPM_STEP_LARGE } from '../utils/constants';

/**
 * コントロールパネルコンポーネント
 *
 * @param {boolean} isPlaying 再生中フラグ
 * @param {number} bpm 現在のBPM
 * @param {function} onPlay 再生開始
 * @param {function} onStop 再生停止
 * @param {function} onBpmChange BPM変更
 * @param {function} onClearPattern パターンクリア
 */
export const Controls = ({
  isPlaying,
  bpm,
  onPlay,
  onStop,
  onBpmChange,
  onClearPattern,
}) => {
  /**
   * BPM変更ハンドラ
   */
  const handleBpmChange = (delta) => {
    const newBpm = Math.max(MIN_BPM, Math.min(MAX_BPM, bpm + delta));
    onBpmChange(newBpm);
  };

  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 bg-slate-800/50 rounded-lg p-4 md:p-6">
      {/* BPMコントロール */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => handleBpmChange(-BPM_STEP_LARGE)}
          className="px-2 md:px-3 py-1.5 md:py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-medium text-sm md:text-base"
          aria-label="BPMを10下げる"
        >
          −10
        </button>
        <button
          onClick={() => handleBpmChange(-BPM_STEP)}
          className="px-2 md:px-3 py-1.5 md:py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-medium text-sm md:text-base"
          aria-label="BPMを1下げる"
        >
          −
        </button>
        <div className="min-w-24 md:min-w-32 text-center">
          <div className="text-xl md:text-2xl font-bold">{bpm}</div>
          <div className="text-xs text-slate-400">BPM</div>
        </div>
        <button
          onClick={() => handleBpmChange(BPM_STEP)}
          className="px-2 md:px-3 py-1.5 md:py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-medium text-sm md:text-base"
          aria-label="BPMを1上げる"
        >
          +
        </button>
        <button
          onClick={() => handleBpmChange(BPM_STEP_LARGE)}
          className="px-2 md:px-3 py-1.5 md:py-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors font-medium text-sm md:text-base"
          aria-label="BPMを10上げる"
        >
          +10
        </button>
      </div>

      {/* 再生コントロール */}
      <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
        {!isPlaying ? (
          <button
            onClick={onPlay}
            className="px-6 md:px-8 py-2 md:py-3 rounded-lg bg-green-600 hover:bg-green-500 transition-colors font-medium text-base md:text-lg shadow-lg"
          >
            ▶️ 再生
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-6 md:px-8 py-2 md:py-3 rounded-lg bg-red-600 hover:bg-red-500 transition-colors font-medium text-base md:text-lg shadow-lg"
          >
            ⏹️ 停止
          </button>
        )}

        <button
          onClick={onClearPattern}
          className="px-4 md:px-6 py-2 md:py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors font-medium text-sm md:text-base"
          disabled={isPlaying}
        >
          🗑️ クリア
        </button>
      </div>

      {/* ステータス */}
      <div className="text-xs md:text-sm text-slate-400">
        {isPlaying ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            再生中
          </span>
        ) : (
          '停止中'
        )}
      </div>
    </div>
  );
};
