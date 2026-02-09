import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { EventTypeBadge } from "./EventTypeBadge";
import type { Event } from "@/types/events";
import { getLocalizedContent } from "@/lib/eventUtils";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const title = getLocalizedContent(event.title, locale);
  const subtitle = getLocalizedContent(event.subtitle, locale);
  const targetAudience = getLocalizedContent(event.targetAudience, locale);

  return (
    <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(185 70% 50%) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10">
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("events.detail.backToEvents")}
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          {/* Event type badge */}
          <div className="mb-6">
            <EventTypeBadge type={event.type} size="lg" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            {title}
          </h1>

          {/* Subtitle - render as HTML since it may contain rich text */}
          {subtitle && (
            <div
              className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-6 prose prose-invert prose-p:my-0"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* Target audience - render as HTML since it may contain rich text */}
          {targetAudience && (
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Users className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary-foreground/70 mb-1">
                  {t("events.targetAudience.title")}
                </p>
                <div
                  className="text-primary-foreground prose prose-invert prose-p:my-0"
                  dangerouslySetInnerHTML={{ __html: targetAudience }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
