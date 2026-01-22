import os
import re
import io
import uuid
import platform
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes

import models
from database import SessionLocal, engine

# --- CONFIGURATION SYSTÈME & OCR ---
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    POPPLER_PATH = r'C:\Users\LENOVO\Desktop\New accountechAI\poppler-25.12.0\Library\bin' 
else:
    POPPLER_PATH = None

# Création des tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CONFIGURATION CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GESTION DES FICHIERS ---
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- RÉCUPÉRATION DE LA SESSION DB ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- FONCTION DE RÉSUMÉ INTELLIGENT ---

def extraire_motif_intelligent(text):
    """Analyse le texte pour extraire les prestations et le client plutôt que l'en-tête."""
    lines = [l.strip() for l in text.split('\n') if len(l.strip()) > 2]
    
    # 1. Tenter d'identifier le client (souvent après le n° de facture ou en haut à droite)
    client = ""
    for i, line in enumerate(lines[:10]):
        if any(keyword in line.upper() for keyword in ["DOUMBIA", "KHALIFA", "CLIENT"]):
            client = line
            break

    # 2. Chercher la zone des prestations (après "Description" ou "Désignation")
    prestations = []
    zone_tableau = False
    mots_cles_debut = ["DESCRIPTION", "DESIGNATION", "QUANTITE", "ARTICLE"]
    
    for line in lines:
        # Si on détecte l'en-tête du tableau
        if any(kw in line.upper() for kw in mots_cles_debut):
            zone_tableau = True
            continue
        
        # Si on est dans le tableau et que la ligne n'est pas un prix
        if zone_tableau:
            # On s'arrête si on atteint le total
            if "TOTAL" in line.upper() or "FCFA" in line.upper() or len(prestations) >= 3:
                break
            # On ignore les lignes trop courtes ou purement numériques
            if len(line) > 5 and not re.match(r'^[\d\s\W]+$', line):
                prestations.append(line)

    # Construction du motif final
    res_items = " - ".join(prestations) if prestations else "Prestation diverse"
    motif_final = f"{client} ({res_items})" if client else res_items
    
    return motif_final[:100] # Limite pour l'affichage

# --- ROUTES D'ANALYSE ---

@app.post("/transactions/analyze")
async def analyze_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        extension = os.path.splitext(file.filename)[1].lower()
        image = None

        # 1. Conversion PDF vers Image
        if extension == ".pdf":
            pages = convert_from_bytes(contents, first_page=1, last_page=1, poppler_path=POPPLER_PATH)
            if pages:
                image = pages[0]
        else:
            image = Image.open(io.BytesIO(contents))

        if not image:
            return {"montant": 0, "motif": "Format non supporté"}

        # 2. OCR : Lecture intégrale
        text = pytesseract.image_to_string(image, lang='fra+eng')
        
        # 3. Extraction du montant (Regex multi-formats)
        montant_final = 0
        patterns = [
            r"TOTAL.*?([\d\s,.]+)\s?(?:FCFA|CFA|XOF)",
            r"Net à payer.*?([\d\s,.]+)",
            r"Montant.*?([\d\s,.]+)",
            r"([\d\s,.]+)\s?FCFA"
        ]
        
        for p in patterns:
            match = re.search(p, text, re.IGNORECASE | re.DOTALL)
            if match:
                raw_val = match.group(1).replace(" ", "").replace(",", "").replace(".", "")
                if raw_val.isdigit():
                    montant_final = int(raw_val)
                    break

        # 4. Extraction intelligente du motif
        motif_ia = extraire_motif_intelligent(text)

        return {
            "montant": montant_final, 
            "motif": f"IA: {motif_ia}"
        }

    except Exception as e:
        print(f"Erreur d'analyse OCR : {str(e)}")
        return {"montant": 0, "motif": "Échec de l'analyse automatique"}

# --- ROUTES CRUD TRANSACTIONS ---

@app.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(models.Transaction).order_by(models.Transaction.id.desc()).all()

@app.post("/transactions")
async def create_transaction(
    type: str = Form(...),
    motif: str = Form(...),
    montant: float = Form(...),
    date: str = Form(...),
    mode: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    if "Décaissement" in type:
        transactions = db.query(models.Transaction).all()
        solde_actuel = sum(t.montant if "Encaissement" in t.type else -t.montant for t in transactions)
        if solde_actuel < montant:
            raise HTTPException(status_code=400, detail="Solde insuffisant en caisse !")

    filename = None
    if file:
        ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as buffer:
            buffer.write(await file.read())

    new_trans = models.Transaction(
        ref=f"TR-{uuid.uuid4().hex[:6].upper()}",
        type=type,
        motif=motif,
        montant=montant,
        date=date,
        mode=mode,
        has_doc=True if filename else False,
        facture_id=filename
    )
    db.add(new_trans)
    db.commit()
    db.refresh(new_trans)
    return new_trans

@app.delete("/transactions/{t_id}")
def delete_transaction(t_id: int, db: Session = Depends(get_db)):
    trans = db.query(models.Transaction).filter(models.Transaction.id == t_id).first()
    if trans:
        if trans.facture_id:
            try:
                os.remove(os.path.join(UPLOAD_DIR, trans.facture_id))
            except:
                pass
        db.delete(trans)
        db.commit()
    return {"status": "ok"}