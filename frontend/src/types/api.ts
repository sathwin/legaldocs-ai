export type RiskLevel = "low" | "medium" | "high";

export interface DocumentSummary {
  id: string;
  name: string;
  created_at: string;
  tags: string[];
  job_id: string;
  status: string;
}

export interface Clause {
  type: string;
  title: string;
  text: string;
  risk: RiskLevel;
  rationale: string;
  recommendation: string;
}

export interface DashboardStats {
  total_documents: number;
  analyzed_documents: number;
  high_risk_clauses: number;
  medium_risk_clauses: number;
  average_processing_ms: number;
  provider: string;
}

export interface Analysis {
  document_id: string;
  summary: string;
  overall_risk: RiskLevel;
  clauses: Clause[];
  recommendations: string[];
  sample_output: Record<string, string>;
}

export interface ChatResponse {
  answer: string;
  citations: string[];
  retrieval_context: string[];
  model_provider: string;
  prompt_preview: string;
}

export interface ComparisonItem {
  area: string;
  document_a: string;
  document_b: string;
  risk_delta: string;
}

export interface CompareResponse {
  document_a_id: string;
  document_b_id: string;
  executive_summary: string;
  differences: ComparisonItem[];
}

export interface PipelineStatus {
  job_id: string;
  status: string;
  stages: Array<{
    name: string;
    status: string;
    duration_ms: number;
    detail: string;
  }>;
}
