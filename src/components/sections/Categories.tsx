import { Heart, Palette, Scissors, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';

// category values match the ones salons are saved with
const categories = [
  { id: 'hair-salon', title: 'Hair salons', icon: <Scissors className="w-6 h-6" />, description: 'Cuts, colour, styling', color: 'bg-rose-100 text-rose-600' },
  { id: 'barber', title: 'Barbershops', icon: <User className="w-6 h-6" />, description: 'Haircuts, beard trims, shaves', color: 'bg-sky-100 text-sky-600' },
  { id: 'nail-salon', title: 'Nail studios', icon: <Palette className="w-6 h-6" />, description: 'Manicures, pedicures, nail art', color: 'bg-purple-100 text-purple-600' },
  { id: 'spa', title: 'Spa & wellness', icon: <Sparkles className="w-6 h-6" />, description: 'Facials, massages, treatments', color: 'bg-green-100 text-green-600' },
  { id: 'beauty-salon', title: 'Beauty & makeup', icon: <Heart className="w-6 h-6" />, description: 'Makeup, brows, lashes', color: 'bg-pink-100 text-pink-600' },
];

const Categories = () => {
  return (
    <section className="container mx-auto px-4" aria-labelledby="categories-title">
        <div className="text-center mb-12">
            <h2 id="categories-title" className='text-3xl md:text-4xl font-bold mb-4'>
                Browse by
                <span className="text-gradient-primary"> category</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick the kind of place you are looking for
            </p>
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/search?category=${category.id}`} className="block h-full">
                <Card className="h-full border-0 shadow-beauty hover:shadow-beauty-md transition-all cursor-pointer group hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
    </section>
  )
}

export default Categories
