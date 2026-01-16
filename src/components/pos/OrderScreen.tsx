import { useState, useRef } from 'react';
import { Table, MenuItem, OrderItem, KitchenTicket as KitchenTicketType, PaymentMethod } from '@/types/pos';
import { menuItems } from '@/data/menuItems';
import { MenuItemCard } from './MenuItemCard';
import { OrderSummary } from './OrderSummary';
import { KitchenTicket } from './KitchenTicket';
import { PaymentModal } from './PaymentModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, CreditCard, UtensilsCrossed } from 'lucide-react';

type Category = 'burgers' | 'drinks' | 'sides';

interface OrderScreenProps {
  table: Table;
  currentOrder: OrderItem[];
  total: number;
  onBack: () => void;
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (menuItemId: string) => void;
  onSendToKitchen: () => KitchenTicketType | null;
  onFinalize: (method: PaymentMethod) => void;
}

const categoryLabels: Record<Category, string> = {
  burgers: 'Burgers',
  drinks: 'Bebidas',
  sides: 'Acompanhamentos',
};

const categoryIcons: Record<Category, string> = {
  burgers: '🍔',
  drinks: '🥤',
  sides: '🍟',
};

export const OrderScreen = ({
  table,
  currentOrder,
  total,
  onBack,
  onAddItem,
  onRemoveItem,
  onSendToKitchen,
  onFinalize,
}: OrderScreenProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>('burgers');
  const [kitchenTicket, setKitchenTicket] = useState<KitchenTicketType | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const handleSendToKitchen = () => {
    const ticket = onSendToKitchen();
    if (ticket) {
      setKitchenTicket(ticket);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCloseTicket = () => {
    setKitchenTicket(null);
  };

  const handleFinalize = (method: PaymentMethod) => {
    onFinalize(method);
    setShowPaymentModal(false);
  };

  const handleAddFromSummary = (menuItemId: string) => {
    const item = menuItems.find(m => m.id === menuItemId);
    if (item) onAddItem(item);
  };

  if (kitchenTicket) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="no-print flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleCloseTicket}
            className="text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handlePrint}
            size="lg"
            className="touch-button bg-primary text-primary-foreground"
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimir
          </Button>
        </div>

        <KitchenTicket ref={ticketRef} ticket={kitchenTicket} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Menu Section */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Mesa {table.number}</h1>
            <p className="text-muted-foreground">
              {table.status === 'waiting' ? 'Aguardando pagamento' : 'Fazendo pedido'}
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {(Object.keys(categoryLabels) as Category[]).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-tab flex items-center gap-2 whitespace-nowrap ${
                activeCategory === category
                  ? 'category-tab-active'
                  : 'category-tab-inactive'
              }`}
            >
              <span className="text-xl">{categoryIcons[category]}</span>
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} onAdd={() => onAddItem(item)} />
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="lg:w-[400px] bg-card border-l border-border p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Pedido</h2>
        </div>

        <div className="flex-1 min-h-0">
          <OrderSummary
            items={currentOrder}
            onAddItem={handleAddFromSummary}
            onRemoveItem={onRemoveItem}
            total={total}
          />
        </div>

        {currentOrder.length > 0 && (
          <div className="mt-6 space-y-3">
            {!table.order?.sentToKitchen && (
              <Button
                onClick={handleSendToKitchen}
                size="lg"
                className="w-full touch-button bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Printer className="w-5 h-5 mr-2" />
                Enviar para Cozinha
              </Button>
            )}

            {table.status === 'waiting' && (
              <Button
                onClick={() => setShowPaymentModal(true)}
                size="lg"
                variant="outline"
                className="w-full touch-button border-success text-success hover:bg-success/10"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Finalizar e Pagar
              </Button>
            )}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleFinalize}
        total={total}
        tableNumber={table.number}
      />
    </div>
  );
};
