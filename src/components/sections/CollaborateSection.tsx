import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Target, Handshake, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CollaborateSection = () => {
  const { t } = useTranslation();

  const collaborationTypes = [
    {
      icon: Lightbulb,
      titleKey: "collaborate.submitUseCase.title",
      descKey: "collaborate.submitUseCase.description",
    },
    {
      icon: Target,
      titleKey: "collaborate.problemStatement.title",
      descKey: "collaborate.problemStatement.description",
    },
    {
      icon: Handshake,
      titleKey: "collaborate.partnership.title",
      descKey: "collaborate.partnership.description",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(185 70% 50%) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            {t("collaborate.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            {t("collaborate.title")}
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            {t("collaborate.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {collaborationTypes.map((type, index) => (
            <motion.div
              key={type.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 hover:border-secondary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <type.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-semibold text-xl text-primary-foreground mb-2">
                {t(type.titleKey)}
              </h3>
              <p className="text-primary-foreground/60 text-sm text-justify leading-relaxed">
                {t(type.descKey)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button variant="glow" size="xl" asChild>
            <Link to="/collaborate">
              {t("collaborate.startCollaborating")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
