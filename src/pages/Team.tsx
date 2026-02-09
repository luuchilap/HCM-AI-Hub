import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { User, ArrowRight, Building2, GraduationCap, Briefcase, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { coreTeamMembers, extendedTeamMembers, TeamMember } from "@/lib/team-data";

interface MemberCardProps {
  member: TeamMember;
  displayImage?: string;
  displayRole: string;
  execRole?: string;
  index: number;
  t: (key: string) => string;
}

const MemberCard = ({ member, displayImage, displayRole, execRole, index, t }: MemberCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
  >
    <Link
      to={`/team/${member.id}`}
      className="group block bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full"
    >
      {/* Avatar */}
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
        {displayImage ? (
          <img
            src={displayImage}
            alt={t(member.nameKey)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-primary/60" />
        )}
      </div>

      {/* Member Info */}
      <div className="text-center">
        <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {t(member.nameKey)}
        </h3>
        {execRole && (
          <p className="text-primary font-medium text-sm mb-1">
            {execRole}
          </p>
        )}
        <p className="text-muted-foreground text-sm">
          {displayRole}
        </p>
      </div>

      {/* View Profile Indicator */}
      <div className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
        <span>{t("team.viewProfile")}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  </motion.div>
);

const Team = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              {t("team.title")}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Network Lead & Members Section */}
      <section className="py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Network Lead */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("team.structure.leadTitle")}
                    </h3>
                    <p className="text-primary font-semibold mb-2">
                      {t("team.structure.leadOrg")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("team.structure.leadDesc")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Members */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {t("team.structure.membersTitle")}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {t("team.structure.membersDesc1")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("team.structure.membersDesc2")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Educational Institutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card rounded-2xl p-6 border border-border mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {t("team.structure.educationalTitle")}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(t("team.structure.educationalOrgs", { returnObjects: true }) as string[]).map((org, index) => (
                  <div key={index} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-primary font-semibold shrink-0">
                      {index + 1}</span>
                    <span>{org}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enterprises */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {t("team.structure.enterpriseTitle")}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(t("team.structure.enterpriseOrgs", { returnObjects: true }) as string[]).map((org, index) => (
                  <div key={index} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <span className="text-secondary font-semibold shrink-0">{index + 1}</span>
                    <span>{org}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Executive Board Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {t("team.execBoardTitle")}
            </h2>
          </motion.div>

          {/* Board Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {t("team.execBoard.boardTitle")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("team.execBoard.boardDesc")}
              </p>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {t("team.execBoard.dutiesTitle")}
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {(t("team.execBoard.duties", { returnObjects: true }) as string[]).map((duty, index) => (
                  <li key={index}>{duty}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Core Members Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
              {t("team.execBoard.coreMembers")}
            </h3>
          </motion.div>
          <div className="space-y-10 mb-16">
            {/* Hàng 1 – card đầu, căn giữa */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                {(() => {
                  const member = coreTeamMembers[0];
                  if (!member) return null;

                  const displayImage = member.image;
                  const jobTitle = member.roleKey ? t(member.roleKey) : undefined;
                  const organization = member.organizationKey ? t(member.organizationKey) : undefined;
                  const displayRole =
                    jobTitle && organization
                      ? `${jobTitle} - ${organization}`
                      : jobTitle || organization || '';
                  const execRole = member.execRoleKey ? t(member.execRoleKey) : undefined;

                  return (
                    <MemberCard
                      member={member}
                      displayImage={displayImage}
                      displayRole={displayRole}
                      execRole={execRole}
                      index={0}
                      t={t}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Các member còn lại – grid bình thường */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coreTeamMembers.slice(1).map((member, index) => {
                const displayImage = member.image;
                const jobTitle = member.roleKey ? t(member.roleKey) : undefined;
                const organization = member.organizationKey ? t(member.organizationKey) : undefined;
                const displayRole =
                  jobTitle && organization
                    ? `${jobTitle} - ${organization}`
                    : jobTitle || organization || '';
                const execRole = member.execRoleKey ? t(member.execRoleKey) : undefined;

                return (
                  <MemberCard
                    key={member.id}
                    member={member}
                    displayImage={displayImage}
                    displayRole={displayRole}
                    execRole={execRole}
                    index={index + 1}
                    t={t}
                  />
                );
              })}
            </div>
          </div>



          {/* Extended Members Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
              {t("team.execBoard.extendedMembers")}
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {extendedTeamMembers.map((member, index) => {
              const displayImage = member.image;
              const jobTitle = member.roleKey ? t(member.roleKey) : undefined;
              const organization = member.organizationKey ? t(member.organizationKey) : undefined;
              const displayRole = jobTitle && organization
                ? `${jobTitle} - ${organization}`
                : jobTitle || organization || '';

              return (
                <MemberCard
                  key={member.id}
                  member={member}
                  displayImage={displayImage}
                  displayRole={displayRole}
                  index={index}
                  t={t}
                />
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
