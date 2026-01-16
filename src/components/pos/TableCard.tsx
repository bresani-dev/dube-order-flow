import { Table } from '@/types/pos';
import { Users } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick: () => void;
}

const statusLabels = {
  free: 'Livre',
  ordering: 'Pedindo',
  waiting: 'Aguardando',
};

export const TableCard = ({ table, onClick }: TableCardProps) => {
  const statusClass = {
    free: 'status-free',
    ordering: 'status-ordering',
    waiting: 'status-waiting',
  }[table.status];

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center
        w-full aspect-square rounded-2xl border-2
        transition-all duration-200 active:scale-95
        ${statusClass}
      `}
    >
      <Users className="w-10 h-10 mb-2" />
      <span className="text-2xl font-bold">Mesa {table.number}</span>
      <span className="text-sm mt-1 opacity-80">{statusLabels[table.status]}</span>
      
      {table.order && (
        <span className="absolute top-3 right-3 bg-foreground/10 px-2 py-1 rounded-lg text-xs">
          {table.order.items.reduce((sum, item) => sum + item.quantity, 0)} itens
        </span>
      )}
    </button>
  );
};
