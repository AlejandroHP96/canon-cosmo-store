// Gestiona el custom claim `admin`, que es lo que firestore.rules exige para
// escribir. Sin el claim, una cuenta autenticada no puede tocar nada.
//
// Requiere service account keys en .keys/ — ver .keys/README.md
//
//   npm run admin:claim dev                          # lista usuarios y claims
//   npm run admin:claim prod -- --grant a@b.com      # concede admin
//   npm run admin:claim prod -- --revoke a@b.com     # lo quita
//   npm run admin:claim prod -- --lock-signup        # cierra el alta libre
//
// Sin flags no escribe nada: solo informa.

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
    return {
        env,
        grant: flag('grant'),
        revoke: flag('revoke'),
        lockSignup: argv.includes('--lock-signup'),
        unlockSignup: argv.includes('--unlock-signup'),
    };
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

const CONFIG_URL = (projectId) =>
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`;

async function getConfig(credential, projectId) {
    const { access_token: token } = await credential.getAccessToken();
    const res = await fetch(CONFIG_URL(projectId), {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} al leer la config`);
    return res.json();
}

/**
 * Cierra o abre el alta autoservicio de cuentas.
 *
 * El campo es `client.permissions.disabledUserSignup`, que es lo que mueve la
 * casilla "Enable create (sign-up)" de Authentication -> Settings -> User
 * actions. Ojo: `signIn.email` NO tiene ningún `disableSignUp`, aunque lo
 * parezca; leer ahí devuelve undefined siempre y da un falso "abierto".
 */
async function setSignUpLock(credential, projectId, disabled) {
    const { access_token: token } = await credential.getAccessToken();
    const res = await fetch(
        `${CONFIG_URL(projectId)}?updateMask=client.permissions.disabledUserSignup`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client: { permissions: { disabledUserSignup: disabled } },
            }),
        },
    );
    if (!res.ok) {
        const body = await res.text();
        console.error(
            `\nNo se ha podido cambiar el alta (HTTP ${res.status}): ${body}`,
        );
        process.exit(1);
    }
    console.log(
        `\nAlta autoservicio de cuentas: ${disabled ? 'BLOQUEADA' : 'ABIERTA'}.`,
    );
}

/** Avisa de por dónde se puede entrar al proyecto. */
async function reportSignUpPolicy(credential, projectId) {
    let cfg;
    try {
        cfg = await getConfig(credential, projectId);
    } catch (err) {
        console.log(
            `\nPolítica de alta: no se ha podido consultar (${err.message}).`,
        );
        return;
    }

    const emailEnabled = cfg.signIn?.email?.enabled === true;
    const anon = cfg.signIn?.anonymous?.enabled === true;
    const signUpBlocked = cfg.client?.permissions?.disabledUserSignup === true;

    console.log('\nPolítica de alta:');
    console.log(`  email/password habilitado : ${emailEnabled ? 'sí' : 'no'}`);
    console.log(
        `  alta autoservicio         : ${signUpBlocked ? 'BLOQUEADA' : 'ABIERTA'}`,
    );
    console.log(
        `  acceso anónimo            : ${anon ? 'SÍ (revísalo)' : 'no'}`,
    );

    if (anon) {
        console.log(
            '\n  AVISO: el acceso anónimo está activo y el código no lo usa.\n' +
                '  Desactívalo en Authentication -> Sign-in method.',
        );
    }
    if (emailEnabled && !signUpBlocked) {
        console.log(
            '\n  AVISO: cualquiera con la apiKey del bundle puede crearse una cuenta.\n' +
                '  Con las reglas basadas en claim eso ya no da acceso a los datos, pero\n' +
                '  conviene cerrarlo:  npm run admin:claim <env> -- --lock-signup',
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
    const { env, grant, revoke, lockSignup, unlockSignup } = parseArgs(
        process.argv.slice(2),
    );

    if (!KEY_FILES[env]) {
        console.error(
            'Uso: npm run admin:claim <dev|prod> [-- --grant <email> | --revoke <email>]\n' +
                '                                    [-- --lock-signup | --unlock-signup]',
        );
        process.exit(1);
    }
    if (grant && revoke) {
        console.error('--grant y --revoke son excluyentes.');
        process.exit(1);
    }
    if (lockSignup && unlockSignup) {
        console.error('--lock-signup y --unlock-signup son excluyentes.');
        process.exit(1);
    }

    const key = loadKey(env);
    const credential = cert(key);
    const app = initializeApp({ credential }, env);
    const auth = getAuth(app);

    console.log(`Proyecto: ${key.project_id} (${env})`);

    if (grant) await setClaim(auth, grant, true);
    else if (revoke) await setClaim(auth, revoke, false);

    if (lockSignup) await setSignUpLock(credential, key.project_id, true);
    else if (unlockSignup)
        await setSignUpLock(credential, key.project_id, false);

    await listUsers(auth);
    await reportSignUpPolicy(credential, key.project_id);

    process.exit(0);
}

main().catch((err) => {
    console.error('ERROR:', err);
    process.exit(1);
});
