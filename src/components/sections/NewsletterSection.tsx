import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { subscribeNewsletter } from "@/lib/api";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email);
      setIsSubmitted(true);
      toast({
        title: t("newsletter.successTitle"),
        description: t("newsletter.successDescription"),
      });
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t("newsletter.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {t("newsletter.title")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t("newsletter.description")}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 rounded-xl bg-background"
              required
            />
            <Button 
              type="submit" 
              variant="hero" 
              size="lg"
              disabled={isSubmitted || isSubmitting}
              className="shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t("newsletter.subscribed")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("newsletter.subscribe")}
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            {t("newsletter.disclaimer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
