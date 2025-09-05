import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { callEdge } from '@/utils/callEdge';

export const SlotsBadge = () => {
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [maxSlots, setMaxSlots] = useState<number>(5);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await callEdge('/slots/state');
        setSlotsRemaining(data.remaining);
        setMaxSlots(data.max_slots);
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
          Noch {slotsRemaining} von {maxSlots} kostenlosen Slots verfügbar
        </Badge>
      )}
    </div>
  );
};