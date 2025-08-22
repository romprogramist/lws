import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Send } from 'lucide-react';
import { useContactModal } from '@/hooks/useContactModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import InputMask from 'react-input-mask';
import { supabase } from '@/integrations/supabase/client';
import { ConsentCheckbox } from '@/components/ConsentCheckbox';

interface HeroContactModalProps {
  language: 'en' | 'ru';
}

export const HeroContactModal = ({ language }: HeroContactModalProps) => {
  const { isOpen, closeModal } = useContactModal();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setShowForm(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  const texts = {
    en: {
      modal: {
        title: "Get in touch with our manager",
        description: "We communicate in a simple format — without complex technical terms. A manager-guide will help understand your goals and immediately name a budget estimate.",
        contactTitle: "How to contact right now",
        phone: "+7 (936) 500-13-33",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        orText: "or",
        callbackButton: "Leave a request for a callback",
        calculatorNote: "Scroll down a bit — there's a project cost calculator. Fill it out and you'll get an almost accurate estimate. Don't worry, there's a small '?' icon next to each item for hints.",
        formTitle: "Callback request",
        backToContacts: "← Back to contacts",
        nameLabel: "Your name *",
        namePlaceholder: "John Doe",
        phoneLabel: "Phone *",
        phonePlaceholder: "+7 (936) 500-13-33",
        commentLabel: "Comment",
        commentPlaceholder: "Tell us briefly about your project...",
        submitButton: "Submit request",
        submitting: "Submitting...",
        errorTitle: "Error",
        nameError: "Enter your name",
        phoneError: "Enter a valid phone number",
        successTitle: "Thank you!",
        successMessage: "We'll call back within 15 minutes."
      }
    },
    ru: {
      modal: {
        title: "Свяжитесь с нашим менеджером",
        description: "Мы общаемся в лёгком формате — без сложных технических терминов. Менеджер-проводник поможет понять ваши цели и сразу назовёт ориентир по бюджету.",
        contactTitle: "Как связаться прямо сейчас",
        phone: "+7 (936) 500-13-33",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        orText: "или",
        callbackButton: "Оставить заявку для обратного звонка",
        calculatorNote: "Прокрутите страницу чуть ниже — там есть калькулятор примерной стоимости проекта. Заполните его и вы получите почти точную оценку. Не бойтесь, возле каждого пункта есть для подсказки маленький значок «?».",
        formTitle: "Заявка на обратный звонок",
        backToContacts: "← Назад к контактам",
        nameLabel: "Ваше имя *",
        namePlaceholder: "Иван Иванов",
        phoneLabel: "Телефон *",
        phonePlaceholder: "+7 (936) 500-13-33",
        commentLabel: "Комментарий",
        commentPlaceholder: "Расскажите кратко о вашем проекте...",
        submitButton: "Отправить заявку",
        submitting: "Отправляем...",
        errorTitle: "Ошибка",
        nameError: "Введите ваше имя",
        phoneError: "Введите корректный номер телефона",
        successTitle: "Спасибо!",
        successMessage: "Мы перезвоним в течение 15 минут."
      }
    }
  };

  const t = texts[language];

  const validatePhone = (phone: string) => {
    // Убираем все пробелы, скобки и дефисы для проверки
    const cleanPhone = phone.replace(/[\s\(\)\-]/g, '');
    const phoneRegex = language === 'ru' ? /^(\+7|8)\d{10}$/ : /^(\+1)?\d{10}$/;
    return phoneRegex.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: t.modal.errorTitle, description: t.modal.nameError, variant: 'destructive' });
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      toast({ title: t.modal.errorTitle, description: t.modal.phoneError, variant: 'destructive' });
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
          type: 'contact',
          name: formData.name,
          phone: formData.phone,
          description: formData.comment,
          consent: true
        }
      });

      if (error) throw error;
      
      // Отправляем цель в Яндекс.Метрику
      if (typeof window !== 'undefined' && window.ym) {
        window.ym(103775554, 'reachGoal', 'message_sent_successfully');
      }
      
      toast({ 
        title: t.modal.successTitle, 
        description: t.modal.successMessage,
        className: 'bg-green-50 border-green-200 text-green-800'
      });
      
      setFormData({ name: '', phone: '', comment: '' });
      setConsentChecked(false);
      setShowForm(false);
      closeModal();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({ 
        title: t.modal.errorTitle, 
        description: 'Ошибка отправки сообщения',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactButtons = [
    {
      icon: Phone,
      label: language === 'en' ? 'Call' : 'Позвонить',
      href: 'tel:+79365001333',
      text: t.modal.phone,
      className: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      icon: MessageCircle,
      label: t.modal.whatsapp,
      href: 'https://wa.me/79365001333',
      text: t.modal.whatsapp,
      className: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
    },
    {
      icon: Send,
      label: t.modal.telegram,
      href: 'https://t.me/+79365001333',
      text: t.modal.telegram,
      className: 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              layoutId="heroCta"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="Закрыть модальное окно"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="p-8 sm:p-10">
                {!showForm ? (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {t.modal.title}
                      </h2>
                      <div className="text-base leading-relaxed text-gray-600 space-y-3">
                        <p>
                          {t.modal.description}
                        </p>
                      </div>
                    </div>

                    {/* Contact Options */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        {t.modal.contactTitle}
                      </h3>
                      <div className="space-y-3">
                        {contactButtons.map((contact, index) => {
                          const IconComponent = contact.icon;
                          return (
                            <motion.a
                              key={contact.label}
                              href={contact.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:outline-none ${contact.className}`}
                              aria-label={contact.label}
                            >
                              <IconComponent className="h-5 w-5" />
                              <span className="font-medium">{contact.text}</span>
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Callback Button */}
                    <div className="mb-6">
                      <p className="text-gray-600 mb-3">{t.modal.orText}</p>
                      <Button
                        onClick={() => setShowForm(true)}
                        className="w-full"
                        size="lg"
                      >
                        {t.modal.callbackButton}
                      </Button>
                    </div>

                    {/* Calculator Note */}
                    <div className="text-sm text-gray-500 leading-relaxed">
                      <p>
                        {t.modal.calculatorNote}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Form */}
                    <div className="mb-6">
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-primary hover:text-primary/80 text-sm mb-4 flex items-center gap-2"
                      >
                        {t.modal.backToContacts}
                      </button>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {t.modal.formTitle}
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.modal.nameLabel}
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t.modal.namePlaceholder}
                          required
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.modal.phoneLabel}
                        </label>
                        <InputMask
                          mask="+7 (999) 999-99-99"
                          maskChar="_"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          children={(inputProps: any) => (
                            <Input
                              {...inputProps}
                              id="phone"
                              type="tel"
                              placeholder={t.modal.phonePlaceholder}
                              required
                              className="focus:ring-2 focus:ring-primary"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                          {t.modal.commentLabel}
                        </label>
                        <Textarea
                          id="comment"
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                          placeholder={t.modal.commentPlaceholder}
                          rows={3}
                          className="focus:ring-2 focus:ring-primary"
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

                      <Button
                        type="submit"
                        disabled={isSubmitting || !consentChecked}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? t.modal.submitting : t.modal.submitButton}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};