import { PaymentMethod } from '@/types/pos';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Banknote, CreditCard, QrCode, Check } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
  total: number;
  tableNumber: number;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  total,
  tableNumber,
}: PaymentModalProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const paymentMethods: { method: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { method: 'cash', label: 'Dinheiro', icon: <Banknote className="w-8 h-8" /> },
    { method: 'card', label: 'Cartão', icon: <CreditCard className="w-8 h-8" /> },
    { method: 'pix', label: 'PIX', icon: <QrCode className="w-8 h-8" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Finalizar Mesa {tableNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <p className="text-muted-foreground mb-2">Total a pagar</p>
          <p className="text-4xl font-bold text-primary">{formatPrice(total)}</p>
        </div>

        <div className="space-y-3">
          <p className="text-center text-muted-foreground mb-4">
            Selecione a forma de pagamento
          </p>

          {paymentMethods.map(({ method, label, icon }) => (
            <Button
              key={method}
              onClick={() => onConfirm(method)}
              variant="outline"
              className="w-full h-20 text-xl font-semibold justify-start gap-4 rounded-xl hover:bg-primary/10 hover:border-primary"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                {icon}
              </div>
              <span className="flex-1 text-left">{label}</span>
              <Check className="w-6 h-6 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
