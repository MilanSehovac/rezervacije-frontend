import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Award, Calendar, Clock, DollarSign, Globe, MapPin, Phone, Share2, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

const SalonPage = () => {
const [activeTab, setActiveTab] = useState('services');
const salon = useLoaderData();

const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing service! The staff was professional and my haircut turned out perfect. Will definitely be coming back.',
    date: '2024-01-10',
    service: 'Classic Haircut'
  },
  {
    id: '2',
    customerName: 'Mike Chen',
    rating: 5,
    comment: 'Best barbershop in town. Great atmosphere and attention to detail. Highly recommend the hot towel shave.',
    date: '2024-01-08',
    service: 'Hot Towel Shave'
  },
  {
    id: '3',
    customerName: 'Emily Davis',
    rating: 4,
    comment: 'Good service overall. The wait time was a bit long but the quality was worth it.',
    date: '2024-01-05',
    service: 'Styling'
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
      }`}
    />
  ));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

  return (
    <div className="space-y-6">
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
            src={salon.image}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              
              <Badge variant="secondary">
                {salon.category.charAt(0).toUpperCase() + salon.category.slice(1).replace('-', ' ')}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{salon.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars(Math.floor(salon.rating))}
                <span className="ml-2 font-medium">{salon.rating}</span>
                <span className="text-white/80">({salon.reviewCount} reviews)</span>
              </div>
              <Badge variant={salon.isOpen ? "default" : "secondary"} className="gap-1">
                <Clock className="w-3 h-3" />
                {salon.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>
          <div className="absolute top-6 right-6">
            <Button asChild size="lg" className="gap-2">
              <Link to={'/salon/' + salon.id + '/calendar'}>
                <Calendar className="w-4 h-4" />
                Book Now
              </Link>
            </Button>
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
                <p className="text-sm text-muted-foreground">{salon.address}</p>
                {salon.distance && (
                  <p className="text-sm text-green-600">{salon.distance} away</p>
                )}
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
                <p className="text-sm text-muted-foreground">{salon.openHours}</p>
                {salon.isOpen && (
                  <p className="text-sm text-green-600">Next: {salon.nextAvailable}</p>
                )}
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
                  {salon.priceRange} - {salon.priceRange === '$' ? '$20-40' : salon.priceRange === '$$' ? '$40-80' : '$80+'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services" className="cursor-pointer">Services</TabsTrigger>
          <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="reviews" className="cursor-pointer">Reviews</TabsTrigger>
          <TabsTrigger value="contact" className="cursor-pointer">Contact</TabsTrigger>
        </TabsList>     

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Services</CardTitle>
              <p className="text-muted-foreground">Professional services tailored to your needsTEST</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salon.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">{service}</h5>
                      <p className="text-sm text-muted-foreground">Professional {service.toLowerCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$25-45</p>
                      <p className="text-sm text-muted-foreground">30-45 min</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
        <Card>
            <CardHeader>
              <CardTitle>About {salon.name}</CardTitle>
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
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose {salon.name}?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium">Top Rated</h5>
                    <p className="text-sm text-muted-foreground">
                      {salon.rating} stars from {salon.reviewCount}+ happy customers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Quick Booking</h5>
                    <p className="text-sm text-muted-foreground">
                      Easy online booking with instant confirmation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Expert Staff</h5>
                    <p className="text-sm text-muted-foreground">
                      Professional stylists with years of experience
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">Premium Quality</h5>
                    <p className="text-sm text-muted-foreground">
                      High-quality products and personalized service
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>     

            <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(Math.floor(salon.rating))}
                  <span className="ml-2 text-2xl font-bold">{salon.rating}</span>
                </div>
                <div className="text-muted-foreground">
                  Based on {salon.reviewCount} reviews
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {review.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium">{review.customerName}</h5>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {review.service}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <p className="text-muted-foreground">{salon.openHours}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Social
                </Button>
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  ) 
}

interface salonLoaderProp{
  params: {
    id: string
  }
}

const salonLoader = async ({ params }: salonLoaderProp) => {
  const res = await fetch(`/api/salons/${params.id}`);
  const data = await res.json();
  return data;
}

export { SalonPage as default, salonLoader };