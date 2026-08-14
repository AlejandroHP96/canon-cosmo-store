// Gestiona el custom claim `admin`, que es lo que firestore.rules exige para
// escribir. Sin el claim, una cuenta autenticada no puede tocar nada.
//
// Requiere service account keys en .keys/ — ver .keys/README.md
//
//   npm run admin:claim dev                          # lista usuarios y claims
//   npm run admin:claim prod -- --grant a@b.com      # concede admin
//   npm run admin:claim prod -- --revoke a@b.com     # lo quita
//
// Sin --grant ni --revoke no escribe nada: solo informa.

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS_DIR = path.join(__dirname, '..', '.keys');

const KEY_FILES = { dev: 'sa-dev.json', prod: 'sa-prod.json' };

function parseArgs(argv) {
    const env = argv.find((a) => !a.startsWith('--'));
    const flag = (name) => {
        const i = argv.indexOf(`--${name}`);
        return i === -1 ? null : argv[i + 1];
    };
    return { env, grant: flag('grant'), revoke: flag('revoke') };
}

function loadKey(env) {
    const filePath = path.join(KEYS_DIR, KEY_FILES[env]);
    try {
        return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
        console.error(`Falta ${filePath}`);
        console.error(
            'Descárgalo desde Firebase console -> Project settings -> Service accounts -> Generate new private key',
        );
        process.exit(1);
    }
}

/** Lee la config de Identity Platform para avisar si el alta es libre. */
async function reportSignUpPolicy(credential, projectId) {
    try {
        const { access_token: token } = await credential.getAccessToken();
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`,
            { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) {
            console.log(
                `\nAlta de usuarios: no se ha podido consultar (HTTP ${res.status}).`,
            );
            return;
        }
        const cfg = await res.json();
        const email = cfg.signIn?.email ?? {};
        const anon = cfg.signIn?.anonymous?.enabled === true;

        console.log('\nPolítica de alta:');
        console.log(
            `  email/password habilitado : ${email.enabled === true ? 'sí' : 'no'}`,
        );
        console.log(
            `  alta autoservicio         : ${email.disableSignUp === true ? 'BLOQUEADA' : 'ABIERTA'}`,
        );
        console.log(
            `  acceso anónimo            : ${anon ? 'SÍ (revísalo)' : 'no'}`,
        );

        if (email.enabled === true && email.disableSignUp !== true) {
            console.log(
                '\n  AVISO: cualquiera con la apiKey del bundle puede crearse una cuenta.\n' +
                    '  Con las reglas basadas en claim eso ya no da acceso a los datos, pero\n' +
                    '  conviene cerrarlo igualmente en Authentication -> Settings -> User actions.',
            );
        }
    } catch (err) {
        console.log(
            `\nAlta de usuarios: no se ha podido consultar (${err.message}).`,
        );
    }
}

async function listUsers(auth) {
    const { users } = await auth.listUsers(1000);
    console.log(`\nUsuarios (${users.length}):`);
    if (users.length === 0) console.log('  (ninguno)');
    for (const u of users) {
        const isAdmin = u.customClaims?.admin === true;
        console.log(
            `  ${isAdmin ? '[ADMIN]' : '[     ]'} ${u.email ?? '(sin email)'}  uid=${u.uid}`,
        );
    }
    return users;
}

async function setClaim(auth, email, value) {
    const user = await auth.getUserByEmail(email).catch(() => null);
    if (!user) {
        console.error(`\nNo existe ninguna cuenta con el email ${email}.`);
        console.error(
            'Créala primero en Firebase console -> Authentication -> Users.',
        );
        process.exit(1);
    }

    // Se conservan otros claims por si algún día hay más de uno
    const claims = { ...(user.customClaims ?? {}) };
    if (value) claims.admin = true;
    else delete claims.admin;

    await auth.setCustomUserClaims(user.uid, claims);
    console.log(
        `\n${value ? 'Concedido' : 'Retirado'} el claim admin a ${email} (uid=${user.uid}).`,
    );
    console.log(
        'El claim viaja dentro del ID token, así que no surte efecto hasta que',
    );
    console.log(
        'esa sesión se renueve: cierra sesión en el panel y vuelve a entrar.',
    );
}

async function main() {
    const { env, grant, revoke } = parseArgs(process.argv.slice(2));

    if (!KEY_FILES[env]) {
        console.error(
            'Uso: npm run admin:claim <dev|prod> [-- --grant <email> | --revoke <email>]',
        );
        process.exit(1);
    }
    if (grant && revoke) {
        console.error('--grant y --revoke son excluyentes.');
        process.exit(1);
    }

    const key = loadKey(env);
    const credential = cert(key);
    const app = initializeApp({ credential }, env);
    const auth = getAuth(app);

    console.log(`Proyecto: ${key.project_id} (${env})`);

    if (grant) await setClaim(auth, grant, true);
    else if (revoke) await setClaim(auth, revoke, false);

    await listUsers(auth);
    await reportSignUpPolicy(credential, key.project_id);

    process.exit(0);
}

main().catch((err) => {
    console.error('ERROR:', err);
    process.exit(1);
});
