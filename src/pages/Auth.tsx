
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { ConnectionTest } from '@/components/ConnectionTest';
import { useLanguage } from '@/hooks/useLanguage';
import SEO from '@/components/SEO';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(loginData.email, loginData.password);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم"
      });
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "حدث خطأ في تسجيل الدخول";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(registerData.email, registerData.password, registerData.fullName);
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول"
      });
      // Clear form
      setRegisterData({ email: '', password: '', fullName: '' });
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = "حدث خطأ في إنشاء الحساب";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <SEO
        title="تسجيل الدخول | مجموعة ديتا"
        description="صفحة الدخول الخاصة بإدارة محتوى مجموعة ديتا."
        url="https://deta.sd/auth"
        canonical="https://deta.sd/auth"
        noindex
      />
      <div className="absolute inset-x-0 top-0 h-56 sm:h-72 bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light" aria-hidden="true" />
      <Card className="relative w-full max-w-md rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light px-6 pt-8 pb-6 text-center text-white">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 border border-white/25">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <CardTitle className="text-2xl arabic-heading text-white justify-center">مجموعة ديتا</CardTitle>
          <p className="text-white/85 text-sm mt-1">نظام إدارة المحتوى</p>
        </div>
        <CardContent className="p-5 sm:p-6">
          {error && (
            <Alert variant="destructive" className="mb-4 rounded-2xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-4">
            <ConnectionTest />
          </div>
          
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1">
              <TabsTrigger value="login" className="rounded-full text-sm">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register" className="rounded-full text-sm">{t('auth.register')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                    disabled={loading}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                    disabled={loading}
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full bg-deta-green hover:bg-deta-green/90 shadow-md" disabled={loading}>
                  {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {t('auth.login')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                    required
                    disabled={loading}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regEmail">{t('auth.email')}</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                    disabled={loading}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword">{t('auth.password')}</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                    disabled={loading}
                    minLength={6}
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full bg-deta-green hover:bg-deta-green/90 shadow-md" disabled={loading}>
                  {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {t('auth.register')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
