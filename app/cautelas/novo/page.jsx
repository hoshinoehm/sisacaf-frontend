"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createData, fetchData } from "@/lib/api";
import { toast } from "sonner";

export default function NovaCautela() {
  const [formData, setFormData] = useState({
  militarId: "",
  armaId: "",
  quantidadeMunicao: "",
  dataEntrega: "",
  observacoes: "",
});

  const [militares, setMilitares] = useState([]);
  const [armas, setArmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData("/militares").then(setMilitares).catch(console.error);
    fetchData("/armas/disponiveis").then(setArmas).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        militarId: Number(formData.militarId),
        armaId: Number(formData.armaId),
        quantidadeMunicao: Number(formData.quantidadeMunicao),
        dataEntrega: formData.dataEntrega, // novo campo aqui
        observacoes: formData.observacoes,
      };

      await createData("/cautelas", payload);
      toast.success("Cautela criada com sucesso!");
      router.push("/cautelas");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar cautela");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Cautela</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="militarId">Militar</Label>
            <select
              id="militarId"
              value={formData.militarId}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Selecione um militar</option>
              {militares.map((militar) => (
                <option key={militar.id} value={militar.id}>
                  {militar.nomeGuerra || militar.nomeCompleto}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="armaId">Arma</Label>
            <select
              id="armaId"
              value={formData.armaId}
              onChange={handleChange}
              required
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Selecione uma arma</option>
              {armas.map((arma) => (
                <option key={arma.id} value={arma.id}>
                  {arma.numeroSerie} - {arma.modelo}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="quantidadeMunicao">Quantidade de Munição</Label>
            <Input
              id="quantidadeMunicao"
              type="number"
              value={formData.quantidadeMunicao}
              onChange={handleChange}
              placeholder="Ex: 30"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dataEntrega">Data de Entrega</Label>
            <Input
              id="dataEntrega"
              type="date"
              value={formData.dataEntrega}
              onChange={handleChange}
              required
            />
          </div>


          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Alguma observação sobre a cautela"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
            <Link href="/cautelas">
              <Button type="button" variant="outline">
                Voltar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </main>
    </PrivateRoute>

  );
}
