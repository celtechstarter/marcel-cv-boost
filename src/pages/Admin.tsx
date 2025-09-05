import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callEdge } from '@/utils/callEdge';
import Layout from '@/components/Layout';

const Admin = () => {
  const [formData, setFormData] = useState({
    reviewId: '',
    adminPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reviewId || !formData.adminPassword) {
      setResult({ success: false, error: 'Bitte füllen Sie alle Felder aus.' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      await callEdge('/reviews/publish', {
        method: 'POST',
        body: JSON.stringify({
          reviewId: formData.reviewId,
          adminPassword: formData.adminPassword,
        }),
      });

      setResult({ 
        success: true, 
        message: 'Bewertung erfolgreich veröffentlicht.' 
      });
      
      // Reset form
      setFormData({
        reviewId: '',
        adminPassword: '',
      });
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Fehler beim Veröffentlichen der Bewertung' 
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
              <CardTitle>Admin - Bewertung veröffentlichen</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reviewId">Bewertungs-ID *</Label>
                  <Input
                    id="reviewId"
                    value={formData.reviewId}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviewId: e.target.value }))}
                    required
                    placeholder="UUID der zu veröffentlichenden Bewertung"
                    aria-describedby="reviewId-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin-Passwort *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
                    required
                    aria-describedby="password-error"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isSubmitting ? 'Veröffentlichung läuft...' : 'Bewertung veröffentlichen'}
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

export default Admin;