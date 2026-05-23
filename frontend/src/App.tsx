import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api/client";
import type { Analysis, ChatResponse, CompareResponse, DashboardStats, DocumentSummary, PipelineStatus, RiskLevel } from "./types/api";

// Custom icon components
const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="8" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="14" width="4" height="6" rx="1" fill="currentColor"/>
    <rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor"/>
    <rect x="16" y="11" width="4" height="9" rx="1" fill="currentColor"/>
  </svg>
);

const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v12m0-12l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </svg>
);

const CompareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 16l-4-4 4-4M17 8l4 4-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="14" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ScaleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M12 3L6 8h12l-6-5z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="6" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-green-100 text-green-800 border border-green-300",
  medium: "bg-yellow-100 text-yellow-900 border border-yellow-300",
  high: "bg-red-100 text-red-800 border border-red-300",
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
    <main className="min-h-screen bg-cream-100 bg-noise">
      {/* Navigation */}
      <nav className="border-b border-brown-900/10 bg-cream-50/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brown-900 shadow-soft">
              <div className="text-yellow-brand"><ScaleIcon /></div>
            </div>
            <div>
              <h1 className="text-xl font-black text-brown-900">LegalDocs</h1>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-brown-700">AI Platform</p>
            </div>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <a href="#dashboard" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brown-900 transition hover:bg-cream-200">Dashboard</a>
            <a href="#analysis" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brown-900 transition hover:bg-cream-200">Analysis</a>
            <a href="#compare" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brown-900 transition hover:bg-cream-200">Compare</a>
            <a href={`${apiBaseUrl}/docs`} className="ml-2 rounded-lg border-2 border-brown-900 bg-brown-900 px-4 py-2.5 text-sm font-bold text-yellow-brand transition hover:shadow-glow">
              API Docs
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-brown-900/10 pattern-dots">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border-2 border-brown-900/20 bg-yellow-brand px-5 py-2.5 shadow-soft">
              <div className="text-brown-900" style={{ width: '18px', height: '18px' }}><LightningIcon /></div>
              <p className="font-mono text-sm font-bold text-brown-900">Automated Contract Analysis</p>
            </div>
            <h2 className="mb-7 text-6xl font-black leading-[1.05] tracking-tight text-brown-900 md:text-7xl">
              Review legal contracts{" "}
              <span className="inline-block rounded-xl bg-brown-900 px-6 py-3 text-white shadow-brutal transition hover:shadow-glow">10x faster</span>{" "}
              with AI
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-brown-700">
              Automated document analysis powered by large language models. Extract key clauses, identify risks, and compare contracts in seconds—not hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#dashboard" className="inline-flex items-center gap-2.5 rounded-xl bg-brown-900 px-8 py-4 text-lg font-bold text-yellow-brand shadow-soft transition hover:shadow-glow">
                View Live Demo <ArrowRight size={20} />
              </a>
              <a href="#dashboard" className="inline-flex items-center gap-2.5 rounded-xl border-2 border-brown-900 bg-cream-50 px-8 py-4 text-lg font-bold text-brown-900 transition hover:bg-brown-900 hover:text-yellow-brand">
                Get Started
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-4">
            <StatsCard icon={<DocumentIcon />} label="Documents" value={stats?.total_documents ?? documents.length} />
            <StatsCard icon={<ChartIcon />} label="Analyzed" value={stats?.analyzed_documents ?? documents.length} />
            <StatsCard icon={<LightningIcon />} label="Processing" value={`${stats?.average_processing_ms ?? 1435}ms`} />
            <StatsCard icon={<CheckIcon />} label="Accuracy" value="98%" />
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section id="dashboard" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Upload Panel */}
            <div className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-brown-900 p-2">
                  <div className="text-yellow-brand" style={{ width: '20px', height: '20px' }}><UploadIcon /></div>
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-brown-900">Upload</h3>
              </div>
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
                className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
                  isDragging ? "border-yellow-brand bg-yellow-brand/10" : "border-brown-900/30 bg-white hover:border-yellow-brand"
                }`}
              >
                <div className="mx-auto mb-2 text-brown-700" style={{ width: '32px', height: '32px' }}><UploadIcon /></div>
                <p className="mb-1 font-semibold text-brown-900">Drop contract file</p>
                <p className="mb-3 text-sm text-brown-700">or click to browse</p>
                <input type="file" accept=".txt" className="hidden" onChange={(event) => void handleUpload(event.target.files?.[0])} />
              </label>

              {/* Document List */}
              <div className="mt-4 space-y-2">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedId(doc.id)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition ${
                      selectedId === doc.id
                        ? "border-yellow-brand bg-yellow-brand/10"
                        : "border-brown-900/20 bg-white hover:border-brown-900/40"
                    }`}
                  >
                    <p className="mb-1 font-semibold text-brown-900">{doc.name}</p>
                    <p className="font-mono text-xs text-brown-700">{doc.status}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline */}
            <div className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-brown-900 p-2">
                  <div className="text-yellow-brand" style={{ width: '20px', height: '20px' }}><CheckIcon /></div>
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-brown-900">Pipeline</h3>
              </div>
              <div className="space-y-3">
                {(pipeline?.stages ?? []).map((stage) => (
                  <div key={stage.name} className="flex gap-3">
                    <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-risk-low text-white">
                      <div style={{ width: '14px', height: '14px' }}><CheckIcon /></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-brown-900">{stage.name}</p>
                      <p className="font-mono text-xs text-brown-700">{stage.duration_ms}ms</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Analysis Section */}
            <section id="analysis" className="grid gap-8 xl:grid-cols-[1fr_380px]">
              {/* Contract Analysis */}
              <div className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-lg bg-brown-900 p-2">
                    <div className="text-yellow-brand"><SearchIcon /></div>
                  </div>
                  <h3 className="text-xl font-bold text-brown-900">Contract Analysis</h3>
                </div>

                {analysis && (
                  <>
                    <div className="mb-6">
                      <p className="mb-2 font-mono text-sm text-brown-700">{selectedDoc?.name}</p>
                      <p className="mb-4 text-lg leading-relaxed text-brown-900">{analysis.summary}</p>
                      <div className="inline-block">
                        <RiskBadge risk={analysis.overall_risk} label={`Overall Risk: ${analysis.overall_risk}`} />
                      </div>
                    </div>

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                      <RiskCard risk="high" count={riskCounts.high} />
                      <RiskCard risk="medium" count={riskCounts.medium} />
                      <RiskCard risk="low" count={riskCounts.low} />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {(analysis.recommendations ?? []).slice(0, 4).map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-brown-900/20 bg-white p-4 text-sm leading-relaxed text-brown-800">
                          <span className="mr-2 text-yellow-brand">▸</span>{item}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Chat Panel */}
              <div className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-brown-900 p-2">
                    <div className="text-yellow-brand" style={{ width: '20px', height: '20px' }}><MessageIcon /></div>
                  </div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-brown-900">Query Contract</h3>
                </div>

                <div className="mb-4 rounded-lg bg-brown-900/5 p-3">
                  <p className="font-mono text-xs text-brown-700">Semantic Search Engine</p>
                </div>

                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask about this contract..."
                  className="mb-4 h-32 w-full resize-none rounded-xl border-2 border-brown-900/20 bg-white p-4 text-sm text-brown-900 outline-none transition focus:border-yellow-brand"
                />

                <button
                  onClick={() => void askQuestion()}
                  className="mb-4 w-full rounded-xl bg-brown-900 px-6 py-3 font-bold text-yellow-brand transition hover:shadow-glow"
                >
                  Search Contract
                </button>

                {chat && (
                  <div className="rounded-lg border border-brown-900/20 bg-white p-4">
                    <p className="mb-3 text-sm leading-relaxed text-brown-900">{chat.answer}</p>
                    <div className="border-t border-brown-900/10 pt-3">
                      <p className="font-mono text-xs font-semibold text-brown-700">Citations</p>
                      <p className="mt-1 font-mono text-xs text-brown-600">{chat.citations.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Clause Risk Table */}
            <div className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-brown-900 p-2">
                  <div className="text-yellow-brand"><WarningIcon /></div>
                </div>
                <h3 className="text-xl font-bold text-brown-900">Clause Analysis</h3>
              </div>

              <div className="overflow-hidden rounded-xl border-2 border-brown-900/20">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brown-900">
                    <tr>
                      <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wide text-yellow-brand">Clause</th>
                      <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wide text-yellow-brand">Risk</th>
                      <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wide text-yellow-brand">Finding</th>
                      <th className="px-6 py-4 font-mono text-xs font-bold uppercase tracking-wide text-yellow-brand">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brown-900/10 bg-white">
                    {(analysis?.clauses ?? []).map((clause) => (
                      <tr key={clause.type} className="align-top hover:bg-cream-50">
                        <td className="px-6 py-4 font-semibold text-brown-900">{clause.title}</td>
                        <td className="px-6 py-4">
                          <RiskBadge risk={clause.risk} label={clause.risk} />
                        </td>
                        <td className="px-6 py-4 text-brown-800">{clause.text}</td>
                        <td className="px-6 py-4 text-brown-700">{clause.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contract Comparison */}
            <div id="compare" className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-brown-900 p-2">
                  <div className="text-yellow-brand"><CompareIcon /></div>
                </div>
                <h3 className="text-xl font-bold text-brown-900">Contract Comparison</h3>
              </div>

              <div className="mb-6 flex flex-wrap gap-4">
                <select
                  value={compareId}
                  onChange={(event) => setCompareId(event.target.value)}
                  className="rounded-xl border-2 border-brown-900/20 bg-white px-4 py-3 font-semibold text-brown-900 outline-none transition focus:border-yellow-brand"
                >
                  {documents.filter((doc) => doc.id !== selectedId).map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => void compare()}
                  className="rounded-xl bg-brown-900 px-6 py-3 font-bold text-yellow-brand transition hover:shadow-glow"
                >
                  Compare Contracts
                </button>
              </div>

              {comparison && (
                <div className="space-y-6">
                  <div className="rounded-xl border-2 border-yellow-brand/50 bg-yellow-brand/10 p-6">
                    <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-brown-900">Executive Summary</p>
                    <p className="text-brown-900">{comparison.executive_summary}</p>
                  </div>

                  {comparison.differences.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-brown-900/20 bg-white p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-bold text-brown-900">{item.area}</h4>
                        <span className="rounded-full bg-yellow-brand px-3 py-1 font-mono text-xs font-bold text-brown-900">
                          {item.risk_delta}
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <CompareBox label="Document A" text={item.document_a} />
                        <CompareBox label="Document B" text={item.document_b} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {loading && (
              <div className="flex items-center gap-3 rounded-xl border-2 border-yellow-brand/50 bg-yellow-brand/10 px-6 py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brown-900 border-t-transparent" />
                <p className="font-semibold text-brown-900">Analyzing contract...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatsCard({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-2 border-brown-900/20 bg-cream-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-brown-900">
        <div className="text-yellow-brand">{icon}</div>
      </div>
      <p className="mb-1 text-3xl font-black text-brown-900">{value}</p>
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brown-700">{label}</p>
    </div>
  );
}

function RiskCard({ risk, count }: { risk: RiskLevel; count: number }) {
  const colors = {
    low: "bg-risk-low/20 border-risk-low text-risk-low",
    medium: "bg-risk-medium/20 border-risk-medium text-risk-medium",
    high: "bg-risk-high/20 border-risk-high text-risk-high"
  };
  return (
    <div className={`rounded-xl border-2 p-6 text-center ${colors[risk]}`}>
      <p className="mb-2 text-4xl font-black">{count}</p>
      <p className="font-mono text-sm font-bold uppercase tracking-wide">{risk} Risk</p>
    </div>
  );
}

function RiskBadge({ risk, label }: { risk: RiskLevel; label: string }) {
  return (
    <span className={`inline-block rounded-lg px-3 py-1 text-xs font-bold uppercase ${riskStyles[risk]}`}>
      {label}
    </span>
  );
}

function CompareBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-brown-900/20 bg-cream-50 p-4">
      <p className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-brown-700">{label}</p>
      <p className="text-sm text-brown-900">{text}</p>
    </div>
  );
}

export default App;
