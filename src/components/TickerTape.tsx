
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'forex' | 'crypto';
}

const TickerTape = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // بيانات وهمية للأسعار (في التطبيق الحقيقي ستكون من API)
  const mockData: TickerItem[] = [
    { symbol: 'USD/SDG', name: 'دولار أمريكي', price: 620.50, change: 2.30, changePercent: 0.37, type: 'forex' },
    { symbol: 'EUR/SDG', name: 'يورو', price: 680.25, change: -1.75, changePercent: -0.26, type: 'forex' },
    { symbol: 'SAR/SDG', name: 'ريال سعودي', price: 165.40, change: 0.85, changePercent: 0.52, type: 'forex' },
    { symbol: 'BTC', name: 'بيتكوين', price: 98450.00, change: 1250.00, changePercent: 1.29, type: 'crypto' },
    { symbol: 'ETH', name: 'إيثيريوم', price: 3650.75, change: -45.25, changePercent: -1.22, type: 'crypto' },
    { symbol: 'GOLD', name: 'الذهب', price: 2024.80, change: 12.40, changePercent: 0.62, type: 'stock' },
    { symbol: 'OIL', name: 'النفط', price: 73.25, change: -0.85, changePercent: -1.15, type: 'stock' },
    { symbol: 'AAPL', name: 'أبل', price: 195.75, change: 2.15, changePercent: 1.11, type: 'stock' },
    { symbol: 'MSFT', name: 'مايكروسوفت', price: 378.50, change: -1.25, changePercent: -0.33, type: 'stock' },
    { symbol: 'GOOGL', name: 'جوجل', price: 142.80, change: 0.95, changePercent: 0.67, type: 'stock' },
  ];

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      setTickerData(mockData);
      setIsLoading(false);
    }, 1000);

    // تحديث البيانات كل 30 ثانية
    const updateInterval = setInterval(() => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 4,
        changePercent: (Math.random() - 0.5) * 2
      })));
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(updateInterval);
    };
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'forex': return 'text-blue-600';
      case 'crypto': return 'text-orange-600';
      case 'stock': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('/')) {
      return price.toFixed(2);
    }
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  if (isLoading) {
    return (
      <div className="bg-deta-green text-white py-2 overflow-hidden">
        <div className="animate-pulse text-center">
          <span className="text-sm">جاري تحميل الأسعار...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deta-green text-white py-2 overflow-hidden relative">
      <div className="ticker-wrapper">
        <div className="ticker-content flex gap-8 animate-ticker">
          {/* تكرار البيانات مرتين لضمان الحركة المستمرة */}
          {[...tickerData, ...tickerData].map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
              <span className={`text-xs font-medium ${getTypeColor(item.type)}`}>
                {item.type === 'forex' ? '💱' : item.type === 'crypto' ? '₿' : '📈'}
              </span>
              <span className="text-sm font-bold">{item.symbol}</span>
              <span className="text-sm">{formatPrice(item.price, item.symbol)}</span>
              <div className={`flex items-center gap-1 text-xs ${
                item.change >= 0 ? 'text-deta-gold' : 'text-red-300'
              }`}>
                {item.change >= 0 ? 
                  <TrendingUp className="w-3 h-3" /> : 
                  <TrendingDown className="w-3 h-3" />
                }
                <span>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}</span>
                <span>({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)</span>
              </div>
              <span className="text-xs text-gray-300 mr-2">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TickerTape;
