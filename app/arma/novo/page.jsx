"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createData } from "@/lib/api";
import { toast } from "sonner";

export default function NovaArma() {
  const [formData, setFormData] = useState({
    numeroSerie: "",
    tipo: "",
    marca: "",
    modelo: "",
    calibre: "",
    acabamento: "",
    numeroTiro: "",
    cano: "",
    numeroPMMA: "",
    tombo: "",
    estadoConservacao: "",
    qtdeCarregador: "",
    maleta: "",
    acessorios: "",
    procedencia: "",
    obs: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createData("/armas", {
        ...formData,
        qtdeCarregador: Number(formData.qtdeCarregador),
      });

      toast.success("Arma cadastrada com sucesso!");
      router.push("/arma");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar arma");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Arma</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="numeroSerie">Número de Série</Label>
            <Input name="numeroSerie" value={formData.numeroSerie} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="modelo">Modelo</Label>
            <select name="modelo" value={formData.modelo} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="PT840">PT840</option>
              <option value="PT100">PT100</option>
              <option value="MAGAL">MAGAL</option>
              <option value="MT12">MT12</option>
              <option value="SMT40">SMT40</option>
              <option value="MD97">MD97</option>
              <option value="M964">M964</option>
              <option value="967">967</option>
              <option value="AM640">AM640</option>
              <option value="586.2">586.2</option>
              <option value="T4">T4</option>
              <option value="IA2">IA2</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="tipo">Tipo de Arma</Label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="PISTOLA">PISTOLA</option>
              <option value="FUZIL">FUZIL</option>
              <option value="CARABINA">CARABINA</option>
              <option value="ESPINGARDA">ESPINGARDA</option>
              <option value="METRALHADORA">METRALHADORA</option>
              <option value="SUBMETRALHADORA">SUBMETRALHADORA</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="marca">Marca</Label>
            <select name="marca" value={formData.marca} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="TAURUS">TAURUS</option>
              <option value="IMBEL">IMBEL</option>
              <option value="CONDOR">CONDOR</option>
              <option value="CBC">CBC</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="calibre">Calibre</Label>
            <select name="calibre" value={formData.calibre} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value=".40mm">.40mm</option>
              <option value=".30">.30</option>
              <option value="9mm">9mm</option>
              <option value="5,56">5,56</option>
              <option value="7,62">7,62</option>
              <option value="12">12</option>
              <option value="40mm">40mm</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="acabamento">Acabamento</Label>
            <select name="acabamento" value={formData.acabamento} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="OXIDADO">OXIDADO</option>
              <option value="INOX">INOX</option>
              <option value="FOSCO">FOSCO</option>
              <option value="PINTADO">PINTADO</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="numeroTiro">Capacidade (Nº de Tiros)</Label>
            <select name="numeroTiro" value={formData.numeroTiro} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="1">1</option>
              <option value="5+1">5+1</option>
              <option value="7+1">7+1</option>
              <option value="11+1">11+1</option>
              <option value="15+1">15+1</option>
              <option value="20+1">20+1</option>
              <option value="30+1">30+1</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="cano">Cano</Label>
            <select name="cano" value={formData.cano} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="108mm">108mm</option>
              <option value="125mm">125mm</option>
              <option value="200mm">200mm</option>
              <option value="230mm">230mm</option>
              <option value="330mm">330mm</option>
              <option value="350mm">350mm</option>
              <option value="355mm">355mm</option>
              <option value="360mm">360mm</option>
              <option value="440mm">440mm</option>
              <option value="610mm">610mm</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="numeroPMMA">Número PMMA</Label>
            <Input name="numeroPMMA" value={formData.numeroPMMA} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tombo">Tombo</Label>
            <Input name="tombo" value={formData.tombo} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="estadoConservacao">Estado de Conservação</Label>
            <select name="estadoConservacao" value={formData.estadoConservacao} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="BOM">BOM</option>
              <option value="REGULAR">REGULAR</option>
              <option value="RUIM">RUIM</option>
              <option value="INSERVÍVEL">INSERVÍVEL</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="qtdeCarregador">Qtd. Carregador</Label>
            <Input name="qtdeCarregador" type="number" value={formData.qtdeCarregador} onChange={handleChange} required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="maleta">Possui Maleta?</Label>
            <select name="maleta" value={formData.maleta} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="acessorios">Possui Acessórios?</Label>
            <select name="acessorios" value={formData.acessorios} onChange={handleChange} className="w-full border rounded p-2" required>
              <option value="">Selecione</option>
              <option value="SIM">Sim</option>
              <option value="NAO">Não</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="procedencia">Procedência</Label>
            <Input name="procedencia" value={formData.procedencia} onChange={handleChange} />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="obs">Observações</Label>
            <Input name="obs" value={formData.obs} onChange={handleChange} />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
            <Link href="/arma">
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </form>
      </main>

    </PrivateRoute>

  );
}
