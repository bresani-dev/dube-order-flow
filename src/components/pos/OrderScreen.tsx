import { useState, useRef } from 'react';
import { Table, MenuItem, OrderItem, KitchenTicket as KitchenTicketType, PaymentMethod } from '@/types/pos';
import { menuItems } from '@/data/menuItems';
import { MenuItemCard } from './MenuItemCard';
import { OrderSummary } from './OrderSummary';
import { KitchenTicket } from './KitchenTicket';
import { PaymentModal } from './PaymentModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, CreditCard, UtensilsCrossed } from 'lucide-react';

type Category = 'artesanal' | 'podrao' | 'macarrao' | 'drinks' | 'sides';

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
  artesanal: 'Artesanal',
  podrao: 'Podrão',
  macarrao: 'Macarrão',
  drinks: 'Bebidas',
  sides: 'Acompanhamentos',
};

const categoryIcons: Record<Category, string> = {
  artesanal: '🍔',
  podrao: '🌭',
  macarrao: '🍝',
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
  const [activeCategory, setActiveCategory] = useState<Category>('artesanal');
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
    if (!kitchenTicket) return;
    
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
      const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      };

      const itemsHtml = kitchenTicket.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin: 8px 0; font-weight: 700;">
          <span><strong style="font-weight: 900;">${item.quantity}x</strong> ${item.menuItem.name}</span>
        </div>
      `).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Comanda</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', 'Lucida Console', monospace;
              font-size: 14px;
              line-height: 1.5;
              padding: 8px;
              width: 80mm;
              color: #000 !important;
              background: #fff !important;
              font-weight: 700;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 22px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .subtitle {
              font-size: 13px;
              margin-top: 4px;
            }
            .info {
              border-bottom: 2px dashed #000;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              margin: 4px 0;
            }
            .mesa {
              font-size: 20px;
              font-weight: 900;
            }
            .items {
              margin-bottom: 12px;
            }
            .notes {
              border-top: 2px dashed #000;
              padding-top: 12px;
              margin-top: 12px;
            }
            .footer {
              border-top: 2px dashed #000;
              padding-top: 12px;
              margin-top: 12px;
              text-align: center;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">DUBE BURGER</div>
            <div class="subtitle">Comanda de Cozinha</div>
          </div>
          
          <div class="info">
            <div class="info-row">
              <span style="font-weight: 700;">Mesa:</span>
              <span class="mesa">${kitchenTicket.tableNumber}</span>
            </div>
            <div class="info-row" style="font-size: 13px;">
              <span>Pedido:</span>
              <span>#${kitchenTicket.orderId.slice(-6).toUpperCase()}</span>
            </div>
          </div>
          
          <div class="items">
            ${itemsHtml}
          </div>
          
          ${kitchenTicket.notes ? `
            <div class="notes">
              <div style="font-weight: 900;">Observações:</div>
              <div style="margin-top: 4px;">${kitchenTicket.notes}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            ${formatDate(kitchenTicket.createdAt)}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
        // Fallback close for browsers that don't support onafterprint
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        }, 1000);
      }, 200);
    }
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
