import { useEffect, useState } from 'react';
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
  CreditCard,
  Shield,
  Save,
  Camera
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { useAuth } from '../../components/context/AuthContext';
import { updateUserProfile } from '../../helpers/userHelpers';
import type { UserFormData } from '../../components/types';
import LoadingSpinner from '../../components/ui/loadingSpinner';
import { Navigate } from 'react-router-dom'


const ProfilePage = () => {
    const { user, isAuthChecked, setUser } = useAuth();
    if (!isAuthChecked) {
        return <LoadingSpinner loading singular={false} />
      }
      
      if (!user) {
        return <Navigate to="/login" replace />
      }
    const [isEditing, setIsEditing] = useState(false)
    const [userFormData, setUserFormData] = useState<UserFormData>({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode
    })
    useEffect(() => {
        if (user) {
          setUserFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            zipCode: user.zipCode || ''
          })
        }
      }, [user])
    const [notifications, setNotifications] = useState({
        bookingConfirmations: true,
        promotions: true,
        reminders: true,
        newMessages: true
    })
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
      const bookingHistory = [];
      const favoriteSalons = [];
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
                                    {favoriteSalons.length} Favorites
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
            <Tabs defaultValue="personal" className="space-y-6">
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
                            value={userFormData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
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
                    {bookingHistory.map((booking) => (
                        <Card key={booking.id} className="border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{booking.salon}</h3>
                                <Badge variant={booking.status === 'upcoming' ? 'default' : 'secondary'}>
                                    {booking.status}
                                </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{booking.service}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(booking.date).toLocaleDateString()}
                                </span>
                                <span>{booking.time}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {booking.status === 'upcoming' ? (
                                <>
                                    <Button variant="outline" size="sm">Reschedule</Button>
                                    <Button variant="destructive" size="sm">Cancel</Button>
                                </>
                                ) : (
                                <Button variant="outline" size="sm">Book Again</Button>
                                )}
                            </div>
                            </div>
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
                    {favoriteSalons.map((salon) => (
                        <Card key={salon.id} className="border shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold">{salon.name}</h3>
                                <p className="text-sm text-muted-foreground">{salon.category}</p>
                                <div className="flex items-center gap-4 text-sm">
                                <Badge variant="secondary" className="gap-1">
                                    ⭐ {salon.rating}
                                </Badge>
                                <span className="text-muted-foreground">{salon.visits} visits</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-gradient-primary">Book Now</Button>
                                <Button variant="outline" size="sm">
                                <Heart className="w-4 h-4 fill-current" />
                                </Button>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
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
                            <Label>Booking Confirmations</Label>
                            <p className="text-sm text-muted-foreground">
                            Receive confirmation emails for new bookings
                            </p>
                        </div>
                        <Switch
                            checked={notifications.bookingConfirmations}
                            onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, bookingConfirmations: checked }))
                            }
                        />
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Promotions & Offers</Label>
                            <p className="text-sm text-muted-foreground">
                            Get notified about special deals and promotions
                            </p>
                        </div>
                        <Switch
                            checked={notifications.promotions}
                            onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, promotions: checked }))
                            }
                        />
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Appointment Reminders</Label>
                            <p className="text-sm text-muted-foreground">
                            Reminders before your scheduled appointments
                            </p>
                        </div>
                        <Switch
                            checked={notifications.reminders}
                            onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, reminders: checked }))
                            }
                        />
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>New Messages</Label>
                            <p className="text-sm text-muted-foreground">
                            Notifications for messages from salons
                            </p>
                        </div>
                        <Switch
                            checked={notifications.newMessages}
                            onCheckedChange={(checked) =>
                            setNotifications(prev => ({ ...prev, newMessages: checked }))
                            }
                        />
                        </div>
                    </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full gap-2">
                        <CreditCard className="w-4 h-4" />
                        Add Payment Method
                        </Button>
                    </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                        Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                        Delete Account
                        </Button>
                    </CardContent>
                    </Card>
                </div>
                </TabsContent>
            </Tabs>
            </div>
    </section>
  )
}

export default ProfilePage