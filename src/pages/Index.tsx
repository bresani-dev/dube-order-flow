import { usePOS } from '@/hooks/usePOS';
import { TableGrid } from '@/components/pos/TableGrid';
import { OrderScreen } from '@/components/pos/OrderScreen';

const Index = () => {
  const {
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
  } = usePOS();

  if (selectedTable) {
    return (
      <OrderScreen
        table={selectedTable}
        currentOrder={currentOrder}
        total={getOrderTotal()}
        onBack={closeTable}
        onAddItem={addItemToOrder}
        onRemoveItem={removeItemFromOrder}
        onSendToKitchen={sendToKitchen}
        onFinalize={finalizeTable}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TableGrid
        tables={tables}
        onSelectTable={selectTable}
        onAddTable={addTable}
      />
    </div>
  );
};

export default Index;
