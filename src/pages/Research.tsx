import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, Filter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Research = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { key: "All", label: t("research.categories.all") },
    { key: "Industry Report", label: t("research.categories.industryReport") },
    { key: "Policy Brief", label: t("research.categories.policyBrief") },
    { key: "Technical Guide", label: t("research.categories.technicalGuide") },
    { key: "White Paper", label: t("research.categories.whitePaper") },
    { key: "Case Study", label: t("research.categories.caseStudy") },
    { key: "Research Paper", label: t("research.categories.researchPaper") },
  ];

  const reports = [
    { id: 1, titleKey: "research.report1.title", descKey: "research.report1.description", category: "Industry Report", categoryKey: "research.categories.industryReport", date: "December 2024", downloads: 1250, authors: ["VNU-HCM University of Science", "TMA Tech Group"] },
    { id: 2, titleKey: "research.report2.title", descKey: "research.report2.description", category: "Policy Brief", categoryKey: "research.categories.policyBrief", date: "November 2024", downloads: 890, authors: ["VNU-HCM University of IT", "VNG"] },
    { id: 3, titleKey: "research.report3.title", descKey: "research.report3.description", category: "Technical Guide", categoryKey: "research.categories.technicalGuide", date: "October 2024", downloads: 2100, authors: ["VNU-HCM University of Technology", "Sao Bac Dau Technologies"] },
    { id: 4, titleKey: "research.report4.title", descKey: "research.report4.description", category: "White Paper", categoryKey: "research.categories.whitePaper", date: "September 2024", downloads: 670, authors: ["AI Network Consortium"] },
    { id: 5, titleKey: "research.report5.title", descKey: "research.report5.description", category: "Case Study", categoryKey: "research.categories.caseStudy", date: "August 2024", downloads: 540, authors: ["VNU-HCM University of Technology", "TMA Tech Group"] },
    { id: 6, titleKey: "research.report6.title", descKey: "research.report6.description", category: "Research Paper", categoryKey: "research.categories.researchPaper", date: "July 2024", downloads: 980, authors: ["VNU-HCM University of Science"] },
  ];

  const filteredReports = reports.filter((report) => selectedCategory === "All" || report.category === selectedCategory);

  return (
    <Layout>
      <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(185 70% 50%) 1px, transparent 0)`, backgroundSize: '40px 40px' }} /></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">{t("research.publicationsBadge")}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">{t("research.pageTitle")}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">{t("research.pageDescription")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (<Button key={category.key} variant={selectedCategory === category.key ? "default" : "ghost"} size="sm" onClick={() => setSelectedCategory(category.key)}>{category.label}</Button>))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <motion.div key={report.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-7 h-7 text-primary" /></div>
                  <div><span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">{t(report.categoryKey)}</span><p className="text-xs text-muted-foreground mt-1">{report.date}</p></div>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">{t(report.titleKey)}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-1">{t(report.descKey)}</p>
                <div className="text-xs text-muted-foreground mb-4">{t("research.by")}: {report.authors.join(", ")}</div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><TrendingUp className="w-4 h-4" /><span>{report.downloads.toLocaleString()} {t("research.downloads")}</span></div>
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary/10"><Download className="w-4 h-4 mr-1" />{t("research.download")}</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Research;
