import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Target, Handshake, Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { submitCollaboration } from "@/lib/api";

const Collaborate = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ type: "", name: "", organization: "", email: "", phone: "", title: "", description: "" });

  const collaborationTypes = [
    { icon: Lightbulb, titleKey: "collaborate.submitUseCase.title", descKey: "collaborate.submitUseCase.description", value: "use-case" },
    { icon: Target, titleKey: "collaborate.problemStatement.title", descKey: "collaborate.problemStatement.description", value: "problem-statement" },
    { icon: Handshake, titleKey: "collaborate.partnership.title", descKey: "collaborate.partnership.description", value: "partnership" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitCollaboration({
        type: formData.type,
        name: formData.name,
        organization: formData.organization,
        email: formData.email,
        phone: formData.phone || undefined,
        title: formData.title,
        description: formData.description,
      });
      setIsSubmitted(true);
      toast({ title: t("collaborate.submissionReceived"), description: t("collaborate.submissionReceivedDesc") });
      setTimeout(() => { setIsSubmitted(false); setFormData({ type: "", name: "", organization: "", email: "", phone: "", title: "", description: "" }); }, 3000);
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to submit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(185 70% 50%) 1px, transparent 0)`, backgroundSize: '40px 40px' }} /></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">{t("collaborate.badge")}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">{t("collaborate.title")}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">{t("collaborate.pageDescription")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {collaborationTypes.map((type, index) => (
              <motion.div key={type.value} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} onClick={() => setFormData({ ...formData, type: type.value })} className={`cursor-pointer bg-card rounded-2xl p-6 border-2 transition-all duration-300 ${formData.type === type.value ? "border-secondary shadow-lg" : "border-border hover:border-secondary/50"}`}>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4"><type.icon className="w-6 h-6 text-secondary" /></div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{t(type.titleKey)}</h3>
                <p className="text-muted-foreground text-sm">{t(type.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <h2 className="font-display font-bold text-2xl text-foreground mb-6">{t("collaborate.formTitle")}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.requestType")} *</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="h-12"><SelectValue placeholder={t("collaborate.selectType")} /></SelectTrigger>
                    <SelectContent>{collaborationTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{t(type.titleKey)}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.fullName")} *</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t("collaborate.yourName")} className="h-12" required /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.organization")} *</label><Input value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} placeholder={t("collaborate.companyOrInstitution")} className="h-12" required /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.email")} *</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="h-12" required /></div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.phone")}</label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+84..." className="h-12" /></div>
                </div>
                <div><label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.requestTitle")} *</label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder={t("collaborate.briefTitle")} className="h-12" required /></div>
                <div><label className="block text-sm font-medium text-foreground mb-2">{t("collaborate.descriptionLabel")} *</label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={t("collaborate.descriptionPlaceholder")} className="min-h-[150px]" required /></div>
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitted || submitting}>{isSubmitted ? (<><CheckCircle className="w-5 h-5" />{t("collaborate.submittedSuccessfully")}</>) : submitting ? (<><Loader2 className="w-5 h-5 animate-spin" />{t("collaborate.submitting", "Submitting...")}</>) : (<><Send className="w-5 h-5" />{t("collaborate.submitRequest")}</>)}</Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Collaborate;
