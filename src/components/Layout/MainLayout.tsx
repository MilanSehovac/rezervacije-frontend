import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { AuthModal } from "../auth/AuthModal"

interface UserProfile {
    name: string;
    avatar?: string;
    type: 'customer' | 'provider';
  }

const MainLayout = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <div className="min-h-screen bg-background">
        <Header  onAuthClick={() => setShowAuthModal(true)}/>
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <Outlet />
                </div>
            </main>
        <Footer />
      <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}

export default MainLayout