import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface GDPRConsentCheckboxesProps {
  isDataProcessingAccepted: boolean;
  setIsDataProcessingAccepted: (value: boolean) => void;
  isSpecialCategoriesAccepted: boolean;
  setIsSpecialCategoriesAccepted: (value: boolean) => void;
  showSpecialCategories?: boolean;
}

export const GDPRConsentCheckboxes: React.FC<GDPRConsentCheckboxesProps> = ({
  isDataProcessingAccepted,
  setIsDataProcessingAccepted,
  isSpecialCategoriesAccepted,
  setIsSpecialCategoriesAccepted,
  showSpecialCategories = false
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <h3 className="font-medium text-gray-900">
            Datenschutz und Einwilligungen
          </h3>
          
          {/* Required Data Processing Consent */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="data-processing-consent"
              checked={isDataProcessingAccepted}
              onCheckedChange={setIsDataProcessingAccepted}
              required
              aria-describedby="data-processing-description"
            />
            <div className="space-y-1">
              <Label 
                htmlFor="data-processing-consent"
                className="text-sm font-medium leading-5 cursor-pointer"
              >
                Ich habe die <a 
                  href="/datenschutz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Datenschutzerklärung
                  <ExternalLink className="w-3 h-3" />
                </a> gelesen und stimme der Verarbeitung meiner Daten zu. <span className="text-red-500">*</span>
              </Label>
              <p 
                id="data-processing-description"
                className="text-xs text-gray-600"
              >
                Diese Einwilligung ist erforderlich, um deine Anfrage bearbeiten zu können.
              </p>
            </div>
          </div>

          {/* Optional Special Categories Consent */}
          {showSpecialCategories && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="special-categories-consent"
                checked={isSpecialCategoriesAccepted}
                onCheckedChange={setIsSpecialCategoriesAccepted}
                aria-describedby="special-categories-description"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor="special-categories-consent"
                  className="text-sm font-medium leading-5 cursor-pointer"
                >
                  Ich erlaube die Verarbeitung besonderer Kategorien (z. B. Gesundheitsdaten), 
                  falls ich solche Angaben freiwillig gemacht habe.
                </Label>
                <p 
                  id="special-categories-description"
                  className="text-xs text-gray-600"
                >
                  Optional: Nur erforderlich, wenn du Gesundheitsdaten oder andere besondere 
                  Kategorien personenbezogener Daten übermittelst.
                </p>
              </div>
            </div>
          )}

          {/* Legal Notice */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Deine Rechte:</strong> Du kannst deine Einwilligung jederzeit widerrufen, 
              Auskunft über deine Daten verlangen oder deren Löschung beantragen.
            </p>
            <p>
              <strong>Auftragsverarbeiter:</strong> Supabase (EU-Region) für Datenspeicherung, 
              Resend für E-Mail-Versand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};