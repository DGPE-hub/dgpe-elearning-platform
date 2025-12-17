import {
  getFirestore,
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const db = getFirestore();

/* 🔵 Mapping officiel DGPE – Plan de formation 2026 */
const dureesDGPE = {
  "Gouvernance stratégique et analyse financière": "4 j",
  "Pilotage stratégique": "4 j",
  "Audit & conformité": "3 j",
  "Performance & KPI": "2 j",
  "Transformation digitale": "3 j",
  "IA & Décision": "2 j",
  "Leadership": "2 j",
  "Communication de crise": "2 j",
  "RSE : Concevoir et piloter une stratégie durable": "3 j",
  "Manager le changement durable": "2 j"
};

async function corrigerDureesModules() {
  const snap = await getDocs(collection(db, "modules"));
  let count = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    if (dureesDGPE[data.titre]) {
      await updateDoc(docSnap.ref, {
        duree: dureesDGPE[data.titre]
      });
      count++;
    }
  }

  document.body.innerHTML = `✅ ${count} modules mis à jour avec les durées DGPE.`;
}

corrigerDureesModules();
