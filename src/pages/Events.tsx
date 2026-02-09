import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, ArrowRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "@/lib/api";
import { EventTypeBadge } from "@/components/events";
import {
  getLocalizedContent,
  formatEventDate,
  formatEventTime,
  calculateEventStatus,
  stripHtmlTags,
} from "@/lib/eventUtils";
import type { Event, EventType } from "@/types/events";

function EventsPageSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

const Events = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [events, setEvents] = useState<any[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchEvents()
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Transform and filter events
  const filteredEvents = events
    ?.map((event) => ({
      ...event,
      computedStatus: calculateEventStatus(event as unknown as Event),
    }))
    .filter((event) => {
      if (filter === "all") return true;
      return event.computedStatus === filter;
    });

  const filterOptions = [
    { key: "all", label: t("events.all") },
    { key: "upcoming", label: t("events.upcoming") },
    { key: "past", label: t("events.past") },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
              {t("events.calendarBadge")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              {t("events.pageTitle")}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">
              {t("events.pageDescription")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events List Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          {/* Filter */}
          <div className="flex items-center gap-4 mb-12">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={filter === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(option.key as "all" | "upcoming" | "past")}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && <EventsPageSkeleton />}

          {/* Empty state */}
          {!loading && filteredEvents?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("events.noEvents")}</p>
            </div>
          )}

          {/* Events list */}
          {filteredEvents && filteredEvents.length > 0 && (
            <div className="space-y-6">
              {filteredEvents.map((event, index) => {
                const title = getLocalizedContent(event.title, locale);
                const description = getLocalizedContent(event.description, locale);
                const venueName = getLocalizedContent(event.venue.name, locale);
                const status = event.computedStatus;

                return (
                  <motion.div
                    key={event._id || event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card rounded-2xl p-6 border border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <EventTypeBadge type={event.type as EventType} size="sm" />
                          {status === "upcoming" && (
                            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                              {t("events.upcoming")}
                            </span>
                          )}
                          {event.isFeatured && (
                            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                              {t("events.featured")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-semibold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                          {title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {stripHtmlTags(description)}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span>{formatEventDate(event.date, locale)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span>
                              {formatEventTime(event.startTime, event.endTime, locale)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{venueName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button
                          variant={status === "upcoming" ? "glow" : "outline"}
                          asChild
                        >
                          <Link to={`/events/${event.slug}`}>
                            {status === "upcoming"
                              ? t("events.registerNow")
                              : t("events.viewDetails")}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
