import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackgroundImages } from '@/hooks/useBackgroundImages';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

export const BackgroundImagePreview = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { data: images } = useBackgroundImages();

  const backgroundImages = images && images.length > 0 
    ? images.map(img => ({ url: img.url, title: img.title }))
    : [
        { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80', title: 'زراعة حديثة' },
        { url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80', title: 'تكنولوجيا زراعية' },
        { url: 'https://images.unsplash.com/photo-1606836591695-4d58a1b335f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80', title: 'صناعة الأغذية' },
        { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2826&q=80', title: 'مجال التكنولوجيا' }
      ];

  useEffect(() => {
    if (!isPlaying || backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 3000); // تغيير الصورة كل 3 ثواني في المعاينة

    return () => clearInterval(interval);
  }, [isPlaying, backgroundImages.length]);

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % backgroundImages.length
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (backgroundImages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>معاينة صور الخلفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">لا توجد صور للمعاينة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>معاينة صور الخلفية المتحركة</span>
          <span className="text-sm font-normal text-gray-500">
            {currentImageIndex + 1} من {backgroundImages.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
          ))}
          
          {/* طبقة تدرج للنص */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          
          {/* عنوان الصورة */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-semibold">
              {backgroundImages[currentImageIndex]?.title}
            </h3>
          </div>
          
          {/* مؤشرات الصور */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`انتقل إلى الصورة ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* أزرار التحكم */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevious}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          {isPlaying ? 'تشغيل تلقائي' : 'متوقف'} • 
          تغيير كل 3 ثواني في المعاينة (5 ثواني في الموقع)
        </div>
      </CardContent>
    </Card>
  );
};
