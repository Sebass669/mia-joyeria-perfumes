import requests
from bs4 import BeautifulSoup
import pandas as pd
base_url = "https://essenzaperfumes.cr/categoria.php"
productos = []
def obtenerProductos(slug,categoria):
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": f"https://essenzaperfumes.cr/categoria.php?slug={slug}"
    }
    offset = 0
    productos = []
    #offset < 36
    while  True:
        params = {
            "slug": slug,
            "ajax": "1",
            "offset": offset,
            "orderby": "menu_order"
        }
        respuesta = requests.get(base_url, params=params, headers=headers)
        data = respuesta.json()
        html = data["html"]
        soup = BeautifulSoup(html, "html.parser")
        #////////////////////////////////
        productoBase = soup.find_all("article", class_="product-card")
        for producto in productoBase:
            img = producto.find("img")
            enlace = img["src"] if img else ""
            nombre = producto.find("div", class_="product-card-body").find("a")
            nombre = nombre.text.strip() if nombre else ""
            precio = producto.find("span", class_="price-current")
            precio = precio.text.strip() if precio else ""
            productos.append({
                "nombre": nombre,
                "precio": precio,
                "imagen": enlace,
                "categoria": categoria
            })
        if not data.get("has_more"):
            break
        offset = data["next_offset"]
    return productos

productos.extend(
    obtenerProductos(
        "perfumes-de-hombre",
        "HOMBRE"
    )
)

productos.extend(
    obtenerProductos(
        "perfumes-de-mujer",
        "MUJER"
    )
)

productos.extend(
    obtenerProductos(
        "perfumes-unisex",
        "UNISEX"
    )
)

productos.extend(
    obtenerProductos(
        "estuches",
        "ESTUCHES"
    )
)



df = pd.DataFrame(productos)
df.to_json(
    "productos.json",
    orient="records",
    force_ascii=False,
    indent=4
)
