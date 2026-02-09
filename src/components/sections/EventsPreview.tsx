import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export const EventsPreview = () => {
  const { t } = useTranslation();

  const upcomingEvents = [
    {
      id: 1,
      titleKey: "events.event1.title",
      date: "January 15, 2026",
      time: "2:00 PM - 4:00 PM",
      location: "VNU-HCM University of Technology (268 Ly Thuong Kiet, Dien Hong Ward, District 10, HCMC)",
      typeKey: "events.seminar",
      featured: true,
    },
    {
      id: 2,
      titleKey: "events.event6.title",
      date: "January 15, 2026",
      time: "9:00 AM - 11:00 AM",
      location: "Bach Khoa Hall, VNU-HCM University of Technology (268 Ly Thuong Kiet, Dien Hong Ward, District 10, HCMC)",
      typeKey: "events.seminar",
      featured: false,
    },
  ];

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
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300 ${
                event.featured ? "lg:row-span-2" : ""
              }`}
            >
              <div className={`p-6 ${event.featured ? "h-full flex flex-col" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                    {t(event.typeKey)}
                  </span>
                  {event.featured && (
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      {t("events.featured")}
                    </span>
                  )}
                </div>
                
                <h3 className={`font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-4 ${
                  event.featured ? "text-2xl" : "text-lg"
                }`}>
                  {t(event.titleKey)}
                </h3>
                
                <div className={`space-y-3 text-muted-foreground ${event.featured ? "flex-1" : ""}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button variant="ghost" className="mt-6 w-full justify-center group-hover:bg-secondary/10" asChild>
                  <Link to={`/events/${event.id}`}>
                    {t("events.learnMore")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
