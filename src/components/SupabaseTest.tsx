import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const SupabaseTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string; message?: string } | null>(null);

  const testConnection = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ping-supabase');
      
      if (error) {
        setResult({ success: false, error: error.message });
      } else if (data?.success) {
        setResult({ success: true, message: '✅ Verbindung erfolgreich zu Supabase' });
      } else {
        setResult({ success: false, error: 'Unbekannter Fehler beim Verbindungstest' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Verbindung fehlgeschlagen' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Button 
        onClick={testConnection} 
        disabled={isLoading}
        className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-describedby={result ? "test-result" : undefined}
      >
        {isLoading ? 'Teste Verbindung...' : 'Supabase Verbindung testen'}
      </Button>
      
      <div 
        id="test-result"
        role="status" 
        aria-live="polite"
        className="min-h-[24px]"
      >
        {result && (
          <div 
            className={`p-3 rounded-lg text-sm font-medium ${
              result.success 
                ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800' 
                : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
            }`}
          >
            {result.success ? result.message : `❌ Fehler: ${result.error}`}
          </div>
        )}
      </div>
    </div>
  );
};