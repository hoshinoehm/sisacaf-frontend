"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchData, authFetch } from "@/lib/api";
import { toast } from "sonner";

interface Funcao {
  id: number;
  nome: string;
}

interface SubUnidade {
  id: number;
  nome: string;
}

interface Estado {
  id: number;
  nome: string;
  uf: string;
}

interface Cidade {
  id: number;
  nome: string;
  ibge?: number;
  estado: {
    id: number;
    nome: string;
    uf: string;
  };
}

interface MilitarForm {
  nomeCompleto: string;
  nomeGuerra: string;
  matricula: string;
  cpf: string;
  rgMilitar: string;
  celular: string;
  cidadeId: number;
  estadoId: number;
  idServidor: string;
  subUnidadeId: string;
  numeroBarra: string;
  dataInclusao: string;
  dataNascimento: string;
  funcaoId: string;
  email: string;
  logradouro: string;
  numeroCasa: string;
  bairro: string;
  sexo: string;
  situacao: string;
  postoGraduacao: string;
  postoGraduacaoEnum?: string;
  quadro: string;
  serve31bpm: boolean;
  comportamento?: string;
  comportamentoEnum: string;
  situacaoJuridica: string;
}

export default function EditarMilitar() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState<MilitarForm>({
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
    numeroBarra: "",
    dataInclusao: "",
    dataNascimento: "",
    funcaoId: "",
    email: "",
    logradouro: "",
    numeroCasa: "",
    bairro: "",
    sexo: "",
    situacao: "PRONTO",
    postoGraduacao: "",
    quadro: "",
    serve31bpm: false,
    comportamentoEnum: "",
    situacaoJuridica: "",
  });

  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [subUnidades, setSubUnidades] = useState<SubUnidade[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [todasCidades, setTodasCidades] = useState<Cidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDataInicial = async () => {
      try {
        const [militarData, funcoesData, subunidadesData, estadosData, cidadesData] = await Promise.all([
          fetchData<MilitarForm>(`/militares/${id}`),
          fetchData<Funcao[]>("/funcoes"),
          fetchData<SubUnidade[]>("/subunidades"),
          fetchData<Estado[]>("/estados"),
          fetchData<Cidade[]>("/cidades"),
        ]);

        setFuncoes(funcoesData);
        setSubUnidades(subunidadesData);
        setEstados(estadosData);
        setTodasCidades(cidadesData);

        const cidadesFiltradas = cidadesData.filter(c => c.estado.id === militarData.estadoId);

        setFormData({
          ...militarData,
          cidadeId: Number(militarData.cidadeId),
          estadoId: Number(militarData.estadoId),
          postoGraduacao: militarData.postoGraduacaoEnum ?? "",
          serve31bpm: !!militarData.serve31bpm,
        });

        setCidades(cidadesFiltradas);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados.");
        router.push("/militar");
      }
    };

    fetchDataInicial();
  }, [id, router]);

  useEffect(() => {
    if (!formData.estadoId || !todasCidades.length) return;
    const cidadesFiltradas = todasCidades.filter(c => c.estado.id === formData.estadoId);
    setCidades(cidadesFiltradas);
  }, [formData.estadoId, todasCidades]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [id]: newValue }));
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

    await authFetch(`/militares/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    toast.success("Militar atualizado com sucesso!");
    router.push("/militar");
  } catch (error) {
    console.error(error);
    toast.error("Erro ao atualizar militar");
  } finally {
    setIsLoading(false);
  }
};


  const camposTexto: (keyof MilitarForm)[] = [
    "nomeCompleto",
    "nomeGuerra",
    "matricula",
    "cpf",
    "rgMilitar",
    "celular",
    "idServidor",
    "numeroBarra",
    "dataInclusao",
    "dataNascimento",
    "email",
    "logradouro",
    "numeroCasa",
    "bairro",
    "situacaoJuridica",
  ];

  return (
    <PrivateRoute>
    <main className="sm:ml-14 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Militar</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {camposTexto.map((field) => (
          <div className="space-y-1" key={field}>
            <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
            <Input
              id={field}
              type={["dataInclusao", "dataNascimento"].includes(field) ? "date" : "text"}
              value={typeof formData[field] === "boolean" ? "" : formData[field] ?? ""}
              onChange={handleChange}
              required={field === "nomeCompleto"}
              readOnly={field === "cpf" || field === "matricula"}
            />
          </div>
        ))}

        <div className="space-y-1">
          <Label htmlFor="estadoId">Estado</Label>
          <select id="estadoId" className="w-full border rounded p-2" value={formData.estadoId} onChange={handleEstadoChange}>
            <option value="">Selecione</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>{estado.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="cidadeId">Cidade</Label>
          <select id="cidadeId" className="w-full border rounded p-2" value={formData.cidadeId} onChange={handleChange}>
            <option value="">Selecione</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="postoGraduacao">Posto/Graduação</Label>
          <select id="postoGraduacao" className="w-full border rounded p-2" value={formData.postoGraduacao} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="CORONEL">CEL</option>
            <option value="TENENTE_CORONEL">TC</option>
            <option value="MAJOR">MAJ</option>
            <option value="CAPITAO">CAP</option>
            <option value="PRIMEIRO_TENENTE">1º TEN</option>
            <option value="SEGUNDO_TENENTE">2º TEN</option>
            <option value="ASPIRANTE">ASP OF</option>
            <option value="CAD_PM">CAD PM</option>
            <option value="SUBTENENTE">SUBTEN</option>
            <option value="PRIMEIRO_SARGENTO">1º SGT</option>
            <option value="SEGUNDO_SARGENTO">2º SGT</option>
            <option value="TERCEIRO_SARGENTO">3º SGT</option>
            <option value="CABO">CB</option>
            <option value="SOLDADO">SD</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="funcaoId">Função</Label>
          <select id="funcaoId" className="w-full border rounded p-2" value={formData.funcaoId} onChange={handleChange}>
            <option value="">Selecione</option>
            {funcoes.map((funcao) => (
              <option key={funcao.id} value={funcao.id}>{funcao.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="subUnidadeId">Subunidade</Label>
          <select id="subUnidadeId" className="w-full border rounded p-2" value={formData.subUnidadeId} onChange={handleChange}>
            <option value="">Selecione</option>
            {subUnidades.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.nome}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="comportamentoEnum">Comportamento</Label>
          <select id="comportamentoEnum" className="w-full border rounded p-2" value={formData.comportamentoEnum} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="EXCEPCIONAL">Excepcional</option>
            <option value="OTIMO">Ótimo</option>
            <option value="BOM">Bom</option>
            <option value="INSUFICIENTE">Insuficiente</option>
            <option value="MAU">Mau</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="sexo">Sexo</Label>
          <select id="sexo" className="w-full border rounded p-2" value={formData.sexo} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="MASC">Masculino</option>
            <option value="FEM">Feminino</option>
            <option value="UNISSEX">Unissex</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="situacao">Situação</Label>
          <select id="situacao" className="w-full border rounded p-2" value={formData.situacao} onChange={handleChange}>
            <option value="PRONTO">PRONTO</option>
            <option value="FERIAS">FÉRIAS</option>
            <option value="LP">LP</option>
            <option value="JMS">JMS</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="quadro">Quadro</Label>
          <select id="quadro" className="w-full border rounded p-2" value={formData.quadro} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="QP">QP</option>
            <option value="QOEM">QOEM</option>
            <option value="QOE">QOE</option>
          </select>
        </div>

        <div className="space-y-1 flex items-center gap-2">
          <input type="checkbox" id="serve31bpm" checked={formData.serve31bpm} onChange={handleChange} />
          <Label htmlFor="serve31bpm">Serve no 31º BPM</Label>
        </div>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-4">
          <Link href="/militar">
            <Button type="button" variant="outline">Cancelar</Button>
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
