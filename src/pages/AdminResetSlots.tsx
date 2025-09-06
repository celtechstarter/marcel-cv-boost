import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const AdminResetSlots = () => {
  const [adminPass, setAdminPass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPass) {
      setResult({ success: false, error: 'Bitte geben Sie das Admin-Passwort ein.' });
      setTimeout(() => messageRef.current?.focus(), 100);
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('https://grryxotfastfmgrrfrun.supabase.co/functions/v1/api/admin/reset-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdycnl4b3RmYXN0Zm1ncnJmcnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjI2MTgsImV4cCI6MjA3MjYzODYxOH0.X7JZd44NkeNbOevZQSGf-EgJyZx9iNKwWz6xH6ftE8M`,
        },
        body: JSON.stringify({ adminPass }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Zurücksetzen der Slots');
      }

      if (data.ok) {
        setResult({ 
          success: true, 
          message: 'Slots erfolgreich zurückgesetzt' 
        });
        setAdminPass('');
        
        // Trigger slots invalidation for immediate frontend refresh
        window.dispatchEvent(new CustomEvent('slots:invalidate'));
      } else {
        throw new Error('Unerwartete Antwort vom Server');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Nicht autorisiert')) {
        setResult({ 
          success: false, 
          error: 'Nicht autorisiert' 
        });
      } else {
        setResult({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Fehler beim Zurücksetzen der Slots' 
        });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => messageRef.current?.focus(), 100);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin - Monats-Slots zurücksetzen</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="adminPass">Admin Passwort *</Label>
                  <Input
                    id="adminPass"
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    required
                    aria-describedby="password-help"
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <p id="password-help" className="text-sm text-muted-foreground">
                    Geben Sie das Admin-Passwort ein, um die Monats-Slots zurückzusetzen.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-950 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Warnung:</strong> Diese Aktion setzt die genutzten Slots für den aktuellen Monat auf 0 zurück. 
                    Dadurch stehen wieder alle kostenlosen Plätze zur Verfügung.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  variant="destructive"
                >
                  {isSubmitting ? 'Slots werden zurückgesetzt...' : 'Monats-Slots zurücksetzen'}
                </Button>

                <div 
                  ref={messageRef}
                  role="status" 
                  aria-live="polite"
                  tabIndex={-1}
                  className="min-h-[24px] focus:outline-none"
                >
                  {result && (
                    <div 
                      className={`p-4 rounded-lg text-sm ${
                        result.success 
                          ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800' 
                          : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
                      }`}
                    >
                      {result.success ? (
                        <p>✅ {result.message}</p>
                      ) : (
                        <p>❌ Fehler: {result.error}</p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminResetSlots;