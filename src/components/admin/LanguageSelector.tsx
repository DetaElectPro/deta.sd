
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, languages, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
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
