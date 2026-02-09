import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Timer, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { Event } from "@/types/events";
import {
  formatEventDate,
  formatEventTime,
  formatDeadline,
  isRegistrationOpen,
  getDaysUntilDeadline,
  getLocalizedContent,
} from "@/lib/eventUtils";

interface EventInfoCardsProps {
  event: Event;
}

export function EventInfoCards({ event }: EventInfoCardsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const venueName = getLocalizedContent(event.venue.name, locale);
  const registrationOpen = isRegistrationOpen(event);
  const daysUntilDeadline = event.registrationDeadline
    ? getDaysUntilDeadline(event.registrationDeadline)
    : null;

  const cards = [
    {
      icon: Calendar,
      title: t("events.info.dateTime"),
      primary: formatEventDate(event.date, locale),
      secondary: formatEventTime(event.startTime, event.endTime, locale),
    },
    {
      icon: MapPin,
      title: t("events.info.venue"),
      primary: venueName,
      secondary: `${event.venue.address}, ${event.venue.city}`,
      action: event.venue.googleMapsUrl
        ? {
            label: t("events.info.getDirections"),
            url: event.venue.googleMapsUrl,
          }
        : undefined,
    },
    ...(event.registrationDeadline
      ? [
          {
            icon: Timer,
            title: t("events.detail.registrationDeadline"),
            primary: formatDeadline(event.registrationDeadline, locale),
            secondary: registrationOpen
              ? daysUntilDeadline !== null && daysUntilDeadline > 0
                ? locale === "vi"
                  ? `Còn ${daysUntilDeadline} ngày`
                  : `${daysUntilDeadline} days left`
                : daysUntilDeadline === 0
                  ? locale === "vi"
                    ? "Hôm nay là hạn cuối"
                    : "Last day to register"
                  : ""
              : t("events.detail.registrationClosed"),
            highlight: !registrationOpen,
          },
        ]
      : []),
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className={`h-full ${card.highlight ? "border-red-200 bg-red-50/50" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    card.highlight ? "bg-red-100" : "bg-secondary/10"
                  }`}
                >
                  <card.icon
                    className={`w-5 h-5 ${card.highlight ? "text-red-600" : "text-secondary"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                  <p
                    className={`font-semibold ${
                      card.highlight ? "text-red-600" : "text-foreground"
                    }`}
                  >
                    {card.primary}
                  </p>
                  {card.secondary && (
                    <p className="text-sm text-muted-foreground mt-1">{card.secondary}</p>
                  )}
                  {card.action && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-2 text-secondary"
                      asChild
                    >
                      <a href={card.action.url} target="_blank" rel="noopener noreferrer">
                        {card.action.label}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
