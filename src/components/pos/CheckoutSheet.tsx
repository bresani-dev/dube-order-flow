import { OrderItem, PaymentMethod } from '@/types/pos';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CreditCard, Banknote, Smartphone, X } from 'lucide-react';

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
  items: OrderItem[];
  total: number;
  tableNumber: number;
  tableName?: string;
}

export const CheckoutSheet = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  total,
  tableNumber,
  tableName,
}: CheckoutSheetProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const displayName = tableName || `Mesa ${tableNumber}`;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Fechar Conta</SheetTitle>
          </div>
          <p className="text-muted-foreground">{displayName}</p>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={`${item.menuItem.id}-${index}`}
                className="flex justify-between items-center py-2 border-b border-border/50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.quantity}x</span>
                  <span>{item.menuItem.name}</span>
                </div>
                <span className="font-medium">
                  {formatPrice(item.menuItem.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-3xl font-bold text-primary">{formatPrice(total)}</span>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Selecione a forma de pagamento
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => onConfirm('cash')}
                size="lg"
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-success/10 hover:border-success hover:text-success"
              >
                <Banknote className="w-6 h-6" />
                <span className="text-sm">Dinheiro</span>
              </Button>
              
              <Button
                onClick={() => onConfirm('card')}
                size="lg"
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-primary/10 hover:border-primary hover:text-primary"
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Cartão</span>
              </Button>
              
              <Button
                onClick={() => onConfirm('pix')}
                size="lg"
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-accent/10 hover:border-accent hover:text-accent-foreground"
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-sm">PIX</span>
              </Button>
            </div>

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Continuar Adicionando
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
