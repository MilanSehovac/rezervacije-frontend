import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Stars } from "../salon/Stars";
import { getRecentReviews, type FeaturedReview } from "../../helpers/publicHelpers";

/** Real, recent reviews from customers. Renders nothing until there are some. */
const Testimonials = () => {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);

  useEffect(() => {
    getRecentReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="bg-gradient-beauty rounded-3xl" aria-labelledby="reviews-title">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 id="reviews-title" className="text-3xl md:text-4xl font-bold mb-4">
            What customers
            <span className="text-gradient-primary"> say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Recent reviews from people who visited</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-beauty bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">{review.author}</h3>
                  <Stars value={review.rating} />
                </div>
                <blockquote className="text-muted-foreground mb-4 leading-relaxed">“{review.comment}”</blockquote>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/salon/${review.salonId}`} className="text-sm font-medium text-primary hover:underline">
                    {review.salonName}
                  </Link>
                  {review.service && (
                    <Badge variant="outline" className="text-xs">
                      {review.service}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
