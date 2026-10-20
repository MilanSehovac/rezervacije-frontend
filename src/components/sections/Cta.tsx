import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CtaProps {
    /** owners go to their dashboard or the salon form, everybody else opens registration */
    isOwner: boolean
    hasSalon: boolean
    onRegister: () => void
}

const Cta = ({ isOwner, hasSalon, onRegister }: CtaProps) => {
  return (
  <section className="container mx-auto px-4" aria-labelledby="cta-title">
    <Card className="bg-gradient-primary border-0 shadow-beauty-lg">
      <CardContent className="p-12 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 id="cta-title" className="text-3xl md:text-4xl font-bold">
            Run a salon?
            <span className="block">Let clients book online</span>
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            List your services with active and waiting time, set your opening hours and let customers book the free
            gaps, so you can take another client while a colour develops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isOwner ? (
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8">
                <Link to={hasSalon ? '/salon/dashboard' : '/salon/create'}>
                  {hasSalon ? 'Open your dashboard' : 'List your salon'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button onClick={onRegister} size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8">
                Create a salon account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
  )
}

export default Cta
