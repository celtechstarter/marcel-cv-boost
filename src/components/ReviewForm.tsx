import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callEdge } from '@/utils/callEdge';

export const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    title: '',
    body: '',
    serviceUsed: false,
    agreePublication: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; code?: string; reviewId?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.body || !formData.rating) {
      setResult({ success: false, error: 'Bitte füllen Sie alle Pflichtfelder aus.' });
      return;
    }
    
    if (!formData.serviceUsed || !formData.agreePublication) {
      setResult({ success: false, error: 'Bitte bestätigen Sie beide Checkboxen.' });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await callEdge('/reviews/create', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          rating: parseInt(formData.rating),
          title: formData.title,
          body: formData.body,
        }),
      });

      setResult({ 
        success: true, 
        code: data.code, 
        reviewId: data.review_id 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: '',
        title: '',
        body: '',
        serviceUsed: false,
        agreePublication: false,
      });
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Fehler beim Erstellen der Bewertung' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificationUrl = result?.reviewId && result?.code 
    ? `${window.location.origin}/review-verify?id=${result.reviewId}&code=${result.code}`
    : '';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Bewertung abgeben</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                aria-describedby="name-error"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                aria-describedby="email-error"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titel (optional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Kurzer Titel für Ihre Bewertung"
            />
          </div>

          <div className="space-y-3">
            <Label>Bewertung *</Label>
            <RadioGroup
              value={formData.rating}
              onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
              className="flex space-x-4"
              aria-required="true"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={rating.toString()} 
                    id={`rating-${rating}`}
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <Label 
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {rating} Stern{rating !== 1 ? 'e' : ''}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Bewertungstext *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              required
              rows={4}
              placeholder="Beschreiben Sie Ihre Erfahrung mit dem Service..."
              aria-describedby="body-error"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="service-used"
                checked={formData.serviceUsed}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, serviceUsed: !!checked }))}
                className="mt-1 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-describedby="service-used-error"
              />
              <Label htmlFor="service-used" className="text-sm leading-5 cursor-pointer">
                Ich bestätige, dass ich diesen Service genutzt habe *
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agree-publication"
                checked={formData.agreePublication}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreePublication: !!checked }))}
                className="mt-1 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-describedby="publication-error"
              />
              <Label htmlFor="agree-publication" className="text-sm leading-5 cursor-pointer">
                Ich stimme der Veröffentlichung meiner Bewertung zu *
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isSubmitting ? 'Bewertung wird erstellt...' : 'Bewertung abgeben'}
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
                  <div className="space-y-2">
                    <p className="font-medium">✅ Bewertung erfolgreich erstellt!</p>
                    <p>Ihr Verifizierungscode: <strong>{result.code}</strong></p>
                    <p>
                      Klicken Sie auf diesen Link zur Verifizierung:{' '}
                      <a 
                        href={verificationUrl}
                        className="text-blue-600 hover:text-blue-800 underline focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Bewertung verifizieren
                      </a>
                    </p>
                  </div>
                ) : (
                  <p>❌ Fehler: {result.error}</p>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};