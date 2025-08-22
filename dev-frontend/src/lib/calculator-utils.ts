/**
 * calculator-utils.ts
 * Utility functions for price calculation logic.
 * Contains dummy price calculation that returns min/max range based on selections.
 */

interface WizardData {
  projectType: string;
  complexity: string;
  timeline: string;
  features: string[];
}

interface PriceRange {
  min: number;
  max: number;
}

export function getPriceRange(data: WizardData): PriceRange {
  let baseMin = 0;
  let baseMax = 0;
  
  // Base price by project type
  switch (data.projectType) {
    case 'website':
      baseMin = 80000;
      baseMax = 150000;
      break;
    case 'webapp':
      baseMin = 200000;
      baseMax = 400000;
      break;
    case 'mobileapp':
      baseMin = 300000;
      baseMax = 600000;
      break;
    case 'chatbot':
      baseMin = 100000;
      baseMax = 200000;
      break;
    case 'ecommerce':
      baseMin = 250000;
      baseMax = 500000;
      break;
    default:
      baseMin = 100000;
      baseMax = 200000;
  }

  // Complexity multipliers
  const complexityMultipliers = {
    simple: { min: 0.8, max: 1.0 },
    medium: { min: 1.2, max: 1.5 },
    complex: { min: 2.0, max: 2.8 }
  };

  const complexityMult = complexityMultipliers[data.complexity as keyof typeof complexityMultipliers] || { min: 1, max: 1 };
  baseMin *= complexityMult.min;
  baseMax *= complexityMult.max;

  // Timeline multipliers
  const timelineMultipliers = {
    urgent: { min: 1.6, max: 2.0 },
    normal: { min: 1.0, max: 1.0 },
    flexible: { min: 0.7, max: 0.9 }
  };

  const timelineMult = timelineMultipliers[data.timeline as keyof typeof timelineMultipliers] || { min: 1, max: 1 };
  baseMin *= timelineMult.min;
  baseMax *= timelineMult.max;

  // Additional features (add fixed amounts)
  const featurePrices = {
    content: { min: 25000, max: 50000 },
    seo: { min: 15000, max: 30000 },
    support: { min: 20000, max: 35000 },
    hosting: { min: 10000, max: 20000 }
  };

  data.features.forEach(featureId => {
    const featurePrice = featurePrices[featureId as keyof typeof featurePrices];
    if (featurePrice) {
      baseMin += featurePrice.min;
      baseMax += featurePrice.max;
    }
  });

  return {
    min: Math.round(baseMin),
    max: Math.round(baseMax)
  };
}