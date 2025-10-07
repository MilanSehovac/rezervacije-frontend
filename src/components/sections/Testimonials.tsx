import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const Testimonials = () => {
    const testimonials = [
        {
          name: 'Sarah Johnson',
          avatar: 'SJ',
          rating: 5,
          text: 'Amazing app! Found the perfect salon near me and booked instantly. The service was exceptional!',
          service: 'Hair Styling'
        },
        {
          name: 'Emily Chen',
          avatar: 'EC',
          rating: 5,
          text: 'Love how easy it is to compare salons and prices. Saved so much time and money!',
          service: 'Nail Care'
        },
        {
          name: 'Maria Rodriguez',
          avatar: 'MR',
          rating: 5,
          text: 'The best beauty booking app! Great deals and reliable service every time.',
          service: 'Spa Treatment'
        }
      ];
  return (
    <section className="bg-gradient-beauty rounded-3xl">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by
              <span className="text-gradient-primary"> Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about their BeautyBook experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-beauty bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3 leading-relaxed">"{testimonial.text}"</p>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.service}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Testimonials