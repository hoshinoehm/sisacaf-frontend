// components/ConfirmarBaixaDialog.tsx
"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

export function ConfirmarBaixaDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="ghost" >Dar baixa</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-md w-full max-w-md shadow-xl space-y-4 z-50">
          <AlertDialog.Title className="text-lg font-semibold">Confirmar baixa</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground">
            Tem certeza que deseja dar baixa nesta cautela? Essa ação não poderá ser desfeita.
          </AlertDialog.Description>
          <div className="flex justify-end gap-4 pt-4">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="destructive" onClick={onConfirm}>Confirmar</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
