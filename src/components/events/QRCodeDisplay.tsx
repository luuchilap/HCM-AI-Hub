import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface QRCodeDisplayProps {
  qrCodeUrl: string;
}

export function QRCodeDisplay({ qrCodeUrl }: QRCodeDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {t("events.qrCode.title")}
      </h3>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <QrCode className="w-4 h-4" />
            {t("events.qrCode.title")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("events.qrCode.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-4 rounded-xl">
              <img
                src={qrCodeUrl}
                alt="Registration QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t("events.qrCode.description")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
