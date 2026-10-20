import { useEffect, useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Input } from '../ui/input';
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { getSiteStats, type SiteStats } from '../../helpers/publicHelpers';

interface HeroProps {
    onSearch: (query: string, location?: string) => void;
  }

const Hero = ({onSearch}: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    getSiteStats().then(setStats).catch(() => setStats(null));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim(), location.trim());
  };

  // Only real numbers, and only the ones worth showing
  const figures = stats
    ? [
        { number: stats.salons, label: stats.salons === 1 ? 'Salon' : 'Salons' },
        { number: stats.cities, label: stats.cities === 1 ? 'City' : 'Cities' },
        { number: stats.completedBookings, label: 'Appointments completed' },
      ].filter((f) => f.number > 0)
    : [];

  return (
    <section className="relative overflow-hidden bg-gradient-beauty rounded-3xl" aria-labelledby="hero-title">
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Badge className='border-primary/20 bg-white/80 text-primary'>
                            Real prices, real opening hours
                        </Badge>
                        <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Book salon{' '}
                            <span className="text-gradient-primary block">
                                appointments{' '}
                            </span>
                            online
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Find hair salons, barbers, nail studios and spas, see what each service costs and how long
                            it takes, and pick a free time that suits you.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} role="search" className="bg-white rounded-2xl p-6 shadow-beauty-md">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                                <Input
                                aria-label="Service or salon"
                                placeholder="Service or salon (e.g. haircut, manicure)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 text-base border-0 bg-muted/50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                            <Input
                            aria-label="City"
                            placeholder="City"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-12 h-14 text-base border-0 bg-muted/50 focus:bg-white transition-colors"
                            />
                            </div>
                            <Button type="submit" className="w-full h-14 bg-gradient-primary text-base font-medium">
                                Search salons
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </form>

                    {figures.length > 0 && (
                      <dl className="flex flex-wrap gap-x-8 gap-y-2">
                        {figures.map((stat) => (
                        <div key={stat.label}>
                            <dd className="text-xl md:text-2xl font-bold text-primary">{stat.number.toLocaleString()}</dd>
                            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                        </div>
                        ))}
                      </dl>
                    )}
                </div>
                <div className="relative">
                    <ImageWithFallback
                    src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=700&fit=crop"
                    alt="Hairdresser styling a client in a salon"
                    width={600}
                    height={700}
                    className="w-full h-[500px] object-cover rounded-2xl shadow-beauty-lg"
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
