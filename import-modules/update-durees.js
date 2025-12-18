import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* 🔹 Mapping officiel DGPE – Plan de formation 2026 */
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

async function corrigerDurees() {
  const snap = await getDocs(collection(db, "modules"));

  let count = 0;

  for (const d of snap.docs) {
    const data = d.data();
    const duree = dureesDGPE[data.titre];

    if (duree && data.duree !== duree) {
      await updateDoc(doc(db, "modules", d.id), {
        duree
      });
      count++;
      console.log(`✔ ${data.titre} → ${duree}`);
    }
  }

  document.body.innerHTML += `<p>✅ ${count} modules mis à jour.</p>`;
}

corrigerDurees();
