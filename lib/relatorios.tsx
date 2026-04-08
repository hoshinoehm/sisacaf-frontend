import { authFetch } from "@/lib/api";

const gerarBlobEDownload = async (endpoint: string, nomeArquivo: string) => {
  try {
    const response = await authFetch(endpoint, { method: "GET" });

    if (!(response instanceof Blob)) {
      throw new Error("Resposta inválida para download.");
    }

    const blobUrl = URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 10_000);
  } catch (error) {
    console.error(`Erro ao baixar ${nomeArquivo}:`, error);
    throw error;
  }
};

export const gerarPdf = async (id: number) =>
  gerarBlobEDownload(`/cautelas/${id}/relatorio`, `acaf-${id}.pdf`);

export const gerarRelatorioCompleto = async (id: number) =>
  gerarBlobEDownload(
    `/cautelas/${id}/relatorio-acaf-processo`,
    `relatorio-completo-${id}.pdf`
  );
