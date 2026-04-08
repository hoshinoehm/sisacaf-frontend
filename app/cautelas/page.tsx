"use client";

import PrivateRoute from "@/components/PrivateRoute";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  createColumnHelper,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";
import { fetchData, authFetch } from "@/lib/api";
import { ConfirmarBaixaDialog } from "@/components/ConfirmarBaixaDialog";
import { toast } from "sonner";
import { gerarPdf, gerarRelatorioCompleto } from "@/lib/relatorios"; // ✅ import correto

interface CautelaDTO {
  id: number;
  militarNome: string;
  armaNumeroSerie: string;
  quantidadeMunicao: number;
}

const columnHelper = createColumnHelper<CautelaDTO>();

export default function ListarCautelasTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [data, setData] = useState<CautelaDTO[]>([]);

  useEffect(() => {
    fetchData<CautelaDTO[]>("/cautelas/nao-baixadas")
      .then(setData)
      .catch((err) => console.error("Erro ao buscar cautelas:", err));
  }, []);

  const baixarCautela = async (id: number) => {
    try {
      await authFetch(`/cautelas/${id}/baixa`, { method: "PATCH" });

      toast.success("Cautela baixada com sucesso!");
      const novosDados = await fetchData<CautelaDTO[]>("/cautelas/nao-baixadas");
      setData(novosDados);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao baixar cautela");
    }
  };

  const columns = [
    columnHelper.accessor("militarNome", {
      header: ({ column }) => (
        <button onClick={column.getToggleSortingHandler()} className="flex items-center gap-1">
          Militar
          {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </button>
      ),
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor("armaNumeroSerie", {
      header: ({ column }) => (
        <button onClick={column.getToggleSortingHandler()} className="flex items-center gap-1">
          Arma
          {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </button>
      ),
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor("quantidadeMunicao", {
      header: ({ column }) => (
        <button onClick={column.getToggleSortingHandler()} className="flex items-center gap-1">
          Munição
          {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </button>
      ),
      cell: (info) => info.getValue() || 0,
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/cautelas/${row.original.id}`}>Visualizar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => gerarPdf(row.original.id)}>
              Imprimir ACAF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => gerarRelatorioCompleto(row.original.id)}>
              Imprimir Relatório Completo
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <ConfirmarBaixaDialog onConfirm={() => baixarCautela(row.original.id)} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: { sorting, globalFilter },
  });

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Cautelas</h1>
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}
