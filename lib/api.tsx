// Todas as chamadas ao backend passam pelo proxy interno /api/proxy,
// que adiciona o token JWT a partir do cookie httpOnly (invisível ao JS do cliente).
const PROXY_BASE = "/api/proxy";

function isBrowser() {
  return typeof window !== "undefined";
}

function redirectToLogin(message = "Sua sessão expirou. Faça login novamente.") {
  if (!isBrowser()) return;

  const alreadyRedirecting = sessionStorage.getItem("auth_redirect_in_progress");
  if (alreadyRedirecting === "true") return;

  sessionStorage.setItem("auth_redirect_in_progress", "true");
  window.dispatchEvent(new CustomEvent("auth:expired", { detail: { message } }));
}

export function clearRedirectFlag() {
  if (!isBrowser()) return;
  sessionStorage.removeItem("auth_redirect_in_progress");
}

export function clearAuthStorage() {
  if (!isBrowser()) return;
  sessionStorage.removeItem("auth_redirect_in_progress");
  // Limpa o cookie httpOnly via rota de logout (JS não pode apagá-lo diretamente)
  fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
}

async function parseResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || "";

  if (res.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    const text = await res.text();
    if (!text.trim()) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  if (
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream") ||
    contentType.includes("image/")
  ) {
    return await res.blob();
  }

  return await res.text();
}

function extractMessage(body: unknown, fallback: string): string {
  if (typeof body === "string") {
    return body.trim() || fallback;
  }

  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;

    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message;
    }

    if (typeof obj.error === "string" && obj.error.trim()) {
      return obj.error;
    }
  }

  return fallback;
}

function isAuthError(status: number) {
  return status === 401 || status === 403;
}

export async function authFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | Blob | null> {
  const url = `${PROXY_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  const body = await parseResponse(response);

  if (isAuthError(response.status)) {
    redirectToLogin("Sua sessão expirou. Faça login novamente.");
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    const message = extractMessage(
      body,
      `Erro ${response.status} na requisição para ${endpoint}`
    );
    throw new Error(message);
  }

  if (body instanceof Blob) {
    return body;
  }

  return body as T | null;
}

export async function fetchData<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  return authFetch<T>(endpoint, {
    method: "GET",
    ...options,
  }) as Promise<T>;
}

export async function createData<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return authFetch<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<T>;
}

export async function updateData<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return authFetch<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  }) as Promise<T>;
}

export async function deleteData<T = unknown>(endpoint: string): Promise<T> {
  return authFetch<T>(endpoint, {
    method: "DELETE",
  }) as Promise<T>;
}

interface LoginFormData {
  login: string;
  password: string;
}

// Chama a rota Next.js /api/auth/login, que faz proxy para o backend
// e armazena o token JWT em cookie httpOnly (JS nunca vê o token)
export async function login(formData: LoginFormData): Promise<void> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body?.error || `Erro no login (HTTP ${response.status})`;
    throw new Error(message);
  }
}
