
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface StatusHistoryItemProps {
  history: {
    fromStatus: { name: string };
    toStatus: { name: string };
    createdAt: string;
    user: { name: string };
    note?: string;
  };
}

export function StatusHistoryItem({ history }: StatusHistoryItemProps) {
  return (
    <li className="mb-4">
      <div className="flex items-center mb-1">
        <p className="text-sm text-muted-foreground">
          {format(new Date(history.createdAt), 'dd/MM/yyyy HH:mm')} por{' '}
          {history.user.name}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={history.fromStatus.name} />
        <ArrowRight className="w-4 h-4" />
        <StatusBadge status={history.toStatus.name} />
      </div>
      {history.note && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md">
          <p className="text-sm">{history.note}</p>
        </div>
      )}
    </li>
  );
}
