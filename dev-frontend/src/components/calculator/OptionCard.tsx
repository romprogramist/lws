/**
 * OptionCard.tsx
 * Reusable card component for wizard options with tooltips and accessibility features.
 * Supports both radio-style selection and checkbox-style multi-selection.
 */

import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptionCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  tooltip: string;
  selected: boolean;
  onClick: () => void;
  checkbox?: boolean;
}

export function OptionCard({ 
  title, 
  subtitle, 
  icon, 
  tooltip, 
  selected, 
  onClick, 
  checkbox = false 
}: OptionCardProps) {
  const isMobile = useIsMobile();
  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "p-3 sm:p-4 cursor-pointer border-2 transition-all duration-200 hover:shadow-md group",
          selected 
            ? "border-primary bg-primary/5 shadow-md" 
            : "border-border hover:border-primary/50"
        )}
        onClick={onClick}
        role={checkbox ? "checkbox" : "radio"}
        aria-checked={selected}
        aria-label={`${title}${subtitle ? ` ${subtitle}` : ''}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 sm:gap-3 flex-1">
            {icon && (
              <span 
                className="text-xl sm:text-2xl flex-shrink-0" 
                role="img" 
                aria-label={title}
              >
                {icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-sm sm:text-base leading-tight",
                selected ? "text-primary" : "text-foreground"
              )}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 flex-shrink-0">
            {/* Selection indicator */}
            {checkbox ? (
              <div className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors",
                selected 
                  ? "bg-primary border-primary" 
                  : "border-border group-hover:border-primary/50"
              )}>
                {selected && <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />}
              </div>
            ) : (
              <div className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-colors",
                selected 
                  ? "bg-primary border-primary" 
                  : "border-border group-hover:border-primary/50"
              )}>
                {selected && (
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            )}

            {/* Help Icon - Tooltip for desktop, Popover for mobile */}
            {isMobile ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Справка: ${tooltip}`}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  className="w-80 text-sm p-3"
                  sideOffset={5}
                >
                  <p>{tooltip}</p>
                </PopoverContent>
              </Popover>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Справка: ${tooltip}`}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="max-w-xs text-sm"
                  sideOffset={5}
                >
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}