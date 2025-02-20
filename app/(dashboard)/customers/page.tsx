import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  getUser,
  getAllCustomers,
  login,
  createCustomer
} from '@/lib/sessions';
import { PlusCircle, Table } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody
} from '@/components/ui/table';
import { Customer } from './customer';

export default async function CustomersPage() {
  const user = await getUser();

  const customers = await getAllCustomers();

  return user?.isAdmin ? (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>

        <CardDescription>
          View all customers and create new ones.
        </CardDescription>
        <div className="ml-auto flex items-center gap-2">
          <CustomerDialog
            createUser={async (payload) => {
              'use server';
              await createCustomer(payload);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <Customer key={customer.id} customer={customer} />
            ))}
          </TableBody>
        </table>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>
          You are logged in as customer this is an Admin only view
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

const CustomerDialog = ({
  createUser
}: {
  createUser: (payload: FormData) => void;
}) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet">Add Customer</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Add Customer</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Create new customer account
        </Dialog.Description>
        <form action={createUser}>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="username">
              Email
            </label>
            <input className="Input" name="username" type="text" />
          </fieldset>
          <fieldset className="Fieldset">
            <label className="Label" htmlFor="password">
              Password
            </label>
            <input className="Input" name="password" defaultValue="" />
          </fieldset>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end'
            }}
          >
            <Button type="submit" value="Submit">
              Create Customer
            </Button>
          </div>
        </form>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
