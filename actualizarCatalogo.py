import subprocess

scripts = [
    "tools/extraerInfo.py",
    "tools/cambiarPrecios.py",
    "tools/agregarNinos.py",
    "tools/agregarVictoriaBath.py"
]

for script in scripts:
    print(f"Ejecutando {script}...")
    subprocess.run(["python", script], check=True)

print("Catálogo actualizado correctamente.")
#git add .
#git commit -m "version minimalista"
#git push origin main
#cambiar el boton de consultar