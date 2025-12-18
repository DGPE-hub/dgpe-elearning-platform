import {
  getFirestore,
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const db = getFirestore();

/* 🔵 Mapping officiel DGPE – Plan de formation 2026 */
const MODULES_DGPE = [
  {
    titre: "Gouvernance stratégique et analyse financière",
    domaine: "Gouvernance",
    duree: "4 j"
  },
  {
    titre: "Pilotage stratégique",
    domaine: "Gouvernance",
    duree: "4 j"
  },
  {
    titre: "Audit & conformité",
    domaine: "Gouvernance",
    duree: "3 j"
  },
  {
    titre: "Performance & KPI",
    domaine: "Performance",
    duree: "2 j"
  },
  {
    titre: "Transformation digitale",
    domaine: "Digital",
    duree: "3 j"
  },
  {
    titre: "IA & Décision",
    domaine: "Digital",
    duree: "2 j"
  },
  {
    titre: "Leadership",
    domaine: "Management",
    duree: "2 j"
  },
  {
    titre: "Communication de crise",
    domaine: "Management",
    duree: "2 j"
  },
  {
    titre: "RSE : Concevoir et piloter une stratégie durable",
    domaine: "Gouvernance",
    duree: "3 j"
  },
  {
    titre: "Manager le changement durable",
    domaine: "Management",
    duree: "2 j"
  }
];


async function resetModulesDGPE() {
  const snap = await getDocs(collection(db, "modules"));

  // 🔥 Supprimer tous les modules existants
  for (const d of snap.docs) {
    await deleteDoc(doc(db, "modules", d.id));
  }

  // ✅ Réinjecter les modules officiels
  for (const m of MODULES_DGPE) {
    await addDoc(collection(db, "modules"), {
      titre: m.titre,
      domaine: m.domaine,
      duree: m.duree,
      resume: "",
      actif: true
    });
  }

  console.log("✅ Modules DGPE réinitialisés");
}

resetModulesDGPE();
