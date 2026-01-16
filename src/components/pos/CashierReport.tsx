import { DailySummary, CompletedOrder } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Banknote, CreditCard, QrCode, Trash2, Printer } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CashierReportProps {
  summary: DailySummary;
  onBack: () => void;
  onClearDay: () => void;
}

export const CashierReport = ({ summary, onBack, onClearDay }: CashierReportProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const paymentStats = [
    {
      method: 'Dinheiro',
      icon: <Banknote className="w-6 h-6" />,
      total: summary.totalCash,
      count: summary.orders.filter(o => o.paymentMethod === 'cash').length,
      colorClass: 'text-success',
    },
    {
      method: 'Cartão',
      icon: <CreditCard className="w-6 h-6" />,
      total: summary.totalCard,
      count: summary.orders.filter(o => o.paymentMethod === 'card').length,
      colorClass: 'text-blue-400',
    },
    {
      method: 'PIX',
      icon: <QrCode className="w-6 h-6" />,
      total: summary.totalPix,
      count: summary.orders.filter(o => o.paymentMethod === 'pix').length,
      colorClass: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="no-print flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="lg" onClick={onBack} className="text-lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Fechamento de Caixa</h1>
              <p className="text-muted-foreground">{summary.date}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="lg"
              className="touch-button"
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimir
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="touch-button border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Limpar Dia
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar fechamento do dia?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso irá apagar todos os registros de vendas de hoje. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onClearDay}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-2xl font-bold">DUBE BURGER</h1>
          <p className="text-sm">Fechamento de Caixa - {summary.date}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {paymentStats.map(stat => (
            <div
              key={stat.method}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-secondary ${stat.colorClass}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.method}</p>
                  <p className="text-sm text-muted-foreground">{stat.count} vendas</p>
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.colorClass}`}>
                {formatPrice(stat.total)}
              </p>
            </div>
          ))}
        </div>

        {/* Total Card */}
        <div className="bg-primary/10 border-2 border-primary rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Total do Dia</p>
              <p className="text-sm text-muted-foreground">
                {summary.orders.length} pedidos finalizados
              </p>
            </div>
            <p className="text-4xl font-bold text-primary">
              {formatPrice(summary.grandTotal)}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Pedidos do Dia</h2>
          </div>

          {summary.orders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p className="text-lg">Nenhum pedido finalizado hoje</p>
              <p className="text-sm mt-2">Os pedidos aparecerão aqui após o pagamento</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {summary.orders
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .map((order: CompletedOrder) => (
                  <div key={order.id} className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <span className="font-bold">{order.tableNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">Mesa {order.tableNumber}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(order.completedAt)} •{' '}
                        {order.paymentMethod === 'cash' ? 'Dinheiro' : 
                         order.paymentMethod === 'card' ? 'Cartão' : 'PIX'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
