export type TableStatus = 'free' | 'ordering' | 'waiting';

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
  order: Order | null;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'burgers' | 'drinks' | 'sides' | 'podrao' | 'macarrao';
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  createdAt: Date;
  sentToKitchen: boolean;
  kitchenTicketTime?: Date;
}

export interface CompletedOrder {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  completedAt: Date;
}

export interface DailySummary {
  date: string;
  orders: CompletedOrder[];
  totalCash: number;
  totalCard: number;
  totalPix: number;
  grandTotal: number;
}

export interface KitchenTicket {
  orderId: string;
  tableNumber: number;
  items: OrderItem[];
  createdAt: Date;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'pix';
