import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callEdge } from '@/utils/callEdge';
import Layout from '@/components/Layout';

const ReviewVerify = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reviewId = searchParams.get('id');
  const code = searchParams.get('code');

  useEffect(() => {
    const verifyReview = async () => {
      if (!reviewId || !code) {
        setResult({ 
          success: false, 
          error: 'Fehlende Parameter: Bewertungs-ID oder Verifizierungscode nicht gefunden.' 
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await callEdge('/reviews/verify', {
          method: 'POST',
          body: JSON.stringify({
            reviewId,
            code,
          }),
        });

        setResult({ 
          success: true, 
          message: 'Ihre Bewertung wurde erfolgreich verifiziert und wird nach Prüfung veröffentlicht.' 
        });
      } catch (error) {
        setResult({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Fehler bei der Verifizierung' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyReview();
  }, [reviewId, code]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bewertung verifizieren</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                role="status" 
                aria-live="polite"
                className="min-h-[100px] flex items-center justify-center"
              >
                {isLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Verifizierung läuft...</p>
                  </div>
                )}

                {!isLoading && result && (
                  <div 
                    className={`p-6 rounded-lg text-center w-full ${
                      result.success 
                        ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800' 
                        : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
                    }`}
                  >
                    {result.success ? (
                      <div>
                        <div className="text-4xl mb-4">✅</div>
                        <h2 className="text-xl font-semibold mb-2">Verifizierung erfolgreich!</h2>
                        <p>{result.message}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-4">❌</div>
                        <h2 className="text-xl font-semibold mb-2">Verifizierung fehlgeschlagen</h2>
                        <p>{result.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewVerify;