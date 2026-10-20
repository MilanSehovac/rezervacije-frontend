import { Suspense, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { AuthModal } from "../../components/auth/AuthModal"
import LoadingSpinner from "../../components/ui/loadingSpinner"

const MainLayout = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  // pages (e.g. the home page call to action) can ask for the sign-in / sign-up dialog
  useEffect(() => {
    const open = (e: Event) => {
      setActiveTab((e as CustomEvent<'signin' | 'signup'>).detail === 'signup' ? 'signup' : 'signin');
      setShowAuthModal(true);
    };
    window.addEventListener('open-auth', open);
    return () => window.removeEventListener('open-auth', open);
  }, []);
  return (
    <div className="min-h-screen bg-background">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow">
          Skip to content
        </a>
        <Header  onAuthClick={(tab: 'signin' | 'signup') => {
          setShowAuthModal(true);
          setActiveTab(tab);
        }}/>
            <main id="main" className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <Suspense fallback={<LoadingSpinner loading singular={false} />}>
                      <Outlet />
                    </Suspense>
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