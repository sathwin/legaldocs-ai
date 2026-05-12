import type { Analysis, ChatResponse, CompareResponse, DashboardStats, DocumentSummary, PipelineStatus } from "../types/api";

export const fallbackDocuments: DocumentSummary[] = [
  {
    id: "sample-msa",
    name: "Acme Master Services Agreement.txt",
    created_at: "2026-05-01T10:00:00Z",
    tags: ["sample", "msa", "technology"],
    job_id: "job-sample-msa",
    status: "Ready",
  },
  {
    id: "sample-vendor",
    name: "Atlas Vendor Agreement.txt",
    created_at: "2026-05-03T14:30:00Z",
    tags: ["sample", "vendor", "procurement"],
    job_id: "job-sample-vendor",
    status: "Ready",
  },
];

export const fallbackStats: DashboardStats = {
  total_documents: 2,
  analyzed_documents: 2,
  high_risk_clauses: 3,
  medium_risk_clauses: 6,
  average_processing_ms: 1435,
  provider: "mock",
};

export const fallbackAnalysis: Analysis = {
  document_id: "sample-msa",
  summary:
    "Acme Master Services Agreement.txt appears to be a commercial agreement covering payment, confidentiality, termination, liability, governing law, and renewal mechanics. The analysis found 0 high-risk and 3 medium-risk clauses requiring reviewer attention.",
  overall_risk: "medium",
  clauses: [
    {
      type: "termination",
      title: "Termination",
      text: "Either party may terminate for material breach after a thirty day cure period. Customer may terminate for convenience with sixty days notice.",
      risk: "medium",
      rationale: "Commercially common but should be reviewed for negotiation leverage and operational impact.",
      recommendation: "Negotiate mutual cure periods and avoid unilateral immediate termination rights.",
    },
    {
      type: "payment",
      title: "Payment",
      text: "Customer shall pay undisputed invoices within thirty days. Vendor may suspend services after notice for unpaid balances.",
      risk: "medium",
      rationale: "Suspension and late fee language can affect operational continuity.",
      recommendation: "Clarify dispute windows, suspension rights, and late fee thresholds.",
    },
    {
      type: "confidentiality",
      title: "Confidentiality",
      text: "Each party protects confidential information using reasonable care and limits disclosure to approved advisors.",
      risk: "low",
      rationale: "Balanced language with clear obligations and standard limits.",
      recommendation: "Acceptable for demo playbook.",
    },
  ],
  recommendations: [
    "Negotiate mutual cure periods and avoid unilateral immediate termination rights.",
    "Clarify dispute windows, suspension rights, and late fee thresholds.",
  ],
  sample_output: {
    reviewer_status: "Ready for legal review",
    playbook: "Enterprise SaaS contracting baseline",
    confidence: "Demo fallback confidence: 0.82",
  },
};

export const fallbackPipeline: PipelineStatus = {
  job_id: "job-sample-msa",
  status: "Completed",
  stages: ["Uploaded", "OCR Extracted", "Chunked", "Embedded", "Retrieved", "Summarized", "Completed"].map((name, index) => ({
    name,
    status: "complete",
    duration_ms: 220 + index * 115,
    detail: "Demo fallback stage completed without external worker dependencies.",
  })),
};

export const fallbackChat: ChatResponse = {
  answer:
    "Based on the retrieved contract sections, the highest review priorities are payment suspension language and termination for convenience notice periods. This answer is served from frontend demo fallback mode.",
  citations: ["Acme Master Services Agreement.txt :: fallback chunk 1"],
  retrieval_context: ["Payment and termination clauses from the sample agreement."],
  model_provider: "mock-fallback",
  prompt_preview: "Fallback prompt constructed from local sample data.",
};

export const fallbackComparison: CompareResponse = {
  document_a_id: "sample-msa",
  document_b_id: "sample-vendor",
  executive_summary:
    "Atlas Vendor Agreement is more vendor-favorable than the Acme MSA in confidentiality, liability, and termination mechanics.",
  differences: [
    {
      area: "Liability",
      document_a: "medium: Liability cap has standard carve-outs.",
      document_b: "high: Liability cap applies to confidentiality and data incidents.",
      risk_delta: "Higher risk in Document B",
    },
    {
      area: "Confidentiality",
      document_a: "low: Disclosure limited to approved advisors.",
      document_b: "high: Offshore subcontractor disclosure allowed without prior approval.",
      risk_delta: "Higher risk in Document B",
    },
  ],
};
