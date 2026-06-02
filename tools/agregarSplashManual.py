import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PRODUCTOS_JSON = BASE_DIR / "productos.json"

SPLASH_MANUAL = {
    "nombre": "VICTORIA'S SECRET SPLASH",
    "precio": "₡10000.00",
    "imagen": "assets/splash1.jpg",
    "categoria": "MUJER",
    "tipoEspecial": "imagenGrande"
}

with open(PRODUCTOS_JSON, "r", encoding="utf-8") as archivo:
    productos = json.load(archivo)

productos = [
    producto for producto in productos
    if producto.get("nombre") != SPLASH_MANUAL["nombre"]
]

productos.insert(0, SPLASH_MANUAL)

with open(PRODUCTOS_JSON, "w", encoding="utf-8") as archivo:
    json.dump(productos, archivo, ensure_ascii=False, indent=4)

print("Splash manual agregado de primero.")