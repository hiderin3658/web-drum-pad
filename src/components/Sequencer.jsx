import { STEPS_PER_PATTERN } from '../utils/constants';
import { PAD_COLORS } from '../utils/constants';

/**
 * シーケンサーコンポーネント（16ステップ）
 *
 * @param {object} pattern パターンデータ
 * @param {number} currentStep 現在の再生ステップ（0-15、-1=停止中）
 * @param {array} pads パッド設定
 * @param {function} onStepToggle ステップ切り替えのコールバック
 */
export const Sequencer = ({
  pattern,
  currentStep,
  pads,
  onStepToggle,
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-3 md:p-4">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">🎼 シーケンサー</h2>

      {/* ステップインジケータ - モバイルではスクロール */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-16 gap-0.5 md:gap-1 mb-3 md:mb-4 min-w-max">
          {Array.from({ length: STEPS_PER_PATTERN }).map((_, step) => (
            <div
              key={step}
              className={`
                h-1.5 md:h-2 w-4 md:w-auto rounded transition-colors
                ${currentStep === step ? 'bg-purple-500' : 'bg-slate-700'}
              `}
            />
          ))}
        </div>
      </div>

      {/* パッドごとのステップグリッド - モバイルでは横スクロール */}
      <div className="overflow-x-auto pb-2">
        <div className="space-y-1 md:space-y-2 max-h-96 overflow-y-auto min-w-max">
          {pads.map((pad, padIndex) => (
            <div
              key={padIndex}
              className="flex items-center gap-1 md:gap-2"
            >
              {/* パッド名 */}
              <div
                className="w-14 md:w-20 text-xs truncate flex-shrink-0 px-1 md:px-2 py-1 rounded"
                style={{
                  backgroundColor: PAD_COLORS[pad.colorIndex],
                  opacity: 0.8,
                }}
              >
                {pad.soundName}
              </div>

              {/* ステップボタン */}
              <div className="flex-1 grid grid-cols-16 gap-0.5 md:gap-1">
                {Array.from({ length: STEPS_PER_PATTERN }).map((_, step) => {
                  const isActive = pattern[padIndex]?.[step] || false;
                  const isCurrentStep = currentStep === step;

                  return (
                    <button
                      key={step}
                      onClick={() => onStepToggle(padIndex, step)}
                      className={`
                        w-4 h-4 md:w-auto md:aspect-square rounded transition-all
                        ${isActive
                          ? isCurrentStep
                            ? 'bg-purple-400 scale-110 shadow-lg'
                            : 'bg-purple-600 hover:bg-purple-500'
                          : isCurrentStep
                            ? 'bg-slate-600 scale-105'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }
                      `}
                      aria-label={`Pad ${padIndex + 1}, Step ${step + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ステップ番号 */}
      <div className="mt-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 md:gap-2 min-w-max">
          <div className="w-14 md:w-20 flex-shrink-0"></div>
          <div className="flex-1 grid grid-cols-16 gap-0.5 md:gap-1 text-[9px] md:text-[10px] text-slate-500 text-center">
            {Array.from({ length: STEPS_PER_PATTERN }).map((_, step) => (
              <div key={step} className="w-4 md:w-auto">{step + 1}</div>
            ))}
          </div>
        </div>
      </div>

      {/* スクロールヒント（モバイルのみ） */}
      <div className="mt-2 text-xs text-slate-400 text-center md:hidden">
        ← スクロールして全ステップを表示 →
      </div>
    </div>
  );
};
