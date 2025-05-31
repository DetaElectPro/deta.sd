
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';

interface ArticleTranslation {
  id: string;
  article_id: string;
  language_code: string;
  title: string;
  excerpt?: string;
  content?: string;
  slug: string;
}

interface Article {
  id: string;
  author: string;
  category: string;
  image_url?: string;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  title?: string;
  excerpt?: string;
  content?: string;
  slug?: string;
}

export const useMultilingualArticles = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['multilingual_articles', currentLanguage],
    queryFn: async () => {
      console.log('Fetching articles for language:', currentLanguage);
      
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          id,
          author,
          category,
          image_url,
          is_featured,
          published_at,
          created_at,
          updated_at,
          article_translations!inner(
            id,
            title,
            excerpt,
            content,
            slug,
            language_code
          )
        `)
        .eq('article_translations.language_code', currentLanguage)
        .order('published_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Fetched articles:', articles);
      
      return articles?.map(article => ({
        ...article,
        title: article.article_translations?.[0]?.title || '',
        excerpt: article.article_translations?.[0]?.excerpt || '',
        content: article.article_translations?.[0]?.content || '',
        slug: article.article_translations?.[0]?.slug || ''
      })) || [];
    },
    enabled: !!currentLanguage
  });
};

export const useCreateMultilingualArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ articleData, translations }: { 
      articleData: any; 
      translations: Record<string, ArticleTranslation> 
    }) => {
      console.log('Creating article with data:', articleData, translations);
      
      // إنشاء المقال الأساسي
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();
      
      if (articleError) {
        console.error('Error creating article:', articleError);
        throw articleError;
      }
      
      console.log('Created article:', article);
      
      // إنشاء الترجمات
      const translationPromises = Object.entries(translations).map(([langCode, translation]) => {
        if (translation.title) { // فقط إنشاء الترجمة إذا كان لديها عنوان
          return supabase
            .from('article_translations')
            .insert({
              article_id: article.id,
              language_code: langCode,
              title: translation.title,
              excerpt: translation.excerpt || '',
              content: translation.content || '',
              slug: translation.slug || translation.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            });
        }
        return null;
      }).filter(Boolean);
      
      const results = await Promise.all(translationPromises);
      console.log('Translation results:', results);
      
      return article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multilingual_articles'] });
    }
  });
};

export const useUpdateMultilingualArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      articleId, 
      articleData, 
      translations 
    }: { 
      articleId: string; 
      articleData: any; 
      translations: Record<string, ArticleTranslation> 
    }) => {
      console.log('Updating article:', articleId, articleData, translations);
      
      // تحديث المقال الأساسي
      const { error: articleError } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', articleId);
      
      if (articleError) {
        console.error('Error updating article:', articleError);
        throw articleError;
      }
      
      // تحديث الترجمات
      const translationPromises = Object.entries(translations).map(([langCode, translation]) => {
        if (translation.title) {
          return supabase
            .from('article_translations')
            .upsert({
              article_id: articleId,
              language_code: langCode,
              title: translation.title,
              excerpt: translation.excerpt || '',
              content: translation.content || '',
              slug: translation.slug || translation.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'article_id,language_code'
            });
        }
        return null;
      }).filter(Boolean);
      
      await Promise.all(translationPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multilingual_articles'] });
    }
  });
};
