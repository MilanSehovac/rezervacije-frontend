import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet'
import { Badge } from '../../components/ui/badge'
import { Search, Sparkles, Calendar, Heart, User, Menu, Bell, LogOut, Store} from 'lucide-react'
import { useAuth } from '../../components/context/AuthContext'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import UserLocation from '../../components/ui/userLocation'

const Header = ({ onAuthClick }: { onAuthClick: (tab: 'signin' | 'signup') => void }) => {
  const { user, logout, salon } = useAuth();
  const hasSalon = !!salon;
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigationItems = [
    { id: 'home', label: 'Home', icon: null, path:'/' },
    { id: 'search', label: 'Find Salons', icon: <Search className="w-4 h-4" /> , path:'/search'},
    { id: 'services', label: 'Services', icon: <Sparkles className="w-4 h-4" /> , path:'/services'},
  ];
  const userItems = user ? [
    { id: 'reservations', label: 'My Reservations', icon: <Calendar className="w-4 h-4" />, path:'/reservations' },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" />, path:'/favorites' },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, path:'/profile' },
    { id: 'salon', label: hasSalon ? 'Manage My Salon' : 'List My Salon', icon: <Store />, path: hasSalon ? '/salon/dashboard' : '/salon/create' },
  ] : [];
  return (
    <header className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-border mobile-safe-top'>
      <div className='container mx-auto px-4'>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={'/'}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-beauty">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient-primary">BeautyBook</h1>
                <p className="text-xs text-muted-foreground">Book your beauty</p>
              </div>
            </div>
          </Link>
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
              type="text"
              placeholder='Search salons, services or locations...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
               />
                {searchQuery && (
                  <Button
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3"
                  >
                    Search
                  </Button>
                )}
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex item-center gap-6">
            {navigationItems.map((item) =>
            { 
              const isActive = location.pathname === item.path;
            return (
              <Button 
              key={item.id} 
              asChild 
              variant={isActive ? "default" : "ghost"}
              className="gap-2 px-4"
              >
                <Link
                  to={item.path}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            )})}
          </nav>
          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Location */}
              <UserLocation />
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-primary text-white text-sm">
                            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-sm font-medium">
                          {user?.firstName || 'User'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="capitalize">
                        {user?.firstName} {user?.lastName}
                        <p className="text-xs text-muted-foreground">{user?.userType}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {userItems.map((item) => (
                        <DropdownMenuItem key={item.id} asChild>
                          <Link to={item.path} className="flex items-center gap-2">
                            {item.icon}
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center gap-2 text-red-500 focus:text-red-600"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => {onAuthClick('signin')}} className="h-12 cursor-pointer">
                  Sign In
                </Button>
                <Button onClick={ () => {onAuthClick('signup')}} className="h-12 bg-gradient-primary cursor-pointer">
                  Get Started
                </Button>
              </div>
            )}
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={'ghost'} size={'sm'} className='md:hidden'>
                  <Menu className='w-t h-t' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] bg-white/95 backdrop-blur-xl'>
                <div className="flex flex-col gap-6 mt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  {/* Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navigationItems.map((item) =>
                    { 
                      const isActive = location.pathname === item.path;
                    return (
                      <Button 
                      key={item.id} 
                      asChild 
                      variant={isActive ? "default" : "ghost"}
                      className="justify-start gap-3 h-12"
                      >
                        <Link
                          to={item.path}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </Button>
                    )})}
                  </nav>
                  {/* User Items */}
                  {user ? (
                    <>
                      <hr className="border-border" />
                      <nav className="flex flex-col gap-2">
                        {userItems.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            className="justify-start gap-3 h-12"
                          >
                          <Link to={item.path}>
                            {item.icon}
                            {item.label}
                          </Link>
                          </Button>
                        ))}
                      </nav>
                    </>
                  ) : (
                    <>
                    <hr className="border-border" />
                    <div className="flex flex-col gap-3">
                      <Button variant="outline" onClick={() => onAuthClick('signin')} className="h-12">
                        Sign In
                      </Button>
                      <Button onClick={() => onAuthClick('signup')} className="h-12 bg-gradient-primary">
                        Get Started
                      </Button>
                    </div>
                  </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header