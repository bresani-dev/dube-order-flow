import { useState, useEffect, useCallback } from 'react';
import { Table, Order, OrderItem, MenuItem, PaymentMethod } from '@/types/pos';

const STORAGE_KEY = 'dube-burger-pos';

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

export const usePOS = () => {
  const [tables, setTables] = useState<Table[]>(getInitialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables }));
  }, [tables]);

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

    setTables(prev =>
      prev.map(t =>
        t.id === selectedTable.id
          ? { ...t, status: 'free' as const, order: null }
          : t
      )
    );

    setSelectedTable(null);
    setCurrentOrder([]);
  }, [selectedTable]);

  const getOrderTotal = useCallback(() => {
    return currentOrder.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  }, [currentOrder]);

  return {
    tables,
    selectedTable,
    currentOrder,
    addTable,
    selectTable,
    closeTable,
    addItemToOrder,
    removeItemFromOrder,
    sendToKitchen,
    finalizeTable,
    getOrderTotal,
  };
};
