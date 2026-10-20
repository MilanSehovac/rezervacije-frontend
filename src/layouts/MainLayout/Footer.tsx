import { Link } from 'react-router-dom';
import { Mail, Phone, Sparkles } from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import { useAuth } from '../../components/context/AuthContext';

const Footer = () => {
  const { user, salon } = useAuth();

  const browseLinks = [
    { label: 'Find salons', href: '/search' },
    { label: 'Services', href: '/services' },
    { label: 'Hair salons', href: '/search?category=hair-salon' },
    { label: 'Barbershops', href: '/search?category=barber' },
    { label: 'Nail studios', href: '/search?category=nail-salon' },
    { label: 'Spa & wellness', href: '/search?category=spa' },
  ];

  // only real destinations: the owner area for owners, otherwise the sign-up dialog on the home page
  const salonLink =
    user?.userType === 'salon_owner'
      ? { label: salon ? 'Your dashboard' : 'List your salon', href: salon ? '/salon/dashboard' : '/salon/create' }
      : { label: 'List your salon', href: '/' };

  return (
    <footer className="border-t border-border bg-gradient-to-br from-beauty-lavender via-white to-beauty-pink mobile-safe-bottom">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-3" aria-label="BeautyBook home">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-beauty">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-bold text-gradient-primary">BeautyBook</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Find a salon, barber, nail studio or spa and book a free time online.
            </p>
          </div>

          <nav aria-label="Browse">
            <h2 className="mb-4 font-semibold text-foreground">Browse</h2>
            <ul className="space-y-2">
              {browseLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 font-semibold text-foreground">For salons &amp; contact</h2>
            <ul className="space-y-2">
              <li>
                {user?.userType === 'salon_owner' ? (
                  <Link to={salonLink.href} className="text-sm text-muted-foreground hover:text-primary">
                    {salonLink.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: 'signup' }))}
                    className="cursor-pointer text-sm text-muted-foreground hover:text-primary"
                  >
                    {salonLink.label}
                  </button>
                )}
              </li>
              <li>
                <a href="tel:+38766452126" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  +387 66 452 126
                </a>
              </li>
              <li>
                <a href="mailto:contact@codevolt.ba" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  contact@codevolt.ba
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} BeautyBook. Built by{' '}
            <a href="https://codevolt.ba" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              CodeVolt
            </a>
            .
          </p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-primary">Cookie Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
