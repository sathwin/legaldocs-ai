from app.models.schemas import CompareResponse, ComparisonItem, Document
from app.services.analysis_service import analysis_service


class ComparisonService:
    def compare_contracts(self, document_a: Document, document_b: Document) -> CompareResponse:
        analysis_a = analysis_service.analyze_contract(document_a)
        analysis_b = analysis_service.analyze_contract(document_b)
        by_type_a = {clause.type: clause for clause in analysis_a.clauses}
        by_type_b = {clause.type: clause for clause in analysis_b.clauses}

        differences = []
        for clause_type in by_type_a:
            clause_a = by_type_a[clause_type]
            clause_b = by_type_b[clause_type]
            differences.append(
                ComparisonItem(
                    area=clause_a.title,
                    document_a=f"{clause_a.risk.value}: {clause_a.text[:220]}",
                    document_b=f"{clause_b.risk.value}: {clause_b.text[:220]}",
                    risk_delta=self._risk_delta(clause_a.risk.value, clause_b.risk.value),
                )
            )

        return CompareResponse(
            document_a_id=document_a.id,
            document_b_id=document_b.id,
            executive_summary=(
                f"{document_b.name} is more vendor-favorable than {document_a.name} in liability, "
                "confidentiality, payment, and termination mechanics. Prioritize those sections in negotiation."
            ),
            differences=differences,
        )

    @staticmethod
    def _risk_delta(a: str, b: str) -> str:
        order = {"low": 0, "medium": 1, "high": 2}
        delta = order[b] - order[a]
        if delta > 0:
            return "Higher risk in Document B"
        if delta < 0:
            return "Lower risk in Document B"
        return "Comparable risk"


comparison_service = ComparisonService()
