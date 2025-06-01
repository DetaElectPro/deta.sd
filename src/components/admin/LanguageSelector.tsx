
import { useLanguage } from '@/hooks/useLanguage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, languages, t, isLoading } = useLanguage();

  console.log('LanguageSelector render:', { currentLanguage, languages, isLoading });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 animate-pulse" />
        <div className="w-32 h-9 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!languages || languages.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="text-sm">Loading languages...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
        <SelectTrigger className="w-32 bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
          <SelectValue placeholder={t('language.switch')} />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300 z-50">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="text-gray-900 hover:bg-gray-100"
            >
              {language.native_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
