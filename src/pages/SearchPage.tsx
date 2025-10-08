import Heading from '../components/sections/Heading'
import { SalonDirectory } from '../components/sections/SalonDirectory'
const Search = () => {
    const handleSalonSelect = () => {}
  return (
    <div className="space-y-6">
        <Heading Title={'Find Your Perfect Salon'} Paragraph={'Discover and book appointments with top-rated salons in your area'} />
        <SalonDirectory 
        onSalonSelect={handleSalonSelect}
        />
    </div>
  )
}

export default Search