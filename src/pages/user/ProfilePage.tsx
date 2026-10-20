import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  Settings,
  Bell,
  Save,
  Camera
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { useAuth } from '../../components/context/AuthContext';
import { updateUserProfile } from '../../helpers/userHelpers';
import type { UserFormData } from '../../components/types';
import { cancelBooking, createReview, getMyBookings } from '../../helpers/bookingHelpers';
import { getErrorMessage } from '../../helpers/errors';
import { Stars } from '../../components/salon/Stars';
import { RescheduleDialog, type ReschedulableBooking } from '../../components/booking/RescheduleDialog';
import { SecuritySettings } from '../../components/user/SecuritySettings';
import { Seo } from '../../components/Seo';
import { SalonCard } from '../../components/ui/salonCard';
import { useFavorites } from '../../components/context/FavoritesContext';
import { getFavoriteSalons } from '../../helpers/favoriteHelpers';
import { updateNotificationPrefs, type NotificationPrefs } from '../../helpers/notificationHelpers';
import type { SalonProfile } from '../../components/types';
import { formatTime } from '../../helpers/phases';
import LoadingSpinner from '../../components/ui/loadingSpinner';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import type { UserProfile } from '../../components/types';

type BookingItem = {
  id: number;
  salonId: number;
  serviceId: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  startAt: string;
  endAt: string;
  Salon?: { id?: number; businessName?: string; timezone?: string; cancellationHours?: number };
  service?: { name?: string };
  review?: { id: number; rating: number } | null;
};

type ProfileContentProps = {
  user: UserProfile;
  setUser: (u: UserProfile | null) => void;
  defaultTab: string;
};

const ProfileContent = ({ user, setUser, defaultTab }: ProfileContentProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [userFormData, setUserFormData] = useState<UserFormData>({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipcode: user.zipcode || ''
    })
    useEffect(() => {
        if (user) {
          setUserFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            zipcode: user.zipcode || ''
          })
        }
      }, [user])
    const [prefs, setPrefs] = useState<NotificationPrefs>({
        reminders: user.notificationPrefs?.reminders ?? true,
        statusUpdates: user.notificationPrefs?.statusUpdates ?? true,
    })
    const [prefsError, setPrefsError] = useState('')
    const changePref = async (key: keyof NotificationPrefs, value: boolean) => {
        const previous = prefs
        setPrefs({ ...prefs, [key]: value })
        setPrefsError('')
        try {
            await updateNotificationPrefs({ [key]: value })
        } catch {
            setPrefs(previous)
            setPrefsError('Could not save your preference. Try again.')
        }
    }
    const { count: favoriteCount, version: favoritesVersion } = useFavorites()
    const [favoriteSalons, setFavoriteSalons] = useState<SalonProfile[]>([])
    const [favoritesLoading, setFavoritesLoading] = useState(true)
    useEffect(() => {
        if (user.userType !== 'user') {
            setFavoritesLoading(false)
            return
        }
        getFavoriteSalons()
            .then(setFavoriteSalons)
            .catch(() => setFavoriteSalons([]))
            .finally(() => setFavoritesLoading(false))
    }, [user.userType, favoritesVersion])
    const [bookingHistory, setBookingHistory] = useState<BookingItem[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState('');
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [reschedulingBooking, setReschedulingBooking] = useState<ReschedulableBooking | null>(null);
    const [reviewingId, setReviewingId] = useState<number | null>(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const handleInputChange = <K extends keyof UserFormData>(
        field: K,
        value: UserFormData[K]
      ) => {
        setUserFormData(prev => ({ ...prev, [field]: value }));
    };
    
      const handleSave = async () => {
        try {
            const updated = await updateUserProfile(userFormData)

            setUser(updated.user)
            setIsEditing(false);
            
        } catch (error) {
            console.log(error)
        }
      };

      const fetchBookings = useCallback(async () => {
        try {
          setBookingsLoading(true);
          setBookingsError('');
          const data = await getMyBookings();
          setBookingHistory(data);
        } catch (error) {
          console.log('Error fetching bookings', error);
          setBookingsError('Could not load your bookings. Try again.');
        } finally {
          setBookingsLoading(false);
        }
      }, []);

      useEffect(() => {
        fetchBookings();
      }, [fetchBookings]);

      const handleReview = async (bookingId: number) => {
        try {
          await createReview(bookingId, { rating: reviewRating, comment: reviewComment });
          setReviewingId(null);
          setReviewRating(0);
          setReviewComment('');
          await fetchBookings();
        } catch (error) {
          setBookingsError(getErrorMessage(error, 'Could not save your review.'));
        }
      };

      const handleCancelBooking = async (bookingId: number) => {
        try {
          setCancellingId(bookingId);
          await cancelBooking(bookingId);
          await fetchBookings();
        } catch (error) {
          setBookingsError(getErrorMessage(error, 'Could not cancel booking. Try again.'));
        } finally {
          setCancellingId(null);
        }
      };
  return (
    <section className='space-y-8'>
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Profile Header */}
            
            <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-gradient-primary text-white text-3xl">
                                {user.firstName.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <Button 
                                size="sm" 
                                className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg"
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>            
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl text-gradient-primary mb-2">
                                {userFormData.firstName} {userFormData.lastName}
                            </h1>
                            <p className="text-muted-foreground mb-4">{userFormData.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <Badge variant="secondary" className="gap-1">
                                    <User className="w-3 h-3" />
                                    {user.userType === 'salon_owner' ? 'salon_owner' : 'user'}
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Member since {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                    month: 'short',
                                    year: 'numeric'
                                    })}
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <Heart className="w-3 h-3 fill-current" />
                                    {favoriteCount} Favorites
                                </Badge>
                            </div>
                        </div>

                        <Button 
                        variant={isEditing ? 'default' : 'outline'}
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="gap-2"
                        >
                        {isEditing ? (
                            <>
                            <Save className="w-4 h-4" />
                            Save Changes
                            </>
                        ) : (
                            <>
                            <Settings className="w-4 h-4" />
                            Edit Profile
                            </>
                        )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Tabs */}
            <Tabs key={defaultTab} defaultValue={defaultTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                <TabsTrigger value="personal" className="gap-2 py-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Personal Info</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-2 py-3">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2 py-3">
                    <Heart className="w-4 h-4" />
                    <span className="hidden sm:inline">Favorites</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2 py-3">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                </TabsList>

                {/* Personal Information */}
                <TabsContent value="personal">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={userFormData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            disabled={!isEditing}
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={userFormData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            disabled={!isEditing}
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                            id="email"
                            type="email"
                            value={userFormData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                            id="phone"
                            type="tel"
                            value={userFormData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                            />
                        </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                            id="address"
                            value={userFormData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            className="pl-10"
                            />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={userFormData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            disabled={!isEditing}
                        />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                            id="state"
                            value={userFormData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            disabled={!isEditing}
                        />
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>

                {/* Booking History */}
                <TabsContent value="bookings">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Booking History
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={fetchBookings} disabled={bookingsLoading}>
                        {bookingsLoading ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </div>
                    {bookingsError && (
                      <p className="text-sm text-destructive">{bookingsError}</p>
                    )}
                    {!bookingsLoading && bookingHistory.length === 0 && !bookingsError && (
                      <p className="text-sm text-muted-foreground">No bookings yet.</p>
                    )}
                    {bookingsLoading && (
                      <p className="text-sm text-muted-foreground">Loading bookings...</p>
                    )}
                    {bookingHistory.map((booking) => (
                        <Card key={booking.id} className="border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{booking.Salon?.businessName || 'Salon'}</h3>
                                <Badge variant={booking.status === 'pending' || booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                    {booking.status}
                                </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{booking.service?.name || 'Service'}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(booking.startAt).toLocaleDateString()}
                                </span>
                                <span>
                                  {formatTime(booking.startAt, booking.Salon?.timezone)}
                                </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                                <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setReschedulingBooking(booking)}
                                    >
                                      Reschedule
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      disabled={cancellingId === booking.id}
                                      onClick={() => handleCancelBooking(booking.id)}
                                    >
                                      {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                    </Button>
                                </>
                                ) : (
                                <>
                                  {booking.status === 'completed' && !booking.review && (
                                    <Button variant="outline" size="sm" onClick={() => setReviewingId(reviewingId === booking.id ? null : booking.id)}>
                                      Leave a review
                                    </Button>
                                  )}
                                  {booking.review && <Stars value={booking.review.rating} />}
                                  {booking.Salon?.id && (
                                    <Button asChild variant="outline" size="sm">
                                      <Link to={`/salon/${booking.Salon.id}`}>Book Again</Link>
                                    </Button>
                                  )}
                                </>
                                )}
                            </div>
                            </div>
                            {reviewingId === booking.id && (
                              <div className="mt-4 space-y-3 border-t pt-4">
                                <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                                  {[1, 2, 3, 4, 5].map((n) => (
                                    <button key={n} type="button" role="radio" aria-checked={reviewRating === n} aria-label={`${n} stars`}
                                      onClick={() => setReviewRating(n)} className="cursor-pointer">
                                      <Stars value={n <= reviewRating ? 5 : 0} size={24} />
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  maxLength={1000}
                                  placeholder="How was your visit? (optional)"
                                  className="w-full rounded-md border bg-background p-2 text-sm"
                                  rows={3}
                                />
                                <Button size="sm" disabled={reviewRating < 1} onClick={() => handleReview(booking.id)}>Submit review</Button>
                              </div>
                            )}
                        </CardContent>
                        </Card>
                    ))}
                    </CardContent>
                </Card>
                </TabsContent>

                {/* Favorites */}
                <TabsContent value="favorites">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Favorite Salons
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {favoritesLoading && <p className="text-sm text-muted-foreground">Loading favorites...</p>}
                    {!favoritesLoading && favoriteSalons.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {user.userType === 'user'
                          ? 'No favorite salons yet. Tap the heart on a salon to keep it here.'
                          : 'Favorites are available for customer accounts.'}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {favoriteSalons.map((salon) => (
                        <SalonCard key={salon.id} salon={salon} />
                      ))}
                    </div>
                    </CardContent>
                </Card>
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings">
                <div className="space-y-6">
                    {/* Notifications */}
                    <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Booking updates</Label>
                            <p className="text-sm text-muted-foreground">
                            When a salon confirms, declines or completes your booking
                            </p>
                        </div>
                        <Switch
                            checked={prefs.statusUpdates}
                            onCheckedChange={(checked) => changePref('statusUpdates', checked)}
                        />
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Appointment reminders</Label>
                            <p className="text-sm text-muted-foreground">
                            A reminder the day before and one hour before each confirmed appointment
                            </p>
                        </div>
                        <Switch
                            checked={prefs.reminders}
                            onCheckedChange={(checked) => changePref('reminders', checked)}
                        />
                        </div>
                        {prefsError && <p className="text-sm text-destructive" role="alert">{prefsError}</p>}
                    </CardContent>
                    </Card>

                    <SecuritySettings />
                </div>
                </TabsContent>
            </Tabs>
            </div>
            <RescheduleDialog
              booking={reschedulingBooking}
              onClose={() => setReschedulingBooking(null)}
              onMoved={fetchBookings}
            />
    </section>
  )
}

const ProfilePage = () => {
  const { user, isAuthChecked, setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const defaultTab = tab === 'bookings' || tab === 'favorites' || tab === 'settings' ? tab : 'personal';

  if (!isAuthChecked) {
    return <LoadingSpinner loading singular={false} />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Seo title="My profile" noindex />
      <ProfileContent user={user} setUser={setUser} defaultTab={defaultTab} />
    </>
  );
};

export default ProfilePage;