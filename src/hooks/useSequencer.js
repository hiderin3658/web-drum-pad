import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { DEFAULT_BPM, STEPS_PER_PATTERN, TOTAL_PADS } from '../utils/constants';

/**
 * シーケンサー機能を管理するカスタムフック
 *
 * Tone.js の Transport と Sequence を使用して16ステップシーケンサーを実装
 *
 * @param {function} playSound 音源再生関数
 * @param {array} pads パッド設定
 */
export const useSequencer = (playSound, pads) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpmState] = useState(DEFAULT_BPM);
  const [pattern, setPattern] = useState(() => {
    // 初期パターン（全てOFF）
    const initialPattern = {};
    for (let i = 0; i < TOTAL_PADS; i++) {
      initialPattern[i] = Array(STEPS_PER_PATTERN).fill(false);
    }
    return initialPattern;
  });

  const sequenceRef = useRef(null);
  const stepIntervalRef = useRef(null);

  /**
   * BPM を設定
   */
  const setBpm = useCallback((newBpm) => {
    const clampedBpm = Math.max(60, Math.min(200, newBpm));
    setBpmState(clampedBpm);
    Tone.Transport.bpm.value = clampedBpm;
  }, []);

  /**
   * ステップをトグル（ON/OFF切り替え）
   */
  const toggleStep = useCallback((padIndex, step) => {
    setPattern(prevPattern => {
      const newPattern = { ...prevPattern };
      newPattern[padIndex] = [...newPattern[padIndex]];
      newPattern[padIndex][step] = !newPattern[padIndex][step];
      return newPattern;
    });
  }, []);

  /**
   * パターンを設定
   */
  const setPatternData = useCallback((newPattern) => {
    setPattern(newPattern);
  }, []);

  /**
   * パターンをクリア
   */
  const clearPattern = useCallback(() => {
    const emptyPattern = {};
    for (let i = 0; i < TOTAL_PADS; i++) {
      emptyPattern[i] = Array(STEPS_PER_PATTERN).fill(false);
    }
    setPattern(emptyPattern);
  }, []);

  /**
   * シーケンスを開始
   */
  const start = useCallback(() => {
    if (isPlaying) return;

    try {
      // BPMを設定
      Tone.Transport.bpm.value = bpm;

      // Sequenceを作成
      const steps = Array.from({ length: STEPS_PER_PATTERN }, (_, i) => i);

      sequenceRef.current = new Tone.Sequence(
        (time, step) => {
          // 現在のステップを更新（UI用）
          Tone.Draw.schedule(() => {
            setCurrentStep(step);
          }, time);

          // このステップでONになっているパッドを再生
          for (let padIndex = 0; padIndex < TOTAL_PADS; padIndex++) {
            if (pattern[padIndex]?.[step]) {
              const pad = pads[padIndex];
              if (pad) {
                // Tone.jsのスケジューリングを使用して正確なタイミングで再生
                Tone.Draw.schedule(() => {
                  playSound(pad.soundId, pad.volume);
                }, time);
              }
            }
          }
        },
        steps,
        '16n' // 16分音符
      );

      sequenceRef.current.start(0);
      Tone.Transport.start();

      setIsPlaying(true);
      console.log('シーケンサーを開始しました');
    } catch (error) {
      console.error('シーケンサーの開始に失敗しました:', error);
      setIsPlaying(false);
    }
  }, [isPlaying, bpm, pattern, pads, playSound]);

  /**
   * シーケンスを停止
   */
  const stop = useCallback(() => {
    if (!isPlaying) return;

    try {
      if (sequenceRef.current) {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
        sequenceRef.current = null;
      }

      Tone.Transport.stop();
      Tone.Transport.cancel();

      setIsPlaying(false);
      setCurrentStep(-1);
      console.log('シーケンサーを停止しました');
    } catch (error) {
      console.error('シーケンサーの停止に失敗しました:', error);
    }
  }, [isPlaying]);

  /**
   * ループON/OFF
   */
  const setLoop = useCallback((loop) => {
    if (sequenceRef.current) {
      sequenceRef.current.loop = loop;
    }
    Tone.Transport.loop = loop;
    if (loop) {
      Tone.Transport.loopStart = 0;
      Tone.Transport.loopEnd = '1m'; // 1小節
    }
  }, []);

  // 初期化時にBPMを設定
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = '1m';
  }, [bpm]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        try {
          sequenceRef.current.stop();
          sequenceRef.current.dispose();
        } catch (error) {
          console.warn('Sequence のクリーンアップに失敗:', error);
        }
      }
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    currentStep,
    bpm,
    pattern,
    start,
    stop,
    setBpm,
    toggleStep,
    setPattern: setPatternData,
    clearPattern,
    setLoop,
  };
};
