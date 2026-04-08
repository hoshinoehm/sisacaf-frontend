"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchData } from "@/lib/api"; // usar sua função fetchData

export default function VisualizarColete() {
  const [colete, setColete] = useState(null);
  const params = useParams(); // captura o id da URL

  useEffect(() => {
    if (params.id) {
      fetchData(`/coletes/${params.id}`)
        .then(setColete)
        .catch((error) => console.error("Erro ao buscar colete:", error));
    }
  }, [params.id]);

  if (!colete) return <p className="p-4">Carregando...</p>;

  return (
    <PrivateRoute>

      <main className="sm:ml-14 p-4">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Detalhes do Colete</h1>

          <Card>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {Object.entries(colete).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                  <p className="text-sm text-muted-foreground break-words">{String(value)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div>
            <Link href="/colete">
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </div>
      </main>

    </PrivateRoute>

  );
}
