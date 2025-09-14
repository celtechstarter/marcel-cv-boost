import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextToSpeechButton } from '@/components/TextToSpeechButton';
import { 
  Accessibility, 
  Type, 
  Eye, 
  Volume2,
  Settings,
  ChevronDown,
  ChevronUp,
  Cloud,
  Monitor
} from 'lucide-react';

export const AccessibilityTools: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [useCloudTTS, setUseCloudTTS] = useState(false);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = '100%';
  };

  const toggleHighContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    
    if (newContrast) {
      document.documentElement.classList.add('high-contrast');
      document.documentElement.style.setProperty('--background', '0 0% 0%');
      document.documentElement.style.setProperty('--foreground', '0 0% 100%');
      document.documentElement.style.setProperty('--primary', '0 0% 100%');
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 0%');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 shadow-lg"
        size="lg"
        aria-label={isExpanded ? "Barrierefreiheits-Tools ausblenden" : "Barrierefreiheits-Tools anzeigen"}
        aria-expanded={isExpanded}
      >
        <Accessibility className="h-5 w-5 mr-2" />
        Barrierefreiheit
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 ml-2" />
        ) : (
          <ChevronUp className="h-4 w-4 ml-2" />
        )}
      </Button>

      {/* Expanded Tools Panel */}
      {isExpanded && (
        <Card className="shadow-xl border-2 border-primary/20 bg-background/95 backdrop-blur">
          <CardContent className="p-4 space-y-4 min-w-[280px]">
            {/* Text-to-Speech Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="h-4 w-4 text-primary" />
                Vorlesen
              </div>
              
              {/* TTS Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setUseCloudTTS(false)}
                  size="sm"
                  variant={!useCloudTTS ? "default" : "outline"}
                  className="flex-1"
                  aria-label="Browser-Vorlesen verwenden"
                >
                  <Monitor className="h-3 w-3 mr-1" />
                  Standard
                </Button>
                <Button
                  onClick={() => setUseCloudTTS(true)}
                  size="sm"
                  variant={useCloudTTS ? "default" : "outline"}
                  className="flex-1"
                  aria-label="Studio-Qualität verwenden"
                >
                  <Cloud className="h-3 w-3 mr-1" />
                  Studio
                </Button>
              </div>
              
              <TextToSpeechButton 
                className="w-full"
                voice="Liam"
                size="md"
                useCloudTTS={useCloudTTS}
              />
              
              {useCloudTTS && (
                <p className="text-xs text-muted-foreground">
                  Studio-Qualität verwendet externe KI-Dienste. Datenschutzerklärung beachten.
                </p>
              )}
            </div>

            {/* Font Size Controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4 text-primary" />
                Schriftgröße ({fontSize}%)
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={decreaseFontSize}
                  size="sm"
                  variant="outline"
                  aria-label="Schrift verkleinern"
                  disabled={fontSize <= 80}
                >
                  A-
                </Button>
                <Button
                  onClick={resetFontSize}
                  size="sm"
                  variant="outline"
                  aria-label="Schriftgröße zurücksetzen"
                >
                  100%
                </Button>
                <Button
                  onClick={increaseFontSize}
                  size="sm"
                  variant="outline"
                  aria-label="Schrift vergrößern"
                  disabled={fontSize >= 150}
                >
                  A+
                </Button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 text-primary" />
                Darstellung
              </div>
              <Button
                onClick={toggleHighContrast}
                size="sm"
                variant={highContrast ? "default" : "outline"}
                className="w-full"
                aria-label={highContrast ? "Hohen Kontrast deaktivieren" : "Hohen Kontrast aktivieren"}
                aria-pressed={highContrast}
              >
                {highContrast ? "Hoher Kontrast: AN" : "Hoher Kontrast: AUS"}
              </Button>
            </div>

            {/* Accessibility Info */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Für weitere Unterstützung verwenden Sie bitte Ihren Screenreader oder kontaktieren Sie mich direkt.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};