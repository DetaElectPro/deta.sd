
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
  translations?: ArticleTranslation[];
}

export const useMultilingualArticles = () => {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['multilingual_articles', currentLanguage],
    queryFn: async () => {
      const { data: articles, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_translations!inner(*)
        `)
        .eq('article_translations.language_code', currentLanguage)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      return articles?.map(article => ({
        ...article,
        title: article.article_translations?.[0]?.title || '',
        excerpt: article.article_translations?.[0]?.excerpt || '',
        content: article.article_translations?.[0]?.content || '',
        slug: article.article_translations?.[0]?.slug || ''
      })) || [];
    }
  });
};

export const useCreateMultilingualArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ articleData, translations }: { 
      articleData: any; 
      translations: Record<string, ArticleTranslation> 
    }) => {
      // إنشاء المقال الأساسي
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();
      
      if (articleError) throw articleError;
      
      // إنشاء الترجمات
      const translationPromises = Object.entries(translations).map(([langCode, translation]) => 
        supabase
          .from('article_translations')
          .insert({
            article_id: article.id,
            language_code: langCode,
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content,
            slug: translation.slug
          })
      );
      
      await Promise.all(translationPromises);
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
      // تحديث المقال الأساسي
      const { error: articleError } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', articleId);
      
      if (articleError) throw articleError;
      
      // تحديث الترجمات
      const translationPromises = Object.entries(translations).map(([langCode, translation]) =>
        supabase
          .from('article_translations')
          .upsert({
            article_id: articleId,
            language_code: langCode,
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content,
            slug: translation.slug,
            updated_at: new Date().toISOString()
          })
      );
      
      await Promise.all(translationPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multilingual_articles'] });
    }
  });
};
