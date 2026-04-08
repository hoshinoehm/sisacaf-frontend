"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { clearRedirectFlag, login } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type LoginFormData = {
  login: string;
  password: string;
};


export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    login: "",
    password: "",
  });

  useEffect(() => {
    clearRedirectFlag();

    const expiredMessage = sessionStorage.getItem("auth_expired_message");
    if (expiredMessage) {
      toast.error(expiredMessage);
      sessionStorage.removeItem("auth_expired_message");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!formData.login || !formData.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Autenticando...");

    try {
      await login(formData);
      authLogin();

      toast.dismiss(toastId);
      toast.success("Login realizado com sucesso!");
      router.replace("/inicio/home");
    } catch (err: unknown) {
      toast.dismiss(toastId);

      const message =
        err instanceof Error ? err.message : "Falha na autenticação";

      toast.error(message);
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">SISCAUT</h1>
          <p className="text-muted-foreground">
            Faça login para acessar o sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Digite suas credenciais abaixo.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="login">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    placeholder="Digite seu usuário"
                    className="pl-10"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Autenticando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={16} />
                    Entrar
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}