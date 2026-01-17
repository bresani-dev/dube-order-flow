import { Table } from '@/types/pos';
import { Users, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface TableCardProps {
  table: Table;
  onClick: () => void;
  onUpdateName: (tableId: string, name: string) => void;
}

const statusLabels = {
  free: 'Livre',
  ordering: 'Pedindo',
  waiting: 'Aguardando',
};

export const TableCard = ({ table, onClick, onUpdateName }: TableCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(table.name || '');

  const statusClass = {
    free: 'status-free',
    ordering: 'status-ordering',
    waiting: 'status-waiting',
  }[table.status];

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempName(table.name || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateName(table.id, tempName.trim());
    setIsEditing(false);
  };

  const handleClear = () => {
    setTempName('');
    onUpdateName(table.id, '');
    setIsEditing(false);
  };

  const displayName = table.name || `Mesa ${table.number}`;

  return (
    <>
      <button
        onClick={onClick}
        className={`
          relative flex flex-col items-center justify-center
          w-full aspect-square rounded-2xl border-2
          transition-all duration-200 active:scale-95
          ${statusClass}
        `}
      >
        <button
          onClick={handleEditClick}
          className="absolute top-3 left-3 p-1.5 rounded-lg bg-foreground/10 hover:bg-foreground/20 transition-colors"
          title="Editar nome"
        >
          <Pencil className="w-4 h-4" />
        </button>
        
        <Users className="w-10 h-10 mb-2" />
        <span className="text-2xl font-bold px-2 text-center leading-tight">{displayName}</span>
        <span className="text-sm mt-1 opacity-80">{statusLabels[table.status]}</span>
        
        {table.order && (
          <span className="absolute top-3 right-3 bg-foreground/10 px-2 py-1 rounded-lg text-xs">
            {table.order.items.reduce((sum, item) => sum + item.quantity, 0)} itens
          </span>
        )}
      </button>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personalizar Mesa {table.number}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Ex: João, Família Silva, Aniversário..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="text-lg"
              autoFocus
            />
            <p className="text-sm text-muted-foreground mt-2">
              Deixe vazio para usar "Mesa {table.number}"
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
