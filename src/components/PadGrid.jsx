import { Pad } from './Pad';
import { GRID_COLUMNS } from '../utils/constants';

/**
 * パッドグリッドコンポーネント（4×4）
 *
 * @param {array} pads パッド設定の配列
 * @param {function} onPadPlay パッド再生時のコールバック
 */
export const PadGrid = ({ pads, onPadPlay }) => {
  return (
    <div
      className={`grid gap-2 w-full max-w-2xl mx-auto`}
      style={{
        gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
      }}
    >
      {pads.map((pad, index) => (
        <Pad
          key={index}
          padId={index}
          soundId={pad.soundId}
          soundName={pad.soundName}
          colorIndex={pad.colorIndex}
          volume={pad.volume}
          onPlay={onPadPlay}
        />
      ))}
    </div>
  );
};
