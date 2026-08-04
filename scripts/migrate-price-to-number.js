// Migra products.price / products.salePrice de string ('4,99 €') a number (4.99).
//
// Uso:
//   npm run migrate:price dev               # dry-run sobre dev
//   npm run migrate:price dev -- --apply    # escribe en dev
//   npm run migrate:price prod -- --apply   # escribe en prod
//
// Ojo al `--` antes de `--apply`: sin él npm se queda el flag y el script
// se ejecuta en dry-run. Equivale a `node scripts/migrate-price-to-number.js`.
//
// Siempre vuelca un backup JSON de la colección en .backups/ antes de escribir.
// Requiere service account keys en .keys/sa-prod.json y .keys/sa-dev.json.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const target = process.argv[2];
const apply = process.argv.includes('--apply');

if (target !== 'dev' && target !== 'prod') {
    console.error('Uso: node scripts/migrate-price-to-number.js <dev|prod> [--apply]');
    process.exit(1);
}

const PROJECT_IDS = { dev: 'canon-cosmo-store-dev', prod: 'canon-cosmo-store' };

function die(...lines) {
    lines.forEach((l) => console.error(l));
    process.exit(1);
}

function loadKey(env) {
    const filePath = path.join(ROOT, '.keys', `sa-${env}.json`);
    let raw;
    try {
        raw = readFileSync(filePath, 'utf-8');
    } catch {
        die(
            `Falta ${filePath}`,
            'Descárgalo desde Firebase console -> Project settings -> Service accounts -> Generate new private key',
            'Ver .keys/README.md',
        );
    }

    let key;
    try {
        key = JSON.parse(raw);
    } catch {
        die(`${filePath} no es JSON válido. Descárgalo de nuevo sin editarlo.`);
    }

    if (key.type !== 'service_account' || !key.private_key) {
        die(`${filePath} no parece una service account key (falta type o private_key).`);
    }

    const expected = PROJECT_IDS[env];
    if (key.project_id !== expected) {
        die(
            `${filePath} es del proyecto "${key.project_id}", pero se esperaba "${expected}".`,
            'Has confundido las claves de dev y prod. Revísalas antes de seguir.',
        );
    }

    return key;
}

const app = initializeApp({ credential: cert(loadKey(target)) }, target);
const db = getFirestore(app);

/** '4,99 €' -> 4.99 ; '1.234,50 €' -> 1234.50 ; number -> number */
function parsePrice(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;
    let s = value.replace(/[^\d,.-]/g, '');
    if (!s) return null;
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    if (lastComma > -1 && lastDot > -1) {
        // El separador decimal es el que aparece más a la derecha
        const decimalSep = lastComma > lastDot ? ',' : '.';
        const thousandsSep = decimalSep === ',' ? '.' : ',';
        s = s.split(thousandsSep).join('').replace(decimalSep, '.');
    } else if (lastComma > -1) {
        s = s.replace(',', '.');
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function backup(docs) {
    const dir = path.join(ROOT, '.backups');
    mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `products-${target}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    writeFileSync(file, JSON.stringify(docs.map((d) => ({ id: d.id, ...d.data() })), null, 2));
    console.log(`Backup: ${path.relative(ROOT, file)} (${docs.length} docs)\n`);
}

async function main() {
    const snap = await db.collection('products').get();
    console.log(`Proyecto: ${target} — ${snap.size} productos\n`);

    const updates = [];
    const skipped = [];

    for (const doc of snap.docs) {
        const data = doc.data();
        const fields = {};

        for (const key of ['price', 'salePrice']) {
            const raw = data[key];
            if (raw === undefined || raw === null || raw === '') continue;
            if (typeof raw === 'number') continue; // ya migrado
            const parsed = parsePrice(raw);
            if (parsed === null) {
                skipped.push(`${doc.id} (${data.name}): ${key} = ${JSON.stringify(raw)}`);
                continue;
            }
            fields[key] = parsed;
        }

        if (Object.keys(fields).length > 0) {
            updates.push({ ref: doc.ref, id: doc.id, name: data.name, fields, before: { price: data.price, salePrice: data.salePrice } });
        }
    }

    for (const u of updates) {
        const parts = Object.entries(u.fields).map(([k, v]) => `${k}: ${JSON.stringify(u.before[k])} -> ${v}`);
        console.log(`  ${u.name}: ${parts.join(', ')}`);
    }

    if (skipped.length > 0) {
        console.log(`\nNO PARSEABLES (${skipped.length}) — se dejan intactos, revísalos a mano:`);
        skipped.forEach((s) => console.log(`  ${s}`));
    }

    console.log(`\n${updates.length} documentos a actualizar, ${skipped.length} sin tocar.`);

    if (!apply) {
        console.log('\nDRY-RUN. Nada escrito. Añade --apply para ejecutar.');
        process.exit(0);
    }

    if (updates.length === 0) {
        console.log('Nada que hacer.');
        process.exit(0);
    }

    backup(snap.docs);

    let batch = db.batch();
    let count = 0;
    for (const u of updates) {
        batch.update(u.ref, u.fields);
        count++;
        if (count % 400 === 0) {
            await batch.commit();
            batch = db.batch();
        }
    }
    if (count % 400 !== 0) await batch.commit();

    console.log(`Listo. ${count} documentos migrados en ${target}.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('ERROR:', err);
    process.exit(1);
});
