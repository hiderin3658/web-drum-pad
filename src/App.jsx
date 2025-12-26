import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { PadGrid } from './components/PadGrid';
import { Settings } from './components/Settings';
import { Sequencer } from './components/Sequencer';
import { Controls } from './components/Controls';
import { Recorder } from './components/Recorder';
import { useAudio } from './hooks/useAudio';
import { useAutoSaveSettings } from './hooks/useLocalStorage';
import { useSequencer } from './hooks/useSequencer';
import { useRecorder } from './hooks/useRecorder';
import { useKeyboard } from './hooks/useKeyboard';

function App() {
  const { isLoaded, loadProgress, loadErrors, playSound, initAudio } = useAudio();
  const { settings, updatePad, reset } = useAutoSaveSettings();
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // パッド設定（localStorageから読み込み）
  const pads = settings.pads;

  // シーケンサー
  const {
    isPlaying,
    currentStep,
    bpm,
    pattern,
    start,
    stop,
    setBpm,
    toggleStep,
    clearPattern,
  } = useSequencer(playSound, pads);

  // 録音
  const {
    isRecording,
    recordingTime,
    recordedBlob,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
  } = useRecorder();

  /**
   * パッド再生ハンドラ
   */
  const handlePadPlay = useCallback(
    (soundId, volume) => {
      playSound(soundId, volume);
    },
    [playSound]
  );

  /**
   * パッド設定更新ハンドラ（自動保存）
   */
  const handlePadUpdate = useCallback((padIndex, updates) => {
    updatePad(padIndex, updates);
  }, [updatePad]);

  /**
   * AudioContext 初期化（最初のユーザー操作時）
   */
  const handleInitAudio = useCallback(async () => {
    if (!audioInitialized) {
      const success = await initAudio();
      if (success) {
        setAudioInitialized(true);
      }
    }
  }, [audioInitialized, initAudio]);

  /**
   * 録音ダウンロードハンドラ
   */
  const handleDownload = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `web-drum-pad-${timestamp}.webm`;
    downloadRecording(filename);
  }, [downloadRecording]);

  /**
   * 再生/停止トグルハンドラ（キーボード用）
   */
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  /**
   * 録音トグルハンドラ（キーボード用）
   */
  const handleToggleRecord = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else if (!recordedBlob) {
      // 録音データがない場合のみ開始可能
      startRecording();
    }
  }, [isRecording, recordedBlob, startRecording, stopRecording]);

  // キーボードショートカット
  useKeyboard({
    onPadTrigger: (padIndex) => {
      const pad = pads[padIndex];
      if (pad && pad.soundId) {
        handlePadPlay(pad.soundId, pad.volume);
      }
    },
    onTogglePlay: handleTogglePlay,
    onToggleRecord: handleToggleRecord,
    onBpmChange: (delta) => setBpm(bpm + delta),
    isRecording,
  });

  // 最初のクリック/タッチでAudioContextを初期化
  useEffect(() => {
    if (audioInitialized) return;

    const handleFirstInteraction = async () => {
      const success = await initAudio();
      if (success) {
        setAudioInitialized(true);
      }
      // イベントリスナーを削除
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioInitialized, initAudio]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* ヘッダー */}
      <header className="flex items-center justify-between p-3 md:p-4 border-b border-slate-700">
        <h1 className="text-lg md:text-2xl font-bold">🎵 Web Drum Pad</h1>
        <div className="flex gap-1.5 md:gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-2 md:px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors text-xs md:text-sm"
          >
            ⚙️ 設定
          </button>
          <button
            onClick={() => {
              if (window.confirm('すべての設定をリセットしますか？')) {
                reset();
              }
            }}
            className="px-2 md:px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors text-xs md:text-sm"
          >
            🔄 リセット
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto p-3 md:p-4 space-y-4 md:space-y-8">
        {/* 音源ロード状態 */}
        {!isLoaded && (
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <div className="text-lg mb-2">音源を読み込み中...</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="text-sm text-slate-400 mt-2">{loadProgress}%</div>
          </div>
        )}

        {/* AudioContext 初期化プロンプト */}
        {isLoaded && !audioInitialized && (
          <div className="bg-amber-900/50 border border-amber-700 rounded-lg p-4 text-center">
            <div className="text-lg mb-2">🎵 音声を有効にしてください</div>
            <p className="text-sm text-slate-300 mb-4">
              ブラウザのセキュリティ制限により、クリックまたはタップで音声を有効化する必要があります
            </p>
            <button
              onClick={handleInitAudio}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors font-medium"
            >
              音声を有効にする
            </button>
          </div>
        )}

        {/* ロードエラー表示 */}
        {loadErrors.length > 0 && (
          <details className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium">
              ⚠️ {loadErrors.length}個の音源がロードできませんでした（クリックで詳細表示）
            </summary>
            <div className="mt-2 text-xs space-y-1 text-slate-300">
              {loadErrors.map((error, index) => (
                <div key={index}>
                  • {error.name}: {error.error}
                </div>
              ))}
              <div className="mt-3 text-slate-400 italic">
                ※ 音源ファイルを public/sounds/ に配置してください
              </div>
            </div>
          </details>
        )}

        {/* パッドグリッド */}
        <div>
          <PadGrid pads={pads} onPadPlay={handlePadPlay} />
        </div>

        {/* コントロール */}
        <Controls
          isPlaying={isPlaying}
          bpm={bpm}
          onPlay={start}
          onStop={stop}
          onBpmChange={setBpm}
          onClearPattern={() => {
            if (window.confirm('パターンをクリアしますか？')) {
              clearPattern();
            }
          }}
        />

        {/* シーケンサー */}
        <Sequencer
          pattern={pattern}
          currentStep={currentStep}
          pads={pads}
          onStepToggle={toggleStep}
        />

        {/* 録音 */}
        <Recorder
          isRecording={isRecording}
          recordingTime={recordingTime}
          recordedBlob={recordedBlob}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onDownload={handleDownload}
          onClear={clearRecording}
        />
      </main>

      {/* フッター */}
      <footer className="text-center p-3 md:p-4 text-slate-500 text-xs md:text-sm border-t border-slate-800 mt-6 md:mt-8">
        <div className="text-sm md:text-base">Web Drum Pad v1.0.0</div>
        <div className="text-xs mt-1">
          {audioInitialized ? '🎵 音声: 有効' : '🔇 音声: 無効'}
          {' · '}
          音源: {isLoaded ? '読み込み完了' : `読み込み中 (${loadProgress}%)`}
        </div>
      </footer>

      {/* 設定モーダル */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pads={pads}
        onPadUpdate={handlePadUpdate}
        onPreviewSound={(soundId) => playSound(soundId, 1.0)}
      />
    </div>
  );
}

export default App;
