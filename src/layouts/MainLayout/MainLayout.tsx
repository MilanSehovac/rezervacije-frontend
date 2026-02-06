import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { AuthModal } from "../../components/auth/AuthModal"

const MainLayout = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  return (
    <div className="min-h-screen bg-background">
        <Header  onAuthClick={(tab: 'signin' | 'signup') => {
          setShowAuthModal(true);
          setActiveTab(tab);
        }}/>
            <main className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <Outlet />
                </div>
            </main>
        <Footer />
      <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          activeTab = {activeTab}
          setActiveTab = {setActiveTab}
      />
    </div>
  )
}

export default MainLayout