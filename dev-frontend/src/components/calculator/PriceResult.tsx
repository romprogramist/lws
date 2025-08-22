/**
 * PriceResult.tsx
 * Displays estimated price range and example cases after wizard completion.
 * Shows price breakdown and comparable real-world examples.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPriceRange } from '@/lib/calculator-utils';
import { CalculatorContactForm } from './CalculatorContactForm';
import { useState } from 'react';

interface WizardData {
  projectType: string;
  complexity: string;
  timeline: string;
  features: string[];
}

interface PriceResultProps {
  projectData: WizardData;
  language: 'en' | 'ru';
}

export function PriceResult({ projectData, language }: PriceResultProps) {
  const priceRange = getPriceRange(projectData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const texts = {
    ru: {
      title: 'Приблизительная стоимость',
      included: 'включено: дизайн, верстка, тестирование, 1 мес. поддержки',
      getQuote: 'Узнать стоимость',
      examples: 'Примеры проектов',
      exampleCases: [
        {
          type: 'Корпоративный сайт',
          timeline: '3 недели',
          budget: '180 000 ₽',
          description: 'Многостраничный сайт с админ-панелью'
        },
        {
          type: 'Мобильное приложение',
          timeline: '2 месяца',
          budget: '450 000 ₽',
          description: 'iOS/Android приложение с push-уведомлениями'
        },
        {
          type: 'Интернет-магазин',
          timeline: '6 недель',
          budget: '320 000 ₽',
          description: 'Каталог + корзина + платежи'
        }
      ]
    },
    en: {
      title: 'Estimated Cost',
      included: 'includes: design, development, testing, 1 month support',
      getQuote: 'Get Quote',
      examples: 'Project Examples',
      exampleCases: [
        {
          type: 'Corporate Website',
          timeline: '3 weeks',
          budget: '$2,400',
          description: 'Multi-page website with admin panel'
        },
        {
          type: 'Mobile Application',
          timeline: '2 months',
          budget: '$6,000',
          description: 'iOS/Android app with push notifications'
        },
        {
          type: 'E-commerce Store',
          timeline: '6 weeks',
          budget: '$4,300',
          description: 'Catalog + cart + payment system'
        }
      ]
    }
  };

  const t = texts[language];

  return (
    <div className="space-y-8">
      {/* Price Range */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="text-center">
          <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t.title}:</h4>
          <div className="text-2xl sm:text-4xl font-bold text-primary mb-2">
            {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()} ₽
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            ({t.included})
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto"
            size="lg"
          >
            {t.getQuote}
          </Button>
        </div>
      </Card>

      {/* Example Cases */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">{t.examples}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {t.exampleCases.map((example, index) => (
            <Card key={index} className="p-3 sm:p-4">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-xs sm:text-sm">{example.type}</h5>
                  <Badge variant="secondary" className="text-xs">
                    {example.timeline}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {example.description}
                </p>
                <div className="text-sm sm:text-lg font-bold text-primary">
                  {example.budget}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Calculator Contact Form */}
      <CalculatorContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        calculatorData={projectData}
        estimatedPrice={priceRange}
        language={language}
      />
    </div>
  );
}