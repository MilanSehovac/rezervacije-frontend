import { Facebook, Globe, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Switch } from "../../ui/switch"
import { Button } from "../../ui/button"
import type { SalonFormChange, SalonFormData } from "../../types"
import type { TimeType } from "../../constants/salon"

interface Props {
    formData: SalonFormData;
    onChange: SalonFormChange;
    onNext:() => void;
    onBack:() => void;
    onDayChange: (day: string) => void;
    onTimeChange: (day: string, type: TimeType, value: string) => void;
}

const StepDetails = ({
    formData, 
    onChange, 
    onNext, 
    onBack,
    onTimeChange,
    onDayChange
}:Props) => {
  return (
    <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contact & Location Details
            </CardTitle>
            <CardDescription>
              Help customers find and reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@yoursalon.com"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => onChange('city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => onChange('state', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={(e) => onChange('zipCode', e.target.value)}
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <Label>Social Media & Website (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Website URL"
                      value={formData.website}
                      onChange={(e) => onChange('website', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Instagram handle"
                      value={formData.instagram}
                      onChange={(e) => onChange('instagram', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Facebook page"
                      value={formData.facebook}
                      onChange={(e) => onChange('facebook', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4">
              <Label>Operating Hours *</Label>
              <Card className="border-muted">
                <CardContent className="p-4 space-y-3">
                  {Object.entries(formData.daysOfOperation).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <Switch
                          checked={hours.enabled}
                          onCheckedChange={() => onDayChange(day)}
                        />
                        <Label className="capitalize">{day}</Label>
                      </div>
                      {hours.enabled ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => onTimeChange(day, 'open', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => onTimeChange(day, 'close', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Closed</span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Seats */}
            <div className="space-y-2">
              <Label htmlFor="seats">Seats / stations (optional)</Label>
              <Input
                id="seats"
                type="number"
                min={1}
                placeholder="Leave empty for unlimited"
                value={formData.seats ?? ''}
                onChange={(e) => onChange('seats', e.target.value === '' ? null : Math.max(1, Math.round(Number(e.target.value))))}
                className="w-56"
              />
              <p className="text-xs text-muted-foreground">
                How many clients can be in the salon at once. A client occupies a seat for the whole service, including passive time.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button
                onClick={onNext}
                disabled={
                  !formData.email ||
                  !formData.phone ||
                  !formData.address ||
                  !formData.city ||
                  !formData.state ||
                  !formData.zipCode ||
                  Object.values(formData.daysOfOperation).some(d => d.enabled && d.open >= d.close)
                }
                className="flex-1 bg-gradient-primary"
              >
                Continue to Services
              </Button>
            </div>
          </CardContent>
        </Card>
  )
}

export default StepDetails