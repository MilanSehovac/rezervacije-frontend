import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '../ui/card.tsx';
import { Input } from '../ui/input.tsx';
import { Button } from '../ui/button.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx';
import { Badge } from '../ui/badge.tsx';
import { SalonCard } from '../ui/salonCard.tsx';
import type { Salon } from '../ui/salonCard.tsx';
import LoadingSpinner from '../ui/loadingSpinner.tsx'

import { 
  Search, 
  MapPin, 
  Star, 
  Clock,
  Scissors,
  Palette,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

interface SalonDirectoryProps {
  onSalonSelect: (salonId: string) => void;
}

export function SalonDirectory({}: SalonDirectoryProps) {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSalons = async () =>{
      try {
        const res = await fetch('/api/salons')
        const data = await res.json();
        setSalons(data)
      } catch (error) {
        console.log('Error Fetching Data', error)
      } finally {
        setLoading(false);
      }
    }
    fetchSalons();
  }, [])

  const filteredSalons = useMemo(() => {
    
    let filtered = salons;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(salon => 
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(salon => salon.category === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      filtered = filtered.filter(salon => salon.priceRange === selectedPriceRange);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.priceRange.length - b.priceRange.length;
        case 'price-high':
          return b.priceRange.length - a.priceRange.length;
        case 'distance':
          return parseFloat(a.distance?.replace(' mi', '') || '0') - parseFloat(b.distance?.replace(' mi', '') || '0');
        default:
          return 0;
      }
    });

    return filtered;
  }, [salons, searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: null },
    { value: 'barber', label: 'Barbershops', icon: <Scissors className="w-4 h-4" /> },
    { value: 'nail-salon', label: 'Nail Salons', icon: <Palette className="w-4 h-4" /> },
    { value: 'spa', label: 'Spas & Wellness', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'beauty-salon', label: 'Beauty Salons', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search salons, services, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="gap-2"
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Rating
                      </div>
                    </SelectItem>
                    <SelectItem value="distance">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Distance
                      </div>
                    </SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="$">$ ($20-40)</SelectItem>
                      <SelectItem value="$$">$$ ($40-80)</SelectItem>
                      <SelectItem value="$$$">$$$ ($80+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="today">Available Today</SelectItem>
                      <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (<LoadingSpinner loading={loading} singular={false} />) : (
        <>
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {filteredSalons.length} salon{filteredSalons.length !== 1 ? 's' : ''} found
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            </p>
            
            {/* Open Now Filter */}
            <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted">
              <Clock className="w-3 h-3" />
              {filteredSalons.filter(s => s.isOpen).length} open now
            </Badge>
          </div>

          {/* Salon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalons.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}          />
            ))}
          </div>

          {/* No Results */}
          {filteredSalons.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No salons found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedPriceRange('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

    </div>
  );
}