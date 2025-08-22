import { useId } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ConsentCheckboxProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  language: 'en' | 'ru';
  error?: string;
  id?: string;
}

export const ConsentCheckbox = ({ isChecked, onChange, language, error, id }: ConsentCheckboxProps) => {
  const uniqueId = useId();
  const consentId = id || uniqueId;
  const errorId = `${consentId}-error`;
  
  const texts = {
    en: {
      consent: "I agree with the ",
      privacyPolicy: "Privacy Policy",
      and: " and give consent to the processing of personal data (name, phone number)",
      required: "Please check the box to continue"
    },
    ru: {
      consent: "Я согласен(а) с ",
      privacyPolicy: "Политикой конфиденциальности",
      and: " и даю согласие на обработку персональных данных (имя, номер телефона)",
      required: "Поставьте галочку для продолжения"
    }
  };

  const t = texts[language];

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <Checkbox
          id={consentId}
          checked={isChecked}
          onCheckedChange={(checked) => onChange(checked === true)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 shrink-0"
        />
        <Label 
          htmlFor={consentId} 
          className="text-sm leading-snug cursor-pointer"
        >
          {t.consent}
          <a 
            href="/privacy-policy" 
            className="text-primary hover:underline"
            target="_self"
          >
            {t.privacyPolicy}
          </a>
          {t.and}
        </Label>
      </div>
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-destructive"
          role="alert"
        >
          {t.required}
        </p>
      )}
    </div>
  );
};