import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const UserLocation = () => {
  const [location, setLocation] = useState<string>('');
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualCity, setManualCity] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            const city = data.city || data.locality;
            const country = data.countryCode;
            setLocation(`${city || 'Unknown'}, ${country}`);
          },
          async (error) => {
            console.warn('Geolocation denied, using IP fallback:', error);
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            const city = data.city || 'Unknown';
            const country = data.country_code || '??';
            setLocation(`${city}, ${country}`);
          }
        );
      } catch (err) {
        console.error('Failed to fetch location:', err);
        setManualMode(true);
      }
    };
    fetchLocation();
  }, []);
  const handleManualSave = () => {
    if (manualCity.trim()) {
      setLocation(`${manualCity.trim()}, --`);
      setManualMode(false);
    }
  };
  if (manualMode) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter your city..."
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            className="w-[140px]"
          />
          <Button size="sm" onClick={handleManualSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="w-4 h-4" />
      <span>{location || 'Fetching location...'}</span>
    </div>
  );
};
export default UserLocation;