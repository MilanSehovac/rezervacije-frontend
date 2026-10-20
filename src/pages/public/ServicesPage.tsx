import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import LoadingSpinner from '../../components/ui/loadingSpinner'
import { PhaseBar } from '../../components/salon/PhaseBar'
import { Seo } from '../../components/Seo'
import { getAllSalons } from '../../helpers/salonHelpers'
import { formatMinutes, getPhases, getTotals } from '../../helpers/phases'
import type { SalonProfile, ServicePhase } from '../../components/types'

type ServiceGroup = {
  name: string
  salons: number
  minPrice: number
  maxPrice: number
  minDuration: number
  maxDuration: number
  phases: ServicePhase[]
}

/** Groups what the listed salons really offer by service name. */
const groupServices = (salons: SalonProfile[]): ServiceGroup[] => {
  const groups = new Map<string, ServiceGroup>()
  for (const salon of salons) {
    for (const service of salon.services ?? []) {
      const key = service.name.trim().toLowerCase()
      const phases = getPhases(service)
      const total = getTotals(phases).total
      const price = Number(service.price)
      const group = groups.get(key)
      if (!group) {
        groups.set(key, { name: service.name.trim(), salons: 1, minPrice: price, maxPrice: price, minDuration: total, maxDuration: total, phases })
      } else {
        group.salons += 1
        group.minPrice = Math.min(group.minPrice, price)
        group.maxPrice = Math.max(group.maxPrice, price)
        group.minDuration = Math.min(group.minDuration, total)
        group.maxDuration = Math.max(group.maxDuration, total)
      }
    }
  }
  return [...groups.values()].sort((a, b) => b.salons - a.salons || a.name.localeCompare(b.name))
}

const range = (min: number, max: number, format: (n: number) => string) => (min === max ? format(min) : `${format(min)} - ${format(max)}`)

const ServicesPage = () => {
  const [salons, setSalons] = useState<SalonProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getAllSalons()
      .then(setSalons)
      .catch(() => setSalons([]))
      .finally(() => setLoading(false))
  }, [])

  const groups = useMemo(() => groupServices(salons), [salons])
  const visible = groups.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <section className="space-y-8">
      <Seo
        title="Beauty services, prices and durations"
        description="See which beauty services salons offer, what they cost and how long they take. Find a salon and book online."
        path="/services"
      />
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything salons on BeautyBook offer right now, with real price ranges and how long each treatment takes.
        </p>
      </div>

      <Card className="border-0 shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              aria-label="Search services"
              placeholder="Search services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 h-12 border-0 bg-input-background"
            />
          </div>
        </CardContent>
      </Card>

      {loading && <LoadingSpinner loading singular={false} />}

      {!loading && groups.length === 0 && (
        <p className="text-center text-muted-foreground">No services are listed yet. Check back soon.</p>
      )}
      {!loading && groups.length > 0 && visible.length === 0 && (
        <p className="text-center text-muted-foreground">No service matches "{query}".</p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((group) => (
          <li key={group.name}>
            <Card className="h-full border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-xl font-semibold leading-tight">{group.name}</h2>
                  <Badge variant="secondary">{group.salons} {group.salons === 1 ? 'salon' : 'salons'}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {range(group.minDuration, group.maxDuration, formatMinutes)}
                  </span>
                  <span className="font-semibold text-primary">{range(group.minPrice, group.maxPrice, (n) => `$${n}`)}</span>
                </div>
                {group.salons === 1 && <PhaseBar phases={group.phases} />}
                <Button asChild className="w-full bg-gradient-primary">
                  <Link to={`/search?q=${encodeURIComponent(group.name)}`}>Find salons</Link>
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ServicesPage
