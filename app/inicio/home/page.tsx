"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Sword, Users, BookCheck } from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";
import { fetchData } from "@/lib/api";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <CardDescription>{description}</CardDescription>}
    </CardContent>
  </Card>
);

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    cautelasAtivas: 0,
    militares: 0,
    armas: 0,
    armasDisponiveis: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const [cautelas, militares, armas, armasDisponiveis] = await Promise.all([
          fetchData<number>("/dashboard/cautelas-ativas"),
          fetchData<number>("/dashboard/militares"),
          fetchData<number>("/dashboard/armamentos"),
          fetchData<number>("/dashboard/armamentos-disponiveis"),
        ]);

        if (!isMounted) return;

        setDashboardData({
          cautelasAtivas: cautelas ?? 0,
          militares: militares ?? 0,
          armas: armas ?? 0,
          armasDisponiveis: armasDisponiveis ?? 0,
        });
      } catch (error) {
        if (!isMounted) return;
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PrivateRoute>
      <main className="sm:ml-14 p-4 max-w-4xl mx-auto">
        <div className="py-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bem-vindo ao SISCAUT</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Controle de Cautela de Armamentos
              </p>
            </div>
            <Link
              href="/cautelas/novo"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Nova Cautela
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <StatCard
              title="Total de Cautelas Ativas"
              value={loading ? "..." : dashboardData.cautelasAtivas}
              icon={BookCheck}
              description="Cautelas em uso"
            />
            <StatCard
              title="Militares Cadastrados"
              value={loading ? "..." : dashboardData.militares}
              icon={Users}
            />
            <StatCard
              title="Armamentos Cadastrados"
              value={loading ? "..." : dashboardData.armas}
              icon={Sword}
              description={
                loading ? "Carregando..." : `${dashboardData.armasDisponiveis} disponíveis`
              }
            />
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}