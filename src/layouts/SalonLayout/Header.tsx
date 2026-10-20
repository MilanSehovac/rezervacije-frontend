import { Link } from 'react-router-dom';
import { Sparkles, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../components/context/AuthContext';
import { NotificationBell } from '../../components/NotificationBell';

const Header = () => {
  const { salon, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/salon/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gradient-primary">
            {salon?.businessName || 'Salon Dashboard'}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Back to site</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
