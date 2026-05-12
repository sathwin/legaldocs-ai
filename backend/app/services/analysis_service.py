import re
from collections import Counter

from app.models.schemas import Clause, ContractAnalysisResponse, Document, RiskLevel

CLAUSE_TYPES = {
    "termination": ["termination", "terminate", "cure", "convenience"],
    "payment": ["payment", "pay", "invoice", "fees", "interest"],
    "confidentiality": ["confidential", "confidentiality", "disclose", "third parties"],
    "liability": ["liability", "liable", "damages", "cap", "indirect"],
    "governing_law": ["governing law", "venue", "jurisdiction", "arbitration"],
    "renewal": ["renewal", "renews", "renew", "term"],
}

RISK_SIGNALS = {
    RiskLevel.high: [
        "immediately",
        "one month",
        "without prior written approval",
        "applies to confidentiality",
        "deemed accepted",
        "expire after two",
    ],
    RiskLevel.medium: [
        "late payments",
        "suspend services",
        "automatic",
        "binding arbitration",
        "fifteen",
        "sixty",
    ],
}


class AnalysisService:
    def analyze_contract(self, document: Document) -> ContractAnalysisResponse:
        clauses = [self._extract_clause(document.content, clause_type, keywords) for clause_type, keywords in CLAUSE_TYPES.items()]
        risk_counter = Counter(clause.risk for clause in clauses)
        overall = RiskLevel.high if risk_counter[RiskLevel.high] else RiskLevel.medium if risk_counter[RiskLevel.medium] else RiskLevel.low

        return ContractAnalysisResponse(
            document_id=document.id,
            summary=self._summarize(document, clauses),
            overall_risk=overall,
            clauses=clauses,
            recommendations=self._recommendations(clauses),
            sample_output={
                "reviewer_status": "Ready for legal review",
                "playbook": "Enterprise SaaS contracting baseline",
                "confidence": "Demo heuristic confidence: 0.84",
            },
        )

    def _extract_clause(self, content: str, clause_type: str, keywords: list[str]) -> Clause:
        paragraphs = [line.strip() for line in re.split(r"\n\s*\n", content) if line.strip()]
        heading = clause_type.replace("_", " ")
        selected = next(
            (paragraph for paragraph in paragraphs if paragraph.lower().startswith(f"{heading}.") or paragraph.lower().startswith(f"{heading}:")),
            None,
        )
        if selected is None and clause_type == "governing_law":
            selected = next(
                (paragraph for paragraph in paragraphs if paragraph.lower().startswith("governing law.") or paragraph.lower().startswith("governing law:")),
                None,
            )
        if selected is None:
            selected = next(
                (paragraph for paragraph in paragraphs if any(keyword in paragraph.lower() for keyword in keywords)),
                "No explicit clause found. Recommend legal review before signature.",
            )

        risk = self._score_risk(selected)
        return Clause(
            type=clause_type,
            title=clause_type.replace("_", " ").title(),
            text=selected,
            risk=risk,
            rationale=self._rationale(risk),
            recommendation=self._recommendation(clause_type, risk),
        )

    def _score_risk(self, text: str) -> RiskLevel:
        lowered = text.lower()
        if any(signal in lowered for signal in RISK_SIGNALS[RiskLevel.high]):
            return RiskLevel.high
        if any(signal in lowered for signal in RISK_SIGNALS[RiskLevel.medium]):
            return RiskLevel.medium
        if text.startswith("No explicit"):
            return RiskLevel.high
        return RiskLevel.low

    @staticmethod
    def _rationale(risk: RiskLevel) -> str:
        if risk == RiskLevel.high:
            return "Contains aggressive terms, missing carve-outs, or rights that may create material business exposure."
        if risk == RiskLevel.medium:
            return "Commercially common but should be reviewed for negotiation leverage and operational impact."
        return "Balanced language with clear obligations and standard limits."

    @staticmethod
    def _recommendation(clause_type: str, risk: RiskLevel) -> str:
        if risk == RiskLevel.low:
            return "Acceptable for demo playbook."
        return {
            "termination": "Negotiate mutual cure periods and avoid immediate termination rights.",
            "payment": "Clarify dispute windows, suspension rights, and late fee thresholds.",
            "confidentiality": "Tighten subcontractor disclosure and survival language.",
            "liability": "Add carve-outs for confidentiality, data security, indemnity, and gross negligence.",
            "governing_law": "Confirm forum, arbitration, and enforcement posture.",
            "renewal": "Add renewal reminders and longer non-renewal notice windows.",
        }.get(clause_type, "Route to legal reviewer.")

    @staticmethod
    def _summarize(document: Document, clauses: list[Clause]) -> str:
        high_count = sum(1 for clause in clauses if clause.risk == RiskLevel.high)
        medium_count = sum(1 for clause in clauses if clause.risk == RiskLevel.medium)
        return (
            f"{document.name} appears to be a commercial agreement covering payment, confidentiality, "
            f"termination, liability, governing law, and renewal mechanics. The analysis found "
            f"{high_count} high-risk and {medium_count} medium-risk clauses requiring reviewer attention."
        )

    @staticmethod
    def _recommendations(clauses: list[Clause]) -> list[str]:
        recommendations = [clause.recommendation for clause in clauses if clause.risk != RiskLevel.low]
        return recommendations or ["No urgent changes detected. Confirm commercial fit and jurisdiction before signature."]


analysis_service = AnalysisService()
