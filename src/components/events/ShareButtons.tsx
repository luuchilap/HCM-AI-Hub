import { useState } from "react";
import { Facebook, Linkedin, Twitter, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { Event } from "@/types/events";
import { getLocalizedContent } from "@/lib/eventUtils";

interface ShareButtonsProps {
  event: Event;
}

export function ShareButtons({ event }: ShareButtonsProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const locale = i18n.language;
  const title = getLocalizedContent(event.title, locale);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "hover:text-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-sky-500",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({
        title: t("events.share.linkCopied"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t("events.share.title")}
      </h3>
      <div className="flex gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="icon"
            className={`${link.color} transition-colors`}
            asChild
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.name}`}
            >
              <link.icon className="w-4 h-4" />
            </a>
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="hover:text-secondary transition-colors"
          onClick={handleCopyLink}
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
