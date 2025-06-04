
import React, { useState, useEffect } from 'react';

const AnimatedBackground = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // مجموعة من الصور المتعلقة بالزراعة والأعمال
  const backgroundImages = [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80', // زراعة حديثة
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80', // تكنولوجيا زراعية
    'https://images.unsplash.com/photo-1606836591695-4d58a1b335f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80', // صناعة الأغذية
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2826&q=80', // مجال التكنولوجيا
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // تغيير الصورة كل 5 ثواني

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}
      
      {/* طبقة تدرج للتأكد من قراءة النص */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      
      {/* طبقة إضافية للون العلامة التجارية */}
      <div className="absolute inset-0 bg-deta-green/20"></div>
      
      {/* عناصر متحركة إضافية */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-deta-gold rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-deta-gold/60 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-deta-gold/40 rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* مؤشرات الصور */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-deta-gold scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`انتقل إلى الصورة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
