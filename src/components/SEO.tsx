// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  employeeName?: string;
  employeeRole?: string;
}

export const SEO = ({
  title = 'TOMO Academy - Digital Learning Platform',
  description = 'TOMO Academy is a comprehensive digital learning platform offering high-quality educational content, tutorials, and resources for technology enthusiasts and learners.',
  keywords = ['TOMO Academy', 'online learning', 'tutorials', 'education', 'technology', 'programming', 'web development'],
  image = '/TOMO.jpg',
  url = 'https://www.tomoacademy.site',
  type = 'website',
  author = 'TOMO Academy',
  publishedTime,
  modifiedTime,
  employeeName,
  employeeRole,
}: SEOProps) => {
  const fullTitle = title.includes('TOMO Academy') ? title : `${title} | TOMO Academy`;
  const fullUrl = url.startsWith('http') ? url : `https://www.tomoacademy.site${url}`;
  const fullImage = image.startsWith('http') ? image : `https://www.tomoacademy.site${image}`;

  // Generate structured data for employee profiles
  const generateStructuredData = () => {
    if (type === 'profile' && employeeName) {
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": employeeName,
        "jobTitle": employeeRole,
        "worksFor": {
          "@type": "Organization",
          "name": "TOMO Academy",
          "url": "https://www.tomoacademy.site"
        },
        "url": fullUrl,
        "image": fullImage
      };
    }
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "TOMO Academy",
      "url": "https://www.tomoacademy.site",
      "logo": "https://www.tomoacademy.site/logo.png",
      "description": description,
      "sameAs": [
        "https://www.youtube.com/@tomoacademy",
        "https://twitter.com/tomo_academy"
      ]
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TOMO Academy" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      <meta property="twitter:site" content="@tomo_academy" />
      <meta property="twitter:creator" content="@tomo_academy" />

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

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'TOMO Academy - Digital Learning Platform',
    description: 'Learn programming, web development, and technology with TOMO Academy. High-quality tutorials, courses, and resources for developers.',
    keywords: ['TOMO Academy', 'online learning', 'programming tutorials', 'web development', 'technology education'],
    url: '/',
  },
  
  dashboard: {
    title: 'Dashboard',
    description: 'View your TOMO Academy dashboard with analytics, recent videos, and team performance metrics.',
    keywords: ['dashboard', 'analytics', 'metrics', 'performance'],
    url: '/dashboard',
  },
  
  team: {
    title: 'Our Team',
    description: 'Meet the talented team behind TOMO Academy. Experienced developers, designers, and content creators.',
    keywords: ['team', 'staff', 'employees', 'about us', 'meet the team'],
    url: '/team',
  },
  
  videos: {
    title: 'Videos',
    description: 'Browse our collection of educational videos covering programming, web development, and technology topics.',
    keywords: ['videos', 'tutorials', 'courses', 'lessons', 'learning content'],
    url: '/videos',
  },
  
  analytics: {
    title: 'Analytics',
    description: 'Real-time YouTube analytics and performance metrics for TOMO Academy channel.',
    keywords: ['analytics', 'youtube', 'metrics', 'statistics', 'performance'],
    url: '/analytics',
  },
};
