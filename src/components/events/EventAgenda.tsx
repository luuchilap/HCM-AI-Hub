import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { AgendaItem } from "@/types/events";
import { getLocalizedContent } from "@/lib/eventUtils";

interface EventAgendaProps {
  agenda: AgendaItem[];
}

export function EventAgenda({ agenda }: EventAgendaProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  if (!agenda || agenda.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">
          {t("events.agenda.title")}
        </h2>
        <p className="text-muted-foreground">{t("events.agenda.emptyAgenda")}</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-display font-bold text-foreground mb-8"
      >
        {t("events.agenda.title")}
      </motion.h2>

      <div className="space-y-4">
        {agenda.map((item, index) => {
          const title = getLocalizedContent(item.title, locale);
          const description = getLocalizedContent(item.description, locale);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="flex gap-4">
                {/* Number indicator */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="font-display font-bold text-secondary group-hover:text-white">
                      {item.number}
                    </span>
                  </div>
                  {index < agenda.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-xl p-5 border border-border hover:border-secondary/50 hover:shadow-md transition-all">
                    {item.time && (
                      <p className="text-sm text-secondary font-medium mb-2">{item.time}</p>
                    )}
                    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                    {description && (
                      <p className="text-muted-foreground text-sm">{description}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
