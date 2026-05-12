import type { Analysis, ChatResponse, CompareResponse, DashboardStats, DocumentSummary, PipelineStatus } from "../types/api";
import { fallbackAnalysis, fallbackChat, fallbackComparison, fallbackDocuments, fallbackPipeline, fallbackStats } from "./fallback";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const ENABLE_FALLBACK = import.meta.env.VITE_ENABLE_DEMO_FALLBACK !== "false";

async function request<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: options?.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
      ...options
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (ENABLE_FALLBACK && fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export const api = {
  dashboardStats: () => request<DashboardStats>("/api/dashboard/stats", undefined, fallbackStats),
  listDocuments: () => request<DocumentSummary[]>("/api/documents", undefined, fallbackDocuments),
  uploadDocument: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return request<DocumentSummary>("/api/documents/upload", { method: "POST", body }, fallbackDocuments[0]);
  },
  analyzeContract: (documentId: string) =>
    request<Analysis>("/api/contracts/analyze", { method: "POST", body: JSON.stringify({ document_id: documentId }) }, fallbackAnalysis),
  compareContracts: (documentAId: string, documentBId: string) =>
    request<CompareResponse>("/api/contracts/compare", {
      method: "POST",
      body: JSON.stringify({ document_a_id: documentAId, document_b_id: documentBId })
    }, fallbackComparison),
  queryChat: (documentId: string, question: string) =>
    request<ChatResponse>("/api/chat/query", {
      method: "POST",
      body: JSON.stringify({ document_id: documentId, question, role: "legal_reviewer" })
    }, fallbackChat),
  pipeline: (jobId: string) => request<PipelineStatus>(`/api/pipeline/${jobId}`, undefined, fallbackPipeline)
};
