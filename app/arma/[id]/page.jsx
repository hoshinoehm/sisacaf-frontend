"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchData } from "@/lib/api"; // usar seu fetchData para chamar a API

export default function VisualizarArma() {
  const [arma, setArma] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // para pegar o { id } da URL

  useEffect(() => {
    if (!params.id) return; // só busca se tiver o ID

    fetchData(`/armas/${params.id}`)
      .then((data) => setArma(data))
      .catch((err) => {
        console.error("Erro ao buscar arma:", err);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="p-4">Carregando...</p>;
  if (!arma) return <p className="p-4 text-red-500">Arma não encontrada.</p>;

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Detalhes da Arma</h1>

        <Card>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {Object.entries(arma).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                <p className="text-sm text-muted-foreground break-words">{value ?? "-"}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div>
          <Link href="/arma">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </div>
    </main>
    </PrivateRoute>
  );
}
