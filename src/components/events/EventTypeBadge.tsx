import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { EventType } from "@/types/events";
import { getEventTypeColor } from "@/lib/eventUtils";
import { cn } from "@/lib/utils";

interface EventTypeBadgeProps {
  type: EventType;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function EventTypeBadge({ type, className, size = "default" }: EventTypeBadgeProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        getEventTypeColor(type),
        sizeClasses[size],
        className
      )}
    >
      {t(`events.${type}`)}
    </Badge>
  );
}
