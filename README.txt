VECTORIA UAP · Proyecto Integrador de Álgebra 2 · Gestión 2026

Versión actualizada: interfaz HTML + CSS + JavaScript modular y reactiva.

CASO PRINCIPAL
Batido Amazónico Energizante · R⁵ · W₁ · dim(W₁)=1
Vbase = (150,100,20,200,5)^T
V_T = N · Vbase
Vcomercial = (x1/1000,x2/1000,x3/1000,x4/1000,x5/1000)^T
P = (35,40,50,18,120)^T
CostoTotal = Vcomercial^T · P
CostoUnitario = CostoTotal / N

CASO COMPLEMENTARIO
Majadito con Charque · R⁴ · W · dim(W)=1
La cantidad se expresa en PLATOS, no en vasos.
Vbase = (100 g arroz, 200 g charque, 1 plátano, 1 huevo)^T
Precios: arroz 9 Bs/kg, charque 65 Bs/kg, plátano 7 Bs/kg, huevo 1 Bs/un.
Conversión del plátano: 1 unidad ≈ 0,15 kg.
Ejemplo del informe: N=50 platos → CostoTotal=797,50 Bs → CostoPlato=15,95 Bs/plato.

INTERFAZ
- Selector de casos.
- Ficha dinámica de ingredientes, cantidades base, unidades y precios.
- Modo por cantidad de vasos/platos.
- Modo inverso por ingrediente: N = xj / Vbase[j].
- Vector total, conversión comercial, costos por ingrediente, costo total y unitario.
- Procedimiento matemático paso a paso.
- Teoría visual con diagramas locales y enlaces a Google Imágenes.
- Animaciones, transiciones y efecto de ondas/agua al pulsar.
- Boris aparece como coordinador del grupo de forma sobria.

ARCHIVOS DE IDENTIDAD
boris.jpeg
german.jpeg
leonel.jpeg
uap.jpeg
facultad.jpeg
sistemas.jpeg
vectoria.jpeg

Los nombres de las fotografías y logos se mantienen sin cambios.


GITHUB PAGES - IMPORTANTE
1. Sube directamente index.html, style.css, script.js y la carpeta assets al nivel principal del repositorio.
2. No dejes la carpeta VECTORIA_UAP dentro de otra carpeta si quieres que GitHub Pages encuentre index.html directamente.
3. En Settings > Pages selecciona Deploy from a branch, rama main y carpeta / (root).
4. La galería de teoría usa imágenes externas encontradas mediante búsqueda de imágenes y tiene un fallback local para que el sitio no quede vacío si el navegador bloquea una imagen remota.
5. El diseño incluye navegación lateral adaptable, menú hamburguesa, tarjetas, tablas y fórmulas para celulares.
