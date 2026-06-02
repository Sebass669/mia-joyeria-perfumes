import json

PRODUCTOS_NINOS = [
    {
        "nombre": "Perfumes para niños - Imagen 1",
        "precio": "Consultar precio",
        "imagen": "ninos1.jpg",
        "categoria": "NIÑOS",
        "tipoEspecial": "imagenGrande"
    },
    {
        "nombre": "Perfumes para niños - Imagen 2",
        "precio": "Consultar precio",
        "imagen": "ninos2.jpg",
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