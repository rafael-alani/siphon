import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { Commodity, Company } from '../../types/api';
import { API_URL, commodities } from '../../types/consts';

export default function Participants() {
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity>(Commodity.ELECTRICITY);
  const [participants, setParticipants] = useState<Company[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchParticipants();

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchParticipants, 1000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

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

 
  // Filter participants based on selected commodity
  const filteredParticipants = participants.filter((participant) => {
    const commodities: Commodity[] = participant.statuses.map((status) => status.commodity);
    return commodities.includes(selectedCommodity);
  });

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
        {filteredParticipants.map((participant) => (
          <Card key={participant.name}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{participant.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{participant.location}</p>
                </div>
                <StatusBadge status={participant.statuses[0].status as 'Pending' | 'Completed'} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900">{participant.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Active</span>
                  <span className="text-gray-900">
                    {new Date(participant.last_active).toLocaleString()}
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