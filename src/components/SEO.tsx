
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  locale?: string;
  noindex?: boolean;
}

const SEO = ({
  title = "Deta Group - مجموعة ديتا | رائدة في الزراعة وتصنيع الأغذية وتطوير البرمجيات",
  description = "مجموعة ديتا - الشركة الرائدة في السودان للزراعة الحديثة، تصنيع الأغذية عالية الجودة، وتطوير حلول البرمجيات المبتكرة. أكثر من 15 عام من الخبرة و200+ موظف متخصص.",
  keywords = "ديتا, مجموعة ديتا, الزراعة, تصنيع الأغذية, البرمجيات, السودان, الخرطوم, زراعة حديثة, أغذية عضوية, تطوير برمجيات",
  image = "https://deta.sd/og-image.jpg",
  url = "https://deta.sd/",
  type = 'website',
  publishedTime,
  modifiedTime,
  author = "Deta Group",
  section,
  locale = "ar_SD",
  noindex = false
}: SEOProps) => {
  const fullTitle = title.includes('Deta Group') ? title : `${title} | Deta Group - مجموعة ديتا`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Deta Group" />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@detagroup" />

      {/* Additional SEO tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1e5b3a" />
    </Helmet>
  );
};

export default SEO;
