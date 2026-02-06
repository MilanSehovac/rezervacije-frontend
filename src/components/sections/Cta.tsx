import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
interface CtaProps {
    onGetStarted: () => void
}
const Cta = ({onGetStarted} : CtaProps) => {
  return (
  <section className="container mx-auto px-4">
    <Card className="bg-gradient-primary border-0 shadow-beauty-lg">
      <CardContent className="p-12 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Do you want to make your salon
            <span className="block">Stand Out?</span>
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Join thousands of satisfied customers who book their beauty services through BeautyBook. 
            Fast, reliable, and always the best prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 h-14 px-8"
            >
              <Link to={'/search'}>
                Get Started Now
              </Link>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
  )
}

export default Cta