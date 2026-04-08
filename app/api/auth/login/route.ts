import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.API_BASE_URL || "http://187.77.231.240:8080/api";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Host: "localhost" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor" },
      { status: 502 }
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object"
        ? data?.message || data?.error || "Falha na autenticação"
        : data || "Falha na autenticação";
    return NextResponse.json({ error: message }, { status: response.status });
  }

  const token =
    typeof data === "object" ? data?.access_token ?? data?.token : null;

  if (!token) {
    return NextResponse.json(
      { error: "Token não encontrado na resposta do servidor" },
      { status: 502 }
    );
  }

  const isProduction =
    process.env.NODE_ENV === "production" &&
    process.env.USE_SECURE_COOKIES === "true";
  const res = NextResponse.json({ success: true });

  // Token JWT em cookie httpOnly — JS do cliente não consegue ler
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Flag de UI (não-httpOnly) para o cliente saber que está autenticado
  res.cookies.set("is_authenticated", "true", {
    httpOnly: false,
    secure: isProduction,
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}
