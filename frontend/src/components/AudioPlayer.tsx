import React, { useState } from 'react';
import { speakTipApi } from '../utils/api';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const handleToggleAudio = async () => {
    if (isPlaying && audioObj) {
      audioObj.pause();
      setIsPlaying(false);
      return;
    }

    if (audioObj) {
      audioObj.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const blob = await speakTipApi(text);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setIsPlaying(false);
        setAudioObj(audio);
        audio.play();
        setIsPlaying(true);
      } else {
        // Speech synthesis fallback if ElevenLabs key is not configured
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        } else {
          alert('Voice audio unavailable.');
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleAudio}
      disabled={isLoading}
      className="px-3.5 py-2 rounded-2xl bg-sage-500 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors flex items-center gap-2 shadow-soft flex-shrink-0"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4 text-sunrise-400 animate-pulse" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      <span>{isPlaying ? 'Pause Audio' : 'Listen to Tip'}</span>
    </button>
  );
};
