"use client";
import PrivateRoute from "@/components/PrivateRoute";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function NovoColete() {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    tamanho: "",
    validade: "",
    anoFabricacao: "",
    nivelProtecao: "",
    genero: "",
    numeroSerie: "",
    numeroGuia: "",
    tombo: "",
    conservacao: "",
    situacao: "",
    obs: "",
    local: "",
    cautelaIndividual: false,
    livroPagina: "",
    livroOrdem: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Enviar para API no futuro
  };

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Novo Colete</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "marca", label: "Marca" },
            { name: "modelo", label: "Modelo" },
            { name: "tamanho", label: "Tamanho" },
            { name: "validade", label: "Validade", type: "date" },
            { name: "anoFabricacao", label: "Ano de Fabricação", type: "number" },
            { name: "nivelProtecao", label: "Nível de Proteção" },
            { name: "genero", label: "Gênero" },
            { name: "numeroSerie", label: "Número de Série" },
            { name: "numeroGuia", label: "Número da Guia" },
            { name: "tombo", label: "Tombo" },
            { name: "conservacao", label: "Conservação" },
            { name: "situacao", label: "Situação" },
            { name: "obs", label: "Observações" },
            { name: "local", label: "Local" },
            { name: "livroPagina", label: "Livro - Página", type: "number" },
            { name: "livroOrdem", label: "Livro - Ordem", type: "number" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name} className="space-y-1">
              <Label htmlFor={name}>{label}</Label>
              <Input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required={name !== "obs"}
              />
            </div>
          ))}

          <div className="flex items-center space-x-2 sm:col-span-2 pt-2">
            <Input
              type="checkbox"
              name="cautelaIndividual"
              checked={formData.cautelaIndividual}
              onChange={handleChange}
            />
            <Label htmlFor="cautelaIndividual">Cautela Individual?</Label>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
            <Button type="submit">Salvar</Button>
            <Link href="/colete   ">
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </form>
      </main>
    </PrivateRoute>

  );
}
