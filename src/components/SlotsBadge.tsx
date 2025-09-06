import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { fetchSlotsState } from '@/utils/slots';
import { useI18n } from '@/hooks/useI18n';

export const SlotsBadge = () => {
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const [maxSlots, setMaxSlots] = useState<number>(5);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchSlotsState();
      setSlotsRemaining(data.remaining);
      setMaxSlots(data.max_slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der verfügbaren Plätze');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    
    // Listen for slots invalidation events
    const refetch = () => fetchSlots();
    window.addEventListener('slots:invalidate', refetch);
    return () => window.removeEventListener('slots:invalidate', refetch);
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
          {t('slots.loading')}
        </Badge>
      )}
      
      {error && (
        <Badge variant="destructive" className="text-sm">
          {t('slots.error', { error })}
        </Badge>
      )}
      
      {!isLoading && !error && slotsRemaining !== null && (
        <Badge variant="default" className="text-sm bg-green-600 hover:bg-green-700 text-white">
          {t('slots.remaining', { remaining: slotsRemaining })}
        </Badge>
      )}
    </div>
  );
};