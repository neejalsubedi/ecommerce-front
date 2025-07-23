import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface CardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  cardClassName?: string;
  contentClassName?: string;
  imageClassName?: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonVariant?: "primary" | "secondary" | "outline";
  renderContent?: () => React.ReactNode;
   onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = "Card image",
  cardClassName = "",
  contentClassName = "",
  imageClassName = "h-48 object-cover w-full",
  showButton = false,
  buttonLabel = "Learn More",
  onButtonClick,
  buttonVariant = "primary",
  renderContent,
  onClick

}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-md transition hover:shadow-lg",
        cardClassName
      )}
   
    >
      {imageSrc && <img src={imageSrc} alt={imageAlt} className={imageClassName}  onClick={onClick} />}

      <div className={cn("p-4 space-y-2", contentClassName)}   >
        {renderContent ? (
          renderContent()
        ) : (
          <>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </>
        )}

        {showButton && onButtonClick && (
          <Button variant={buttonVariant} onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
