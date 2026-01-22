from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    ref = Column(String, unique=True, index=True)
    type = Column(String) # Entrée ou Sortie
    motif = Column(String)
    montant = Column(Float)
    date = Column(String)
    mode = Column(String)
    has_doc = Column(Boolean, default=False)
    facture_id = Column(String, nullable=True) # Lien avec ventes/achats