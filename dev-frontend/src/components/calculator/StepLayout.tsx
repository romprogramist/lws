/**
 * StepLayout.tsx
 * Layout component for each wizard step with consistent styling and accessibility.
 * Provides structured heading hierarchy and spacing.
 */

import { ReactNode } from 'react';

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StepLayout({ title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      <div className="mt-6 sm:mt-8">
        {children}
      </div>
    </div>
  );
}