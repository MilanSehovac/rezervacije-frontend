import { useNavigate } from 'react-router-dom';
import Hero from '../../components/sections/Hero';
import Categories from '../../components/sections/Categories';
import { useAuth } from '../../components/context/AuthContext'
import Features from '../../components/sections/Features';
import Testimonials from '../../components/sections/Testimonials';
import Cta from '../../components/sections/Cta';
import { Seo } from '../../components/Seo';
import { SITE_URL } from '../../helpers/siteUrl';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, salon } = useAuth();

  const handleSearch = (query: string, city?: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    const qs = params.toString();
    navigate(qs ? `/search?${qs}` : '/search');
  };

  return (
    <div className="space-y-16">
      <Seo
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', name: 'BeautyBook', url: SITE_URL },
            {
              '@type': 'WebSite',
              name: 'BeautyBook',
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            },
          ],
        }}
      />
      <Hero onSearch={handleSearch} />
      <Categories />
      <Features />
      <Testimonials />
      <Cta
        isOwner={user?.userType === 'salon_owner'}
        hasSalon={!!salon}
        onRegister={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: 'signup' }))}
      />
    </div>
  );
};

export default Home;
