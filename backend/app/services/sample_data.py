from app.models.schemas import Document


SAMPLE_CONTRACTS = [
    Document(
        id="sample-msa",
        name="Acme Master Services Agreement.txt",
        created_at="2026-05-01T10:00:00Z",
        tags=["sample", "msa", "technology"],
        job_id="job-sample-msa",
        content="""
MASTER SERVICES AGREEMENT

This agreement is entered into by Acme Cloud Systems and Northstar Retail Group.

Payment. Customer shall pay all undisputed invoices within thirty (30) days. Late
payments accrue interest at 1.5% per month. Vendor may suspend services after
ten (10) days written notice for unpaid balances.

Confidentiality. Each party shall protect confidential information using at least
reasonable care and shall not disclose it to third parties except approved advisors.
Obligations survive for five (5) years after termination.

Termination. Either party may terminate for material breach if the breach remains
uncured after thirty (30) days written notice. Customer may terminate for convenience
with sixty (60) days notice and payment of committed fees.

Liability. Except for confidentiality, data security, payment obligations, and
gross negligence, each party's aggregate liability is capped at fees paid in the
twelve (12) months before the claim. No party is liable for indirect damages.

Governing Law. This agreement is governed by the laws of Delaware, with venue in
state or federal courts located in New Castle County.

Renewal. The initial term is one year and automatically renews for successive
one-year periods unless either party gives notice of non-renewal at least forty-five
(45) days before the renewal date.
""".strip(),
    ),
    Document(
        id="sample-vendor",
        name="Atlas Vendor Agreement.txt",
        created_at="2026-05-03T14:30:00Z",
        tags=["sample", "vendor", "procurement"],
        job_id="job-sample-vendor",
        content="""
VENDOR AGREEMENT

Atlas Analytics will provide data labeling and model evaluation services.

Payment. Client will pay invoices within fifteen (15) days. Any disputed amount
must be identified within five (5) days, otherwise the invoice is deemed accepted.

Confidentiality. Vendor may share confidential information with offshore
subcontractors without prior written approval if subcontractors are bound by
substantially similar obligations. Confidentiality obligations expire after two
(2) years.

Termination. Vendor may terminate immediately if Client misses a payment deadline.
Client may terminate for cause after forty-five (45) days cure notice.

Liability. Vendor's total liability is limited to one month of fees and the cap
applies to confidentiality breaches, data incidents, and indemnity claims.

Governing Law. The agreement is governed by California law. Disputes will be
resolved by binding arbitration in San Francisco.

Renewal. The contract renews monthly unless either party provides fifteen (15)
days notice before the next billing cycle.
""".strip(),
    ),
    Document(
        id="sample-dpa",
        name="Northstar Data Processing Addendum.txt",
        created_at="2026-05-06T09:15:00Z",
        tags=["sample", "dpa", "privacy"],
        job_id="job-sample-dpa",
        content="""
DATA PROCESSING ADDENDUM

This addendum governs processor obligations for personal data handled on behalf
of Northstar Retail Group.

Payment. Fees for privacy support are included in the master subscription fees.
Additional audit support requested more than once per year may be billed at the
provider's standard professional services rates.

Confidentiality. Processor shall limit access to personnel with a need to know,
maintain written confidentiality obligations, and ensure confidentiality survives
for the duration required by applicable law.

Termination. Upon termination, Processor will return or delete personal data
within thirty (30) days, except backup copies retained under standard archival
procedures.

Liability. Liability for data protection breaches is capped at two times the fees
paid in the twelve (12) months before the incident, except where prohibited by law.

Governing Law. This addendum follows the governing law and venue selected in the
master services agreement.

Renewal. This addendum renews automatically with the underlying master services
agreement and terminates when data processing activities end.
""".strip(),
    ),
]
