import { useState } from 'react';
import { Participant, CommodityType } from '../../types/energy';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';

// Mock data
const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Solar Farm Alpha',
    type: 'producer',
    status: {
      electricity: 'surplus',
      hydrogen: 'balanced',
      gas: 'balanced',
      heat: 'surplus'
    },
    location: 'Grid Zone A',
    lastActive: '2024-03-10T14:30:00Z'
  },
  {
    id: '2',
    name: 'Industrial Complex Beta',
    type: 'prosumer',
    status: {
      electricity: 'deficit',
      hydrogen: 'surplus',
      gas: 'deficit',
      heat: 'balanced'
    },
    location: 'Grid Zone B',
    lastActive: '2024-03-10T14:25:00Z'
  },
  // Add more mock participants as needed
];

const commodities: CommodityType[] = ['electricity', 'hydrogen', 'gas', 'heat'];

export default function Participants() {
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityType>('electricity');

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Hub Participants</h1>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {commodities.map((commodity) => (
            <button
              key={commodity}
              onClick={() => setSelectedCommodity(commodity)}
              className={`${
                selectedCommodity === commodity
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {commodity}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockParticipants.map((participant) => (
          <Card key={participant.id}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{participant.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{participant.type}</p>
                </div>
                <StatusBadge status={participant.status[selectedCommodity]} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900">{participant.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Active</span>
                  <span className="text-gray-900">
                    {new Date(participant.lastActive).toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                View Details
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}