import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  Sparkles, 
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Award,
  Heart,
  Instagram,
  Linkedin
} from 'lucide-react';

const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Find Salons', href: '/search' },
    { label: 'Book Appointment', href: '/' },
    { label: 'Gift Cards', href: '/' },
    { label: 'Membership', href: '/' },
  ];

  const services = [
    { label: 'Hair Styling', href: '/' },
    { label: 'Nail Care', href: '/' },
    { label: 'Spa & Wellness', href: '/' },
    { label: 'Makeup Services', href: '/' },
    { label: 'Skincare', href: '/' },
  ];

  const support = [
    { label: 'Help Center', href: '/' },
    { label: 'Contact Us', href: '/' },
    { label: 'Booking Support', href: '/' },
    { label: 'Cancellation Policy', href: '/' },
  ];

  const business = [
    { label: 'For Salons', href: '/' },
    { label: 'Partner Program', href: '/' },
    { label: 'Business Tools', href: '/' },
    { label: 'Analytics', href: '/' },
  ];

  const features = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Easy Booking',
      description: 'Book appointments in just 3 taps'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure & Safe',
      description: 'Your data is protected with us'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Top Rated',
      description: 'Only verified, high-quality salons'
    }
  ];

  return (
<footer className="bg-gradient-to-br from-beauty-lavender via-white to-beauty-pink border-t border-border mobile-safe-bottom">
      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
                <div className="text-primary">
                  {feature.icon}
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <Separator className="mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-beauty">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient-primary">BeautyBook</h3>
                <p className="text-xs text-muted-foreground">Book your beauty</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Discover and book appointments with the best beauty professionals in your area. 
              From hair styling to spa treatments, we connect you with top-rated salons.
            </p>

            <div className="space-y-3">
              <Link to={'tel:+387 66 452 126'} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+387 66 452 126</span>
              </Link>
              <Link to={'mail:contact@codevolt.ba'} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>contact@codevolt.ba</span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Available in 50+ cities</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-primary">
                    <Link to={link.href}>
                      {link.label}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-primary">
                    {service.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {support.map((item, index) => (
                <li key={index}>
                  <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-primary">
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">For Business</h4>
            <ul className="space-y-3">
              {business.map((item, index) => (
                <li key={index}>
                  <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-primary">
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
            
            <div className="mt-6">
              <Button className="w-full bg-gradient-primary" size="sm">
                List Your Salon
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 BeautyBook. Powered by <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"><Link to={'https://codevolt.ba'} target='_blank'>CodeVolt</Link></Button>.</p>
            <div className="flex items-center gap-4">
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                <Link to={'/privacy-policy'} >
                  Privacy Policy
                </Link>
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                <Link to={'/terms-of-service'}>
                  Terms of Service
                </Link>
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                <Link to={'/cookie-policy'}>
                  Cookie Policy
                </Link>
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground mr-2">Follow us:</span>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-primary/10">
              <Link to={'https://codevolt.ba'} target='_blank'>
                <Globe className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-primary/10">
              <Link to={'https://www.instagram.com/codevolt.ba/'} target='_blank'>
                <Instagram className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-primary/10">
              <Link to={'https://www.linkedin.com/company/107935700'} target='_blank'>
                <Linkedin />
              </Link>
            </Button>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mt-8 p-6 bg-gradient-beauty rounded-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Get the BeautyBook App</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Book on-the-go with our mobile app. Available soon on iOS and Android.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Badge variant="outline" className="bg-white/50">
              📱 Coming to App Store
            </Badge>
            <Badge variant="outline" className="bg-white/50">
              🤖 Coming to Google Play
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;