import json

REGLAS_PRECIOS = [
    {
        "marca": "CURVE",
        "precio_actual": "₡10500.00",
        "precio_nuevo": "₡13000.00"
    },
    {
        "marca": "ADIDAS",
        "precio_actual": "₡6500.00",
        "precio_nuevo": "₡8500.00"
    }
]

with open("productos.json", "r", encoding="utf-8") as archivo:
    productos = json.load(archivo)

cambios = 0

for producto in productos:
    nombre = producto.get("nombre", "").upper()
    precio = producto.get("precio", "").strip()

    for regla in REGLAS_PRECIOS:
        marca = regla["marca"].upper()

        if marca in nombre and precio == regla["precio_actual"]:
            print(
                f'Cambiando: {producto["nombre"]} | '
                f'{precio} -> {regla["precio_nuevo"]}'
            )

            producto["precio"] = regla["precio_nuevo"]
            cambios += 1
            break

with open("productos.json", "w", encoding="utf-8") as archivo:
    json.dump(productos, archivo, ensure_ascii=False, indent=4)

print(f"Listo. Productos modificados: {cambios}")