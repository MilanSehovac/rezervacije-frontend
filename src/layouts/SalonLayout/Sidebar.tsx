import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../components/context/AuthContext';

const navItems = [
  { path: '/salon/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/salon/create', label: 'List salon', icon: PlusCircle },
];

const Sidebar = () => {
  const location = useLocation();
  const { salon } = useAuth();

  const items = salon
    ? navItems.filter((item) => item.path !== '/salon/create')
    : navItems;

  return (
    <aside className="w-full md:w-56 shrink-0 border-r border-border bg-muted/30 min-h-[calc(100vh-4rem)] p-4">
      <nav className="flex flex-col gap-1">
        {items.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Button
              key={path}
              asChild
              variant={isActive ? 'default' : 'ghost'}
              className="justify-start gap-2"
            >
              <Link to={path}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </Button>
          );
        })}
        {!salon && (
          <Button asChild variant="default" className="justify-start gap-2 mt-2 bg-gradient-primary">
            <Link to="/salon/create">
              <PlusCircle className="w-4 h-4" />
              Create salon
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost" className="justify-start gap-2 mt-4">
          <Link to="/">
            <Home className="w-4 h-4" />
            Back to site
          </Link>
        </Button>
      </nav>
    </aside>
  );
};

export default Sidebar;
