import { KitchenTicket as KitchenTicketType } from '@/types/pos';
import { forwardRef } from 'react';

interface KitchenTicketProps {
  ticket: KitchenTicketType;
}

export const KitchenTicket = forwardRef<HTMLDivElement, KitchenTicketProps>(
  ({ ticket }, ref) => {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <div ref={ref} className="print-ticket bg-card p-6 rounded-xl max-w-sm mx-auto">
        <div className="text-center border-b border-dashed border-border pb-4 mb-4">
          <h1 className="text-2xl font-bold">DUBE BURGER</h1>
          <p className="text-muted-foreground text-sm mt-1">Comanda de Cozinha</p>
        </div>

        <div className="border-b border-dashed border-border pb-4 mb-4">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Mesa:</span>
            <span className="font-bold text-primary">{ticket.tableNumber}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Pedido:</span>
            <span>#{ticket.orderId.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {ticket.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex gap-3">
                <span className="font-bold text-primary">{item.quantity}x</span>
                <span className="font-medium">{item.menuItem.name}</span>
              </div>
            </div>
          ))}
        </div>

        {ticket.notes && (
          <div className="border-t border-dashed border-border pt-4 mb-4">
            <p className="text-sm font-semibold">Observações:</p>
            <p className="text-sm text-muted-foreground mt-1">{ticket.notes}</p>
          </div>
        )}

        <div className="border-t border-dashed border-border pt-4 text-center">
          <p className="text-sm text-muted-foreground">{formatDate(ticket.createdAt)}</p>
        </div>
      </div>
    );
  }
);

KitchenTicket.displayName = 'KitchenTicket';
