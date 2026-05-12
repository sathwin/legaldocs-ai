import os
import time


def main() -> None:
    redis_url = os.getenv("REDIS_URL", "mock://disabled")
    vector_store_url = os.getenv("VECTOR_STORE_URL", "mock://disabled")
    print(f"LegalDocs worker started redis={redis_url} vector_store={vector_store_url}")
    print("Demo worker is idle. In production it would process OCR, chunking, and embedding jobs.")
    while os.getenv("LEGALDOCS_WORKER_ONCE", "false").lower() != "true":
        time.sleep(60)


if __name__ == "__main__":
    main()
