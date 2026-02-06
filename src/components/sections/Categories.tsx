import { Heart, Palette, Scissors, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface CategoriesProps {
    onCategorySelect: (category: string) => void;
  }

const Categories = ({onCategorySelect}: CategoriesProps) => {
    const categories = [
        {
          id: 'hair',
          title: 'Hair Styling',
          icon: <Scissors className="w-6 h-6" />,
          description: 'Cuts, colors, styling',
          color: 'bg-rose-100 text-rose-600',
          services: '1,200+ services'
        },
        {
          id: 'nails',
          title: 'Nail Care',
          icon: <Palette className="w-6 h-6" />,
          description: 'Manicures, pedicures, art',
          color: 'bg-purple-100 text-purple-600',
          services: '800+ services'
        },
        {
          id: 'spa',
          title: 'Spa & Wellness',
          icon: <Sparkles className="w-6 h-6" />,
          description: 'Facials, massages, treatments',
          color: 'bg-green-100 text-green-600',
          services: '600+ services'
        },
        {
          id: 'makeup',
          title: 'Makeup',
          icon: <Heart className="w-6 h-6" />,
          description: 'Special events, bridal',
          color: 'bg-pink-100 text-pink-600',
          services: '400+ services'
        }
      ];
  return (
    <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                Book Your perfect
                <span className="text-gradient-primary"> Beauty Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From quick touch-ups to full makeovers, find the perfect service for every occasion
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
            <Card 
              key={category.id}
              className="group cursor-pointer hover:shadow-beauty-md transition-all duration-300 border-0 shadow-beauty"
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-3">{category.description}</p>
                <Badge variant="outline" className="text-xs">
                  {category.services}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
    </section>
  )
}

export default Categories