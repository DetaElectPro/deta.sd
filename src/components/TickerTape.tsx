
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'forex' | 'crypto' | 'commodity';
}

const TickerTape = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch major currencies - استخدام بيانات ثابتة لتجنب مشاكل CORS
  const fetchMajorCurrencies = async (): Promise<TickerItem[]> => {
    try {
      // بيانات ثابتة للعملات الرئيسية (يمكن تحديثها لاحقاً)
      const rates = {
        SAR: 3.75,
        AED: 3.67,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.25
      };

      const majorCurrencies: TickerItem[] = [
        {
          symbol: 'USD/SAR',
          name: 'دولار/ريال سعودي',
          price: rates.SAR,
          change: (Math.random() - 0.5) * 0.05,
          changePercent: (Math.random() - 0.5) * 1,
          type: 'forex' as const
        },
        {
          symbol: 'USD/AED',
          name: 'دولار/درهم إماراتي',
          price: rates.AED,
          change: (Math.random() - 0.5) * 0.02,
          changePercent: (Math.random() - 0.5) * 0.5,
          type: 'forex' as const
        },
        {
          symbol: 'EUR/USD',
          name: 'يورو/دولار',
          price: 1 / rates.EUR,
          change: (Math.random() - 0.5) * 0.02,
          changePercent: (Math.random() - 0.5) * 2,
          type: 'forex' as const
        },
        {
          symbol: 'GBP/USD',
          name: 'جنيه/دولار',
          price: 1 / rates.GBP,
          change: (Math.random() - 0.5) * 0.02,
          changePercent: (Math.random() - 0.5) * 2,
          type: 'forex' as const
        },
        {
          symbol: 'USD/JPY',
          name: 'دولار/ين ياباني',
          price: rates.JPY,
          change: (Math.random() - 0.5) * 2,
          changePercent: (Math.random() - 0.5) * 1.5,
          type: 'forex' as const
        }
      ];

      return majorCurrencies;
    } catch (error) {
      console.error('Error fetching major currencies:', error);
      return [];
    }
  };

  // Fetch commodities (Gold, Silver, Cotton) - simulated data
  const fetchCommodities = async (): Promise<TickerItem[]> => {
    try {
      // Since free commodity APIs are limited, we'll simulate realistic data
      const commodities: TickerItem[] = [
        {
          symbol: 'GOLD',
          name: 'الذهب (أونصة)',
          price: 2020 + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.5) * 20,
          changePercent: (Math.random() - 0.5) * 2,
          type: 'commodity' as const
        },
        {
          symbol: 'SILVER',
          name: 'الفضة (أونصة)',
          price: 24 + (Math.random() - 0.5) * 4,
          change: (Math.random() - 0.5) * 1,
          changePercent: (Math.random() - 0.5) * 3,
          type: 'commodity' as const
        },
        {
          symbol: 'COTTON',
          name: 'القطن (رطل)',
          price: 0.70 + (Math.random() - 0.5) * 0.1,
          change: (Math.random() - 0.5) * 0.05,
          changePercent: (Math.random() - 0.5) * 5,
          type: 'commodity' as const
        }
      ];

      return commodities;
    } catch (error) {
      console.error('Error fetching commodities:', error);
      return [];
    }
  };

  // Fetch NASDAQ stocks - استخدام بيانات ثابتة لتجنب مشاكل CORS
  const fetchNasdaqStocks = async (): Promise<TickerItem[]> => {
    try {
      // بيانات ثابتة للأسهم الرئيسية (يمكن تحديثها لاحقاً عبر API آخر)
      const stockItems: TickerItem[] = [
        {
          symbol: 'AAPL',
          name: 'أبل',
          price: 175.43,
          change: 2.15,
          changePercent: 1.24,
          type: 'stock' as const
        },
        {
          symbol: 'MSFT',
          name: 'مايكروسوفت',
          price: 378.85,
          change: -1.23,
          changePercent: -0.32,
          type: 'stock' as const
        },
        {
          symbol: 'GOOGL',
          name: 'جوجل',
          price: 142.56,
          change: 0.87,
          changePercent: 0.61,
          type: 'stock' as const
        },
        {
          symbol: 'AMZN',
          name: 'أمازون',
          price: 151.94,
          change: -0.45,
          changePercent: -0.29,
          type: 'stock' as const
        },
        {
          symbol: 'TSLA',
          name: 'تسلا',
          price: 248.42,
          change: 3.21,
          changePercent: 1.31,
          type: 'stock' as const
        }
      ];

      return stockItems;
    } catch (error) {
      console.error('Error fetching NASDAQ stocks:', error);
      return [];
    }
  };

  // Fetch cryptocurrency data
  const fetchCryptoData = async (): Promise<TickerItem[]> => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana,dogecoin,ripple&vs_currencies=usd&include_24hr_change=true',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const cryptoItems: TickerItem[] = [
        {
          symbol: 'BTC',
          name: 'بيتكوين',
          price: data.bitcoin?.usd || 0,
          change: data.bitcoin?.usd_24h_change || 0,
          changePercent: data.bitcoin?.usd_24h_change || 0,
          type: 'crypto' as const
        },
        {
          symbol: 'ETH',
          name: 'إيثيريوم',
          price: data.ethereum?.usd || 0,
          change: data.ethereum?.usd_24h_change || 0,
          changePercent: data.ethereum?.usd_24h_change || 0,
          type: 'crypto' as const
        },
        {
          symbol: 'SOL',
          name: 'سولانا',
          price: data.solana?.usd || 0,
          change: data.solana?.usd_24h_change || 0,
          changePercent: data.solana?.usd_24h_change || 0,
          type: 'crypto' as const
        },
        {
          symbol: 'DOGE',
          name: 'دوجكوين',
          price: data.dogecoin?.usd || 0,
          change: data.dogecoin?.usd_24h_change || 0,
          changePercent: data.dogecoin?.usd_24h_change || 0,
          type: 'crypto' as const
        },
        {
          symbol: 'XRP',
          name: 'ريبل',
          price: data.ripple?.usd || 0,
          change: data.ripple?.usd_24h_change || 0,
          changePercent: data.ripple?.usd_24h_change || 0,
          type: 'crypto' as const
        }
      ].filter(item => item.price > 0);

      return cryptoItems;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return [];
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    console.log('Fetching comprehensive market data...');
    
    try {
      const [currencyData, commodityData, stockData, cryptoData] = await Promise.allSettled([
        fetchMajorCurrencies(),
        fetchCommodities(),
        fetchNasdaqStocks(),
        fetchCryptoData()
      ]);

      const allData: TickerItem[] = [];

      // Process currency data
      if (currencyData.status === 'fulfilled') {
        allData.push(...currencyData.value);
        console.log(`Loaded ${currencyData.value.length} currency items`);
      }

      // Process commodity data
      if (commodityData.status === 'fulfilled') {
        allData.push(...commodityData.value);
        console.log(`Loaded ${commodityData.value.length} commodity items`);
      }

      // Process stock data
      if (stockData.status === 'fulfilled') {
        allData.push(...stockData.value);
        console.log(`Loaded ${stockData.value.length} stock items`);
      }

      // Process crypto data
      if (cryptoData.status === 'fulfilled') {
        allData.push(...cryptoData.value);
        console.log(`Loaded ${cryptoData.value.length} crypto items`);
      }

      console.log(`Total items loaded: ${allData.length}`);
      setTickerData(allData);
      
    } catch (error) {
      console.error('Error fetching ticker data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const updateInterval = setInterval(() => {
      fetchAllData();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'forex': return 'text-blue-400';
      case 'crypto': return 'text-orange-400';
      case 'stock': return 'text-green-400';
      case 'commodity': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'forex': return '💱';
      case 'crypto': return '₿';
      case 'stock': return '📈';
      case 'commodity': return '🥇';
      default: return '📊';
    }
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('/')) {
      return price.toFixed(4);
    }
    if (price > 1000) {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    }
    if (price < 1) {
      return price.toFixed(6);
    }
    return price.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="bg-deta-green text-white py-3 overflow-hidden">
        <div className="animate-pulse text-center">
          <span className="text-sm">جاري تحميل الأسعار المباشرة...</span>
        </div>
      </div>
    );
  }

  if (tickerData.length === 0) {
    return (
      <div className="bg-deta-green text-white py-3 overflow-hidden">
        <div className="text-center">
          <span className="text-sm">الأسعار غير متاحة حالياً - جاري المحاولة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deta-green text-white py-3 overflow-hidden relative">
      <div className="ticker-wrapper">
        <div className="ticker-content flex gap-12 animate-ticker-seamless">
          {/* تكرار البيانات 3 مرات لضمان العرض المتتابع بلا توقف */}
          {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
              <span className={`text-sm font-medium ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
              </span>
              <span className="text-sm font-bold">{item.symbol}</span>
              <span className="text-sm font-mono">${formatPrice(item.price, item.symbol)}</span>
              <div className={`flex items-center gap-1 text-xs ${
                item.change >= 0 ? 'text-green-400' : 'text-red-400'
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
