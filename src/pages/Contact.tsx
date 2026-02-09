import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { submitContact } from "@/lib/api";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContact(formData);
      setIsSubmitted(true);
      toast({ title: t("contact.messageSentTitle"), description: t("contact.messageSentDescription") });
      setTimeout(() => { setIsSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }, 3000);
    } catch (error) {
      toast({
        title: t("contact.errorTitle", "Error"),
        description: error instanceof Error ? error.message : t("contact.errorDescription", "Failed to send message. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(185 70% 50%) 1px, transparent 0)`, backgroundSize: '40px 40px' }} /></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">{t("contact.badge")}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">{t("contact.title")}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">{t("contact.description")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="font-display font-bold text-3xl text-foreground mb-6">{t("contact.connectTitle")}</h2>
              <p className="text-muted-foreground text-lg mb-8">{t("contact.connectDescription")}</p>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0"><Mail className="w-6 h-6 text-secondary" /></div>
                  <div><h3 className="font-display font-semibold text-foreground mb-1">{t("contact.emailLabel")}</h3><a href="mailto:qttho@hcmut.edu.vn" className="text-muted-foreground hover:text-primary transition-colors">qttho@hcmut.edu.vn</a></div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0"><MapPin className="w-6 h-6 text-secondary" /></div>
                  <div><h3 className="font-display font-semibold text-foreground mb-1">{t("contact.locationLabel")}</h3><p className="text-muted-foreground">{t("contact.locationValue")}<br />{t("contact.locationSubvalue")}</p></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <h2 className="font-display font-bold text-2xl text-foreground mb-6">{t("contact.formTitle")}</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-foreground mb-2">{t("contact.fullName")} *</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t("contact.yourName")} className="h-12" required /></div>
                    <div><label className="block text-sm font-medium text-foreground mb-2">{t("contact.email")} *</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="h-12" required /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">{t("contact.subject")} *</label><Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder={t("contact.subjectPlaceholder")} className="h-12" required /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">{t("contact.message")} *</label><Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("contact.messagePlaceholder")} className="min-h-[150px]" required /></div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitted || isSubmitting}>
                    {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Sending...</>) : isSubmitted ? (<><CheckCircle className="w-5 h-5" />{t("contact.messageSent")}</>) : (<><Send className="w-5 h-5" />{t("contact.sendMessage")}</>)}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
