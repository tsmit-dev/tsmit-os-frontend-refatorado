
import { format } from 'date-fns';

interface EditHistoryItemProps {
  history: {
    field: string;
    oldValue: string;
    newValue: string;
    createdAt: string;
    user: { name: string };
  };
}

export function EditHistoryItem({ history }: EditHistoryItemProps) {
  return (
    <li className="mb-4">
      <div className="flex items-center mb-1">
        <p className="text-sm text-muted-foreground">
          {format(new Date(history.createdAt), 'dd/MM/yyyy HH:mm')} por{' '}
          {history.user.name}
        </p>
      </div>
      <p className="text-sm">
        Campo <strong>{history.field}</strong> alterado:
      </p>
      <div className="flex items-center gap-2">
        <span className="text-red-500 line-through">{history.oldValue}</span>
        <span>-&gt;</span>
        <span className="text-green-500">{history.newValue}</span>
      </div>
    </li>
  );
}
