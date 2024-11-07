import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../../components/Card';
import { Commodity, Company } from '../../types/api';
import { API_URL } from '../../types/consts';

interface PriceResponse {
  timestamp: string;
  price: number;
}

interface ChartDataPoint {
  timestamp: string;
  electricity: number;
  hydrogen: number;
  gas: number;
  heat: number;
  electricity_market: number;
  hydrogen_market: number;
  gas_market: number;
  heat_market: number;
}

// Map frontend timeRange to backend TimeFrame enum
const timeFrameMap = {
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
  '1y': '1y'
} as const;

const commodities: Commodity[] = [Commodity.ELECTRICITY, Commodity.HYDROGEN, Commodity.GAS, Commodity.HEAT];
const colors = {
  [Commodity.ELECTRICITY]: '#10B981',
  [Commodity.HYDROGEN]: '#3B82F6',
  [Commodity.GAS]: '#F59E0B',
  [Commodity.HEAT]: '#EF4444',
};

const aggregateDataPoints = (data: ChartDataPoint[], timeRange: string): ChartDataPoint[] => {
  if (!data || data.length === 0) return [];
  
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  let groupSize: number;
  
  switch (timeRange) {
    case '24h':
      groupSize = Math.max(1, Math.floor(sortedData.length / 24));
      break;
    case '7d':
      groupSize = Math.max(1, Math.floor(sortedData.length / 42));
      break;
    case '30d':
      groupSize = Math.max(1, Math.floor(sortedData.length / 30));
      break;
    case '1y':
      groupSize = Math.max(1, Math.floor(sortedData.length / 52));
      break;
    default:
      return sortedData;
  }

  const groupedData: ChartDataPoint[] = [];
  for (let i = 0; i < sortedData.length; i += groupSize) {
    const chunk = sortedData.slice(i, i + groupSize);
    if (chunk.length === 0) continue;

    const aggregated: ChartDataPoint = {
      timestamp: chunk[0].timestamp,
      electricity: chunk.reduce((sum, item) => sum + item.electricity, 0) / chunk.length,
      hydrogen: chunk.reduce((sum, item) => sum + item.hydrogen, 0) / chunk.length,
      gas: chunk.reduce((sum, item) => sum + item.gas, 0) / chunk.length,
      heat: chunk.reduce((sum, item) => sum + item.heat, 0) / chunk.length,
      electricity_market: chunk.reduce((sum, item) => sum + item.electricity, 0) / chunk.length * 1.2,
      hydrogen_market: chunk.reduce((sum, item) => sum + item.hydrogen, 0) / chunk.length * 1.2,
      gas_market: chunk.reduce((sum, item) => sum + item.gas, 0) / chunk.length * 1.2,
      heat_market: chunk.reduce((sum, item) => sum + item.heat, 0) / chunk.length * 1.2,
    };
    groupedData.push(aggregated);
  }

  return groupedData;
};

const fillGapsWithAverages = (data: ChartDataPoint[]): ChartDataPoint[] => {
    const commodities = ['electricity', 'hydrogen', 'gas', 'heat'] as const;
    
    return data.map((point, index) => {
        if (index === 0 || index === data.length - 1) return point;
        
        const newPoint = { ...point };
        commodities.forEach(commodity => {
            if (point[commodity] === 0) {

                let increment = 1;
                let prev = data[index - increment]?.[commodity];
                let next = data[index + increment]?.[commodity];

                while ((prev === 0 || next === 0) && (index - increment >= 0 && index + increment < data.length)) {
                    increment++;
                    if (index - increment >= 0 && prev === 0) prev = data[index - increment][commodity];
                    if (index + increment < data.length && next === 0) next = data[index + increment][commodity];
                }
                if (prev !== 0 && next !== 0) {
                    newPoint[commodity] = (prev + next) / 2;
                }
                
            }
        });
        return newPoint;
    });
};

// Add this new function after fillGapsWithAverages
const smoothMarketPrices = (data: ChartDataPoint[], windowSize: number = 3): ChartDataPoint[] => {
    const result = [...data];
    const marketFields = ['electricity_market', 'hydrogen_market', 'gas_market', 'heat_market'] as const;
    
    for (let i = 0; i < result.length; i++) {
        marketFields.forEach(field => {
            let sum = 0;
            let count = 0;
            
            // Calculate moving average around current point
            for (let j = Math.max(0, i - windowSize); j <= Math.min(result.length - 1, i + windowSize); j++) {
                sum += result[j][field];
                count++;
            }
            
            result[i][field] = sum / count;
        });
    }
    
    return result;
};

// Update the commodity mapping to match backend enum values
const commodityToEndpoint = {
  [Commodity.ELECTRICITY]: 'electricity',
  [Commodity.HYDROGEN]: 'hydrogen',
  [Commodity.GAS]: 'gas',
  [Commodity.HEAT]: 'heat',
} as const;



interface CommodityAnalytics {
  percentage_saved: number;
  volume: string;
  trades: number;
}

interface CompanyAnalytics {
  [Commodity.ELECTRICITY]: CommodityAnalytics;
  [Commodity.HYDROGEN]: CommodityAnalytics;
  [Commodity.GAS]: CommodityAnalytics;
  [Commodity.HEAT]: CommodityAnalytics;
}

interface AnalyticsState {
  [companyId: string]: CompanyAnalytics;
}

// Move this outside the component
const generateRandomAnalytics = (commodity: Commodity): CommodityAnalytics => ({
  percentage_saved: Math.floor(Math.random() * 10 + 15),
  volume: (() => {
    switch(commodity) {
      case Commodity.ELECTRICITY: return Math.floor(Math.random() * 100000).toString() + ' MWh';
      case Commodity.HYDROGEN: return Math.floor(Math.random() * 10000).toString() + ' kg';
      case Commodity.GAS: return Math.floor(Math.random() * 10000).toString() + ' MMBtu';
      case Commodity.HEAT: return Math.floor(Math.random() * 10000).toString() + ' GJ';
    }
  })(),
  trades: Math.floor(Math.random() * 50 + 20)
});

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('24h');
  const [priceData, setPriceData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<Company[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [analytics, setAnalytics] = useState<AnalyticsState>({});

  const [currentCompanyAnalytics, setCurrentCompanyAnalytics] = useState<CompanyAnalytics>({
    [Commodity.ELECTRICITY]: generateRandomAnalytics(Commodity.ELECTRICITY),
    [Commodity.HYDROGEN]: generateRandomAnalytics(Commodity.HYDROGEN),
    [Commodity.GAS]: generateRandomAnalytics(Commodity.GAS),
    [Commodity.HEAT]: generateRandomAnalytics(Commodity.HEAT)
  });

  useEffect(() => {
    if (selectedParticipant) {
      if (!analytics[selectedParticipant]) {
        setAnalytics({
          ...analytics,
          [selectedParticipant]: {
            [Commodity.ELECTRICITY]: generateRandomAnalytics(Commodity.ELECTRICITY),
            [Commodity.HYDROGEN]: generateRandomAnalytics(Commodity.HYDROGEN),
            [Commodity.GAS]: generateRandomAnalytics(Commodity.GAS),
            [Commodity.HEAT]: generateRandomAnalytics(Commodity.HEAT),
          }
        });
      }
      setCurrentCompanyAnalytics(analytics[selectedParticipant] || {
        [Commodity.ELECTRICITY]: generateRandomAnalytics(Commodity.ELECTRICITY),
        [Commodity.HYDROGEN]: generateRandomAnalytics(Commodity.HYDROGEN),
        [Commodity.GAS]: generateRandomAnalytics(Commodity.GAS),
        [Commodity.HEAT]: generateRandomAnalytics(Commodity.HEAT)
      });
    }
  }, [selectedParticipant, analytics]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`${API_URL}/companies`);
        if (!response.ok) throw new Error('Failed to fetch participants');
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          commodities.map(commodity =>
            fetch(`http://localhost:8000/analytics/market-prices/${commodityToEndpoint[commodity]}/${timeFrameMap[timeRange]}`)
              .then(res => res.json())
              .then((data: PriceResponse[]) => data)
          )
        );
        
        console.log(responses);
        const allChartData: ChartDataPoint[] = [];

        // Process each timestamp from all arrays
        responses.forEach((commodityData, commodityIndex) => {
            commodityData.forEach(item => {
                const timestamp = new Date(item.timestamp).toISOString();
                const existingPoint = allChartData.find(point => point.timestamp === timestamp);
                
                if (existingPoint) {
                    // Add to existing timestamp
                    switch(commodityIndex) {
                        case 0: existingPoint.electricity = Number(item.price); break;
                        case 1: existingPoint.hydrogen = Number(item.price); break;
                        case 2: existingPoint.gas = Number(item.price); break;
                        case 3: existingPoint.heat = Number(item.price); break;
                    }
                } else {
                    // Create new point with defaults
                    const newPoint: ChartDataPoint = {
                        timestamp,
                        electricity: 0,
                        hydrogen: 0,
                        gas: 0,
                        heat: 0,
                        electricity_market: 0,
                        hydrogen_market: 0,
                        gas_market: 0,
                        heat_market: 0,
                    };
                    // Set the current commodity's value
                    switch(commodityIndex) {
                        case 0: newPoint.electricity = Number(item.price); break;
                        case 1: newPoint.hydrogen = Number(item.price); break;
                        case 2: newPoint.gas = Number(item.price); break;
                        case 3: newPoint.heat = Number(item.price); break;
                    }
                    allChartData.push(newPoint);
                }
            });
        });

        // Sort by timestamp
        const sortedData = allChartData.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const filledData = fillGapsWithAverages(sortedData);
        const aggregatedData = aggregateDataPoints(filledData, timeRange);
        const smoothedData = smoothMarketPrices(aggregatedData, 
            timeRange === '24h' ? 2 : 
            timeRange === '7d' ? 3 : 
            timeRange === '30d' ? 4 : 5
        );

        // Filter out today's data
        const yesterday = new Date();
        yesterday.setHours(0, 0, 0, 0);
        const filteredData = smoothedData.filter(point => 
            new Date(point.timestamp) < yesterday
        );
        
        setPriceData(filteredData);
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
      setIsLoading(false);
    };

    fetchPrices();
    fetchParticipants();
  }, [timeRange]);

  useEffect(() => {
    if (participants.length > 0 && !selectedParticipant) {
      setSelectedParticipant(participants[0].name);
    }
  }, [participants]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Market Analytics</h1>
        
        <div className="mt-3 sm:mt-0 sm:ml-4 flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <select
            value={selectedParticipant}
            onChange={(e) => {
              setSelectedParticipant(e.target.value)
              console.log(e.target.value);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            {participants.map((participant) => (
              <option key={participant.name} value={participant.name}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Price Trends</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp"
                  interval="preserveStartEnd"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange === '24h') {
                      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    if (timeRange === '7d') {
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' });
                    }
                    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => {
                    if (timeRange === '24h') return `Time: ${label.slice(11, 16)}`;
                    if (timeRange === '7d') return `Time: ${label.slice(5, 16)}`;
                    return `Date: ${label.slice(0, 10)}`;
                  }}
                />
                <Legend />
                {commodities.map((commodity) => (
                  <Line
                    key={commodity}
                    type="monotone"
                    dataKey={commodity.toLowerCase()}
                    name={commodity}
                    stroke={colors[commodity]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
                {commodities.map((commodity) => (
                  <Line
                    key={`${commodity}_market`}
                    type="monotone"
                    dataKey={`${commodity.toLowerCase()}_market`}
                    name={`${commodity} Market`}
                    stroke={colors[commodity]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        
        {commodities.map((commodity) => (
          <Card key={commodity}>
            <h3 className="text-lg font-medium text-gray-900 capitalize mb-4">
              {commodity}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-2xl font-semibold text-gray-900">
                  €{priceData.length > 0 ? priceData[priceData.length - 1][commodity.toLowerCase() as keyof Omit<ChartDataPoint, 'timestamp'>].toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Procentage saved</p>
                <p className={`text-2xl font-semibold ${
                  analytics[selectedParticipant]?.[commodity]?.percentage_saved >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {analytics[selectedParticipant]?.[commodity]?.percentage_saved ?? 0}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Volume</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics[selectedParticipant]?.[commodity]?.volume ?? 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Completed Trades</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics[selectedParticipant]?.[commodity]?.trades ?? 0}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}