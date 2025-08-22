import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';
import { supabase } from '@/integrations/supabase/client';
import { ConsentCheckbox } from '@/components/ConsentCheckbox';

interface WizardData {
  projectType: string;
  complexity: string;
  timeline: string;
  features: string[];
}

interface CalculatorContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorData: WizardData;
  estimatedPrice: { min: number; max: number };
  language: 'en' | 'ru';
}

export const CalculatorContactForm = ({ 
  isOpen, 
  onClose, 
  calculatorData, 
  estimatedPrice, 
  language 
}: CalculatorContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');

  const texts = {
    ru: {
      title: 'Получить точную стоимость',
      subtitle: 'Оставьте контакты и мы пришлем детальное предложение',
      name: 'Имя',
      phone: 'Телефон',
      company: 'Компания',
      description: 'Дополнительные пожелания',
      submit: 'Отправить заявку',
      submitting: 'Отправка...',
      close: 'Закрыть',
      success: 'Заявка отправлена!',
      successDescription: 'Мы свяжемся с вами в течение часа',
      error: 'Ошибка отправки',
      validation: {
        name: 'Введите имя',
        phone: 'Введите корректный телефон'
      }
    },
    en: {
      title: 'Get Exact Quote',
      subtitle: 'Leave your contacts and we\'ll send detailed proposal',
      name: 'Name',
      phone: 'Phone',
      company: 'Company',
      description: 'Additional requirements',
      submit: 'Send Request',
      submitting: 'Sending...',
      close: 'Close',
      success: 'Request sent!',
      successDescription: 'We\'ll contact you within an hour',
      error: 'Sending error',
      validation: {
        name: 'Enter name',
        phone: 'Enter valid phone'
      }
    }
  };

  const t = texts[language];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const validatePhone = (phone: string) => {
    // Убираем все пробелы, скобки и тире для проверки
    const cleanPhone = phone.replace(/[\s\(\)\-]/g, '');
    const phoneRegex = language === 'ru' ? /^(\+7|8)\d{10}$/ : /^(\+1)?\d{10}$/;
    console.log('Валидация телефона:', { phone, cleanPhone, isValid: phoneRegex.test(cleanPhone) });
    return phoneRegex.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t.validation.name);
      return;
    }
    
    console.log('Проверка телефона:', formData.phone);
    if (!validatePhone(formData.phone)) {
      console.log('Телефон не прошел валидацию');
      toast.error(t.validation.phone);
      return;
    }

    if (!consentChecked) {
      setConsentError('consent');
      return;
    }

    setConsentError('');
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'calculator',
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          description: formData.description,
          consent: true,
          calculatorData: {
            ...calculatorData,
            estimatedPrice
          }
        }
      });

      if (error) throw error;
      
      // Отправляем цель в Яндекс.Метрику
      if (typeof window !== 'undefined' && window.ym) {
        window.ym(103775554, 'reachGoal', 'message_sent_successfully');
      }
      
      toast.success(t.success, {
        description: t.successDescription,
      });
      
      setFormData({ name: '', phone: '', company: '', description: '' });
      setConsentChecked(false);
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-background rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{t.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-6">
                {t.subtitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.name} *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.phone} *
                  </label>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    maskChar="_"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    children={(inputProps: any) => (
                      <Input
                        {...inputProps}
                        type="tel"
                        required
                        placeholder={t.phone}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.company}
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t.company}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.description}
                  </label>
                  <Textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t.description}
                  />
                 </div>

                 <ConsentCheckbox
                   isChecked={consentChecked}
                   onChange={(checked) => {
                     setConsentChecked(checked);
                     if (checked) setConsentError('');
                   }}
                   language={language}
                   error={consentError}
                 />

                 <div className="flex gap-3 pt-4">
                   <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     className="flex-1"
                   >
                     {t.close}
                   </Button>
                   <Button
                     type="submit"
                     disabled={isSubmitting || !consentChecked}
                     className="flex-1"
                   >
                     {isSubmitting ? t.submitting : t.submit}
                   </Button>
                 </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};