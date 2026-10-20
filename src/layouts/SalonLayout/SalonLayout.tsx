import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { Seo } from '../../components/Seo'
import LoadingSpinner from '../../components/ui/loadingSpinner'
const SalonLayout = () => {
    return(
        <div className="min-h-screen bg-background flex flex-col">
            <Seo title="Salon dashboard" noindex />
            <Header />
            <div className="flex flex-1 container mx-auto w-full">
              <Sidebar />
              <main className="flex-1 min-w-0 px-4 py-8">
                <Suspense fallback={<LoadingSpinner loading singular={false} />}>
                  <Outlet />
                </Suspense>
              </main>
            </div>
            <Footer />
        </div>
    )
}
export default SalonLayout