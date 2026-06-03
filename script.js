const WHATSAPP_NUMERO = "50683273777";
const PRODUCTOS_POR_BLOQUE = 36;

const MARCAS_ARABES = [
    "AFNAN",
    "AL HARAMAIN",
    "ARMAF",
    "ASDAAF",
    "ASDAF",
    "ARABIYAT",
    "ANFAR",
    "BHARARA",
    "EMPER",
    "FRENCH AVENUE",
    "GRANDEUR",
    "GULF ORQUID",
    "GULF ORCHID",
    "JO MILANO",
    "LATTAFA",
    "LE CHAMEAU",
    "LE FALCONE",
    "LUNICHE",
    "MAISON ALHAMBRA",
    "MAKTOUB",
    "ORIENTICA",
    "PARIS CORNER",
    "ZAKAT"
];

const contenedor = document.getElementById("contenedor-productos");
const busqueda = document.getElementById("busqueda");
const contador = document.getElementById("contador-productos");
const botonCargarMas = document.getElementById("cargar-mas");
const filtros = document.querySelectorAll("[data-categoria]");
const whatsappGeneral = document.getElementById("whatsapp-general");
const whatsappFooter = document.getElementById("whatsapp-footer");

let productosOriginales = [];
let productosFiltrados = [];
let categoriaActual = "TODOS";
let cantidadMostrada = 0;

function limpiarTexto(texto = ""){
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function esPerfumeArabe(producto){
    const nombre = limpiarTexto(producto.nombre).toUpperCase();
    return MARCAS_ARABES.some(marca => nombre.includes(marca));
}

function detectarCategoria(producto){
    const categoria = limpiarTexto(producto.categoria).toUpperCase();
    const nombre = limpiarTexto(producto.nombre).toUpperCase();
    if(categoria === "ESTUCHES") return "ESTUCHES";
    if(nombre.includes("ESTUCHE")) return "ESTUCHES";
    if(nombre.includes("UNISEX")) return "UNISEX";
    if(nombre.includes("MUJER")) return "MUJER";
    if(nombre.includes("HOMBRE")) return "HOMBRE";
    if(categoria === "NIÑOS") return "NIÑOS";
    if(categoria === "NINOS") return "NIÑOS";
    if(categoria === "VICTORIA'S SECRET") return "VICTORIA'S SECRET";
    if(categoria === "VICTORIA SECRET") return "VICTORIA'S SECRET";
    if(categoria === "VICTORIAS SECRET") return "VICTORIA'S SECRET";
    if(categoria === "BATH AND BODY WORKS") return "BATH AND BODY WORKS";
    if(categoria === "BATH & BODY WORKS") return "BATH AND BODY WORKS";

    if([
        "HOMBRE",
        "MUJER",
        "UNISEX",
        "ESTUCHES",
        "NIÑOS",
        "NINOS",
        "VICTORIA'S SECRET",
        "VICTORIA SECRET",
        "VICTORIAS SECRET",
        "BATH AND BODY WORKS",
        "BATH & BODY WORKS"
    ].includes(categoria)){
        if(categoria === "NINOS") return "NIÑOS";
        if(categoria === "VICTORIA SECRET" || categoria === "VICTORIAS SECRET") return "VICTORIA'S SECRET";
        if(categoria === "BATH & BODY WORKS") return "BATH AND BODY WORKS";
        return categoria;
    }

    return "UNISEX";
}

function formatearPrecio(precio){
    if(!precio) return "Consultar precio";
    return String(precio).replace(".00", "");
}

function crearMensajeWhatsApp(producto){
    return `Hola, me interesa consultar disponibilidad de este perfume: ${producto.nombre} - ${formatearPrecio(producto.precio)}`;
}

function crearLinkWhatsApp(mensaje){
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

function activarBotonesCategoria(){
    filtros.forEach(boton => {
        boton.classList.toggle("active", boton.dataset.categoria === categoriaActual);
    });
}

function aplicarFiltros(){
    const texto = limpiarTexto(busqueda.value);

    productosFiltrados = productosOriginales.filter(producto => {
        const categoria = producto.categoriaFinal;
        const coincideCategoria = categoriaActual === "TODOS" || categoria === categoriaActual || (categoriaActual === "ARABES" && producto.esArabe);
        const contenido = limpiarTexto(`${producto.nombre} ${producto.precio} ${producto.categoriaFinal} ${producto.categoria || ""} ${producto.marcaArabe || ""} ${producto.esArabe ? "arabe arabes perfumes arabes" : ""}`);
        const coincideBusqueda = !texto || contenido.includes(texto);

        return coincideCategoria && coincideBusqueda;
    });

    cantidadMostrada = 0;
    contenedor.innerHTML = "";
    renderizarBloque();
    activarBotonesCategoria();
}

function renderizarBloque(){
    const inicio = cantidadMostrada;
    const fin = inicio + PRODUCTOS_POR_BLOQUE;
    const bloque = productosFiltrados.slice(inicio, fin);

    if(inicio === 0 && bloque.length === 0){
        contenedor.innerHTML = `<div class="empty">No se encontraron perfumes con ese filtro.</div>`;
    }

    const fragmento = document.createDocumentFragment();

    bloque.forEach(producto => {
        const card = document.createElement("article");
        card.className = "card";

        const categoria = producto.categoriaFinal;
        const precio = formatearPrecio(producto.precio);
        const link = crearLinkWhatsApp(crearMensajeWhatsApp(producto));
        const badgeExtra = producto.esArabe ? `<span class="badge badge-arabe">Árabe</span>` : "";

        card.innerHTML = `
            <div class="card-img">
                <a href="${producto.imagen}" target="_blank" rel="noopener">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                </a>
            </div>
            <div class="info">
                <h3>${producto.nombre}</h3>
                <div class="meta">
                    <p class="precio">${precio}</p>
                    <span class="badge">${categoria}</span>
                    ${badgeExtra}
                </div>
                <a class="whatsapp-card" href="${link}" target="_blank" rel="noopener">Consultar</a>
            </div>
        `;

        fragmento.appendChild(card);
    });

    contenedor.appendChild(fragmento);
    cantidadMostrada += bloque.length;

    contador.textContent = `${productosFiltrados.length} perfumes encontrados`;
    botonCargarMas.style.display = cantidadMostrada < productosFiltrados.length ? "inline-flex" : "none";
}

async function iniciarCatalogo(){
    try{
        const respuesta = await fetch("productos.json");
        const productos = await respuesta.json();

        productosOriginales = productos.map(producto => {
            const nombre = limpiarTexto(producto.nombre).toUpperCase();
            const marcaArabe = MARCAS_ARABES.find(marca => nombre.includes(marca)) || "";

            return {
                ...producto,
                categoriaFinal: detectarCategoria(producto),
                esArabe: Boolean(marcaArabe),
                marcaArabe
            };
        });

        productosFiltrados = productosOriginales;

        const mensajeGeneral = "Hola, quiero consultar por el catálogo de perfumes.";
        whatsappGeneral.href = crearLinkWhatsApp(mensajeGeneral);
        whatsappFooter.href = crearLinkWhatsApp(mensajeGeneral);

        aplicarFiltros();
    }catch(error){
        console.error(error);
        contador.textContent = "No se pudo cargar el catálogo.";
        contenedor.innerHTML = `<div class="empty">Revisá que el archivo productos.json esté en la misma carpeta.</div>`;
        botonCargarMas.style.display = "none";
    }
}

filtros.forEach(boton => {
    boton.addEventListener("click", () => {
        categoriaActual = boton.dataset.categoria;
        aplicarFiltros();
        document.getElementById("catalogo").scrollIntoView({ behavior:"smooth", block:"start" });
    });
});

busqueda.addEventListener("input", aplicarFiltros);
botonCargarMas.addEventListener("click", renderizarBloque);

iniciarCatalogo();
