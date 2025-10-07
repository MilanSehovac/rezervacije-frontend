import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Award, Calendar, Shield } from 'lucide-react';

const Features = () => {
    const features = [
        {
          icon: <Calendar className="w-8 h-8 text-primary" />,
          title: 'Instant Booking',
          description: 'Book appointments in just 3 taps. No calls, no waiting.',
          stats: '500K+ bookings monthly'
        },
        {
          icon: <Shield className="w-8 h-8 text-primary" />,
          title: 'Verified Salons',
          description: 'All our partners are verified and highly rated by real customers.',
          stats: '10K+ verified salons'
        },
        {
          icon: <Award className="w-8 h-8 text-primary" />,
          title: 'Best Prices',
          description: 'Compare prices and find the best deals in your area.',
          stats: 'Save up to 30%'
        }
      ];
  return (
    <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose
            <span className="text-gradient-primary"> BeautyBook?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We make beauty booking simple, secure, and rewarding
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-beauty hover:shadow-beauty-md transition-all">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  {feature.stats}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
    </section>
  )
}

export default Features