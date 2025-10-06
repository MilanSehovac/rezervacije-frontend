import { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Input } from '../ui/input';
import { ArrowRight, Calendar, MapPin, Search, Star } from 'lucide-react'

interface HeroProps {
    onSearch: (query: string, location?: string) => void;
  }

const Hero = ({onSearch}: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const handleSearch = () => {
    onSearch(searchQuery, location);
  };
  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '10K+', label: 'Partner Salons' },
    { number: '100+', label: 'Cities' },
    { number: '500K+', label: 'Bookings Made' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-beauty rounded-3xl">
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Badge className='bg-white/20 text-primary-foreground border-white/30'>
                            ✨ Book with confidence
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Book Beauty
                            <span className="text-gradient-primary block">
                                Appointments
                            </span>
                            Instantly
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Discover and book with the best salons, spas, and beauty professionals 
                            in your area. Compare prices, read reviews, and book instantly.
                        </p>
                    </div>

                    {/* Search Bar */}

                    <div className="bg-white rounded-2xl p-6 shadow-beauty-md">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                placeholder="Search for services (e.g., haircut, manicure)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 text-base border-0 bg-muted/50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                            placeholder="Enter your location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-12 h-14 text-base border-0 bg-muted/50 focus:bg-white transition-colors"
                            />
                            </div>
                            <Button 
                            onClick={handleSearch}
                            className="w-full h-14 bg-gradient-primary text-base font-medium"
                            >
                                Find Salons Near Me
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>   
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-xl md:text-2xl font-bold text-primary">{stat.number}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                        ))}
                    </div> 
                </div>
                {/* Hero Image */}
                <div className="relative">
                    <div className="relative z-10">
                        <ImageWithFallback
                        src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=700&fit=crop"
                        alt="Beauty salon"
                        className="w-full h-[500px] object-cover rounded-2xl shadow-beauty-lg"
                        />
                    </div>
                    <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-beauty'>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">Next Available</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Today at 2:30 PM</p>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-beauty">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="font-medium">4.9</span>
                        </div>
                        <p className="text-sm text-muted-foreground">1,200+ reviews</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero