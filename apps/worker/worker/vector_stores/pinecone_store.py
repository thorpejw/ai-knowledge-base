"""
pinecone_store.py
Purpose: Handle Pinecone upserts for chunk embeddings.
Assumes index is already created manually in Pinecone dashboard.
"""

import os
from typing import List
from pinecone import Pinecone

# ENV config
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX = os.environ.get("PINECONE_INDEX", "ai-knowledge-base")

if not PINECONE_API_KEY:
    raise RuntimeError("PINECONE_API_KEY must be set in environment")

pc = Pinecone(PINECONE_API_KEY)

def upsert_vectors(
    user_id: str,
    document_id: str,
    document_name: str,
    chunks: List[str],
    vectors: List[List[float]],
    index_name: str = PINECONE_INDEX,
) -> None:
    """
    Upsert vectors into Pinecone with metadata.
    Id format: {document_id}:{i}
    Namespace: user_id
    Metadata: {documentId, chunkIndex}
    """
    index = pc.Index(PINECONE_INDEX)

    items = [
        {
            "id": f"{document_id}:{i}",
            "values": vectors[i],
            "metadata": {"documentId": document_id, "documentName": document_name, "chunkIndex": i},
        }
        for i in range(len(vectors))
    ]

    # Batch upsert
    index.upsert(items,user_id)

    print(f"Upserted {len(items)} vectors for document {document_id} in namespace {user_id}")
