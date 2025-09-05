import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callEdge } from '@/utils/callEdge';
import Layout from '@/components/Layout';

const AdminResetSlots = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminPassword) {
      setResult({ success: false, error: 'Bitte geben Sie das Admin-Passwort ein.' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await callEdge('/admin/reset-slots', {
        method: 'POST',
        body: JSON.stringify({ adminPassword }),
      });

      setResult({ 
        success: true, 
        message: data.message || 'Slots erfolgreich zurückgesetzt.' 
      });
      
      setAdminPassword('');
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Fehler beim Zurücksetzen der Slots' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin - Monatliche Slots zurücksetzen</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin-Passwort *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    aria-describedby="password-error"
                  />
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
                  {isSubmitting ? 'Slots werden zurückgesetzt...' : 'Monatliche Slots zurücksetzen'}
                </Button>

                <div 
                  role="status" 
                  aria-live="polite"
                  className="min-h-[24px]"
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