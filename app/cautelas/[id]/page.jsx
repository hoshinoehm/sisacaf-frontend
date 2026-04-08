"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchData } from "@/lib/api";
import { toast } from "sonner";

// Função para formatar data
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function VisualizarCautela() {
  const router = useRouter();
  const params = useParams();
  const [cautela, setCautela] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeamento dos campos com nomes amigáveis
  const fieldLabels = {
    id: "Número da Cautela",
    militarNome: "Nome de Guerra",
    armaNumeroSerie: "Arma Nº Série",
    quantidadeMunicao: "Quantidade de Munição",
    dataEntrega: "Data de Entrega",
    dataDevolucao: "Data de Devolução",
    observacoes: "Observações",
  };

  // Lista de campos que vamos exibir
  const fieldsToShow = [
    "id",
    "militarNome",
    "armaNumeroSerie",
    "quantidadeMunicao",
    "dataEntrega",
    "dataDevolucao",
    "observacoes",
  ];

  useEffect(() => {
    const loadCautela = async () => {
      try {
        const data = await fetchData(`/cautelas/${params.id}`);
        setCautela(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar cautela");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      loadCautela();
    }
  }, [params?.id]);

  if (loading) {
    return <p className="sm:ml-14 p-4">Carregando...</p>;
  }

  if (!cautela) {
    return <p className="sm:ml-14 p-4">Cautela não encontrada.</p>;
  }

  return (
    <PrivateRoute>

      <main className="sm:ml-14 p-4">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Detalhes da Cautela</h1>

          <Card>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {fieldsToShow.map((key) => {
                let value = cautela[key];

                if (key === "dataEntrega" || key === "dataDevolucao") {
                  value = formatDate(value);
                }

                if (key === "dataDevolucao" && !value) {
                  value = (
                    <span className="text-red-500 font-semibold">
                      Em uso
                    </span>
                  );
                }

                return (
                  <div key={key} className="space-y-1">
                    <Label className="capitalize">
                      {fieldLabels[key] || key}
                    </Label>
                    <p className="text-sm text-muted-foreground break-words">
                      {value ?? "—"}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex gap-2 mt-4">
            <Link href="/cautelas">
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </div>
      </main>

    </PrivateRoute>

  );
}
