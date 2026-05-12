.PHONY: install lint test backend frontend compose-up compose-down

install:
	cd frontend && npm install
	cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

lint:
	cd backend && . .venv/bin/activate && python -m compileall app tests
	cd frontend && npm run lint

test:
	cd backend && . .venv/bin/activate && PYTHONPATH=. pytest
	cd frontend && npm run build

backend:
	cd backend && . .venv/bin/activate && PYTHONPATH=. uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

compose-up:
	docker compose up --build

compose-down:
	docker compose down
