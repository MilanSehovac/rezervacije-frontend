import { Eye, EyeOff, Lock, Mail, Phone, Smartphone, Sparkles, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import axios from 'axios'

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  agreeTerms: boolean;
  userType: number;
}
interface authModalProps{
  isOpen : boolean,
  onClose : () => void
}

export function AuthModal({isOpen, onClose}: authModalProps) {
  const [activeTab, setActiveTab] = useState('signin');
  const [accountType, setAccountType] = useState<'customer' | 'provider'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    agreeTerms: false,
    userType: 1,
  });
  const isValidName = ([firstName, lastName]: [string, string]) => {
    return firstName.trim().length > 0 && lastName.trim().length > 0;
  };
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const isValidPhone = (phone: string) => {
    const regex = /^\+?\d{10,15}$/;
    return regex.test(phone);
  };
  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };
  const validateForm = (formData: FormData) => {
    if (!isValidName([formData.firstName, formData.lastName])) {
      return "Please enter a valid first and last name";
    }
  
    if (!isValidEmail(formData.email)) {
      return "Please enter a valid email";
    }
  
    if (!isValidPhone(formData.phoneNumber)) {
      return "Please enter a valid phone number";
    }
  
    if (!isValidPassword(formData.password)) {
      return "Password must be at least 8 characters long and contain at least one number";
    }
  
    if (!formData.agreeTerms) {
      return "You must agree to the terms";
    }
  
    return null;
  };
  const handleAccountTypeChange = (type: 'customer' | 'provider') => {
    setAccountType(type);
    setFormData((prev) => ({
      ...prev,
      userType: type === 'customer' ? 1 : 2,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (activeTab === 'signin') {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email: formData.email,
        password: formData.password,
      });
      console.log("User logged in:", res.data);
      
      localStorage.setItem("token", res.data.token);
      onClose();
    } catch (error: any) {
      console.error("Error logging in:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed.");
    }
  };
  const handleRegister = async () => {
    const error = validateForm(formData);
    if (error) {
      alert(error);
      return;
    }
  
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, formData);
      console.log("User created:", res.data);
      onClose();
    } catch (error: any) {
      console.error("Error creating user:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed.");
    }
  };
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const socialProviders = [
    { name: 'Google', icon: <span className="text-sm font-medium">G</span>, color: 'hover:bg-red-50' },
    { name: 'Facebook', icon: <span className="text-sm font-medium">f</span>, color: 'hover:bg-blue-50' },
    { name: 'Apple', icon: <Smartphone className="w-4 h-4" />, color: 'hover:bg-gray-50' }
  ];
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-beauty-lg">
        <DialogHeader className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-beauty">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-gradient-primary">
            Welcome to BeautyBook
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="signin" className="data-[state=active]:bg-white cursor-pointer">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white cursor-pointer">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                  <Input id="singin-email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="pl-10" required/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember"
                    className="cursor-pointer" 
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button variant="link" className="px-0 h-auto text-sm text-primary cursor-pointer">
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary h-12 cursor-pointer">
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mt-6">
                  <Label className="text-sm font-medium mb-3 block">I am a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant={accountType === 'customer' ? 'default' : 'outline'} onClick={() => handleAccountTypeChange('customer')} className="cursor-pointer h-12 flex-col gap-1">
                      <User className="w-4 h-4" />
                      <span className="text-xs">Customer</span>
                    </Button>
                    <Button
                      type="button"
                      variant={accountType === 'provider' ? 'default' : 'outline'}
                      onClick={() => handleAccountTypeChange('provider')}
                      className="cursor-pointer h-12 flex-col gap-1"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs">Salon Owner</span>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms"
                    className="cursor-pointer" 
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    I agree to the{' '}
                    <Button variant="link" className="px-0 h-auto text-sm text-primary cursor-pointer">
                      Terms of Service
                    </Button>{' '}
                    and{' '}
                    <Button variant="link" className="px-0 h-auto text-sm text-primary cursor-pointer">
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary h-12 cursor-pointer">
                  Create Account
                </Button>
              </form>
          </TabsContent>
        </Tabs>
        <div className="space-y-4"> 
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                className={`h-12 ${provider.color} transition-colors cursor-pointer`}
              >
                {provider.icon}
              </Button>
            ))}
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {activeTab === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <Button
            variant="link"
            onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
            className="px-0 h-auto text-sm text-primary font-medium cursor-pointer"
          >
            {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}