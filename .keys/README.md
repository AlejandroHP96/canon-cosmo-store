# Service account keys

Credenciales del Admin SDK para los scripts de `scripts/` (`sync:dev-db`,
`migrate:price`). **Este directorio entero está en `.gitignore`** — nunca
subas su contenido al repo.

## Qué descargar

Firebase Console -> Project settings -> Service accounts -> *Generate new
private key*. Sale un `.json` a la carpeta de descargas: renómbralo y muévelo
aquí con el nombre exacto que espera cada script.

| Fichero | Proyecto | Enlace directo |
|---|---|---|
| `sa-dev.json` | `canon-cosmo-store-dev` | https://console.firebase.google.com/project/canon-cosmo-store-dev/settings/serviceaccounts/adminsdk |
| `sa-prod.json` | `canon-cosmo-store` | https://console.firebase.google.com/project/canon-cosmo-store/settings/serviceaccounts/adminsdk |

El fichero descargado ya viene completo, no hay que editarlo. Debe tener
`"type": "service_account"` y un `"project_id"` que coincida con el proyecto.

## Comprobar que están bien

```bash
npm run migrate:price dev    # dry-run, no escribe nada
```

Si falta el fichero el script lo dice y sale sin tocar nada.

## Si se filtra una clave

Revócala en la misma pantalla de la consola (pestaña de service accounts ->
*Manage service account permissions* -> Keys) y genera una nueva.
