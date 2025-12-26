import { useState, useMemo } from 'react';
import { SOUNDS, SOUND_CATEGORIES, getSoundsByCategory } from '../utils/soundData';

/**
 * 音源選択コンポーネント
 *
 * @param {string} currentSoundId 現在選択中の音源ID
 * @param {function} onSelect 音源選択時のコールバック
 * @param {function} onPreview プレビュー再生のコールバック
 */
export const SoundSelector = ({ currentSoundId, onSelect, onPreview }) => {
  const [selectedCategory, setSelectedCategory] = useState(SOUND_CATEGORIES.DRUMS);
  const [searchQuery, setSearchQuery] = useState('');

  // カテゴリ別の音源リスト
  const soundsByCategory = useMemo(() => {
    return {
      [SOUND_CATEGORIES.DRUMS]: getSoundsByCategory(SOUND_CATEGORIES.DRUMS),
      [SOUND_CATEGORIES.SYNTH]: getSoundsByCategory(SOUND_CATEGORIES.SYNTH),
      [SOUND_CATEGORIES.FX]: getSoundsByCategory(SOUND_CATEGORIES.FX),
    };
  }, []);

  // 検索フィルタリング
  const filteredSounds = useMemo(() => {
    const sounds = soundsByCategory[selectedCategory];
    if (!searchQuery.trim()) return sounds;

    const query = searchQuery.toLowerCase();
    return sounds.filter(sound =>
      sound.name.toLowerCase().includes(query) ||
      sound.id.toLowerCase().includes(query)
    );
  }, [selectedCategory, searchQuery, soundsByCategory]);

  // カテゴリタブ
  const categories = [
    { id: SOUND_CATEGORIES.DRUMS, label: '🥁 ドラム', count: soundsByCategory[SOUND_CATEGORIES.DRUMS].length },
    { id: SOUND_CATEGORIES.SYNTH, label: '🎹 シンセ', count: soundsByCategory[SOUND_CATEGORIES.SYNTH].length },
    { id: SOUND_CATEGORIES.FX, label: '🎭 FX', count: soundsByCategory[SOUND_CATEGORIES.FX].length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 検索バー */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="音源を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-purple-500 focus:outline-none text-white placeholder-slate-400"
        />
      </div>

      {/* カテゴリタブ */}
      <div className="flex gap-2 mb-4 border-b border-slate-700">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSearchQuery(''); // カテゴリ変更時に検索をクリア
            }}
            className={`
              px-4 py-2 font-medium transition-colors
              ${selectedCategory === category.id
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* 音源リスト */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredSounds.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            {searchQuery ? '該当する音源が見つかりません' : '音源がありません'}
          </div>
        ) : (
          filteredSounds.map(sound => (
            <div
              key={sound.id}
              className={`
                flex items-center justify-between p-3 rounded-lg
                cursor-pointer transition-all
                ${currentSoundId === sound.id
                  ? 'bg-purple-600 shadow-lg'
                  : 'bg-slate-700 hover:bg-slate-600'
                }
              `}
              onClick={() => onSelect(sound.id)}
            >
              <div className="flex-1">
                <div className="font-medium">{sound.name}</div>
                <div className="text-xs text-slate-400">{sound.id}</div>
              </div>

              {/* プレビューボタン */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPreview) {
                    onPreview(sound.id);
                  }
                }}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-900 transition-colors text-sm"
                aria-label={`${sound.name}をプレビュー`}
              >
                ▶️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
