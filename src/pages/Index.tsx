import { useState } from 'react';
import { usePOS } from '@/hooks/usePOS';
import { TableGrid } from '@/components/pos/TableGrid';
import { OrderScreen } from '@/components/pos/OrderScreen';
import { CashierReport } from '@/components/pos/CashierReport';
import { PrinterSettings } from '@/components/pos/PrinterSettings';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Receipt } from 'lucide-react';

type View = 'tables' | 'cashier';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('tables');
  
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
    getDailySummary,
    clearTodayOrders,
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
      {/* Navigation Tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setCurrentView('tables')}
              className={`touch-button ${
                currentView === 'tables' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'text-muted-foreground'
              }`}
            >
              <LayoutGrid className="w-5 h-5 mr-2" />
              Mesas
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setCurrentView('cashier')}
              className={`touch-button ${
                currentView === 'cashier' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'text-muted-foreground'
              }`}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Fechamento
            </Button>
          </div>
          
          <PrinterSettings />
        </div>
      </div>

      {currentView === 'tables' ? (
        <TableGrid
          tables={tables}
          onSelectTable={selectTable}
          onAddTable={addTable}
        />
      ) : (
        <CashierReport
          summary={getDailySummary()}
          onBack={() => setCurrentView('tables')}
          onClearDay={clearTodayOrders}
        />
      )}
    </div>
  );
};

export default Index;
