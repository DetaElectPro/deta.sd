
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

export const ConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setTesting(true);
    setStatus('idle');
    
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setStatus('success');
      setMessage('الاتصال مع قاعدة البيانات يعمل بشكل صحيح');
    } catch (error: any) {
      console.error('Connection test failed:', error);
      setStatus('error');
      
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        setMessage('فشل في الاتصال مع الخادم. يرجى التحقق من الإنترنت');
      } else {
        setMessage(`خطأ في الاتصال: ${error.message}`);
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={testConnection} 
        disabled={testing}
        variant="outline"
        className="w-full"
      >
        {testing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري اختبار الاتصال...
          </>
        ) : (
          <>
            <Wifi className="mr-2 h-4 w-4" />
            اختبار الاتصال
          </>
        )}
      </Button>
      
      {status === 'success' && (
        <Alert>
          <Wifi className="h-4 w-4" />
          <AlertDescription className="text-green-600">
            {message}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
