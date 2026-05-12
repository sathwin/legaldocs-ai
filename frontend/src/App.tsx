import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Cloud,
  FileSearch,
  GitCompareArrows,
  Layers3,
  MessageSquare,
  Scale,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client";
import type { Analysis, ChatResponse, CompareResponse, DashboardStats, DocumentSummary, PipelineStatus, RiskLevel } from "./types/api";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-red-50 text-red-700 ring-red-200",
};

function App() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedId, setSelectedId] = useState("sample-msa");
  const [compareId, setCompareId] = useState("sample-vendor");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [pipeline, setPipeline] = useState<PipelineStatus | null>(null);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [question, setQuestion] = useState("Which clauses should legal review first?");
  const [chat, setChat] = useState<ChatResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedDoc = useMemo(() => documents.find((doc) => doc.id === selectedId), [documents, selectedId]);
  const riskCounts = useMemo(() => {
    const counts: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0 };
    analysis?.clauses.forEach((clause) => {
      counts[clause.risk] += 1;
    });
    return counts;
  }, [analysis]);

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (selectedId && documents.length) {
      void runAnalysis(selectedId);
    }
  }, [selectedId, documents]);

  async function refresh() {
    const [docs, dashboard] = await Promise.all([api.listDocuments(), api.dashboardStats()]);
    setDocuments(docs);
    setStats(dashboard);
    if (!selectedId && docs[0]) setSelectedId(docs[0].id);
  }

  async function runAnalysis(documentId: string) {
    setLoading(true);
    try {
      const result = await api.analyzeContract(documentId);
      setAnalysis(result);
      const doc = documents.find((item) => item.id === documentId);
      if (doc) setPipeline(await api.pipeline(doc.job_id));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    const uploaded = await api.uploadDocument(file);
    await refresh();
    setSelectedId(uploaded.id);
  }

  async function askQuestion() {
    if (!question.trim()) return;
    setChat(await api.queryChat(selectedId, question));
  }

  async function compare() {
    setComparison(await api.compareContracts(selectedId, compareId));
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-ink">
      <nav className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-brand text-white">
              <FileSearch size={22} />
            </div>
            <div>
              <p className="text-lg font-semibold">LegalDocs AI</p>
              <p className="text-xs text-stone-500">Demo-ready contract intelligence platform</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-stone-600 md:flex">
            <a href="#dashboard" className="rounded px-3 py-2 hover:bg-stone-100">Dashboard</a>
            <a href="#analysis" className="rounded px-3 py-2 hover:bg-stone-100">Analysis</a>
            <a href="#compare" className="rounded px-3 py-2 hover:bg-stone-100">Compare</a>
          </div>
        </div>
      </nav>

      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium text-stone-700">
              <Badge icon={<ShieldCheck size={14} />} label="Mock RBAC" />
              <Badge icon={<Cloud size={14} />} label="Cloud-ready AWS templates" />
              <Badge icon={<Layers3 size={14} />} label="RAG architecture" />
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-normal">
              Contract review workflows with LLM-style analysis, retrieval, and operational scaffolding.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              A recruiter-facing prototype that demonstrates React, FastAPI, mock LLM providers, document ingestion,
              clause extraction, comparison, Kubernetes, CI/CD, observability, and AWS-style infrastructure.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#dashboard" className="inline-flex items-center gap-2 rounded bg-ink px-5 py-3 text-sm font-semibold text-white">
                Open demo workflow <ArrowRight size={16} />
              </a>
              <a href={`${apiBaseUrl}/docs`} className="inline-flex items-center gap-2 rounded border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700">
                FastAPI docs
              </a>
            </div>
          </div>
          <div className="rounded border border-stone-200 bg-stone-50 p-5 shadow-panel">
            <div className="grid gap-3 sm:grid-cols-2">
              <HeroMetric label="Documents" value={stats?.total_documents ?? documents.length} />
              <HeroMetric label="Avg processing" value={`${stats?.average_processing_ms ?? 1435}ms`} />
              <HeroMetric label="Provider" value={stats?.provider ?? "mock"} />
              <HeroMetric label="Pipeline" value="7 stages" />
            </div>
            <div className="mt-5 rounded border border-stone-200 bg-white p-4">
              <p className="text-sm font-semibold">Sample output</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {analysis?.sample_output.reviewer_status ?? "Ready for legal review"} · Enterprise SaaS playbook · cited RAG context
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[330px_1fr]">
        <aside className="space-y-5">
          <Panel title="Upload and Samples" icon={<UploadCloud size={18} />}>
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                void handleUpload(event.dataTransfer.files[0]);
              }}
              className={`block rounded border border-dashed p-5 text-sm transition ${isDragging ? "border-brand bg-teal-50" : "border-stone-300 bg-white hover:border-brand"}`}
            >
              <span className="flex items-center gap-2 font-semibold"><UploadCloud size={17} /> Drop a .txt contract</span>
              <span className="mt-2 block text-xs leading-5 text-stone-500">Drag and drop or select a file. PDF OCR is intentionally scaffolded for workers.</span>
              <input type="file" accept=".txt" className="mt-4 block w-full text-xs" onChange={(event) => void handleUpload(event.target.files?.[0])} />
            </label>
            <div className="mt-4 space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full rounded border px-3 py-3 text-left text-sm transition ${selectedId === doc.id ? "border-brand bg-teal-50" : "border-stone-200 bg-white hover:bg-stone-50"}`}
                >
                  <span className="block font-medium">{doc.name}</span>
                  <span className="mt-1 block text-xs text-stone-500">{doc.tags.join(" / ")} · {doc.status}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Pipeline Timeline" icon={<CheckCircle2 size={18} />}>
            <div className="space-y-3">
              {(pipeline?.stages ?? []).map((stage) => (
                <div key={stage.name} className="flex gap-3">
                  <div className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stage.name}</p>
                    <p className="text-xs leading-5 text-stone-500">{stage.duration_ms}ms · {stage.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>

        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard icon={<FileSearch size={18} />} label="Documents" value={stats?.total_documents ?? documents.length} />
            <StatCard icon={<BarChart3 size={18} />} label="Analyzed" value={stats?.analyzed_documents ?? documents.length} />
            <StatCard icon={<AlertTriangle size={18} />} label="High risk" value={riskCounts.high || stats?.high_risk_clauses || 0} />
            <StatCard icon={<Scale size={18} />} label="Medium risk" value={riskCounts.medium || stats?.medium_risk_clauses || 0} />
          </div>

          <section id="analysis" className="grid gap-5 xl:grid-cols-[1fr_380px]">
            <Panel title="Contract Analysis" icon={<Bot size={18} />}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-stone-500">{selectedDoc?.name}</p>
                  <p className="mt-3 max-w-3xl text-lg leading-8 text-stone-800">{analysis?.summary ?? "Select a contract to begin analysis."}</p>
                </div>
                {analysis && <RiskBadge risk={analysis.overall_risk} label={`Overall ${analysis.overall_risk}`} />}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <RiskSummary risk="high" count={riskCounts.high} />
                <RiskSummary risk="medium" count={riskCounts.medium} />
                <RiskSummary risk="low" count={riskCounts.low} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {(analysis?.recommendations ?? []).slice(0, 4).map((item) => (
                  <div key={item} className="rounded border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">
                    {item}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Ask Your Contract" icon={<MessageSquare size={18} />}>
              <div className="rounded border border-stone-200 bg-stone-50 p-3 text-sm text-stone-600">
                Legal reviewer · Provider: {chat?.model_provider ?? stats?.provider ?? "mock"}
              </div>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="mt-3 h-28 w-full resize-none rounded border border-stone-300 bg-white p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-teal-100"
              />
              <button onClick={() => void askQuestion()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-ink px-4 py-2.5 text-sm font-medium text-white">
                <MessageSquare size={16} /> Query RAG Context
              </button>
              {chat && (
                <div className="mt-4 rounded border border-stone-200 bg-white p-3">
                  <p className="text-sm leading-6 text-stone-700">{chat.answer}</p>
                  <p className="mt-3 text-xs font-medium text-stone-500">Citations: {chat.citations.join(", ")}</p>
                </div>
              )}
            </Panel>
          </section>

          <Panel title="Clause Risk Table" icon={<AlertTriangle size={18} />}>
            <div className="overflow-hidden rounded border border-stone-200">
              <table className="w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Clause</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Finding</th>
                    <th className="px-4 py-3">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {(analysis?.clauses ?? []).map((clause) => (
                    <tr key={clause.type} className="align-top">
                      <td className="w-40 px-4 py-4 font-medium">{clause.title}</td>
                      <td className="w-28 px-4 py-4"><RiskBadge risk={clause.risk} label={clause.risk} /></td>
                      <td className="px-4 py-4 leading-6 text-stone-700">{clause.text}</td>
                      <td className="w-72 px-4 py-4 leading-6 text-stone-600">{clause.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Contract Comparison" icon={<GitCompareArrows size={18} />}>
            <div id="compare" className="flex flex-col gap-3 md:flex-row md:items-center">
              <select value={compareId} onChange={(event) => setCompareId(event.target.value)} className="rounded border border-stone-300 bg-white px-3 py-2 text-sm">
                {documents.filter((doc) => doc.id !== selectedId).map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
              <button onClick={() => void compare()} className="inline-flex items-center justify-center gap-2 rounded bg-brand px-4 py-2 text-sm font-medium text-white">
                <GitCompareArrows size={16} /> Compare
              </button>
            </div>
            {comparison && (
              <div className="mt-4">
                <p className="rounded border border-stone-200 bg-stone-50 p-3 text-sm leading-6 text-stone-700">{comparison.executive_summary}</p>
                <div className="mt-3 space-y-3">
                  {comparison.differences.map((item) => (
                    <div key={item.area} className="rounded border border-stone-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="font-semibold">{item.area}</p>
                        <p className="text-xs font-semibold text-brand">{item.risk_delta}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <ComparisonCell label="Document A" text={item.document_a} />
                        <ComparisonCell label="Document B" text={item.document_b} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
          {loading && <p className="text-sm text-stone-500">Analyzing contract...</p>}
        </section>
      </section>
    </main>
  );
}

function Badge({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2 rounded border border-stone-200 bg-stone-50 px-3 py-2">{icon}{label}</span>;
}

function HeroMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-stone-200 bg-white p-4">
      <p className="text-xs uppercase text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold capitalize">{value}</p>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded border border-stone-200 bg-white p-4 shadow-panel">
      <div className="flex items-center justify-between text-brand">{icon}<span className="text-xs uppercase text-stone-500">{label}</span></div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded border border-stone-200 bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
        <span className="text-brand">{icon}</span>
        <h2 className="text-sm font-semibold uppercase tracking-normal text-stone-700">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function RiskBadge({ risk, label }: { risk: RiskLevel; label: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${riskStyles[risk]}`}>{label}</span>;
}

function RiskSummary({ risk, count }: { risk: RiskLevel; count: number }) {
  return (
    <div className={`rounded border border-stone-200 p-4 ring-1 ${riskStyles[risk]}`}>
      <p className="text-xs font-semibold uppercase">{risk} risk</p>
      <p className="mt-2 text-3xl font-semibold">{count}</p>
    </div>
  );
}

function ComparisonCell({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded border border-stone-200 bg-stone-50 p-3">
      <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
    </div>
  );
}

export default App;
