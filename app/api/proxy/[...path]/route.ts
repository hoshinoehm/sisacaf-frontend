import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.API_BASE_URL || "http://187.77.231.240:8080/api";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyRequest(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { path } = await params;

  // Proteção contra path traversal
  if (path.some((segment) => segment.includes("..") || segment === "")) {
    return NextResponse.json({ error: "Caminho inválido" }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams.toString();
  const backendPath = path.join("/");
  const url = searchParams
    ? `${BACKEND_URL}/${backendPath}?${searchParams}`
    : `${BACKEND_URL}/${backendPath}`;

  const forwardHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Host: "localhost",
  };

  const contentType = request.headers.get("content-type");
  if (contentType) forwardHeaders["Content-Type"] = contentType;

  const accept = request.headers.get("accept");
  if (accept) forwardHeaders["Accept"] = accept;

  const init: RequestInit = {
    method: request.method,
    headers: forwardHeaders,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { error: "Erro ao comunicar com o servidor" },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers();
  const respContentType = response.headers.get("content-type");
  if (respContentType) responseHeaders.set("content-type", respContentType);

  // Se o backend retornar 401/403, limpa os cookies de sessão
  if (response.status === 401 || response.status === 403) {
    const errorRes = new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
    errorRes.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    errorRes.cookies.set("is_authenticated", "", { maxAge: 0, path: "/" });
    return errorRes;
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
