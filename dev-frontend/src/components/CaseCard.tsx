import { Card, CardContent } from "@/components/ui/card";
import { useVerticalPan } from "@/hooks/useVerticalPan";

interface CaseCardProps {
  image: string;
  alt: string;
  description: string;
  className?: string;
}

export const CaseCard = ({ image, alt, description, className }: CaseCardProps) => {
  const { containerProps, imageProps } = useVerticalPan();

  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <div 
        {...containerProps}
        style={{ height: '192px' }} // h-48 equivalent for mobile
      >
        <img 
          {...imageProps}
          src={image} 
          alt={alt}
        />
      </div>
      <CardContent className="p-4">
        <p className="text-base font-medium">{description}</p>
      </CardContent>
    </Card>
  );
};

interface DesktopCaseCardProps {
  image: string;
  alt: string;
  description: string;
  className?: string;
}

export const DesktopCaseCard = ({ image, alt, description, className }: DesktopCaseCardProps) => {
  const { containerProps, imageProps } = useVerticalPan();

  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <div 
        {...containerProps}
        style={{ height: '256px' }} // h-64 equivalent for desktop
      >
        <img 
          {...imageProps}
          src={image} 
          alt={alt}
        />
      </div>
      <CardContent className="p-6">
        <p className="text-lg font-medium">{description}</p>
      </CardContent>
    </Card>
  );
};