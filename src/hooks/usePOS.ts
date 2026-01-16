import { useState, useEffect, useCallback } from 'react';
import { Table, Order, OrderItem, MenuItem, PaymentMethod, CompletedOrder } from '@/types/pos';

const STORAGE_KEY = 'dube-burger-pos';
const ORDERS_KEY = 'dube-burger-orders';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getInitialTables = (): Table[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.tables || createDefaultTables();
  }
  return createDefaultTables();
};

const createDefaultTables = (): Table[] => {
  return Array.from({ length: 6 }, (_, i) => ({
    id: generateId(),
    number: i + 1,
    status: 'free' as const,
    order: null,
  }));
};

const getCompletedOrders = (): CompletedOrder[] => {
  const saved = localStorage.getItem(ORDERS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

export const usePOS = () => {
  const [tables, setTables] = useState<Table[]>(getInitialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>(getCompletedOrders);

  // Persist tables to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables }));
  }, [tables]);

  // Persist completed orders to localStorage
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(completedOrders));
  }, [completedOrders]);

  // Load order when selecting a table
  useEffect(() => {
    if (selectedTable?.order) {
      setCurrentOrder(selectedTable.order.items);
    } else {
      setCurrentOrder([]);
    }
  }, [selectedTable?.id]);

  const addTable = useCallback(() => {
    const maxNumber = Math.max(...tables.map(t => t.number), 0);
    const newTable: Table = {
      id: generateId(),
      number: maxNumber + 1,
      status: 'free',
      order: null,
    };
    setTables(prev => [...prev, newTable]);
  }, [tables]);

  const selectTable = useCallback((table: Table) => {
    setSelectedTable(table);
    if (table.order) {
      setCurrentOrder(table.order.items);
    } else {
      setCurrentOrder([]);
    }
  }, []);

  const closeTable = useCallback(() => {
    setSelectedTable(null);
    setCurrentOrder([]);
  }, []);

  const addItemToOrder = useCallback((menuItem: MenuItem) => {
    setCurrentOrder(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });

    // Update table status to ordering
    if (selectedTable) {
      setTables(prev =>
        prev.map(t =>
          t.id === selectedTable.id
            ? { ...t, status: 'ordering' as const }
            : t
        )
      );
    }
  }, [selectedTable]);

  const removeItemFromOrder = useCallback((menuItemId: string) => {
    setCurrentOrder(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.menuItem.id === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.menuItem.id !== menuItemId);
    });
  }, []);

  const sendToKitchen = useCallback(() => {
    if (!selectedTable || currentOrder.length === 0) return null;

    const order: Order = {
      id: generateId(),
      tableId: selectedTable.id,
      items: currentOrder,
      createdAt: new Date(),
      sentToKitchen: true,
      kitchenTicketTime: new Date(),
    };

    setTables(prev =>
      prev.map(t =>
        t.id === selectedTable.id
          ? { ...t, status: 'waiting' as const, order }
          : t
      )
    );

    setSelectedTable(prev => prev ? { ...prev, status: 'waiting', order } : null);

    return {
      orderId: order.id,
      tableNumber: selectedTable.number,
      items: currentOrder,
      createdAt: new Date(),
    };
  }, [selectedTable, currentOrder]);

  const finalizeTable = useCallback((paymentMethod: PaymentMethod) => {
    if (!selectedTable) return;

    const total = currentOrder.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    // Add to completed orders
    const completedOrder: CompletedOrder = {
      id: generateId(),
      tableNumber: selectedTable.number,
      items: currentOrder,
      total,
      paymentMethod,
      completedAt: new Date(),
    };

    setCompletedOrders(prev => [...prev, completedOrder]);

    setTables(prev =>
      prev.map(t =>
        t.id === selectedTable.id
          ? { ...t, status: 'free' as const, order: null }
          : t
      )
    );

    setSelectedTable(null);
    setCurrentOrder([]);
  }, [selectedTable, currentOrder]);

  const getOrderTotal = useCallback(() => {
    return currentOrder.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  }, [currentOrder]);

  const getTodayOrders = useCallback(() => {
    const today = new Date().toDateString();
    return completedOrders.filter(
      order => new Date(order.completedAt).toDateString() === today
    );
  }, [completedOrders]);

  const getDailySummary = useCallback(() => {
    const todayOrders = getTodayOrders();
    
    const totalCash = todayOrders
      .filter(o => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalCard = todayOrders
      .filter(o => o.paymentMethod === 'card')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalPix = todayOrders
      .filter(o => o.paymentMethod === 'pix')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      date: new Date().toLocaleDateString('pt-BR'),
      orders: todayOrders,
      totalCash,
      totalCard,
      totalPix,
      grandTotal: totalCash + totalCard + totalPix,
    };
  }, [getTodayOrders]);

  const clearTodayOrders = useCallback(() => {
    const today = new Date().toDateString();
    setCompletedOrders(prev => 
      prev.filter(order => new Date(order.completedAt).toDateString() !== today)
    );
  }, []);

  return {
    tables,
    selectedTable,
    currentOrder,
    completedOrders,
    addTable,
    selectTable,
    closeTable,
    addItemToOrder,
    removeItemFromOrder,
    sendToKitchen,
    finalizeTable,
    getOrderTotal,
    getTodayOrders,
    getDailySummary,
    clearTodayOrders,
  };
};
