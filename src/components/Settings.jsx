import { useState } from 'react';
import { SoundSelector } from './SoundSelector';
import { getSoundById } from '../utils/soundData';
import { PAD_COLORS } from '../utils/constants';

/**
 * 設定画面コンポーネント（モーダル形式）
 *
 * @param {boolean} isOpen モーダルの開閉状態
 * @param {function} onClose モーダルを閉じるコールバック
 * @param {array} pads パッド設定の配列
 * @param {function} onPadUpdate パッド設定更新のコールバック
 * @param {function} onPreviewSound 音源プレビューのコールバック
 */
export const Settings = ({
  isOpen,
  onClose,
  pads,
  onPadUpdate,
  onPreviewSound,
}) => {
  const [selectedPadIndex, setSelectedPadIndex] = useState(0);

  if (!isOpen) return null;

  const selectedPad = pads[selectedPadIndex];

  /**
   * 音源選択ハンドラ
   */
  const handleSoundSelect = (soundId) => {
    const sound = getSoundById(soundId);
    if (sound) {
      onPadUpdate(selectedPadIndex, {
        soundId,
        soundName: sound.name,
      });
    }
  };

  /**
   * 音量変更ハンドラ
   */
  const handleVolumeChange = (volume) => {
    onPadUpdate(selectedPadIndex, { volume });
  };

  /**
   * カラー変更ハンドラ
   */
  const handleColorChange = (colorIndex) => {
    onPadUpdate(selectedPadIndex, { colorIndex });
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-16 bg-slate-900 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-700">
          <h2 className="text-lg md:text-xl font-bold">⚙️ パッド設定</h2>
          <button
            onClick={onClose}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm md:text-base"
          >
            ✕ 閉じる
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* パッド選択エリア */}
          <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-700 p-3 md:p-4 overflow-y-auto">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">パッドを選択</h3>
            <div className="grid grid-cols-4 gap-2">
              {pads.map((pad, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPadIndex(index)}
                  className={`
                    aspect-square rounded-lg p-2
                    flex flex-col items-center justify-center
                    text-xs font-medium
                    transition-all
                    ${selectedPadIndex === index
                      ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-105'
                      : 'hover:scale-105'
                    }
                  `}
                  style={{
                    backgroundColor: PAD_COLORS[pad.colorIndex],
                  }}
                >
                  <div className="text-[10px] opacity-70">{index + 1}</div>
                  <div className="text-center leading-tight">
                    {pad.soundName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* パッド設定エリア */}
          <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-4 md:space-y-6">
            {/* 選択中のパッド情報 */}
            <div className="bg-slate-800 rounded-lg p-3 md:p-4">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                パッド {selectedPadIndex + 1}
              </h3>
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold"
                  style={{ backgroundColor: PAD_COLORS[selectedPad.colorIndex] }}
                >
                  {selectedPadIndex + 1}
                </div>
                <div>
                  <div className="font-medium text-sm md:text-base">{selectedPad.soundName}</div>
                  <div className="text-xs md:text-sm text-slate-400">{selectedPad.soundId}</div>
                </div>
              </div>
            </div>

            {/* 音量調整 */}
            <div>
              <label className="block text-xs md:text-sm font-medium mb-2">
                音量: {Math.round(selectedPad.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedPad.volume * 100}
                onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* カラー選択 */}
            <div>
              <label className="block text-xs md:text-sm font-medium mb-2">
                パッドカラー
              </label>
              <div className="flex flex-wrap gap-2">
                {PAD_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(index)}
                    className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-lg transition-all
                      ${selectedPad.colorIndex === index
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                        : 'hover:scale-110'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`カラー ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* 音源選択 */}
            <div className="flex-1 flex flex-col min-h-0">
              <label className="block text-xs md:text-sm font-medium mb-2">
                音源を選択
              </label>
              <div className="flex-1 bg-slate-800 rounded-lg p-3 md:p-4 overflow-hidden">
                <SoundSelector
                  currentSoundId={selectedPad.soundId}
                  onSelect={handleSoundSelect}
                  onPreview={onPreviewSound}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
