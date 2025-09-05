import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { callEdge } from '@/utils/callEdge';

export const SlotsBadge = () => {
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await callEdge('/slots/remaining');
        setSlotsRemaining(data.remaining);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der verfügbaren Plätze');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div 
      className="flex justify-center"
      role="status"
      aria-live="polite"
      aria-label="Verfügbare kostenlose Plätze"
    >
      {isLoading && (
        <Badge variant="secondary" className="text-sm">
          Lade verfügbare Plätze...
        </Badge>
      )}
      
      {error && (
        <Badge variant="destructive" className="text-sm">
          Fehler: {error}
        </Badge>
      )}
      
      {!isLoading && !error && slotsRemaining !== null && (
        <Badge variant="default" className="text-sm bg-green-600 hover:bg-green-700 text-white">
          {slotsRemaining} kostenlose Plätze verfügbar
        </Badge>
      )}
    </div>
  );
};