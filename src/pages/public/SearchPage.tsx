import Heading from '../../components/sections/Heading'
import { SalonDirectory } from '../../components/sections/SalonDirectory'
import { Seo } from '../../components/Seo'

const Search = () => {
  return (
    <div className="space-y-6">
        <Seo
          title="Find salons, barbers and spas"
          description="Browse hair salons, barbershops, nail studios and spas. Compare prices, read reviews and book an appointment online."
          path="/search"
        />
        <Heading Title={'Find your salon'} Paragraph={'Search by name, service or city and book a free time online'} />
        <SalonDirectory />
    </div>
  )
}

export default Search
