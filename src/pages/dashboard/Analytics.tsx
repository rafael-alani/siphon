import { useState } from 'react';
import { CommodityType } from '../../types/energy';
import Card from '../../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const mockPriceData = [
  { timestamp: '00:00', electricity: 45, hydrogen: 120, gas: 35, heat: 25 },
  { timestamp: '04:00', electricity: 52, hydrogen: 125, gas: 38, heat: 28 },
  { timestamp: '08:00', electricity: 68, hydrogen: 118, gas: 42, heat: 30 },
  { timestamp: '12:00', electricity: 75, hydrogen: 130, gas: 45, heat: 35 },
  { timestamp: '16:00', electricity: 58, hydrogen: 122, gas: 40, heat: 32 },
  { timestamp: '20:00', electricity: 48, hydrogen: 115, gas: 36, heat: 27 },
];

const commodities: CommodityType[] = ['electricity', 'hydrogen', 'gas', 'heat'];
const colors = {
  electricity: '#10B981',
  hydrogen: '#3B82F6',
  gas: '#F59E0B',
  heat: '#EF4444',
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '1y'>('24h');

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Market Analytics</h1>
        
        <div className="mt-3 sm:mt-0 sm:ml-4">
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Price Trends</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                {commodities.map((commodity) => (
                  <Line
                    key={commodity}
                    type="monotone"
                    dataKey={commodity}
                    stroke={colors[commodity]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {commodities.map((commodity) => (
          <Card key={commodity}>
            <h3 className="text-lg font-medium text-gray-900 capitalize mb-4">
              {commodity} Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Current Price</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${mockPriceData[mockPriceData.length - 1][commodity]}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">24h Change</p>
                <p className="text-2xl font-semibold text-green-600">+5.2%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">24h Volume</p>
                <p className="text-2xl font-semibold text-gray-900">1,234 kWh</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Active Trades</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}