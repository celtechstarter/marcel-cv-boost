import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { callEdge } from '@/utils/callEdge';
import { useI18n } from '@/hooks/useI18n';

export const BookingForm = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discordName: '',
    note: '',
    startsAt: '',
    duration: '',
    privacyAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; bookingId?: string; error?: string; emailSent?: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.startsAt) {
      setResult({ success: false, error: t('messages.formRequired') });
      return;
    }
    
    if (!formData.privacyAccepted) {
      setResult({ success: false, error: t('messages.privacyRequired') });
      return;
    }

    if (!formData.duration) {
      setResult({ success: false, error: t('messages.durationRequired') });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await callEdge('/bookings/create', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          discordName: formData.discordName,
          note: formData.note,
          startsAt: formData.startsAt,
          duration: parseInt(formData.duration),
        }),
      });

      // Check if email was actually sent successfully
      const emailSent = data.emailSent !== false;
      
      setResult({ 
        success: true, 
        bookingId: data.bookingId,
        emailSent: emailSent
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        discordName: '',
        note: '',
        startsAt: '',
        duration: '',
        privacyAccepted: false,
      });
    } catch (error: any) {
      let errorMessage = t('messages.bookingError');
      
      if (error.message.includes('Keine freien Slots')) {
        errorMessage = t('messages.noSlotsError');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setResult({ 
        success: false, 
        error: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('buttons.bookAppointment')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                aria-describedby="name-error"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')} *</Label>
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
            <Label htmlFor="discordName">{t('form.discordNameOptional')}</Label>
            <Input
              id="discordName"
              value={formData.discordName}
              onChange={(e) => setFormData(prev => ({ ...prev, discordName: e.target.value }))}
              placeholder={t('form.discordPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startsAt">{t('form.datetime')} *</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(e) => setFormData(prev => ({ ...prev, startsAt: e.target.value }))}
                required
                aria-describedby="datetime-error"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t('form.duration')} *</Label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger id="duration" aria-describedby="duration-error">
                  <SelectValue placeholder={t('form.durationSelect')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">{t('form.duration30')}</SelectItem>
                  <SelectItem value="45">{t('form.duration45')}</SelectItem>
                  <SelectItem value="60">{t('form.duration60')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t('form.notes')}</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              rows={3}
              placeholder={t('form.notesPlaceholder')}
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy-accepted"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, privacyAccepted: !!checked }))}
              className="mt-1 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-describedby="privacy-error"
            />
            <Label htmlFor="privacy-accepted" className="text-sm leading-5 cursor-pointer">
              {t('form.privacyAccept')}{' '}
              <a 
                href="/datenschutz" 
                className="text-primary hover:underline focus:ring-2 focus:ring-primary focus:ring-offset-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('form.privacyLink')}
              </a>{' '}
              {t('form.privacyEnd')} *
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {isSubmitting ? t('buttons.bookingAppointment') : t('buttons.bookAppointment')}
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
                  <div>
                    <p className="font-medium">✅ {t('messages.bookingSuccess')}</p>
                    <p>{t('messages.bookingId')} <strong>{result.bookingId}</strong></p>
                    {result.emailSent ? (
                      <p>✅ {t('messages.emailSent')}</p>
                    ) : (
                      <p>⚠️ {t('messages.emailNotSent')}</p>
                    )}
                  </div>
                ) : (
                  <p>❌ {t('messages.errorPrefix')} {result.error}</p>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};