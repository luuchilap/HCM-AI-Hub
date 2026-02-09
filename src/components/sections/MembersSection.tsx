import { motion } from "framer-motion";
import { GraduationCap, Building2, Cpu, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export const MembersSection = () => {
  const { t, i18n } = useTranslation();

  const members = [
    {
      nameKey: "members.vnuTech.name",
      descKey: "members.vnuTech.description",
      role: t("members.academicPartner"),
      icon: GraduationCap,
      category: "Academic",
      url: "https://hcmut.edu.vn/",
    },
    {
      nameKey: "members.vnuScience.name",
      descKey: "members.vnuScience.description",
      role: t("members.academicPartner"),
      icon: GraduationCap,
      category: "Academic",
      url: "https://hcmus.edu.vn/",
    },
    {
      nameKey: "members.vnuIT.name",
      descKey: "members.vnuIT.description",
      role: t("members.academicPartner"),
      icon: GraduationCap,
      category: "Academic",
      url: "https://www.uit.edu.vn/",
    },
    {
      nameKey: "members.tma.name",
      descKey: "members.tma.description",
      role: t("members.industryPartner"),
      icon: Cpu,
      category: "Industry",
      url: "https://www.tmatechgroup.com/",
    },
    {
      nameKey: "members.sbd.name",
      descKey: "members.sbd.description",
      role: t("members.industryPartner"),
      icon: Building2,
      category: "Industry",
      url: "https://saobacdau.vn/",
    },
    {
      nameKey: "members.greennode.name",
      descKey: "members.greennode.description",
      role: t("members.industryPartner"),
      icon: Globe,
      category: "Industry",
      url: "https://vng.com.vn/",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("members.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            {t("members.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("members.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.a
              key={member.nameKey}
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-secondary/50 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {member.nameKey === "members.vnuTech.name" ? (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 p-2">
                    <img
                      src={i18n.language === "en" ? "/Logo_BK.png" : "/Logo_BK.png"}
                      alt="HCMUT Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : member.nameKey === "members.vnuScience.name" ? (
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center shrink-0 ${
                    i18n.language === "en" ? "bg-gray-100" : "bg-gray-100"
                  }`}>
                    <img
                      src={i18n.language === "en" ? "/hcmus_logo_vi.png" : "/hcmus_logo_vi.png"}
                      alt="HCMUS Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : member.nameKey === "members.vnuIT.name" ? (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
                    <img
                      src="/uit_logo.png"
                      alt="UIT Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : member.nameKey === "members.tma.name" ? (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
                    <img
                      src="/tma_techgroup.webp"
                      alt="TMA Tech Group Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : member.nameKey === "members.sbd.name" ? (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
                    <img
                      src="/saobacdau_logo.png"
                      alt="Sao Bac Dau Technologies Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : member.nameKey === "members.greennode.name" ? (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
                    <img
                      src="/vng-orange-stand.png"
                      alt="VNG Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    member.category === "Academic"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}>
                    <member.icon className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    member.category === "Academic"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  }`}>
                    {member.role}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-foreground mt-2 group-hover:text-primary transition-colors">
                    {t(member.nameKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {t(member.descKey)}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
