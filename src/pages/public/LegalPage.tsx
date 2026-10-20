import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Seo } from '../../components/Seo';

const titles: Record<string, string> = {
  'privacy-policy': 'Privacy Policy',
  'terms-of-service': 'Terms of Service',
  'cookie-policy': 'Cookie Policy',
};

const LegalPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const title = titles[slug] || 'Legal';

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      {/* placeholder text: keep it out of search results until the real policy is published */}
      <Seo title={title} noindex />
      <h1 className="text-3xl font-bold text-gradient-primary">{title}</h1>
      <p className="text-muted-foreground leading-relaxed">
        This page is a placeholder for {title.toLowerCase()} content. BeautyBook will publish
        full legal text here before production launch.
      </p>
      <Button asChild variant="outline">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default LegalPage;
