import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { Trade } from '../../types/energy';

// // Mock data
const mockTrades: Trade[] = [];
//   {
//     id: '1',
//     type: 'buy',
//     commodity: 'electricity',
//     amount: 50,
//     price: 75.20,
//     timestamp: '2024-03-10T14:30:00Z',
//     status: 'completed'
//   },
//   {
//     id: '2',
//     type: 'sell',
//     commodity: 'hydrogen',
//     amount: 30,
//     price: 120.50,
//     timestamp: '2024-03-10T14:25:00Z',
//     status: 'pending'
//   },
//   // Add more mock trades as needed
// ];

// Add new mock data for offers and requests
const mockOffers: Trade[] = [
  {
    id: '1',
    type: 'sell',
    commodity: 'electricity',
    amount: 50,
    price: 75.20,
    timestamp: '2024-03-10T14:30:00Z',
    status: 'pending'
  },
  // ... more offers
];

const mockRequests: Trade[] = [
  {
    id: '3',
    type: 'buy',
    commodity: 'electricity',
    amount: 50,
    price: 80.00,
    timestamp: '2024-03-10T14:25:00Z',
    status: 'pending'
  },
  {
    id: '4',
    type: 'buy',
    commodity: 'electricity',
    amount: 30,
    price: 70.50,
    timestamp: '2024-03-10T14:25:00Z',
    status: 'pending'
  },
  // ... more requests
];

export default function Ledger() {
  // Convert mock data to state so we can modify it
  const [offers, setOffers] = useState<Trade[]>(mockOffers);
  const [requests, setRequests] = useState<Trade[]>(mockRequests);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>(mockTrades);

  // Function to handle trade matching
  const matchTrades = () => {
    const newOffers = [...offers];
    const newRequests = [...requests];
    const newHistory = [...tradeHistory];

    // Sort by best price
    newOffers.sort((a, b) => a.price - b.price); // Lowest first
    newRequests.sort((a, b) => b.price - a.price); // Highest first

    // Keep matching while we have offers and requests, and the prices match
    while (newOffers.length > 0 && newRequests.length > 0) {
      const offer = newOffers[0];
      const request = newRequests[0];

      // Only match if request price >= offer price
      if (request.price < offer.price) break;

      // Calculate trade amount
      const tradeAmount = Math.min(offer.amount, request.amount);
      
      // Create trade history entry
      const newTrade: Trade = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'buy',
        commodity: offer.commodity,
        amount: tradeAmount,
        price: offer.price,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      // Case 1: Equal amounts - remove both
      if (offer.amount === request.amount) {
        newOffers.shift();
        newRequests.shift();
      }
      // Case 2: Offer amount > Request amount - update offer
      else if (offer.amount > request.amount) {
        offer.amount -= request.amount;
        newRequests.shift();
      }
      // Case 3: Request amount > Offer amount - update request
      else {
        request.amount -= offer.amount;
        newOffers.shift();
      }

      // Add to history
      newHistory.push(newTrade);
    }

    setOffers(newOffers);
    setRequests(newRequests);
    setTradeHistory(newHistory);
  };

  // Check for matches whenever offers or requests change
  useEffect(() => {
    matchTrades();
  }, []); // Empty dependency array means this runs once on mount

  const lowestOffer = offers.length > 0 
    ? Math.min(...offers.map(offer => offer.price))
    : 0;
    
  const highestRequest = requests.length > 0
    ? Math.max(...requests.map(request => request.price))
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
              trades={offers.sort((a, b) => b.price - a.price)} // Sort high to low
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
              trades={requests.sort((a, b) => b.price - a.price)} // Sort high to low
            />
          </Card>
        </div>

        {/* Right Column - History */}
        <div>
          <Card>
            <h2 className="text-lg font-medium mb-4">Trade History ({tradeHistory.length})</h2>
            <TableComponent trades={tradeHistory.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )} />
          </Card>
        </div>
      </div>
    </div>
  );
}

// Extract table into a separate component
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
                  {trade.type === 'buy' ? (
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
                {trade.amount} kWh
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${trade.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={trade.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(trade.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}