import subprocess

scripts = [
    "tools/extraerInfo.py",
    "tools/ajustarPrecios.py",
    "tools/agregarNinos.py"
]

for script in scripts:
    print(f"Ejecutando {script}...")
    subprocess.run(["python", script], check=True)

print("Catálogo actualizado correctamente.")
#git add .
#git commit -m "modularizar"
#git push origin main