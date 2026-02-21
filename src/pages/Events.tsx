import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { EventTypeBadge } from "@/components/events";
import {
  getLocalizedContent,
  formatEventDate,
  formatEventTime,
  calculateEventStatus,
  stripHtmlTags,
} from "@/lib/eventUtils";
import type { Event, EventType, EventStatus } from "@/types/events";

function EventsPageSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-40 rounded-2xl" />
      ))}
    </div>
  );
}

interface EventCardProps {
  event: Event & { computedStatus: EventStatus };
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const title = getLocalizedContent(event.title, locale);
  const description = getLocalizedContent(event.description, locale);
  const venueName = getLocalizedContent(event.venue.name, locale);
  const status = event.computedStatus;

  return (
    <motion.div
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
};

const Events = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events from Convex
  const convexEvents = useQuery(api.events.listEvents, {});

  // Transform Convex events to our display format
  const events = convexEvents?.map((event) => ({
    ...event,
    computedStatus: calculateEventStatus(event as unknown as Event),
  })) as (Event & { computedStatus: EventStatus })[] | undefined;

  // Filter events based on search query
  const filteredEvents = events?.filter((event) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    const locale = i18n.language;
    const title = getLocalizedContent(event.title, locale).toLowerCase();
    const description = getLocalizedContent(event.description, locale).toLowerCase();
    const venueName = getLocalizedContent(event.venue.name, locale).toLowerCase();

    return (
      title.includes(lowerQuery) ||
      description.includes(lowerQuery) ||
      venueName.includes(lowerQuery)
    );
  });

  // Separate events into upcoming and past
  const upcomingEvents = filteredEvents
    ?.filter((event) => event.computedStatus === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = filteredEvents
    ?.filter((event) => event.computedStatus === "past")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 space-y-8">

          <Tabs defaultValue="overview" className="w-full space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("events.searchPlaceholder")}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <TabsList>
                <TabsTrigger value="overview">{t("events.overview")}</TabsTrigger>
                <TabsTrigger value="upcoming">{t("events.upcoming")}</TabsTrigger>
                <TabsTrigger value="past">{t("events.past")}</TabsTrigger>
              </TabsList>
            </div>

            {/* Loading state */}
            {convexEvents === undefined ? (
              <EventsPageSkeleton />
            ) : (
              <>
                <TabsContent value="overview" className="space-y-16">
                  {/* Upcoming Events Section */}
                  {upcomingEvents && upcomingEvents.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-secondary rounded-full"></span>
                        {t("events.upcoming")}
                      </h2>
                      <div className="space-y-6">
                        {upcomingEvents.map((event, index) => (
                          <EventCard key={`overview-up-${event._id}`} event={event} index={index} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Events Section */}
                  {pastEvents && pastEvents.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-muted-foreground rounded-full"></span>
                        {t("events.past")}
                      </h2>
                      <div className="space-y-6">
                        {pastEvents.map((event, index) => (
                          <EventCard key={`overview-past-${event._id}`} event={event} index={index} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Events Found */}
                  {(!upcomingEvents || upcomingEvents.length === 0) && (!pastEvents || pastEvents.length === 0) && (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                      <p className="text-muted-foreground">{t("events.noEvents")}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                      <span className="w-2 h-8 bg-secondary rounded-full"></span>
                      {t("events.upcoming")}
                    </h2>

                    {upcomingEvents && upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => (
                        <EventCard
                          key={`tab-up-${event._id}`}
                          event={event}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                        <p className="text-muted-foreground">
                          {t("events.noUpcomingEvents")}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>


                <TabsContent value="past">
                  {pastEvents && pastEvents.length > 0 ? (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-secondary rounded-full"></span>
                        {t("events.past")}
                      </h2>
                      {pastEvents.map((event, index) => (
                        <EventCard key={`tab-past-${event._id}`} event={event} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                      <p className="text-muted-foreground">{t("events.noPastEvents")}</p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Events;