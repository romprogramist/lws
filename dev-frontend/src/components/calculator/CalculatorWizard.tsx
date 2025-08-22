/**
 * CalculatorWizard.tsx
 * Main wizard component that guides users through 4 steps to estimate project cost.
 * Replaces the flat form with an intuitive step-by-step interface.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StepLayout } from './StepLayout';
import { OptionCard } from './OptionCard';
import { PriceResult } from './PriceResult';
import { getPriceRange } from '@/lib/calculator-utils';
import { useCalculatorModal } from '@/hooks/useCalculatorModal';

interface WizardData {
  projectType: string;
  complexity: string;
  timeline: string;
  features: string[];
}

interface CalculatorWizardProps {
  language: 'en' | 'ru';
}

export function CalculatorWizard({ language }: CalculatorWizardProps) {
  const { openModal } = useCalculatorModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    projectType: '',
    complexity: '',
    timeline: '',
    features: []
  });

  const texts = {
    ru: {
      title: 'Калькулятор стоимости',
      subtitle: 'Узнайте примерную стоимость вашего проекта за 4 простых шага',
      steps: [
        'Тип проекта',
        'Объём функционала', 
        'Срок запуска',
        'Доп. опции'
      ],
      stepsMobile: [
        'Тип',
        'Функционал',
        'Сроки', 
        'Опции'
      ],
      projectTypes: [
        {
          id: 'website',
          title: 'Сайт-визитка / корпоративный сайт',
          icon: '🖥️',
          tooltip: 'Простой информационный сайт с презентацией услуг'
        },
        {
          id: 'webapp',
          title: 'Онлайн-сервис (личный кабинет, SaaS)',
          icon: '⚡',
          tooltip: 'Веб-приложение с пользовательскими аккаунтами и функционалом'
        },
        {
          id: 'mobileapp',
          title: 'Приложение для iOS/Android',
          icon: '📱',
          tooltip: 'Нативное или кроссплатформенное мобильное приложение'
        },
        {
          id: 'chatbot',
          title: 'Чат-бот (Telegram / WhatsApp)',
          icon: '🤖',
          tooltip: 'Автоматизированный бот для общения с клиентами'
        },
        {
          id: 'ecommerce',
          title: 'Онлайн-магазин (каталог + корзина)',
          icon: '🛒',
          tooltip: 'Полноценный интернет-магазин с оплатой и доставкой'
        }
      ],
      complexities: [
        {
          id: 'simple',
          title: 'Простой',
          icon: '🟢',
          tooltip: 'Базовый функционал, стандартный дизайн'
        },
        {
          id: 'medium',
          title: 'Средний',
          icon: '🟡',
          tooltip: 'Расширенный функционал, кастомный дизайн'
        },
        {
          id: 'complex',
          title: 'Сложный',
          icon: '🔴',
          tooltip: 'Сложная логика, интеграции, уникальные решения'
        }
      ],
      timelines: [
        {
          id: 'urgent',
          title: 'Срочно',
          subtitle: 'до 1 месяца',
          icon: '⚡',
          tooltip: 'Ускоренная разработка с приоритетом'
        },
        {
          id: 'normal',
          title: 'Обычно',
          subtitle: '1-3 месяца',
          icon: '📅',
          tooltip: 'Стандартные сроки разработки'
        },
        {
          id: 'flexible',
          title: 'Гибко',
          subtitle: '3+ месяца',
          icon: '🕒',
          tooltip: 'Поэтапная разработка без спешки'
        }
      ],
      extraFeatures: [
        {
          id: 'content',
          title: 'Наполнение контентом',
          tooltip: 'Создание и размещение текстов, изображений'
        },
        {
          id: 'seo',
          title: 'Базовое SEO',
          tooltip: 'Настройка для поисковых систем'
        },
        {
          id: 'support',
          title: 'Техподдержка 3 мес.',
          tooltip: 'Исправление ошибок и консультации'
        },
        {
          id: 'hosting',
          title: 'Облачный хостинг',
          tooltip: 'Размещение на надежном сервере'
        }
      ],
      buttons: {
        back: 'Назад',
        next: 'Далее',
        finish: 'Узнать стоимость'
      }
    },
    en: {
      title: 'Cost Calculator',
      subtitle: 'Get an estimated cost for your project in 4 simple steps',
      steps: [
        'Project Type',
        'Complexity',
        'Timeline',
        'Extra Options'
      ],
      stepsMobile: [
        'Type',
        'Level',
        'Time',
        'Extras'
      ],
      projectTypes: [
        {
          id: 'website',
          title: 'Business Website / Corporate Site',
          icon: '🖥️',
          tooltip: 'Simple informational website showcasing services'
        },
        {
          id: 'webapp',
          title: 'Online Service (Dashboard, SaaS)',
          icon: '⚡',
          tooltip: 'Web application with user accounts and functionality'
        },
        {
          id: 'mobileapp',
          title: 'iOS/Android Application',
          icon: '📱',
          tooltip: 'Native or cross-platform mobile application'
        },
        {
          id: 'chatbot',
          title: 'Chatbot (Telegram / WhatsApp)',
          icon: '🤖',
          tooltip: 'Automated bot for customer communication'
        },
        {
          id: 'ecommerce',
          title: 'Online Store (Catalog + Cart)',
          icon: '🛒',
          tooltip: 'Full-featured e-commerce with payment and shipping'
        }
      ],
      complexities: [
        {
          id: 'simple',
          title: 'Simple',
          icon: '🟢',
          tooltip: 'Basic functionality, standard design'
        },
        {
          id: 'medium',
          title: 'Medium',
          icon: '🟡',
          tooltip: 'Extended functionality, custom design'
        },
        {
          id: 'complex',
          title: 'Complex',
          icon: '🔴',
          tooltip: 'Complex logic, integrations, unique solutions'
        }
      ],
      timelines: [
        {
          id: 'urgent',
          title: 'Urgent',
          subtitle: 'up to 1 month',
          icon: '⚡',
          tooltip: 'Accelerated development with priority'
        },
        {
          id: 'normal',
          title: 'Normal',
          subtitle: '1-3 months',
          icon: '📅',
          tooltip: 'Standard development timeline'
        },
        {
          id: 'flexible',
          title: 'Flexible',
          subtitle: '3+ months',
          icon: '🕒',
          tooltip: 'Phased development without rush'
        }
      ],
      extraFeatures: [
        {
          id: 'content',
          title: 'Content Creation',
          tooltip: 'Creating and placing texts, images'
        },
        {
          id: 'seo',
          title: 'Basic SEO',
          tooltip: 'Search engine optimization setup'
        },
        {
          id: 'support',
          title: '3-month Support',
          tooltip: 'Bug fixes and consultations'
        },
        {
          id: 'hosting',
          title: 'Cloud Hosting',
          tooltip: 'Reliable server hosting'
        }
      ],
      buttons: {
        back: 'Back',
        next: 'Next',
        finish: 'Get Estimate'
      }
    }
  };

  const t = texts[language];
  const progress = (currentStep / 4) * 100;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      // Открываем модалку контактов на последнем шаге
      openModal();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProjectTypeSelect = (projectType: string) => {
    setWizardData(prev => ({ ...prev, projectType }));
  };

  const handleComplexitySelect = (complexity: string) => {
    setWizardData(prev => ({ ...prev, complexity }));
  };

  const handleTimelineSelect = (timeline: string) => {
    setWizardData(prev => ({ ...prev, timeline }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setWizardData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return wizardData.projectType;
      case 2: return wizardData.complexity;
      case 3: return wizardData.timeline;
      case 4: return true; // Features are optional
      default: return false;
    }
  };

  const isComplete = wizardData.projectType && wizardData.complexity && wizardData.timeline;

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            {/* Desktop version */}
            <div className="hidden sm:flex justify-between w-full">
              {t.steps.map((step, index) => (
                <span 
                  key={index}
                  className={`${currentStep > index ? 'text-primary font-medium' : ''}`}
                >
                  {step}
                </span>
              ))}
            </div>
            {/* Mobile version */}
            <div className="flex sm:hidden justify-between w-full">
              {t.stepsMobile.map((step, index) => (
                <span 
                  key={index}
                  className={`${currentStep > index ? 'text-primary font-medium' : ''}`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-center mt-2 text-sm text-muted-foreground">
            {progress.toFixed(0)}% завершено
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Project Type */}
          {currentStep === 1 && (
            <StepLayout 
              title={t.steps[0]} 
              subtitle="Выберите тип проекта, который нужно разработать"
            >
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {t.projectTypes.map((type) => (
                  <OptionCard
                    key={type.id}
                    title={type.title}
                    icon={type.icon}
                    tooltip={type.tooltip}
                    selected={wizardData.projectType === type.id}
                    onClick={() => handleProjectTypeSelect(type.id)}
                  />
                ))}
              </div>
            </StepLayout>
          )}

          {/* Step 2: Complexity */}
          {currentStep === 2 && (
            <StepLayout 
              title={t.steps[1]} 
              subtitle="Какой уровень сложности планируется?"
            >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {t.complexities.map((complexity) => (
                  <OptionCard
                    key={complexity.id}
                    title={complexity.title}
                    icon={complexity.icon}
                    tooltip={complexity.tooltip}
                    selected={wizardData.complexity === complexity.id}
                    onClick={() => handleComplexitySelect(complexity.id)}
                  />
                ))}
              </div>
            </StepLayout>
          )}

          {/* Step 3: Timeline */}
          {currentStep === 3 && (
            <StepLayout 
              title={t.steps[2]} 
              subtitle="В какие сроки нужно запустить проект?"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {t.timelines.map((timeline) => (
                  <OptionCard
                    key={timeline.id}
                    title={timeline.title}
                    subtitle={timeline.subtitle}
                    icon={timeline.icon}
                    tooltip={timeline.tooltip}
                    selected={wizardData.timeline === timeline.id}
                    onClick={() => handleTimelineSelect(timeline.id)}
                  />
                ))}
              </div>
            </StepLayout>
          )}

          {/* Step 4: Extra Features */}
          {currentStep === 4 && (
            <StepLayout 
              title={t.steps[3]} 
              subtitle="Дополнительные услуги (необязательно)"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {t.extraFeatures.map((feature) => (
                  <OptionCard
                    key={feature.id}
                    title={feature.title}
                    tooltip={feature.tooltip}
                    selected={wizardData.features.includes(feature.id)}
                    onClick={() => handleFeatureToggle(feature.id)}
                    checkbox
                  />
                ))}
              </div>

              {/* Price Result */}
              {isComplete && (
                <PriceResult 
                  projectData={wizardData} 
                  language={language}
                />
              )}
            </StepLayout>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.buttons.back}
            </Button>

            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {currentStep === 4 ? t.buttons.finish : t.buttons.next}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}