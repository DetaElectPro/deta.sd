
import { useState, useEffect } from 'react';
import { useBackgroundImages } from '@/hooks/useBackgroundImages';

const AnimatedBackground = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: backgroundImagesData } = useBackgroundImages();

  // الصور الافتراضية في حالة عدم وجود بيانات من قاعدة البيانات
  const defaultImages = [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    'https://images.unsplash.com/photo-1606836591695-4d58a1b335f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2826&q=80',
  ];

  // استخدام الصور من قاعدة البيانات أو الصور الافتراضية
  const backgroundImages = backgroundImagesData && backgroundImagesData.length > 0
    ? backgroundImagesData.map(img => img.url)
    : defaultImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // تغيير الصورة كل 5 ثواني

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-palm-950" aria-hidden="true">
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[2000ms] ease-in-out ${
            index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}

      {/* طبقة تدرج للتأكد من قراءة النص */}
      <div className="absolute inset-0 bg-gradient-to-t from-palm-950/95 via-palm-950/55 to-palm-950/25"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-palm-950/40 via-transparent to-transparent"></div>

      {/* طبقة إضافية للون العلامة التجارية */}
      <div className="absolute inset-0 bg-deta-green/25"></div>

      {/* توهج ذهبي خافت */}
      <div className="absolute -top-24 end-0 h-72 w-72 rounded-full bg-deta-gold/15 blur-3xl"></div>
      <div className="absolute bottom-0 start-0 h-80 w-80 rounded-full bg-deta-green-light/20 blur-3xl"></div>

      {/* عناصر متحركة إضافية */}
      <div className="absolute inset-0">
        <div className="absolute top-20 start-10 h-2 w-2 animate-ping rounded-full bg-deta-gold opacity-70"></div>
        <div className="absolute top-40 end-20 h-3 w-3 animate-pulse rounded-full bg-deta-gold/60"></div>
        <div className="absolute bottom-32 start-1/4 h-1.5 w-1.5 animate-ping rounded-full bg-white delay-1000"></div>
        <div className="absolute bottom-20 end-1/3 h-2.5 w-2.5 animate-pulse rounded-full bg-deta-gold/40 delay-500"></div>
      </div>

      {/* مؤشرات الصور */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2 sm:bottom-8">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'w-8 bg-deta-gold'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`انتقل إلى الصورة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
