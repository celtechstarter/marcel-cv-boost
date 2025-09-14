import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, SkipForward, SkipBack, Pause, Play } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TextToSpeechButtonProps {
  className?: string;
  voice?: 'Liam' | 'Charlotte' | 'Daniel' | 'Laura';
  size?: 'sm' | 'md' | 'lg';
  useCloudTTS?: boolean;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ 
  className = "",
  voice = 'Liam',
  size = 'md',
  useCloudTTS = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech synthesis and cleanup on unmount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (currentUtterance) {
        window.speechSynthesis?.cancel();
      }
    };
  }, [currentUtterance]);

  const extractPageText = (): string => {
    // Get main content, excluding navigation and footer
    const mainContent = document.querySelector('main') || document.body;
    
    // Remove scripts, styles, and other non-content elements
    const clone = mainContent.cloneNode(true) as Element;
    
    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', 
      '.sr-only', '[aria-hidden="true"]', 'button', 'a'
    ];
    
    unwantedSelectors.forEach(selector => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    let text = clone.textContent || '';
    
    // Clean up text
    text = text
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n+/g, ' ') // Newlines to spaces
      .trim();

    // Add page context for screen readers
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    let fullText = `Seite: ${pageTitle}.`;
    if (pageDescription) {
      fullText += ` ${pageDescription}.`;
    }
    fullText += ` Seiteninhalt: ${text}`;

    return fullText;
  };

  const splitIntoSentences = (text: string): string[] => {
    // Split by sentence endings, keeping reasonable chunk sizes
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + '.');

    // Combine very short sentences
    const combined: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length < 250) {
        currentChunk += ' ' + sentence;
      } else {
        if (currentChunk) combined.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) combined.push(currentChunk.trim());
    return combined.filter(s => s.length > 5);
  };

  const getGermanVoice = (): SpeechSynthesisVoice | null => {
    if (!speechSynthesis) return null;
    
    const voices = speechSynthesis.getVoices();
    
    // Try to find German voices
    const germanVoices = voices.filter(voice => 
      voice.lang.includes('de') || voice.name.toLowerCase().includes('german')
    );
    
    if (germanVoices.length > 0) {
      // Prefer female voices for better accessibility
      const femaleGerman = germanVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('anna') ||
        voice.name.toLowerCase().includes('petra')
      );
      return femaleGerman || germanVoices[0];
    }
    
    // Fallback to any available voice
    return voices.find(voice => voice.default) || voices[0] || null;
  };

  const playWithBrowserTTS = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!speechSynthesis) {
        reject(new Error('Browser TTS nicht verfügbar'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const germanVoice = getGermanVoice();
      
      if (germanVoice) {
        utterance.voice = germanVoice;
        utterance.lang = 'de-DE';
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setCurrentUtterance(null);
        resolve();
      };
      
      utterance.onerror = (event) => {
        setCurrentUtterance(null);
        reject(new Error(`Browser TTS Fehler: ${event.error}`));
      };

      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    });
  };

  const playWithCloudTTS = async (text: string): Promise<HTMLAudioElement> => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });

      if (error) throw error;

      if (!data?.audioContent) {
        throw new Error('Keine Audiodaten erhalten');
      }

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onloadeddata = () => resolve(audio);
        audio.onerror = () => reject(new Error('Audio konnte nicht geladen werden'));
        audio.load();
      });
    } catch (error) {
      console.error('Cloud TTS Error:', error);
      throw error;
    }
  };

  const startReading = async () => {
    try {
      setIsLoading(true);
      
      const pageText = extractPageText();
      if (!pageText || pageText.length < 10) {
        throw new Error('Kein Text zum Vorlesen gefunden');
      }

      const sentenceList = splitIntoSentences(pageText);
      setSentences(sentenceList);
      setCurrentSentence(0);
      
      await playNextSentence(sentenceList, 0);
      
    } catch (error) {
      console.error('Vorlesen Fehler:', error);
      toast({
        title: "Fehler beim Vorlesen",
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playNextSentence = async (sentenceList: string[], index: number) => {
    if (index >= sentenceList.length) {
      stopReading();
      toast({
        title: "Vorlesen beendet",
        description: "Die gesamte Seite wurde vorgelesen.",
      });
      return;
    }

    try {
      setCurrentSentence(index);
      setIsPlaying(true);

      if (useCloudTTS) {
        // Use cloud TTS with throttling
        await new Promise(resolve => setTimeout(resolve, 500)); // Throttle requests
        const audio = await playWithCloudTTS(sentenceList[index]);
        audioRef.current = audio;
        setCurrentAudio(audio);

        audio.onended = () => {
          playNextSentence(sentenceList, index + 1);
        };

        audio.onerror = () => {
          console.error('Cloud TTS error for sentence:', index);
          // Fallback to browser TTS
          playWithBrowserTTS(sentenceList[index])
            .then(() => playNextSentence(sentenceList, index + 1))
            .catch(() => playNextSentence(sentenceList, index + 1));
        };

        audio.play().catch(error => {
          console.error('Audio play error:', error);
          // Fallback to browser TTS
          playWithBrowserTTS(sentenceList[index])
            .then(() => playNextSentence(sentenceList, index + 1))
            .catch(() => playNextSentence(sentenceList, index + 1));
        });
      } else {
        // Use browser TTS
        await playWithBrowserTTS(sentenceList[index]);
        playNextSentence(sentenceList, index + 1);
      }

    } catch (error) {
      console.error('Error playing sentence:', error);
      // Skip to next sentence on error
      playNextSentence(sentenceList, index + 1);
    }
  };

  const stopReading = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (currentUtterance && speechSynthesis) {
      speechSynthesis.cancel();
      setCurrentUtterance(null);
    }
    setCurrentAudio(null);
    setIsPlaying(false);
    setCurrentSentence(0);
    setSentences([]);
  };

  const pauseResumeReading = () => {
    if (useCloudTTS && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else if (!useCloudTTS && speechSynthesis) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speechSynthesis.pause();
        setIsPlaying(false);
      }
    }
  };

  const skipToNext = () => {
    if (sentences.length > 0 && currentSentence < sentences.length - 1) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (currentUtterance && speechSynthesis) {
        speechSynthesis.cancel();
      }
      playNextSentence(sentences, currentSentence + 1);
    }
  };

  const skipToPrevious = () => {
    if (sentences.length > 0 && currentSentence > 0) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (currentUtterance && speechSynthesis) {
        speechSynthesis.cancel();
      }
      playNextSentence(sentences, currentSentence - 1);
    }
  };

  const buttonSize = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  if (isPlaying) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={skipToPrevious}
          size={buttonSize}
          variant="outline"
          disabled={currentSentence === 0}
          aria-label="Vorheriger Abschnitt"
        >
          <SkipBack className={iconSize} />
        </Button>
        
        <Button
          onClick={pauseResumeReading}
          size={buttonSize}
          variant="outline"
          aria-label={
            useCloudTTS 
              ? (audioRef.current?.paused ? "Vorlesen fortsetzen" : "Vorlesen pausieren")
              : (speechSynthesis?.paused ? "Vorlesen fortsetzen" : "Vorlesen pausieren")
          }
        >
          {(useCloudTTS ? audioRef.current?.paused : speechSynthesis?.paused) ? (
            <Play className={iconSize} />
          ) : (
            <Pause className={iconSize} />
          )}
        </Button>

        <Button
          onClick={stopReading}
          size={buttonSize}
          variant="outline"
          aria-label="Vorlesen beenden"
        >
          <VolumeX className={iconSize} />
        </Button>

        <Button
          onClick={skipToNext}
          size={buttonSize}
          variant="outline"
          disabled={currentSentence >= sentences.length - 1}
          aria-label="Nächster Abschnitt"
        >
          <SkipForward className={iconSize} />
        </Button>

        {sentences.length > 0 && (
          <span className="text-sm text-muted-foreground ml-2">
            {currentSentence + 1} / {sentences.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={startReading}
      size={buttonSize}
      disabled={isLoading}
      className={className}
      aria-label="Seite vorlesen lassen"
      title="Seite vorlesen lassen (Barrierefreiheit)"
    >
      {isLoading ? (
        <Loader2 className={`${iconSize} animate-spin mr-2`} />
      ) : (
        <Volume2 className={`${iconSize} mr-2`} />
      )}
      {size !== 'sm' && 'Seite vorlesen'}
    </Button>
  );
};
