import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
const SalonLayout = () => {
    return(
        <div className="min-h-screen bg-background">
            <Header />
            <Sidebar />
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default SalonLayout