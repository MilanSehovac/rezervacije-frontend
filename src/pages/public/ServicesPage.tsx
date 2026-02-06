import { useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Clock, Heart, Paintbrush, Scissors, Sparkles, Star, TrendingUp } from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle} from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '../../components/ui/button'

interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    priceRange: string;
    duration: string;
    popular: boolean;
  }
const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Sparkles },
    { id: 'hair', name: 'Hair Services', icon: Scissors },
    { id: 'nails', name: 'Nail Services', icon: Paintbrush },
    { id: 'spa', name: 'Spa & Wellness', icon: Heart },
    { id: 'makeup', name: 'Makeup & Beauty', icon: Sparkles },
  ];
const services: Service[] = [
    // Hair Services
    {
      id: '1',
      name: 'Premium Cut & Style',
      description: 'Professional haircut with personalized styling consultation',
      category: 'hair',
      priceRange: '$45 - $85',
      duration: '45-60 min',
      popular: true
    },
    {
      id: '2',
      name: 'Color Treatment',
      description: 'Full color service including highlights, balayage, or full color',
      category: 'hair',
      priceRange: '$95 - $250',
      duration: '2-3 hours',
      popular: true
    },
    {
      id: '3',
      name: 'Keratin Treatment',
      description: 'Smoothing treatment for frizz-free, glossy hair',
      category: 'hair',
      priceRange: '$150 - $350',
      duration: '2-3 hours',
      popular: false
    },
    {
      id: '4',
      name: 'Hair Extensions',
      description: 'Professional extension application for length and volume',
      category: 'hair',
      priceRange: '$200 - $800',
      duration: '2-4 hours',
      popular: false
    },
    {
      id: '5',
      name: 'Blowout & Styling',
      description: 'Professional blow dry and styling for any occasion',
      category: 'hair',
      priceRange: '$35 - $65',
      duration: '30-45 min',
      popular: true
    },
    
    // Nail Services
    {
      id: '6',
      name: 'Signature Manicure',
      description: 'Complete nail care with polish or gel finish',
      category: 'nails',
      priceRange: '$25 - $45',
      duration: '30-45 min',
      popular: true
    },
    {
      id: '7',
      name: 'Luxury Pedicure',
      description: 'Full pedicure service with massage and exfoliation',
      category: 'nails',
      priceRange: '$45 - $75',
      duration: '60-75 min',
      popular: true
    },
    {
      id: '8',
      name: 'Gel Nail Art',
      description: 'Custom gel nail designs with extended wear',
      category: 'nails',
      priceRange: '$55 - $95',
      duration: '60-90 min',
      popular: false
    },
    {
      id: '9',
      name: 'Acrylic Extensions',
      description: 'Full set of acrylic nail extensions',
      category: 'nails',
      priceRange: '$60 - $100',
      duration: '90-120 min',
      popular: false
    },
    
    // Spa & Wellness
    {
      id: '10',
      name: 'Signature Facial',
      description: 'Customized facial treatment for your skin type',
      category: 'spa',
      priceRange: '$75 - $150',
      duration: '60-90 min',
      popular: true
    },
    {
      id: '11',
      name: 'Hot Stone Massage',
      description: 'Relaxing massage therapy with heated stones',
      category: 'spa',
      priceRange: '$95 - $180',
      duration: '60-90 min',
      popular: true
    },
    {
      id: '12',
      name: 'Body Wrap Treatment',
      description: 'Detoxifying body wrap with natural ingredients',
      category: 'spa',
      priceRange: '$85 - $160',
      duration: '75-90 min',
      popular: false
    },
    {
      id: '13',
      name: 'Aromatherapy Session',
      description: 'Therapeutic massage with essential oils',
      category: 'spa',
      priceRange: '$80 - $140',
      duration: '60 min',
      popular: false
    },
    
    // Makeup & Beauty
    {
      id: '14',
      name: 'Professional Makeup',
      description: 'Full makeup application for events or photos',
      category: 'makeup',
      priceRange: '$65 - $150',
      duration: '45-60 min',
      popular: true
    },
    {
      id: '15',
      name: 'Bridal Makeup Package',
      description: 'Complete bridal makeup with trial session',
      category: 'makeup',
      priceRange: '$250 - $500',
      duration: '2-3 hours',
      popular: true
    },
    {
      id: '16',
      name: 'Brow Sculpting',
      description: 'Professional eyebrow shaping and tinting',
      category: 'makeup',
      priceRange: '$25 - $50',
      duration: '30 min',
      popular: true
    },
    {
      id: '17',
      name: 'Lash Extensions',
      description: 'Semi-permanent eyelash extension application',
      category: 'makeup',
      priceRange: '$120 - $300',
      duration: '90-120 min',
      popular: false
    },
  ];
  interface ServicesPageProps {
    onBookService?: (serviceId: string) => void;
  }
const ServicesPage = ({onBookService}: ServicesPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const popularServices = services.filter(s => s.popular);
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary">Discover Beauty Services</span>
        </div>
        <h1 className="text-4xl md:text-5xl text-gradient-primary">
          Browse All Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our complete range of beauty and wellness services. 
          Book with top-rated professionals in your area.
        </p>
      </div>
      {/* Search Bar */}
      <Card className="border-0 shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 border-0 bg-input-background"
            />
          </div>
        </CardContent>
      </Card>
      {/* Popular Services */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl">Most Popular</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularServices.map((service) => {
              const CategoryIcon = serviceCategories.find(c => c.id === service.category)?.icon || Sparkles;
              return (
                <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </Badge>
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <span className="font-semibold text-primary">{service.priceRange}</span>
                    </div>
                    <Button className="w-full bg-gradient-primary cursor-pointer" onClick={() => onBookService?.(service.id)}>
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        {serviceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2 cursor-pointer"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>
      {/* All Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">
            {selectedCategory === 'all' ? 'All Services' : serviceCategories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <Badge variant="secondary">{filteredServices.length} services</Badge>
        </div>

        {filteredServices.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No services found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const CategoryIcon = serviceCategories.find(c => c.id === service.category)?.icon || Sparkles;
              return (
                <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                      {service.popular && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <span className="font-semibold text-primary">{service.priceRange}</span>
                    </div>
                    <Button className="w-full bg-gradient-primary cursor-pointer" onClick={() => onBookService?.(service.id)}>
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesPage