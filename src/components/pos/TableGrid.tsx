import { Table } from '@/types/pos';
import { TableCard } from './TableCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableGridProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
  onAddTable: () => void;
  onUpdateTableName: (tableId: string, name: string) => void;
}

export const TableGrid = ({ tables, onSelectTable, onAddTable, onUpdateTableName }: TableGridProps) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Dube Burger</h1>
          <p className="text-muted-foreground mt-1">Sistema de Pedidos</p>
        </div>
        <Button
          onClick={onAddTable}
          size="lg"
          className="touch-button bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Mesa
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => onSelectTable(table)}
            onUpdateName={onUpdateTableName}
          />
        ))}
      </div>
    </div>
  );
};
