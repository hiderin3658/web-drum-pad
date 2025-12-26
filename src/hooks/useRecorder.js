import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { MAX_RECORDING_TIME } from '../utils/constants';

/**
 * 録音機能を管理するカスタムフック
 *
 * Tone.Recorder を使用してブラウザ内で録音し、
 * WebM形式でダウンロード可能にします。
 *
 * 注: lamejs を使用したMP3エンコードは複雑なため、
 * ブラウザネイティブのWebM形式で録音します。
 */
export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const recorderRef = useRef(null);
  const timerRef = useRef(null);

  /**
   * 録音を停止
   */
  const stopRecording = useCallback(async () => {
    try {
      if (!recorderRef.current) {
        console.warn('Recorder が存在しません');
        return null;
      }

      // タイマー停止
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 録音停止 & Blob取得
      const recording = await recorderRef.current.stop();

      // Recorderをクリーンアップ
      if (recorderRef.current) {
        Tone.Destination.disconnect(recorderRef.current);
        recorderRef.current = null;
      }

      setIsRecording(false);
      setRecordedBlob(recording);

      console.log('録音を停止しました', recording);
      return recording;
    } catch (error) {
      console.error('録音の停止に失敗しました:', error);
      setIsRecording(false);
      throw error;
    }
  }, []);

  /**
   * 録音を開始
   */
  const startRecording = useCallback(async () => {
    try {
      // Recorderを作成
      recorderRef.current = new Tone.Recorder();

      // Tone.Destination（マスター出力）に接続
      Tone.Destination.connect(recorderRef.current);

      // 録音開始
      await recorderRef.current.start();

      setIsRecording(true);
      setRecordingTime(0);
      setRecordedBlob(null);

      // タイマー開始
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsed);

        // 最大録音時間に達したら自動停止
        if (elapsed >= MAX_RECORDING_TIME) {
          stopRecording();
        }
      }, 1000);

      console.log('録音を開始しました');
    } catch (error) {
      console.error('録音の開始に失敗しました:', error);
      setIsRecording(false);
      throw error;
    }
  }, [stopRecording]);

  /**
   * 録音データをダウンロード
   */
  const downloadRecording = useCallback((filename = 'recording.webm') => {
    try {
      if (!recordedBlob) {
        console.warn('ダウンロードするデータがありません');
        return;
      }

      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // メモリリーク防止のため、URLを解放
      setTimeout(() => URL.revokeObjectURL(url), 100);

      console.log('録音データをダウンロードしました:', filename);
    } catch (error) {
      console.error('ダウンロードに失敗しました:', error);
      throw error;
    }
  }, [recordedBlob]);

  /**
   * 録音データをクリア
   */
  const clearRecording = useCallback(() => {
    setRecordedBlob(null);
    setRecordingTime(0);
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recorderRef.current) {
        try {
          Tone.Destination.disconnect(recorderRef.current);
        } catch (error) {
          console.warn('Recorder のクリーンアップに失敗:', error);
        }
      }
    };
  }, []);

  return {
    isRecording,
    recordingTime,
    recordedBlob,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecording,
  };
};
