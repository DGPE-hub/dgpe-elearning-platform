import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const db = getFirestore();

/* ================================
   MODULES OFFICIELS DGPE – 2026
================================ */
const MODULES_DGPE = [
  { titre: "Gouvernance stratégique et analyse financière", domaine: "Gouvernance", duree: "4 j" },
  { titre: "Pilotage stratégique", domaine: "Gouvernance", duree: "4 j" },
  { titre: "Audit & conformité", domaine: "Gouvernance", duree: "3 j" },
  { titre: "Performance & KPI", domaine: "Performance", duree: "2 j" },
  { titre: "Transformation digitale", domaine: "Digital", duree: "3 j" },
  { titre: "IA & Décision", domaine: "Digital", duree: "2 j" },
  { titre: "Leadership", domaine: "Management", duree: "2 j" },
  { titre: "Communication de crise", domaine: "Management", duree: "2 j" },
  { titre: "RSE : Concevoir et piloter une stratégie durable", domaine: "Gouvernance", duree: "3 j" },
  { titre: "Manager le changement durable", domaine: "Management", duree: "2 j" }
];

/* ================================
   EXECUTION
================================ */
async function resetModulesDGPE() {
  const log = document.getElementById("log");

  log.innerHTML += "Connexion à Firestore…<br>";

  /* 🔥 1. SUPPRESSION */
  const snap = await getDocs(collection(db, "modules"));
  for (const d of snap.docs) {
    await deleteDoc(doc(db, "modules", d.id));
  }
  log.innerHTML += `✔ Modules supprimés : ${snap.size}<br>`;

  /* ✅ 2. RÉIMPORT */
  for (const m of MODULES_DGPE) {
    await addDoc(collection(db, "modules"), {
      titre: m.titre,
      domaine: m.domaine,
      duree: m.duree,
      actif: true,
      createdAt: new Date()
    });
    log.innerHTML += `✔ ${m.titre} → ${m.duree}<br>`;
  }

  log.innerHTML += "<br><b>=== IMPORT TERMINÉ AVEC SUCCÈS ===</b>";
}

resetModulesDGPE();
