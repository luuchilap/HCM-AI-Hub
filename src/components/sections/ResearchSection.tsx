import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ResearchSection = () => {
  const { t } = useTranslation();

  const reports = [
    {
      id: 1,
      titleKey: "research.report1.title",
      descKey: "research.report1.description",
      categoryKey: "research.categories.industryReport",
      date: "December 2024",
      downloads: 1250,
    },
    {
      id: 2,
      titleKey: "research.report2.title",
      descKey: "research.report2.description",
      categoryKey: "research.categories.policyBrief",
      date: "November 2024",
      downloads: 890,
    },
    {
      id: 3,
      titleKey: "research.report3.title",
      descKey: "research.report3.description",
      categoryKey: "research.categories.technicalGuide",
      date: "October 2024",
      downloads: 2100,
    },
    {
      id: 4,
      titleKey: "research.report4.title",
      descKey: "research.report4.description",
      categoryKey: "research.categories.whitePaper",
      date: "September 2024",
      downloads: 670,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              {t("research.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
              {t("research.title")}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button variant="outline" asChild>
              <Link to="/research">
                {t("research.viewAll")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      {t(report.categoryKey)}
                    </span>
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2 truncate">
                    {t(report.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {t(report.descKey)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>{report.downloads.toLocaleString()} {t("research.downloads")}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      <Download className="w-4 h-4 mr-1" />
                      {t("research.download")}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
