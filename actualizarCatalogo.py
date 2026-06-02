import subprocess

scripts = [
    "tools/extraerInfo.py",
    "tools/cambiarPrecios.py",
    "tools/agregarNinos.py",
    "tools/agregarSplashManual.py"
]

for script in scripts:
    print(f"Ejecutando {script}...")
    subprocess.run(["python", script], check=True)

print("Catálogo actualizado correctamente.")
#git add .
#git commit -m "actualizacion de json"
#git push origin main
#cambiar el boton de consultar