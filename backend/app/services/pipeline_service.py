from app.models.schemas import PipelineStage, PipelineStatus


class PipelineService:
    def get_status(self, job_id: str) -> PipelineStatus:
        stages = []
        for index, stage in enumerate(PipelineStage):
            stages.append(
                {
                    "name": stage.value,
                    "status": "complete",
                    "duration_ms": 220 + index * 115,
                    "detail": self._stage_detail(stage),
                }
            )
        return PipelineStatus(job_id=job_id, stages=stages, status="Completed")

    @staticmethod
    def _stage_detail(stage: PipelineStage) -> str:
        return {
            PipelineStage.uploaded: "Document accepted, tenant metadata attached, and encrypted storage event created.",
            PipelineStage.ocr_extracted: "Text extraction completed. PDF OCR is scaffolded for worker integration.",
            PipelineStage.chunked: "Contract sections split into retrieval chunks with clause-aware boundaries.",
            PipelineStage.embedded: "Chunks embedded into local demo vector index placeholder.",
            PipelineStage.retrieved: "Relevant clauses retrieved and ranked for analysis and chat.",
            PipelineStage.summarized: "Summary, clauses, risk rationale, and recommendations generated.",
            PipelineStage.completed: "Analysis ready for reviewer workflow and audit trail export.",
        }[stage]


pipeline_service = PipelineService()
