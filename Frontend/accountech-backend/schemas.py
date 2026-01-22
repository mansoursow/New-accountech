from pydantic import BaseModel
from typing import Optional

class TransactionBase(BaseModel):
    ref: str
    type: str
    motif: str
    montant: float
    date: str
    mode: str
    has_doc: bool = False
    facture_id: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int

    class Config:
        from_attributes = True