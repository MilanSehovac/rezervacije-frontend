import { Card, CardContent } from '../ui/card'
import { Clock, Eye, Calendar } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="w-8 h-8 text-primary" />,
    title: 'Free times only',
    description: 'You only see times that are really free, even when a treatment has waiting time in the middle.',
  },
  {
    icon: <Eye className="w-8 h-8 text-primary" />,
    title: 'Clear prices and durations',
    description: 'Every service shows its price and how long it takes, split into hands-on and waiting time.',
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: 'Reminders that help',
    description: 'Get a notification when the salon confirms, a day before and an hour before your appointment.',
  },
];

const Features = () => {
  return (
    <section className="container mx-auto px-4" aria-labelledby="features-title">
        <div className="text-center mb-12">
          <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-4">
            Why book with
            <span className="text-gradient-primary"> BeautyBook?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Booking that respects your time and the salon&apos;s
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-beauty hover:shadow-beauty-md transition-all">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
    </section>
  )
}

export default Features
