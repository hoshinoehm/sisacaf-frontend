"use client";

import PrivateRoute from "@/components/PrivateRoute";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchData } from "@/lib/api";

interface Militar {
  id?: number | string;
  nomeCompleto?: string;
  nomeGuerra?: string;
  matricula?: string;
  cpf?: string;
  rgMilitar?: string;
  celular?: string;
  email?: string;

  postoGraduacaoEnum?: string;
  postoGraduacao?: string;
  situacao?: string;
  quadro?: string;

  funcaoId?: number | string;
  subUnidadeId?: number | string;

  estadoId?: number;
  cidadeId?: number;

  logradouro?: string;
  numeroCasa?: string;
  bairro?: string;

  idServidor?: number | string;
  numeroBarra?: string;

  dataInclusao?: string;   // ISO ou yyyy-MM-dd
  dataNascimento?: string; // ISO ou yyyy-MM-dd
  sexo?: string;

  serve31bpm?: boolean | "S" | "N";
}

type FieldDef = {
  key: keyof Militar;
  label: string;
  format?: (v: unknown) => string;
};

export default function VisualizarMilitar() {
  const params = useParams<{ id: string }>();
  const [militar, setMilitar] = useState<Militar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);

    fetchData<Militar>(`/militares/${params.id}`)
      .then((data) => setMilitar(data))
      .catch((err) => {
        console.error("Erro ao buscar militar:", err);
        setMilitar(null);
      })
      .finally(() => setLoading(false));
  }, [params?.id]);

 const formatDate = (v: unknown): string => {
  const iso = typeof v === "string" ? v : undefined;
  if (!iso) return "-";
  const base = iso.split("T")[0] ?? iso;
  const parts = base.split("-");
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const fields: FieldDef[] = useMemo(
    () => [
      { key: "nomeCompleto", label: "Nome Completo" },
      { key: "nomeGuerra", label: "Nome de Guerra" },
      { key: "matricula", label: "Matrícula" },
      { key: "cpf", label: "CPF" },
      { key: "rgMilitar", label: "RG Militar" },
      { key: "celular", label: "Celular" },
      { key: "email", label: "E-mail" },

      { key: "postoGraduacaoEnum", label: "Posto/Graduação" },
      { key: "situacao", label: "Situação" },
      { key: "quadro", label: "Quadro" },

      { key: "funcaoId", label: "Função (ID)" },
      { key: "subUnidadeId", label: "Subunidade (ID)" },

      { key: "estadoId", label: "Estado (ID)" },
      { key: "cidadeId", label: "Cidade (ID)" },

      { key: "logradouro", label: "Logradouro" },
      { key: "numeroCasa", label: "Número" },
      { key: "bairro", label: "Bairro" },

      { key: "idServidor", label: "ID Servidor" },
      { key: "numeroBarra", label: "Nº Barra" },
      { key: "dataInclusao", label: "Data de Inclusão", format: formatDate },
      { key: "dataNascimento", label: "Data de Nascimento", format: formatDate },
      { key: "sexo", label: "Sexo" },
      {
        key: "serve31bpm",
        label: "Serve no 31º BPM",
        format: (v: unknown) => {
          if (v === true || v === "S") return "Sim";
          if (v === false || v === "N") return "Não";
          if (typeof v === "string") return v || "-";
          if (typeof v === "number") return String(v);
          return "-";
        },
      },
    ],
    []
  );

  if (loading) return <p className="p-4">Carregando...</p>;
  if (!militar) return <p className="p-4 text-red-500">Militar não encontrado.</p>;

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Detalhes do Militar</h1>
            <div className="flex gap-2">
              <Link href="/militar">
                <Button variant="outline">Voltar</Button>
              </Link>
              <Link href={`/militar/${params.id}/editar`}>
                <Button>Editar</Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {fields.map(({ key, label, format }) => {
                const raw = militar[key];
                const value = format
                  ? format(raw as unknown)
                  : raw === null || raw === undefined || raw === ""
                  ? "-"
                  : String(raw);
                return (
                  <div key={String(key)} className="space-y-1">
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground break-words">{value}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </PrivateRoute>
  );
}
