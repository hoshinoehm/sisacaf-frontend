"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createData, fetchData } from "@/lib/api";
import { toast } from "sonner";

interface Estado {
  id: number;
  nome: string;
  uf: string;
}

interface Cidade {
  id: number;
  nome: string;
  estado: {
    id: number;
    nome: string;
    uf: string;
  };
}

interface Funcao {
  id: number;
  nome: string;
}

interface SubUnidade {
  id: number;
  nome: string;
}

export default function CadastroMilitar() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeGuerra: "",
    matricula: "",
    cpf: "",
    rgMilitar: "",
    celular: "",
    cidadeId: 0,
    estadoId: 0,
    idServidor: "",
    subUnidadeId: "",
    situacao: "PRONTO",
    postoGraduacao: "SOLDADO",
    quadro: "QOPM",
    numeroBarra: "",
    dataInclusao: "",
    dataNascimento: "",
    funcaoId: "",
    serve31bpm: false,
    sexo: "",
    email: "",
    logradouro: "",
    numeroCasa: "",
    bairro: "",
  });

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [subUnidades, setSubUnidades] = useState<SubUnidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [estadosData, cidadesData, funcoesData, subunidadesData] = await Promise.all([
          fetchData<Estado[]>("/estados"),
          fetchData<Cidade[]>("/cidades"),
          fetchData<Funcao[]>("/funcoes"),
          fetchData<SubUnidade[]>("/subunidades"),
        ]);

        setEstados(estadosData);
        setTodasCidades(cidadesData);
        setFuncoes(funcoesData);
        setSubUnidades(subunidadesData);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados iniciais.");
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (!formData.estadoId) return;
    const cidadesFiltradas = todasCidades.filter(c => c.estado.id === formData.estadoId);
    setCidades(cidadesFiltradas);
  }, [formData.estadoId, todasCidades]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { id, value, type } = target;
    const val = type === "checkbox" && "checked" in target ? (target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [id]: val }));
  };

  const handleEstadoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const novoEstadoId = Number(e.target.value);
    const cidadesFiltradas = todasCidades.filter(c => c.estado.id === novoEstadoId);
    setCidades(cidadesFiltradas);
    setFormData(prev => ({ ...prev, estadoId: novoEstadoId, cidadeId: 0 }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.estadoId || !formData.cidadeId) {
      toast.error("Estado e cidade devem ser selecionados.");
      return;
    }

    if (!formData.matricula || !formData.cpf || !formData.idServidor) {
      toast.error("Matrícula, CPF e ID Servidor são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        idServidor: Number(formData.idServidor),
        subUnidadeId: Number(formData.subUnidadeId),
        funcaoId: Number(formData.funcaoId),
        estadoId: Number(formData.estadoId),
        cidadeId: Number(formData.cidadeId),
        serve31bpm: formData.serve31bpm ? "S" : "N",
      };

      await createData("/militares", payload);
      toast.success("Militar cadastrado com sucesso!");
      router.push("/militar");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar militar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrivateRoute>
    <main className="sm:ml-14 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Militar</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(
          [
            "nomeCompleto", "nomeGuerra", "matricula", "cpf", "rgMilitar", "celular",
            "idServidor", "numeroBarra", "dataInclusao", "dataNascimento", "email",
            "logradouro", "numeroCasa", "bairro"
          ] as (keyof typeof formData)[]
        ).map((field) => (

          <div className="space-y-1" key={field}>
            <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
            <Input
              id={field}
              type={["dataInclusao", "dataNascimento"].includes(field) ? "date" : "text"}
              value={typeof formData[field] === "boolean" ? "" : formData[field] ?? ""}
              onChange={handleChange}
              required={["nomeCompleto", "cpf", "matricula", "idServidor"].includes(field)}
            />
          </div>
        ))}

        <div className="space-y-1">
          <Label htmlFor="estadoId">Estado</Label>
          <select
            id="estadoId"
            className="w-full border rounded p-2"
            value={formData.estadoId}
            onChange={handleEstadoChange}
            required
          >
            <option value="">Selecione</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>{estado.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="cidadeId">Cidade</Label>
          <select
            id="cidadeId"
            className="w-full border rounded p-2"
            value={formData.cidadeId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="sexo">Sexo</Label>
          <select
            id="sexo"
            className="w-full border rounded p-2"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="MASC">Masculino</option>
            <option value="FEM">Feminino</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="situacao">Situação</Label>
          <select
            id="situacao"
            className="w-full border rounded p-2"
            value={formData.situacao}
            onChange={handleChange}
          >
            <option value="PRONTO">PRONTO</option>
            <option value="FERIAS">FERIAS</option>
            <option value="LP">LP</option>
            <option value="JMS">JMS</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="postoGraduacao">Posto/Graduação</Label>
          <select
            id="postoGraduacao"
            className="w-full border rounded p-2"
            value={formData.postoGraduacao}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            <option value="SOLDADO">Soldado</option>
            <option value="CABO">Cabo</option>
            <option value="TERCEIRO_SARGENTO">3° Sargento</option>
            <option value="SEGUNDO_SARGENTO">2° Sargento</option>
            <option value="PRIMEIRO_SARGENTO">1° Sargento</option>
            <option value="SUBTENENTE">Subtenente</option>
            <option value="ASPIRANTE">Aspirante</option>
            <option value="SEGUNDO_TENENTE">2° Tenente</option>
            <option value="PRIMEIRO_TENENTE">1° Tenente</option>
            <option value="CAPITAO">Capitão</option>
            <option value="MAJOR">Major</option>
            <option value="TENENTE_CORONEL">Tenente-Coronel</option>
            <option value="CORONEL">Coronel</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="quadro">Quadro</Label>
          <select
            id="quadro"
            className="w-full border rounded p-2"
            value={formData.quadro}
            onChange={handleChange}
          >
            <option value="QPPM">QPPM</option>
            <option value="QOPM">QOPM</option>
            <option value="QOAPM">QOAPM</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="funcaoId">Função</Label>
          <select
            id="funcaoId"
            className="w-full border rounded p-2"
            value={formData.funcaoId}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {funcoes.map((funcao) => (
              <option key={funcao.id} value={funcao.id}>{funcao.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="subUnidadeId">Subunidade</Label>
          <select
            id="subUnidadeId"
            className="w-full border rounded p-2"
            value={formData.subUnidadeId}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {subUnidades.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 flex items-center gap-2">
          <input
            type="checkbox"
            id="serve31bpm"
            checked={formData.serve31bpm}
            onChange={handleChange}
          />
          <Label htmlFor="serve31bpm">Serve no 31º BPM</Label>
        </div>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
          <Link href="/militares">
            <Button type="button" variant="outline">Voltar</Button>
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
