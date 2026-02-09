import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import { teamMembers } from "@/lib/team-data";
import { User, ArrowLeft, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const TeamMemberDetail = () => {
  const { t } = useTranslation();
  const { memberId } = useParams();

  const member = teamMembers.find((m) => m.id === memberId);

  if (!member) {
    return <Navigate to="/team" replace />;
  }

  // Helper to safely get translation or return key if missing
  const getTranslation = (key: string | undefined) => {
    if (!key) return null;
    const text = t(key);
    return text === key ? null : text;
  };

  const displayImage = member.image;
  const bio = getTranslation(member.bioKey);
  const role = getTranslation(member.roleKey);
  const organization = getTranslation(member.organizationKey);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <Link to="/team">
          <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("team.backToTeam", "Back to Team")}
          </Button>
        </Link>

        <div className="bg-card rounded-3xl border border-border p-8 md:p-12 max-w-4xl mx-auto shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            
            {/* Avatar Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 overflow-hidden border-4 border-background shadow-lg">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={t(member.nameKey)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-24 h-24 text-primary/60" />
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {t(member.nameKey)}
              </h1>
              
              <div className="space-y-4 mb-8">
                {role && (
                    <div className="flex items-center text-muted-foreground">
                        <Briefcase className="w-5 h-5 mr-3 text-primary" />
                        <span className="text-lg">{role}</span>
                    </div>
                )}
                {organization && (
                  <div className="flex items-center text-muted-foreground">
                    <Building2 className="w-5 h-5 mr-3 text-primary" />
                    <span className="text-lg">{organization}</span>
                  </div>
                )}
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-3">{t("team.about", "About")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {bio || t("team.bioPlaceholder", "Biography coming soon...")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamMemberDetail;
