import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ImageWithFallback } from './ImageWithFallback'
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Scissors, 
  Palette, 
  Sparkles,
  DollarSign,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Salon {
  id: string;
  name: string;
  category: 'barber' | 'nail-salon' | 'spa' | 'beauty-salon';
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  priceRange: '$' | '$$' | '$$$';
  openHours: string;
  services: string[];
  specialties: string[];
  isOpen: boolean;
  nextAvailable: string;
  distance?: string;
}

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'barber': return <Scissors className="w-4 h-4" />;
      case 'nail-salon': return <Palette className="w-4 h-4" />;
      case 'spa': return <Sparkles className="w-4 h-4" />;
      case 'beauty-salon': return <Sparkles className="w-4 h-4" />;
      default: return <Scissors className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'barber': return 'Barbershop';
      case 'nail-salon': return 'Nail Salon';
      case 'spa': return 'Spa & Wellness';
      case 'beauty-salon': return 'Beauty Salon';
      default: return 'Salon';
    }
  };

  const getPriceRangeLabel = (range: string) => {
    switch (range) {
      case '$': return '$20-40';
      case '$$': return '$40-80';
      case '$$$': return '$80+';
      default: return '';
    }
  };

  return (
    <Link to={'/salon/' + salon.id}>
      <Card className="overflow-hidden hover:shadow-beauty-md transition-all duration-300 cursor-pointer group border-0 shadow-beauty">
        <div className="relative">
          <ImageWithFallback
            src={salon.image}
            alt={salon.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge 
              variant={salon.isOpen ? "default" : "secondary"} 
              className={`gap-1 ${salon.isOpen ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}
            >
              <Clock className="w-3 h-3" />
              {salon.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 gap-1">
              {getCategoryIcon(salon.category)}
              {getCategoryLabel(salon.category)}
            </Badge>
          </div>
          {salon.distance && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="bg-white/90">
                {salon.distance}
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {salon.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {salon.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{salon.rating}</span>
              <span className="text-muted-foreground">({salon.reviewCount})</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location and Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{salon.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{salon.phone}</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Services</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {salon.services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
              {salon.services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{salon.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Specialties */}
          {salon.specialties.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {salon.specialties.slice(0, 2).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    ⭐ {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Pricing and Availability */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{salon.priceRange}</span>
              <span className="text-muted-foreground">{getPriceRangeLabel(salon.priceRange)}</span>
            </div>
            {salon.isOpen && (
              <span className="text-green-600 font-medium">
                Next: {salon.nextAvailable}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Link to={'/salon/' + salon.id}>
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              variant={'default'}
              className="flex-1"
              disabled={!salon.isOpen}
            >
              <Link to={'/salon/' + salon.id}>
                {salon.isOpen ? 'Book Now' : 'Closed'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>

  );
}