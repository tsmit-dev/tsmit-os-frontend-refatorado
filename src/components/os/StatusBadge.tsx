
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'aberto':
        return 'bg-blue-500';
      case 'em andamento':
        return 'bg-yellow-500';
      case 'aguardando peça':
        return 'bg-orange-500';
      case 'finalizado':
        return 'bg-green-500';
      case 'entregue':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return <Badge className={`${getStatusColor()} text-white`}>{status}</Badge>;
}
