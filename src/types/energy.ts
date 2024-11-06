// export interface Trade {
//   id: string;
//   type: 'buy' | 'sell';
//   commodity: CommodityType;
//   amount: number;
//   price: number;
//   timestamp: string;
//   status: 'pending' | 'completed' | 'cancelled';
// }

export interface Participant {
  id: string;
  name: string;
  type: 'consumer' | 'producer' | 'prosumer';
  status: {
    electricity: 'surplus' | 'deficit' | 'balanced';
    hydrogen: 'surplus' | 'deficit' | 'balanced';
    gas: 'surplus' | 'deficit' | 'balanced';
    heat: 'surplus' | 'deficit' | 'balanced';
  };
  location: string;
  lastActive: string;
}

export interface GridStatus {
  load: number;
  capacity: number;
  timestamp: string;
}

export interface StatusBadgeProps {
  status: 'Pending' | 'Completed';
}