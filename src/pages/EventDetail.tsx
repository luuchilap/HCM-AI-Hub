import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { fetchEventBySlug } from "@/lib/api";
import {
  EventHero,
  EventInfoCards,
  EventAgenda,
  RegistrationForm,
  ShareButtons,
  QRCodeDisplay,
} from "@/components/events";
import type { Event } from "@/types/events";

function EventDetailSkeleton() {
  return (
    <Layout>
      {/* Hero skeleton */}
      <section className="py-20 lg:py-28 bg-hero">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [event, setEvent] = useState<any | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchEventBySlug(slug)
      .then((data) => setEvent(data))
      .catch(() => setNotFound(true));
  }, [slug]);

  // Loading state
  if (event === undefined && !notFound) {
    return <EventDetailSkeleton />;
  }

  // Not found
  if (notFound || event === null) {
    return <Navigate to="/events" replace />;
  }

  // Cast to our Event type
  const eventData = event as unknown as Event;

  return (
    <Layout>
      {/* Hero Section */}
      <EventHero event={eventData} />

      {/* Banner/Poster Image */}
      {eventData.bannerImage && (
        <section className="bg-muted py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <img
                src={eventData.bannerImage}
                alt={eventData.title?.vi || eventData.title?.en || "Event poster"}
                className="w-full rounded-2xl shadow-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Info Cards */}
          <div className="mb-12">
            <EventInfoCards event={eventData} />
          </div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Agenda */}
            <div className="lg:col-span-2">
              <EventAgenda agenda={eventData.agenda} />
            </div>

            {/* Right column - Registration & Share */}
            <div className="space-y-6">
              {/* Registration Form */}
              <RegistrationForm event={eventData} />

              {/* Share buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-xl p-5 border border-border"
              >
                <ShareButtons event={eventData} />
              </motion.div>

              {/* QR Code if available */}
              {eventData.qrCodeUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card rounded-xl p-5 border border-border"
                >
                  <QRCodeDisplay qrCodeUrl={eventData.qrCodeUrl} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
