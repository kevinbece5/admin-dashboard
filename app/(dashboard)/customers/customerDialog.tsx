'use server';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Dialog } from 'radix-ui';

export const CustomerDialog = ({
  createUser
}: {
  createUser: (payload: FormData) => void;
}) => {
  return (
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
          <form
            action={async (payload) => {
              await createUser(payload);
              window.location.reload();
            }}
          >
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
};
