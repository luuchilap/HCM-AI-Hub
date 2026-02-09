import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { createRegistration } from "@/lib/api";
import type { Event } from "@/types/events";
import { isRegistrationOpen, hasAvailableSpots, getRemainingSpots } from "@/lib/eventUtils";

interface RegistrationFormProps {
  event: Event;
}

export function RegistrationForm({ event }: RegistrationFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const registrationOpen = isRegistrationOpen(event);
  const spotsAvailable = hasAvailableSpots(event);
  const remainingSpots = getRemainingSpots(event);

  // Form validation schema
  const formSchema = z.object({
    fullName: z.string().min(2, { message: t("events.registration.required") }),
    email: z.string().email({ message: t("events.registration.invalidEmail") }),
    phone: z.string().min(5, { message: t("events.registration.required") }),
    organization: z.string().min(2, { message: t("events.registration.required") }),
    role: z.string().min(2, { message: t("events.registration.required") }),
    organizationType: z.enum(["university", "tech_company", "government_other"], {
      required_error: t("events.registration.required"),
    }),
    suggestions: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      organizationType: undefined,
      suggestions: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const eventId = event._id || (event as any).id;
      await createRegistration(eventId, {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        role: data.role,
        organizationType: data.organizationType,
        suggestions: data.suggestions || undefined,
      });

      setIsSubmitted(true);
      toast({
        title: t("events.registration.success"),
        description: t("events.registration.successMessage"),
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 3000);
    } catch (error: unknown) {
      let errorMessage = t("events.registration.errorMessage");

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Map known error types to user-friendly messages
      if (errorMessage.includes("already registered")) {
        toast({
          title: t("events.registration.error"),
          description: t("events.registration.alreadyRegistered"),
          variant: "destructive",
        });
      } else if (errorMessage.includes("Event not found")) {
        toast({
          title: t("events.registration.error"),
          description: t("events.registration.eventNotFound"),
          variant: "destructive",
        });
      } else if (errorMessage.includes("Registration is closed") || errorMessage.includes("deadline has passed")) {
        toast({
          title: t("events.registration.error"),
          description: t("events.registration.registrationClosed"),
          variant: "destructive",
        });
      } else if (errorMessage.includes("fully booked")) {
        toast({
          title: t("events.registration.error"),
          description: t("events.registration.fullyBooked"),
          variant: "destructive",
        });
      } else if (errorMessage.includes("valid email")) {
        toast({
          title: t("events.registration.error"),
          description: t("events.registration.invalidEmail"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("events.registration.error"),
          description: t("events.registration.errorMessage"),
          variant: "destructive",
        });
      }
    }
  };

  // Don't show form if registration is closed
  if (!registrationOpen) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 font-medium">{t("events.detail.registrationClosed")}</p>
        </CardContent>
      </Card>
    );
  }

  // Don't show form if event is sold out
  if (!spotsAvailable) {
    return (
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-6 text-center">
          <p className="text-orange-600 font-medium">{t("events.detail.soldOut")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-display">{t("events.registration.title")}</CardTitle>
          {remainingSpots !== null && remainingSpots < 20 && (
            <p className="text-sm text-orange-600">
              {t("events.detail.spotsLeft", { count: remainingSpots })}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.registration.fullName")} *</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.registration.email")} *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.registration.phone")} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+84..." className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("events.registration.organization")} *</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("events.registration.role")} *</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("events.registration.organizationType")} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder={t("events.registration.selectOrganizationType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="university">
                          {t("events.registration.organizationTypes.university")}
                        </SelectItem>
                        <SelectItem value="tech_company">
                          {t("events.registration.organizationTypes.techCompany")}
                        </SelectItem>
                        <SelectItem value="government_other">
                          {t("events.registration.organizationTypes.governmentOther")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suggestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("events.registration.suggestions")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" placeholder={t("events.registration.suggestionsPlaceholder")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitted || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("events.registration.submitting")}
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {t("events.registration.success")}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t("events.registration.submit")}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
