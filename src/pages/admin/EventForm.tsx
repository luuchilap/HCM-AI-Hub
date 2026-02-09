import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  adminGetEvent,
  adminCreateEvent,
  adminUpdateEvent,
} from "@/lib/api";

interface AgendaItem {
  sortOrder: number;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  timeSlot: string;
}

const emptyAgendaItem = (): AgendaItem => ({
  sortOrder: 0,
  titleVi: "",
  titleEn: "",
  descriptionVi: "",
  descriptionEn: "",
  timeSlot: "",
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Event fields
  const [slug, setSlug] = useState("");
  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState("conference");
  const [subtitleVi, setSubtitleVi] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [descriptionVi, setDescriptionVi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [targetAudienceVi, setTargetAudienceVi] = useState("");
  const [targetAudienceEn, setTargetAudienceEn] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [venueNameVi, setVenueNameVi] = useState("");
  const [venueNameEn, setVenueNameEn] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueCity, setVenueCity] = useState("Ho Chi Minh City");
  const [venueGoogleMapsUrl, setVenueGoogleMapsUrl] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  // Auto-generate slug from English title
  useEffect(() => {
    if (!isEdit && titleEn) {
      setSlug(slugify(titleEn));
    }
  }, [titleEn, isEdit]);

  // Load event data for editing
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      adminGetEvent(id)
        .then((e) => {
          setSlug(e.slug);
          setTitleVi(e.titleVi);
          setTitleEn(e.titleEn);
          setType(e.type);
          setSubtitleVi(e.subtitleVi || "");
          setSubtitleEn(e.subtitleEn || "");
          setDescriptionVi(e.descriptionVi);
          setDescriptionEn(e.descriptionEn);
          setTargetAudienceVi(e.targetAudienceVi || "");
          setTargetAudienceEn(e.targetAudienceEn || "");
          setDate(e.date);
          setStartTime(e.startTime?.slice(0, 5) || "09:00");
          setEndTime(e.endTime?.slice(0, 5) || "17:00");
          setVenueNameVi(e.venueNameVi);
          setVenueNameEn(e.venueNameEn);
          setVenueAddress(e.venueAddress);
          setVenueCity(e.venueCity);
          setVenueGoogleMapsUrl(e.venueGoogleMapsUrl || "");
          setRegistrationDeadline(e.registrationDeadline || "");
          setRegistrationUrl(e.registrationUrl || "");
          setBannerImage(e.bannerImage || "");
          setStatus(e.status);
          setMaxAttendees(e.maxAttendees?.toString() || "");
          setIsFeatured(e.isFeatured);
          setAgendaItems(
            (e.agendaItems || []).map((a: any) => ({
              sortOrder: a.sortOrder,
              titleVi: a.titleVi,
              titleEn: a.titleEn,
              descriptionVi: a.descriptionVi || "",
              descriptionEn: a.descriptionEn || "",
              timeSlot: a.timeSlot || "",
            }))
          );
        })
        .catch(() => toast({ title: "Error", description: "Event not found", variant: "destructive" }))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      slug,
      titleVi,
      titleEn,
      type,
      subtitleVi: subtitleVi || undefined,
      subtitleEn: subtitleEn || undefined,
      descriptionVi,
      descriptionEn,
      targetAudienceVi: targetAudienceVi || undefined,
      targetAudienceEn: targetAudienceEn || undefined,
      date,
      startTime,
      endTime,
      venueNameVi,
      venueNameEn,
      venueAddress,
      venueCity,
      venueGoogleMapsUrl: venueGoogleMapsUrl || undefined,
      registrationDeadline: registrationDeadline || undefined,
      registrationUrl: registrationUrl || undefined,
      bannerImage: bannerImage || undefined,
      status,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      isFeatured,
      agendaItems: agendaItems.map((a, i) => ({
        ...a,
        sortOrder: i + 1,
      })),
    };

    try {
      if (isEdit && id) {
        await adminUpdateEvent(id, payload);
        toast({ title: "Event updated" });
      } else {
        await adminCreateEvent(payload);
        toast({ title: "Event created" });
      }
      navigate("/admin/events");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems((prev) => [
      ...prev,
      { ...emptyAgendaItem(), sortOrder: prev.length + 1 },
    ]);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, field: keyof AgendaItem, value: string | number) => {
    setAgendaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/events">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Button>
      </Link>

      <h2 className="text-2xl font-display font-bold mb-6">
        {isEdit ? "Edit Event" : "Create Event"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (Vietnamese) *</Label>
                <Input value={titleVi} onChange={(e) => setTitleVi(e.target.value)} required placeholder="Tiêu đề sự kiện" />
              </div>
              <div className="space-y-2">
                <Label>Title (English) *</Label>
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required placeholder="Event title" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subtitle (Vietnamese)</Label>
                <Input value={subtitleVi} onChange={(e) => setSubtitleVi(e.target.value)} placeholder="Phụ đề (tùy chọn)" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle (English)</Label>
                <Input value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} placeholder="Subtitle (optional)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="event-slug" />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="forum">Forum</SelectItem>
                    <SelectItem value="symposium">Symposium</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Description (Vietnamese) *</Label>
                <Textarea value={descriptionVi} onChange={(e) => setDescriptionVi(e.target.value)} required rows={5} placeholder="Mô tả sự kiện bằng tiếng Việt..." />
              </div>
              <div className="space-y-2">
                <Label>Description (English) *</Label>
                <Textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} required rows={5} placeholder="Event description in English..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Audience (Vietnamese)</Label>
                <Textarea value={targetAudienceVi} onChange={(e) => setTargetAudienceVi(e.target.value)} rows={3} placeholder="Đối tượng mục tiêu..." />
              </div>
              <div className="space-y-2">
                <Label>Target Audience (English)</Label>
                <Textarea value={targetAudienceEn} onChange={(e) => setTargetAudienceEn(e.target.value)} rows={3} placeholder="Target audience..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>End Time *</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Registration Deadline</Label>
              <Input type="date" value={registrationDeadline} onChange={(e) => setRegistrationDeadline(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Venue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Venue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue Name (Vietnamese) *</Label>
                <Input value={venueNameVi} onChange={(e) => setVenueNameVi(e.target.value)} required placeholder="Tên địa điểm" />
              </div>
              <div className="space-y-2">
                <Label>Venue Name (English) *</Label>
                <Input value={venueNameEn} onChange={(e) => setVenueNameEn(e.target.value)} required placeholder="Venue name" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} required placeholder="123 Street Name" />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input value={venueCity} onChange={(e) => setVenueCity(e.target.value)} required placeholder="Ho Chi Minh City" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Google Maps URL</Label>
              <Input value={venueGoogleMapsUrl} onChange={(e) => setVenueGoogleMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Attendees</Label>
                <Input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="Leave empty for unlimited" />
              </div>
              <div className="space-y-2">
                <Label>Registration URL</Label>
                <Input value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} placeholder="External registration link (optional)" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Banner Image URL</Label>
              <Input value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} placeholder="https://example.com/banner.jpg" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label>Featured Event</Label>
            </div>
          </CardContent>
        </Card>

        {/* Agenda */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Agenda</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {agendaItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No agenda items yet. Click "Add Item" to create one.
              </p>
            )}

            {agendaItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Item #{index + 1}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAgendaItem(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Time Slot</Label>
                  <Input
                    value={item.timeSlot}
                    onChange={(e) => updateAgendaItem(index, "timeSlot", e.target.value)}
                    placeholder="09:00 - 10:00"
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Title (Vietnamese) *</Label>
                    <Input
                      value={item.titleVi}
                      onChange={(e) => updateAgendaItem(index, "titleVi", e.target.value)}
                      placeholder="Tiêu đề"
                      className="text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Title (English) *</Label>
                    <Input
                      value={item.titleEn}
                      onChange={(e) => updateAgendaItem(index, "titleEn", e.target.value)}
                      placeholder="Title"
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Description (Vietnamese)</Label>
                    <Textarea
                      value={item.descriptionVi}
                      onChange={(e) => updateAgendaItem(index, "descriptionVi", e.target.value)}
                      placeholder="Mô tả..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description (English)</Label>
                    <Textarea
                      value={item.descriptionEn}
                      onChange={(e) => updateAgendaItem(index, "descriptionEn", e.target.value)}
                      placeholder="Description..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="min-w-[120px]">
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : isEdit ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/events")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
