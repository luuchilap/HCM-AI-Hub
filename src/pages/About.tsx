import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Lightbulb, Users, FileText, Building2, UserCheck, Briefcase, Globe, ClipboardList, CheckCircle, Clock, Scale, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

const REGULATIONS_LAST_UPDATED = "2026-01-08T10:00:00";

const About = () => {
  const { t, i18n } = useTranslation();

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    };

    return (
      <Layout>
        {/* Section 1: Foundation and Assigned Mission */}
        <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-6">
                  {t("aboutIntro.foundation.title")}
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Legal Basis */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Scale className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-white mb-2">
                        {t("aboutIntro.foundation.legalBasis.title")}
                      </h3>
                      <p className="text-white/90 font-medium mb-2">
                        {t("aboutIntro.foundation.legalBasis.content")}
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {t("aboutIntro.foundation.legalBasis.subtitle")}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Mission */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-white mb-2">
                        {t("aboutIntro.foundation.mission.title")}
                      </h3>
                      <p className="text-white/90 font-medium mb-2">
                        {t("aboutIntro.foundation.mission.content")}
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {t("aboutIntro.foundation.mission.subtitle")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Vision and Operating Principles */}
        <section className="py-20 lg:py-28 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
                  {t("aboutIntro.vision.title")}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Vision */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                        {t("aboutIntro.vision.visionSection.title")}
                      </h3>
                      <ul className="space-y-2">
                        {(t("aboutIntro.vision.visionSection.items", { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary font-semibold">{index + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Operating Principles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <Compass className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                        {t("aboutIntro.vision.principles.title")}
                      </h3>
                      <ul className="space-y-2">
                        {(t("aboutIntro.vision.principles.items", { returnObjects: true }) as string[]).map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-secondary font-semibold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Chapter I: General Provisions */}
        <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                {t("regulations.mainTitle")}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-6 max-w-3xl mx-auto">
                {t("regulations.mainSubtitle")}
              </p>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-white/90 mb-4">
                {t("regulations.chapter1.title")}
              </h2>
              <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                <span>{t("regulations.lastUpdated")}: {formatLastUpdated(REGULATIONS_LAST_UPDATED)}</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Article 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter1.article1.title")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      {t("regulations.chapter1.article1.content")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Article 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter1.article2.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {t("regulations.chapter1.article2.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter1.article2.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter1.article3.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {t("regulations.chapter1.article3.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter1.article3.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter1.article4.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter1.article4.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter II: Network Organization */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {t("regulations.chapter2.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Article 5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter2.article5.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {t("regulations.chapter2.article5.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter2.article5.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 6 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter2.article6.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter2.article6.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 7 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter2.article7.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter2.article7.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 8 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter2.article8.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter2.article8.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter III: Duties and Powers */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {t("regulations.chapter3.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Article 9 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter3.article9.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter3.article9.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 10 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter3.article10.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter3.article10.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 11 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter3.article11.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter3.article11.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 12 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter3.article12.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter3.article12.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 13 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter3.article13.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter3.article13.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter IV: Operating Procedures */}
      <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                {t("regulations.chapter4.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Article 14 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter4.article14.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-justify">
                      {t("regulations.chapter4.article14.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter4.article14.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 15 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter4.article15.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {t("regulations.chapter4.article15.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter4.article15.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 16 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter4.article16.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-justify">
                      {t("regulations.chapter4.article16.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter4.article16.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 17 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter4.article17.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-justify">
                      {t("regulations.chapter4.article17.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter4.article17.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 18 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter4.article18.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-justify">
                      {t("regulations.chapter4.article18.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter4.article18.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter V: Resource Mechanism - Finance - Infrastructure */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {t("regulations.chapter5.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Article 19 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter5.article19.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter5.article19.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 20 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter5.article20.title")}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {t("regulations.chapter5.article20.intro")}
                    </p>
                    <ul className="space-y-2">
                      {(t("regulations.chapter5.article20.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter VI: Reporting - Monitoring - Evaluation */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {t("regulations.chapter6.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Article 21 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter6.article21.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter6.article21.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Article 22 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter6.article22.title")}
                    </h3>
                    <ul className="space-y-2">
                      {(t("regulations.chapter6.article22.items", { returnObjects: true }) as string[]).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapter VII: Implementation Provisions */}
      <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                {t("regulations.chapter7.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {/* Article 23 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter7.article23.title")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("regulations.chapter7.article23.content")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Article 24 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("regulations.chapter7.article24.title")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t("regulations.chapter7.article24.content")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
