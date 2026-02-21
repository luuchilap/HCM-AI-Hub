import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/api";
import {
  calculateEventStatus,
  formatEventDate,
  formatEventTime,
  getLocalizedContent,
} from "@/lib/eventUtils";
import type { Event } from "@/types/events";
import { Skeleton } from "@/components/ui/skeleton";

export const EventsPreview = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  // Fetch events from NestJS
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => fetchEvents("upcoming"),
  });

  // Transform and filter for upcoming events
  const upcomingEvents = eventsData
    ?.map((event) => ({
      ...event,
      computedStatus: calculateEventStatus(event as unknown as Event),
    }))
    .filter((event) => event.computedStatus === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3); // Show max 3 upcoming events

  // Initial loading state or if no events found (but usually we might want to show at least something or hide section)
  // For preview sections, if there are no upcoming events, it's often better to just hide the section or show a generic message.
  // Here we'll hide it if done loading and empty.
  if (!isLoading && (!upcomingEvents || upcomingEvents.length === 0)) {
    return (
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <h2 className="text-3xl font-bold mb-4">{t("events.title")}</h2>
          <p>{t("events.noUpcomingEvents")}</p>
          <Button variant="outline" asChild className="mt-6">
            <Link to="/events">{t("events.viewAll")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              {t("events.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
              {t("events.title")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button variant="outline" asChild>
              <Link to="/events">
                {t("events.viewAll")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {isLoading
            ? [1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-card border border-border p-6 flex flex-col">
                <Skeleton className="h-6 w-24 mb-4 rounded-full" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className="space-y-3 mt-auto">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
            : upcomingEvents?.map((event, index) => {
              const title = getLocalizedContent(event.title, locale);
              const venueName = getLocalizedContent(event.venue.name, locale);

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300 flex flex-col`}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium capitalize">
                        {t(`events.${event.type}` as any) || event.type}
                      </span>
                      {event.isFeatured && (
                        <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                          {t("events.featured")}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-4 text-lg`}
                    >
                      {title}
                    </h3>

                    <div className="space-y-3 text-muted-foreground mt-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{formatEventDate(event.date, locale)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{formatEventTime(event.startTime, event.endTime, locale)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{venueName}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="mt-6 w-full justify-center group-hover:bg-secondary/10"
                      asChild
                    >
                      <Link to={`/events/${event.slug}`}>
                        {t("events.learnMore")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
};