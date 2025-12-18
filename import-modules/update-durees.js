import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ================= CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ================= UI LOG ================= */
const logBox = document.getElementById("log");
function log(txt) {
  console.log(txt);
  if (logBox) logBox.textContent += "\n" + txt;
}

/* ================= NORMALISATION ================= */
function normalize(txt = "") {
  return String(txt)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= MAPPING OFFICIEL DGPE ================= */
/* ➜ MATCH PAR MOT-CLÉ (robuste) */
const REGLES_DGPE = [
  { key: "gouvernance", duree: "4 j" },
  { key: "pilotage", duree: "4 j" },
  { key: "audit", duree: "3 j" },
  { key: "conformite", duree: "3 j" },
  { key: "performance", duree: "2 j" },
  { key: "kpi", duree: "2 j" },
  { key: "transformation digitale", duree: "3 j" },
  { key: "intelligence artificielle", duree: "2 j" },
  { key: "ia", duree: "2 j" },
  { key: "leadership", duree: "2 j" },
  { key: "communication de crise", duree: "2 j" },
  { key: "rse", duree: "3 j" },
  { key: "developpement durable", duree: "3 j" },
  { key: "changement", duree: "2 j" }
];

function trouverDureeOfficielle(titre) {
  const t = normalize(titre);
  for (const r of REGLES_DGPE) {
    if (t.includes(r.key)) return r.duree;
  }
  return null;
}

/* ================= TRAITEMENT ================= */
async function corrigerDurees() {
  log("Connexion à Firestore…");

  const snap = await getDocs(collection(db, "modules"));
  let total = 0;
  let corriges = 0;

  for (const d of snap.docs) {
    total++;
    const data = d.data();
    const titre =
      data.titre || data.title || data.nom || data.name || "";

    if (!titre) continue;

    const dureeOfficielle = trouverDureeOfficielle(titre);
    if (!dureeOfficielle) continue;

    const ref = doc(db, "modules", d.id);

    await updateDoc(ref, {
      duree: dureeOfficielle,
      nbHeures: null,
      heures: null
    });

    corriges++;
    log(`✔ ${titre} → ${dureeOfficielle}`);
  }

  log("");
  log("====== TERMINÉ ======");
  log(`Modules analysés : ${total}`);
  log(`Modules corrigés : ${corriges}`);
}

corrigerDurees().catch(e => {
  console.error(e);
  log("❌ ERREUR : " + e.message);
});
