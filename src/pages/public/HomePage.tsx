import { useNavigate } from 'react-router-dom';
import Hero from '../../components/sections/Hero';
import Categories from '../../components/sections/Categories';
import { useAuth } from '../../components/context/AuthContext'
import Features from '../../components/sections/Features';
import Testimonials from '../../components/sections/Testimonials';
import Cta from '../../components/sections/Cta';
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = () => {
    navigate('/directory');
  };

  const handleCategorySelect = () => {
    navigate('/directory');
  };

  const handleGetStarted = () => {
    if (!user) return;
    navigate('/directory');
  };

  return (
    <div className="space-y-16">
      <Hero onSearch={handleSearch} />
      <Categories onCategorySelect={handleCategorySelect} />
      <Features />
      <Testimonials />
      <Cta onGetStarted={handleGetStarted} />
    </div>
  );
};


export default Home;
