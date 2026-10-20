import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Seo } from "../../components/Seo";
import { SITE_URL } from "../../helpers/siteUrl";
import { idFromSlug, salonPath } from "../../helpers/slug";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Award, Calendar, Clock, DollarSign, MapPin, Phone, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Stars } from "../../components/salon/Stars";
import { FavoriteButton } from "../../components/salon/FavoriteButton";
import { createBooking, getSalonAvailability, getSalonReviews, type AvailabilitySlot, type Review } from "../../helpers/bookingHelpers";
import { PhaseBar, PhaseLegend } from "../../components/salon/PhaseBar";
import { formatMinutes, formatTime, getPhases, getTotals } from "../../helpers/phases";
import { DEFAULT_TIMEZONE, dateStringInZone, weekdayKey } from "../../helpers/timezone";
import { getSalonById } from "../../helpers/salonHelpers";
import type { SalonProfile, SalonService } from "../../components/types";
import { useAuth } from "../../components/context/AuthContext";
import { getErrorMessage } from "../../helpers/errors";

const SalonPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const numericId = idFromSlug(slug);
  const id = numericId ? String(numericId) : undefined;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("services");
  const [salon, setSalon] = useState<SalonProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string>("");
  const [bookingError, setBookingError] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchSalon = async () => {
      if (!id) return;
      try {
        const data = await getSalonById(id);
        // /salon/12 -> /salon/12-studio-one (one canonical URL per salon)
        if (slug !== salonPath(data).replace('/salon/', '')) navigate(salonPath(data), { replace: true });
        setSalon({
          ...data,
          specialties: Array.isArray(data.specialties)
            ? data.specialties
            : typeof data.specialties === "string" && data.specialties.startsWith("[")
            ? JSON.parse(data.specialties)
            : [],
        });
      } catch (error) {
        console.error("Failed to fetch salon", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalon()
    if (id) getSalonReviews(id).then(setReviews).catch(() => setReviews([]));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedService = useMemo<SalonService | undefined>(
    () => salon?.services?.find((service) => String(service.id) === selectedServiceId),
    [salon, selectedServiceId]
  );

  const loadSlots = async () => {
    if (!id || !selectedServiceId || !selectedDate) return;
    try {
      setIsLoadingSlots(true);
      setBookingError("");
      const availability = await getSalonAvailability(
        Number(id),
        Number(selectedServiceId),
        selectedDate,
        selectedStaffId === "any" ? undefined : Number(selectedStaffId)
      );
      setAvailableSlots(availability.slots || []);
      setSelectedSlot("");
    } catch (error) {
      console.error("Failed to load availability", error);
      setAvailableSlots([]);
      setBookingError(getErrorMessage(error, "Could not load availability for selected date."));
    } finally {
      setIsLoadingSlots(false);
      setHasCheckedAvailability(true);
    }
  };

  const handleCreateBooking = async () => {
    setBookingError("");
    setBookingMessage("");
    if (!id || !selectedServiceId || !selectedSlot) return;
    if (!user) {
      setBookingError("Please log in before booking.");
      return;
    }
    try {
      setIsBooking(true);
      setBookingError("");
      await createBooking({
        salonId: Number(id),
        serviceId: Number(selectedServiceId),
        startAt: selectedSlot,
        ...(selectedStaffId === "any" ? {} : { staffId: Number(selectedStaffId) }),
      });
      setBookingMessage(salon?.autoConfirm ? "Booking confirmed. See you soon!" : "Booking request sent. The salon will confirm it shortly.");
      setSelectedSlot("");
      await loadSlots();
    } catch (error) {
      setBookingError(getErrorMessage(error, "Failed to create booking."));
    } finally {
      setIsBooking(false);
    }
  };

  const tz = salon?.timezone || DEFAULT_TIMEZONE;
  const minDate = dateStringInZone(Date.now(), tz);
  const selectedSlotData = availableSlots.find((slot) => slot.startAt === selectedSlot);
  const selectedPhases = selectedService ? getPhases(selectedService) : [];
  const dayHours = (() => {
    if (!selectedDate || !salon?.daysOfOperation) return null;
    return salon.daysOfOperation[weekdayKey(selectedDate)] ?? null;
  })();
  const resetSlots = () => {
    setHasCheckedAvailability(false);
    setAvailableSlots([]);
    setSelectedSlot("");
    setBookingMessage("");
    setBookingError("");
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading salon...</div>;
  }

  if (!salon) {
    return (
      <div className="space-y-4 py-12 text-center">
        <Seo title="Salon not found" noindex />
        <h1 className="text-2xl font-bold">Salon not found</h1>
        <p className="text-muted-foreground">It may have been removed or is not published yet.</p>
        <Button asChild variant="outline"><Link to="/search">Browse salons</Link></Button>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    barber: 'Barbershop', 'hair-salon': 'Hair salon', 'nail-salon': 'Nail studio', spa: 'Spa & wellness', 'beauty-salon': 'Beauty salon',
  };
  const categoryLabel = categoryLabels[salon.category] ?? 'Salon';
  const typeByCategory: Record<string, string> = {
    barber: 'BarberShop', 'hair-salon': 'HairSalon', 'nail-salon': 'NailSalon', spa: 'DaySpa', 'beauty-salon': 'BeautySalon',
  };
  const dayNames: Record<string, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  };
  const seoDescription = [
    `${salon.businessName}: ${categoryLabel.toLowerCase()}${salon.city ? ` in ${salon.city}` : ''}.`,
    salon.services?.length ? `Services: ${salon.services.slice(0, 5).map((s) => s.name).join(', ')}.` : '',
    salon.minPrice != null ? `Prices from $${salon.minPrice}.` : '',
    'Book online.',
  ].filter(Boolean).join(' ');
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': typeByCategory[salon.category] ?? 'HealthAndBeautyBusiness',
    name: salon.businessName,
    url: `${SITE_URL}${salonPath(salon)}`,
    telephone: salon.phone,
    email: salon.email,
    description: salon.description || undefined,
    image: salon.images?.length ? salon.images : undefined,
    address:
      salon.address || salon.city
        ? {
            '@type': 'PostalAddress',
            streetAddress: salon.address || undefined,
            addressLocality: salon.city || undefined,
            addressRegion: salon.state || undefined,
            postalCode: salon.zipCode || undefined,
          }
        : undefined,
    priceRange: salon.priceRange || undefined,
    sameAs: [salon.website, salon.instagram, salon.facebook, salon.twitter].filter(Boolean),
    openingHoursSpecification: Object.entries(salon.daysOfOperation || {})
      .filter(([, d]) => d.enabled)
      .map(([day, d]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dayNames[day], opens: d.open, closes: d.close })),
    aggregateRating: salon.reviewCount
      ? { '@type': 'AggregateRating', ratingValue: salon.rating, reviewCount: salon.reviewCount }
      : undefined,
  };

  return (
    <div className="space-y-6">
      <Seo
        title={`${salon.businessName} – ${categoryLabel}${salon.city ? ` in ${salon.city}` : ''}`}
        description={seoDescription}
        path={salonPath(salon)}
        image={salon.images?.[0]}
        jsonLd={structuredData}
        noindex={salon.isApproved === false}
      />
      {/* Back Button */}
      <Button asChild variant="outline" className="gap-2 px-4">
        <Link to="/search">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </Button>
      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-80">
          <ImageWithFallback
            src={salon.images?.[0]}
            alt={`${salon.businessName} – ${categoryLabel}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <FavoriteButton salonId={salon.id} className="absolute right-4 top-4" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              
              <Badge variant="secondary">
                {categoryLabel}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{salon.businessName}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-2 font-medium">{salon.reviewCount ? salon.rating : "New"}</span>
                <span className="text-white/80">
                  {salon.reviewCount ? `(${salon.reviewCount} review${salon.reviewCount === 1 ? "" : "s"})` : "(no reviews yet)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{salon.address}, {salon.city}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const open = Object.values(salon.daysOfOperation || {}).filter((d) => d.enabled);
                    if (!open.length) return "See the Book tab";
                    const first = open[0];
                    return open.every((d) => d.open === first.open && d.close === first.close)
                      ? `${first.open} – ${first.close}`
                      : "Varies by day, pick a date in the Book tab";
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Price Range</p>
                <p className="text-sm text-muted-foreground">
                  {salon.minPrice == null || salon.maxPrice == null
                    ? 'See services'
                    : salon.minPrice === salon.maxPrice
                    ? `$${salon.minPrice}`
                    : `$${salon.minPrice} - $${salon.maxPrice}`}
                  {salon.priceRange ? ` (${salon.priceRange})` : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="services" className="cursor-pointer">Services</TabsTrigger>
          <TabsTrigger value="book" className="cursor-pointer">Book</TabsTrigger>
          <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="reviews" className="cursor-pointer">Reviews</TabsTrigger>
          <TabsTrigger value="contact" className="cursor-pointer">Contact</TabsTrigger>
        </TabsList>     

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
              <p className="text-muted-foreground">Professional services tailored to your needs</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salon.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{service.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        Active {formatMinutes(getTotals(getPhases(service)).active)}
                        {getTotals(getPhases(service)).passive > 0 && `, waiting ${formatMinutes(getTotals(getPhases(service)).passive)}`}
                      </p>
                      <PhaseBar phases={getPhases(service)} className="mt-2 w-48" />
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${service.price}</p>
                      <p className="text-sm text-muted-foreground">{formatMinutes(getTotals(getPhases(service)).total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="book" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Service</p>
                <Select
                  value={selectedServiceId}
                  onValueChange={(value) => {
                    setSelectedServiceId(value);
                    resetSlots();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {salon.services.map((service) => (
                      <SelectItem key={service.id} value={String(service.id)}>
                        {service.name} - ${service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Date</p>
                <Input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    resetSlots();
                  }}
                />
                {dayHours && (
                  <p className="text-xs text-muted-foreground">
                    {dayHours.enabled ? `Open ${dayHours.open} – ${dayHours.close}` : "Closed on this day"}
                  </p>
                )}
              </div>

              {salon.teamMembers && salon.teamMembers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Specialist</p>
                  <Select
                    value={selectedStaffId}
                    onValueChange={(value) => {
                      setSelectedStaffId(value);
                      resetSlots();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Anyone available</SelectItem>
                      {salon.teamMembers.map((member) => (
                        <SelectItem key={member.id} value={String(member.id)}>
                          {member.name} – {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={loadSlots}
                disabled={!selectedServiceId || !selectedDate || isLoadingSlots}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                {isLoadingSlots ? "Loading slots..." : "Check available slots"}
              </Button>

              {selectedService && (
                <div className="space-y-2 rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Total duration: {formatMinutes(getTotals(selectedPhases).total)}
                  </p>
                  <PhaseBar phases={selectedPhases} />
                  <PhaseLegend />
                </div>
              )}

              {availableSlots.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Available slots <span className="font-normal text-muted-foreground">(times in {tz})</span></p>
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.startAt}
                        type="button"
                        variant={selectedSlot === slot.startAt ? "default" : "outline"}
                        onClick={() => setSelectedSlot(slot.startAt)}
                      >
                        {formatTime(slot.startAt, tz)}
                      </Button>
                    ))}
                  </div>
                  {selectedSlotData && (
                    <ul className="space-y-1 rounded-lg border bg-muted/40 p-3 text-sm">
                      {selectedSlotData.phases.map((phase, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{phase.type === "active" ? "Treatment" : "Waiting time"}</span>
                          <span className="text-muted-foreground">{formatTime(phase.startAt, tz)} – {formatTime(phase.endAt, tz)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {hasCheckedAvailability && !isLoadingSlots && availableSlots.length === 0 && selectedServiceId && selectedDate && (
                <p className="text-sm text-muted-foreground">No slots available for this day.</p>
              )}

              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>{salon.autoConfirm ? "Bookings are confirmed instantly." : "The salon confirms each booking. You get a notification when it does."}</li>
                {(salon.minNoticeHours ?? 0) > 1 && <li>Book at least {salon.minNoticeHours} hours ahead.</li>}
                <li>
                  {(salon.cancellationHours ?? 0) > 0
                    ? `Free cancellation or changes up to ${salon.cancellationHours} hours before.`
                    : "You can cancel or move your booking any time."}
                </li>
              </ul>

              <Button onClick={handleCreateBooking} disabled={!selectedSlot || isBooking}>
                {isBooking ? "Booking..." : "Confirm booking"}
              </Button>

              {bookingMessage && <p className="text-sm text-green-600">{bookingMessage}</p>}
              {bookingError && <p className="text-sm text-destructive">{bookingError}</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
        <Card>
            <CardHeader>
              <CardTitle>About {salon.businessName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{salon.description}</p>
              
              {salon.specialties.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {salon.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        ⭐ {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Popular Services
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {salon.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>     

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Completed bookings can be reviewed from your profile.</p>}
              {reviews.map((review) => (
                <div key={review.id} className="space-y-1 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.author}</span>
                    <Stars value={review.rating} />
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{salon.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{salon.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Hours</p>
                  <div className="text-muted-foreground text-sm">
                    {Object.entries(salon.daysOfOperation || {}).map(([day, h]) => (
                      <div key={day} className="flex gap-4">
                        <span className="w-24 capitalize">{day}</span>
                        <span>{h.enabled ? `${h.open} – ${h.close}` : "Closed"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  ) 
}
export default SalonPage;