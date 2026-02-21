import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/api";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  className,
  accept = "image/*",
  maxSizeMB = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Please upload an image smaller than ${maxSizeMB}MB.`,
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      try {
        const { url } = await uploadImage(file);
        onChange(url);

        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "There was an error uploading your image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [maxSizeMB, onChange, toast]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        // Preview mode
        <div className="relative group">
          <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.png";
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Upload mode
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "relative aspect-video rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            "flex flex-col items-center justify-center gap-2",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-muted p-3">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drop image here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL input fallback */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">or enter URL:</span>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder="https://..."
          className="flex-1 text-xs px-2 py-1 rounded border bg-background"
        />
      </div>
    </div>
  );
}
