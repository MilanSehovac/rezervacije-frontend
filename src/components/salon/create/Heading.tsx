import { Store } from 'lucide-react'
const Heading = () => {
  return (
    <div className="text-center space-y-4">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
      <Store className="w-4 h-4 text-primary" />
      <span className="text-sm text-primary">Grow Your Business</span>
    </div>
    <h1 className="text-4xl md:text-5xl text-gradient-primary">
      List Your Salon
    </h1>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      Join our platform and reach thousands of potential customers. 
      Complete the form below to get started.
    </p>
  </div>
  )
}

export default Heading