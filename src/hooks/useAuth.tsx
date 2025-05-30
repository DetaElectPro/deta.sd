
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  userProfile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User logged in, fetching profile...');
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('Profile fetch result:', { profile, error });
              
              if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
                // إذا لم يكن هناك ملف شخصي، قم بإنشاء واحد
                if (error.code === 'PGRST301' || error.message?.includes('no rows returned')) {
                  console.log('No profile found, creating one...');
                  const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                      id: session.user.id,
                      email: session.user.email,
                      full_name: session.user.user_metadata?.full_name || session.user.email,
                      role: 'admin' // مؤقتاً جعل جميع المستخدمين مديرين للاختبار
                    })
                    .select()
                    .single();
                    
                  if (insertError) {
                    console.error('Error creating profile:', insertError);
                  } else {
                    console.log('Profile created successfully:', newProfile);
                    setUserProfile(newProfile);
                  }
                }
              } else {
                console.log('Profile loaded successfully:', profile);
                setUserProfile(profile);
              }
            } catch (err) {
              console.error('Error in profile fetch:', err);
            }
          }, 0);
        } else {
          console.log('User logged out, clearing profile...');
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    // Check network connectivity first
    if (!navigator.onLine) {
      throw new Error('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('بيانات الدخول غير صحيحة');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('يرجى تأكيد البريد الإلكتروني أولاً');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          throw new Error('مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى');
        }
        throw error;
      }
      
      console.log('Sign in successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign in failed:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting sign up for:', email);
    
    // Check network connectivity first
    if (!navigator.onLine) {
      throw new Error('لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى.');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('User already registered')) {
          throw new Error('المستخدم مسجل بالفعل');
        } else if (error.message.includes('Password should be')) {
          throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
          throw new Error('مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى');
        }
        throw error;
      }
      
      console.log('Sign up successful:', data.user?.email);
    } catch (error: any) {
      console.error('Sign up failed:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى');
      }
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out failed:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى');
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      userProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
