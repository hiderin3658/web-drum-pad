import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEY, STORAGE_VERSION, TOTAL_PADS, DEFAULT_BPM, DEFAULT_VOLUME } from '../utils/constants';
import { DEFAULT_PAD_ASSIGNMENTS, getSoundById } from '../utils/soundData';
import { DEFAULT_PAD_COLORS } from '../utils/constants';

/**
 * localStorage を使用した設定の永続化フック
 *
 * 設定の保存・読み込み・リセット機能を提供します
 */
export const useLocalStorage = () => {
  /**
   * デフォルト設定を生成
   */
  const getDefaultSettings = useCallback(() => {
    return {
      version: STORAGE_VERSION,
      settings: {
        bpm: DEFAULT_BPM,
        volume: DEFAULT_VOLUME,
        metronome: false,
        loop: true,
      },
      pads: Array.from({ length: TOTAL_PADS }, (_, index) => {
        const soundId = DEFAULT_PAD_ASSIGNMENTS[index];
        const sound = getSoundById(soundId);
        return {
          id: index,
          soundId,
          soundName: sound ? sound.name : 'Unknown',
          volume: DEFAULT_VOLUME,
          colorIndex: DEFAULT_PAD_COLORS[index] || 0,
        };
      }),
      patterns: Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
        name: `Pattern ${index + 1}`,
        steps: {},
      })),
      currentPattern: 1,
    };
  }, []);

  /**
   * localStorageから設定を読み込み
   */
  const loadSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        console.log('保存された設定が見つかりません。デフォルト設定を使用します。');
        return getDefaultSettings();
      }

      const data = JSON.parse(stored);

      // バージョンチェック
      if (data.version !== STORAGE_VERSION) {
        console.warn(`設定のバージョンが異なります（保存: ${data.version}, 現在: ${STORAGE_VERSION}）`);
        console.log('デフォルト設定を使用します。');
        return getDefaultSettings();
      }

      console.log('保存された設定を読み込みました');
      return data;
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
      return getDefaultSettings();
    }
  }, [getDefaultSettings]);

  /**
   * localStorageに設定を保存
   */
  const saveSettings = useCallback((settings) => {
    try {
      const data = {
        ...settings,
        version: STORAGE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('設定を保存しました');
      return true;
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      // localStorage容量超過などのエラー
      if (error.name === 'QuotaExceededError') {
        console.error('localStorageの容量が不足しています');
      }
      return false;
    }
  }, []);

  /**
   * 設定をリセット
   */
  const resetSettings = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('設定をリセットしました');
      return getDefaultSettings();
    } catch (error) {
      console.error('設定のリセットに失敗しました:', error);
      return getDefaultSettings();
    }
  }, [getDefaultSettings]);

  return {
    loadSettings,
    saveSettings,
    resetSettings,
    getDefaultSettings,
  };
};

/**
 * 自動保存機能付きの設定管理フック
 *
 * @param {number} autoSaveDelay 自動保存の遅延時間（ミリ秒）
 */
export const useAutoSaveSettings = (autoSaveDelay = 1000) => {
  const { loadSettings, saveSettings, resetSettings, getDefaultSettings } = useLocalStorage();
  const [settings, setSettings] = useState(() => loadSettings());
  const [saveTimer, setSaveTimer] = useState(null);

  /**
   * 設定を更新（自動保存）
   */
  const updateSettings = useCallback((updates) => {
    setSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        ...updates,
      };

      // 既存のタイマーをクリア
      if (saveTimer) {
        clearTimeout(saveTimer);
      }

      // 遅延保存タイマーを設定
      const timer = setTimeout(() => {
        saveSettings(newSettings);
      }, autoSaveDelay);

      setSaveTimer(timer);

      return newSettings;
    });
  }, [saveSettings, autoSaveDelay, saveTimer]);

  /**
   * パッド設定を更新
   */
  const updatePad = useCallback((padId, updates) => {
    setSettings(prevSettings => {
      const newPads = [...prevSettings.pads];
      newPads[padId] = { ...newPads[padId], ...updates };

      const newSettings = {
        ...prevSettings,
        pads: newPads,
      };

      // 自動保存
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      const timer = setTimeout(() => {
        saveSettings(newSettings);
      }, autoSaveDelay);
      setSaveTimer(timer);

      return newSettings;
    });
  }, [saveSettings, autoSaveDelay, saveTimer]);

  /**
   * パターンを保存
   */
  const savePattern = useCallback((patternId, patternData) => {
    setSettings(prevSettings => {
      const newPatterns = [...prevSettings.patterns];
      const index = newPatterns.findIndex(p => p.id === patternId);
      if (index !== -1) {
        newPatterns[index] = { ...newPatterns[index], ...patternData };
      }

      const newSettings = {
        ...prevSettings,
        patterns: newPatterns,
      };

      // 即座に保存
      saveSettings(newSettings);

      return newSettings;
    });
  }, [saveSettings]);

  /**
   * パターンを読み込み
   */
  const loadPattern = useCallback((patternId) => {
    const pattern = settings.patterns.find(p => p.id === patternId);
    return pattern || null;
  }, [settings.patterns]);

  /**
   * 設定をリセット
   */
  const reset = useCallback(() => {
    const defaultSettings = resetSettings();
    setSettings(defaultSettings);
    return defaultSettings;
  }, [resetSettings]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [saveTimer]);

  return {
    settings,
    updateSettings,
    updatePad,
    savePattern,
    loadPattern,
    reset,
  };
};
