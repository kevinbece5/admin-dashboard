import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { SelectCustomer } from '@/lib/db';
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenu
} from '@radix-ui/react-dropdown-menu';
import { Badge, MoreHorizontal } from 'lucide-react';

export function Customer({ customer }: { customer: SelectCustomer }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{customer.id}</TableCell>
      <TableCell className="font-medium">{customer.email}</TableCell>
    </TableRow>
  );
}
