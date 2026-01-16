import { OrderItem } from '@/types/pos';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  items: OrderItem[];
  onAddItem: (menuItemId: string) => void;
  onRemoveItem: (menuItemId: string) => void;
  total: number;
}

export const OrderSummary = ({ items, onAddItem, onRemoveItem, total }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
        <p className="text-lg">Nenhum item no pedido</p>
        <p className="text-sm mt-2">Selecione itens do menu</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-3">
        {items.map(item => (
          <div
            key={item.menuItem.id}
            className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{item.menuItem.name}</h4>
              <p className="text-muted-foreground text-sm">
                {formatPrice(item.menuItem.price)} cada
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => onRemoveItem(item.menuItem.id)}
              >
                {item.quantity === 1 ? (
                  <Trash2 className="w-4 h-4 text-destructive" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
              </Button>

              <span className="w-8 text-center font-bold text-lg">
                {item.quantity}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl"
                onClick={() => onAddItem(item.menuItem.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-24 text-right">
              <p className="font-bold text-primary">
                {formatPrice(item.menuItem.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-3xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};
