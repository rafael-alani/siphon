
export enum Commodity {
  ELECTRICITY = "Electricity",
  HYDROGEN = "Hydrogen",
  HEAT = "Heat",
  GAS = "Gas"
}

export enum TradeType {
  BUY = "buy",
  SELL = "sell"
}

export enum TradeStatus {
  COMPLETED = "Completed",
  PENDING = "Pending"
}

export interface Amount {
  value: number;
  measurement_unit: string;
}

export interface Price {
  value: number;
  currency: string;
}

export interface ResourceState {
  commodity: Commodity;
  status: "surplus" | "deficit";
  amount: Amount;
}

export interface Company {
  name: string;
  location: string;
  statuses: ResourceState[];
  last_active: string;
}

export interface Trade {
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