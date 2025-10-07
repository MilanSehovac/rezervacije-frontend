import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import Categories from '../components/sections/Categories';
import type { UserProfile } from '../components/types';
import Features from '../components/sections/Features';
import Testimonials from '../components/sections/Testimonials';
import Cta from '../components/sections/Cta';
const Home: React.FC = () => {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);


  const handleSearch = (query: string, location?: string) => {
    navigate('/directory');
  };

  const handleCategorySelect = (category: string) => {
    navigate('/directory');
  };

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      navigate('/directory');
    }
  };

  const handleLogin = (userData: UserProfile) => {
    setIsLoggedIn(true);
    setUserProfile(userData);
  };
  return (
    <div className='space-y-16'>
      <Hero 
      onSearch={handleSearch}
      />
      <Categories 
      onCategorySelect={handleCategorySelect}
      />
      <Features />
      <Testimonials />
      <Cta 
      onGetStarted={handleGetStarted}
      />
    </div>
  );
};

export default Home;
