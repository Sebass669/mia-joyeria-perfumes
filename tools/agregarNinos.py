import json

PRODUCTOS_NINOS = [
    {
        "nombre": "TUBBEES",
        "precio": "₡9000.00",
        "imagen": "assets/ninos1.jpg",
        "categoria": "NIÑOS",
        "tipoEspecial": "imagenGrande"
    },
    {
        "nombre": "TUBBEES",
        "precio": "₡11000.00",
        "imagen": "assets/ninos2.jpg",
        "categoria": "NIÑOS",
        "tipoEspecial": "imagenGrande"
    }
]

with open("productos.json", "r", encoding="utf-8") as archivo:
    productos = json.load(archivo)

productos = [
    producto for producto in productos
    if producto.get("categoria") != "NIÑOS"
]

productos.extend(PRODUCTOS_NINOS)

with open("productos.json", "w", encoding="utf-8") as archivo:
    json.dump(productos, archivo, ensure_ascii=False, indent=4)

print("Categoría Niños agregada correctamente.")