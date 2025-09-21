
# clonar base de datos (dump)

en PowerShell:

```powershell
.\pg_dump -U postgres -d tu_base > C:\backups\backup.sql
```


👉 Cambia:

postgres por tu usuario.

tu_base por el nombre de tu base.

C:\backups\backup.sql por la ruta donde quieras guardar.

Te pedirá la contraseña.

<hr>

👉 En Linux, para que un usuario pueda acceder a un archivo, también debe tener permisos de ejecución (x) en todas las carpetas del camino.
El usuario postgres no puede “entrar” a /home/antonio, aunque sea dueño del archivo dentro.

🔹 Soluciones
✅ Opción 1 – Copiar el archivo a un lugar accesible

Lo más simple y seguro:

```bash
sudo cp /home/antonio/nomades.sql /tmp/
sudo -u postgres psql -d nomadeswebsite -f /tmp/nomades.sql

```

👉 Un consejo extra: cuando termines, puedes limpiar /tmp para no dejar el backup tirado ahí:

```bash
sudo rm /tmp/nomades.sql

```


<hr>

### script 
Perfecto 🙌, acá te dejo un script simple para restaurar dumps `.sql` en PostgreSQL desde Linux.

---

### 🔹 Script: `restore.sh`

```bash
#!/bin/bash
# Uso: ./restore.sh archivo.sql nombre_base

SQL_FILE=$1
DB_NAME=$2

if [ -z "$SQL_FILE" ] || [ -z "$DB_NAME" ]; then
  echo "Uso: $0 archivo.sql nombre_base"
  exit 1
fi

# Copiar a /tmp
TMP_FILE="/tmp/$(basename "$SQL_FILE")"
sudo cp "$SQL_FILE" "$TMP_FILE"

# Restaurar
echo "Restaurando base de datos '$DB_NAME' desde $SQL_FILE..."
sudo -u postgres psql -d "$DB_NAME" -f "$TMP_FILE"

# Eliminar archivo temporal
sudo rm "$TMP_FILE"
echo "✅ Restauración completada y archivo temporal eliminado."
```

---

### 🔹 Cómo usarlo

1. Guarda el script en un archivo, por ejemplo `restore.sh`.
2. Dale permisos de ejecución:

   ```bash
   chmod +x restore.sh
   ```
3. Ejecútalo así:

   ```bash
   ./restore.sh /home/antonio/nomades.sql nomadeswebsite
   ```

---

👉 El script se encargará de:

* Copiar tu dump a `/tmp/`.
* Restaurarlo en la base indicada.
* Borrar el dump temporal al terminar.

---

¿Querés que lo adapte para que **cree la base de datos automáticamente si no existe** antes de restaurar?
