// Espeja datos de canon-cosmo-store (prod) a canon-cosmo-store-dev.
// Requiere service account keys en .keys/sa-prod.json y .keys/sa-dev.json
// (Firebase console -> Project settings -> Service accounts -> Generate new private key)

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS_DIR = path.join(__dirname, '..', '.keys');

function loadKey(filename) {
    const filePath = path.join(KEYS_DIR, filename);
    try {
        return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
        console.error(`Falta ${filePath}`);
        console.error('Descárgalo desde Firebase console -> Project settings -> Service accounts -> Generate new private key');
        process.exit(1);
    }
}

const prodApp = initializeApp({ credential: cert(loadKey('sa-prod.json')) }, 'prod');
const devApp = initializeApp({ credential: cert(loadKey('sa-dev.json')) }, 'dev');

const prodDb = getFirestore(prodApp);
const devDb = getFirestore(devApp);

async function clearCollection(db, name) {
    const snap = await db.collection(name).get();
    let batch = db.batch();
    let count = 0;
    for (const doc of snap.docs) {
        batch.delete(doc.ref);
        count++;
        if (count % 400 === 0) {
            await batch.commit();
            batch = db.batch();
        }
    }
    if (count % 400 !== 0) await batch.commit();
}

async function copyCollection(name) {
    const snap = await prodDb.collection(name).get();
    await clearCollection(devDb, name);
    let batch = devDb.batch();
    let count = 0;
    for (const doc of snap.docs) {
        batch.set(devDb.collection(name).doc(doc.id), doc.data());
        count++;
        if (count % 400 === 0) {
            await batch.commit();
            batch = devDb.batch();
        }
    }
    if (count % 400 !== 0) await batch.commit();
    console.log(`  ${name}: ${snap.size} documentos`);
    return snap.size;
}

const EXCLUDED_COLLECTIONS = ['reservas'];

async function main() {
    const cols = await prodDb.listCollections();
    const collections = cols.map((c) => c.id).filter((id) => !EXCLUDED_COLLECTIONS.includes(id));
    console.log('Sincronizando prod -> dev:', collections);
    let total = 0;
    for (const name of collections) {
        total += await copyCollection(name);
    }
    console.log(`\nListo. ${total} documentos sincronizados en canon-cosmo-store-dev.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('ERROR:', err);
    process.exit(1);
});
