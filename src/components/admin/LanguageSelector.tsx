
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, languages, t, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 animate-pulse" />
        <div className="w-32 h-9 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('language.switch')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.native_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
