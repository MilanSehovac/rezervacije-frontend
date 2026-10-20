import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ImageWithFallback } from './ImageWithFallback'
import type { SalonProfile } from '../types';
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
import { salonPath } from '../../helpers/slug';
import { FavoriteButton } from '../salon/FavoriteButton';
import { DEFAULT_TIMEZONE, isOpenNow } from '../../helpers/timezone';

interface SalonCardProps {
  salon: SalonProfile;
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
      case 'hair-salon': return 'Hair Salon';
      case 'nail-salon': return 'Nail Salon';
      case 'spa': return 'Spa & Wellness';
      case 'beauty-salon': return 'Beauty Salon';
      default: return 'Salon';
    }
  };

  const priceLabel =
    salon.minPrice == null || salon.maxPrice == null
      ? ''
      : salon.minPrice === salon.maxPrice
      ? `$${salon.minPrice}`
      : `$${salon.minPrice} - $${salon.maxPrice}`;
  const open = isOpenNow(salon.daysOfOperation, salon.timezone || DEFAULT_TIMEZONE);

  return (
    <Link to={salonPath(salon)}>
      <Card className="overflow-hidden hover:shadow-beauty-md transition-all duration-300 cursor-pointer group border-0 shadow-beauty">
        <div className="relative">
          <ImageWithFallback
            src={salon.images[0]}
            alt={salon.businessName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant="default"
              className={open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
            >
              <Clock className="w-3 h-3" />
              {open ? 'Open now' : 'Closed'}
            </Badge>
          </div>
          <FavoriteButton salonId={salon.id} className="absolute bottom-3 right-3" />
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 gap-1">
              {getCategoryIcon(salon.category)}
              {getCategoryLabel(salon.category)}
            </Badge>
          </div>

        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {salon.businessName}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {salon.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {salon.reviewCount ? (
                <>
                  <span className="font-medium">{salon.rating}</span>
                  <span className="text-muted-foreground">({salon.reviewCount})</span>
                </>
              ) : (
                <span className="text-muted-foreground">New</span>
              )}
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
            {(salon.services || []).slice(0, 3).map((service, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {service.name}
              </Badge>
            ))}
            {(salon.services || []).length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{(salon.services || []).length - 3} more
              </Badge>
            )}
            </div>
          </div>

          {/* Specialties */}
          {(salon.specialties ?? []).length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">

              </div>
            </div>
          )}

          {/* Pricing and Availability */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{salon.priceRange ?? ''}</span>
              <span className="text-muted-foreground">{priceLabel}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Link to={salonPath(salon)}>
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              variant={'default'}
              className="flex-1"
            
            >
              <Link to={salonPath(salon)}>
                Book Now
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>

  );
}