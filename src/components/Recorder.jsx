import { MAX_RECORDING_TIME } from '../utils/constants';

/**
 * 録音コントロールコンポーネント
 *
 * @param {boolean} isRecording 録音中フラグ
 * @param {number} recordingTime 録音時間（秒）
 * @param {Blob} recordedBlob 録音データ
 * @param {function} onStartRecording 録音開始
 * @param {function} onStopRecording 録音停止
 * @param {function} onDownload ダウンロード
 * @param {function} onClear クリア
 */
export const Recorder = ({
  isRecording,
  recordingTime,
  recordedBlob,
  onStartRecording,
  onStopRecording,
  onDownload,
  onClear,
}) => {
  /**
   * 時間をフォーマット（MM:SS）
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * 録音時間の進捗率（%）
   */
  const progress = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 md:p-4">
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">🎙️ 録音</h3>

      {/* 録音中の表示 */}
      {isRecording && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="font-medium">録音中...</span>
            </div>
            <div className="text-lg font-mono">{formatTime(recordingTime)}</div>
          </div>

          {/* 進捗バー */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 text-right mt-1">
            最大: {formatTime(MAX_RECORDING_TIME)}
          </div>
        </div>
      )}

      {/* コントロールボタン */}
      <div className="flex gap-2 flex-wrap">
        {!isRecording ? (
          <>
            <button
              onClick={onStartRecording}
              disabled={!!recordedBlob}
              className={`
                flex-1 min-w-[120px] px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base
                ${recordedBlob
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500'
                }
              `}
            >
              🔴 録音開始
            </button>

            {recordedBlob && (
              <>
                <button
                  onClick={onDownload}
                  className="flex-1 min-w-[120px] px-3 md:px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors font-medium text-sm md:text-base"
                >
                  💾 ダウンロード
                </button>
                <button
                  onClick={onClear}
                  className="px-3 md:px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm md:text-base"
                >
                  🗑️
                </button>
              </>
            )}
          </>
        ) : (
          <button
            onClick={onStopRecording}
            className="flex-1 px-3 md:px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors font-medium text-sm md:text-base"
          >
            ⏹️ 録音停止
          </button>
        )}
      </div>

      {/* 録音完了メッセージ */}
      {recordedBlob && !isRecording && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span>✅</span>
            <span className="font-medium">録音が完了しました</span>
          </div>
          <div className="text-xs text-slate-400">
            録音時間: {formatTime(recordingTime)} · 形式: WebM
          </div>
        </div>
      )}

      {/* 注意事項 */}
      {!isRecording && !recordedBlob && (
        <div className="mt-4 text-xs text-slate-400">
          ※ 録音形式はWebMです（ブラウザネイティブ）
        </div>
      )}
    </div>
  );
};
