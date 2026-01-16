import { MenuItem } from '@/types/pos';
import { Plus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: () => void;
}

export const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <button
      onClick={onAdd}
      className="menu-item-card flex items-center justify-between w-full text-left"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
        <p className="text-primary font-bold text-xl mt-1">{formatPrice(item.price)}</p>
      </div>
      <div className="ml-4 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
        <Plus className="w-6 h-6 text-primary" />
      </div>
    </button>
  );
};
