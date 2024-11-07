import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Commodity, TradeStatus, TradeType } from '../../../src/types/api';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { API_URL } from '../../types/consts';
// Update the Trade type to match the API model
interface Trade {
  id: string;
  type: TradeType;
  commodity: Commodity;
  amount: {
    value: number;
    measurement_unit: string;
  };
  price: {
    value: number;
    currency: string;
  };
  status: TradeStatus;
  time: string;
  requester_company: string;
  fulfiller_company?: string;
}



export default function Ledger() {
  // Update state management
  const [offers, setOffers] = useState<Trade[]>([]);
  const [requests, setRequests] = useState<Trade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);

  // Add API fetch functions
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const [offersRes, requestsRes, historyRes] = await Promise.all([
          fetch(API_URL + '/trades/offers').then(res => res.ok ? res.json() : Promise.reject(`Offers API error: ${res.status}`)),
          fetch(API_URL + '/trades/requests').then(res => res.ok ? res.json() : Promise.reject(`Requests API error: ${res.status}`)),
          fetch(API_URL + '/trades/history').then(res => res.ok ? res.json() : Promise.reject(`History API error: ${res.status}`))
        ]);

        setOffers(offersRes);
        setRequests(requestsRes);
        setTradeHistory(historyRes);
      } catch (error) {
        console.error('Error fetching trades:', error);
        // Optionally set error state here
      }
    };

    // Initial fetch
    fetchTrades();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchTrades, 1000); // 1000ms = 1s

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Update price calculations
  const lowestOffer = offers.length > 0 
    ? Math.min(...offers.map(offer => offer.price.value))
    : 0;
    
  const highestRequest = requests.length > 0
    ? Math.max(...requests.map(request => request.price.value))
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Trading Ledger</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Market */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-medium mb-4">Current Market</h2>
            
            {/* Offers Table */}
            <h3 className="text-md font-medium mb-2">Offers ({offers.length})</h3>
            <TableComponent 
              trades={offers.sort((a, b) => b.price.value - a.price.value)} // Sort high to low
            />
            
            {/* Market Overview */}
            <div className="flex justify-between p-4 bg-gray-50 rounded-lg my-6">
              <div>
                <p className="text-sm text-gray-500">Lowest Offer</p>
                <p className="text-lg font-bold text-green-600">
                  {offers.length > 0 ? `$${lowestOffer.toFixed(2)}` : 'No offers'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Highest Request</p>
                <p className="text-lg font-bold text-blue-600">
                  {requests.length > 0 ? `$${highestRequest.toFixed(2)}` : 'No requests'}
                </p>
              </div>
            </div>
            
            {/* Requests Table */}
            <h3 className="text-md font-medium mb-2">Requests ({requests.length})</h3>
            <TableComponent 
              trades={requests.sort((a, b) => b.price.value - a.price.value)} // Sort high to low
            />
          </Card>
        </div>

        {/* Right Column - History */}
        <div>
          <Card>
            <h2 className="text-lg font-medium mb-4">Trade History ({tradeHistory.length})</h2>
            <div className="max-h-[600px] overflow-y-auto">
              <TableComponent trades={tradeHistory
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                // .slice(0, 20)
              } />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Update TableComponent to use new Trade interface
function TableComponent({ trades }: { trades: Trade[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commodity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {trade.type === TradeType.BUY ? (
                    <ArrowDownRight className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="capitalize">{trade.type}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="capitalize">{trade.commodity}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {trade.amount.value} {trade.amount.measurement_unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {trade.price.currency}{trade.price.value.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={trade.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(trade.time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}