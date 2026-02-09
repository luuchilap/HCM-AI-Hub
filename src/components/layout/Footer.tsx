import { Link } from "react-router-dom";
import { Brain, Mail, MapPin, Linkedin, Facebook, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    consortium: [
      { name: t("footer.aboutUs"), path: "/about" },
      { name: t("footer.ourMission"), path: "/about#mission" },
      { name: t("footer.foundingMembers"), path: "/" },
      { name: t("footer.contact"), path: "/contact" },
    ],
    resources: [
      { name: t("footer.eventsLink"), path: "/events" },
      // { name: t("footer.researchReports"), path: "/research" }, // Temporarily disabled
      // { name: t("footer.blogLink"), path: "/blog" }, // Temporarily disabled
      { name: t("footer.collaborateLink"), path: "/collaborate" },
    ],
  };

  return (
    <footer className="bg-[hsl(var(--footer-background))] text-[hsl(var(--footer-foreground))]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Brain className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">AI Network</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Consortium Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t("footer.consortium")}</h4>
            <ul className="space-y-3">
              {footerLinks.consortium.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t("footer.contactTitle")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {t("contact.locationValue")}
                  <br />
                  {t("contact.locationSubvalue")}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:qttho@hcmut.edu.vn " className="hover:text-primary-foreground transition-colors">
                qttho@hcmut.edu.vn 
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
