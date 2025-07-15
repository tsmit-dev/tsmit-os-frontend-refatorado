
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  User,
  HardDrive,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ServiceOrder } from '@/interfaces';
import { format } from 'date-fns';
import { StatusBadge } from './StatusBadge';

interface OsTableProps {
  data: ServiceOrder[];
}

export function OsTable({ data }: OsTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleRowClick = (id: string) => {
    router.push(`/os/${id}`);
  };

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 640;

  if (isMobile) {
    return (
      <MobileView
        data={paginatedData}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        onRowClick={handleRowClick}
      />
    );
  }

  return (
    <DesktopView
      data={paginatedData}
      page={page}
      totalPages={totalPages}
      setPage={setPage}
      onRowClick={handleRowClick}
    />
  );
}

interface ViewProps {
  data: ServiceOrder[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  onRowClick: (id: string) => void;
}

function DesktopView({
  data,
  page,
  totalPages,
  setPage,
  onRowClick,
}: ViewProps) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipamento</TableHead>
              <TableHead>Data de Abertura</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((os) => (
              <TableRow
                key={os.id}
                onClick={() => onRowClick(os.id)}
                className="cursor-pointer"
              >
                <TableCell>{os.order_number}</TableCell>
                <TableCell>{os.client_snapshot.name}</TableCell>
                <TableCell>{`${os.equipment.brand} ${os.equipment.model}`}</TableCell>
                <TableCell>
                  {format(new Date(os.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <StatusBadge status={os.status.name} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function MobileView({ data, page, totalPages, setPage, onRowClick }: ViewProps) {
  return (
    <div className="space-y-4">
      {data.map((os) => (
        <Card key={os.id} onClick={() => onRowClick(os.id)}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>OS: {os.order_number}</span>
              <StatusBadge status={os.status.name} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{os.client_snapshot.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-muted-foreground" />
              <span>{`${os.equipment.brand} ${os.equipment.model}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{format(new Date(os.createdAt), 'dd/MM/yyyy')}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>
      ))}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
