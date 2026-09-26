// ============================================================
// VECTORIA UAP · ÁLGEBRA 2
// Núcleo matemático: V_T = N·V_base y C = V_comercial^T·P
// Casos: Batido Amazónico Energizante (R⁵) + Majadito (R⁴)
// ============================================================

const CASES = {
  batido: {
    key: "batido",
    name: "Batido Amazónico Energizante",
    short: "Batido Amazónico",
    quantityLabel: "Cantidad de vasos",
    quantityModeLabel: "Por cantidad de vasos",
    unitSingular: "vaso",
    unitPlural: "vasos",
    space: "R⁵",
    subspace: "W₁",
    dimension: 1,
    base: [150, 100, 20, 200, 5],
    ingredients: ["Asaí", "Copoazú", "Miel de Abeja Amazónica", "Leche de Castaña", "Esencia de Vainilla Silvestre"],
    units: ["g", "g", "ml", "ml", "ml"],
    commercialUnits: ["kg", "kg", "L", "L", "L"],
    prices: [35, 40, 50, 18, 120],
    priceLabels: ["Bs/kg", "Bs/kg", "Bs/L", "Bs/L", "Bs/L"],
    conversions: ["g ÷ 1000", "g ÷ 1000", "ml ÷ 1000", "ml ÷ 1000", "ml ÷ 1000"],
    commercialize: value => value / 1000,
    defaultN: 120,
    ingredientDefaults: [3000, 2000, 400, 4000, 100],
    vectorLabel: "V<sub>base</sub> = (150, 100, 20, 200, 5)<sup>T</sup>",
    subtitle: "R⁵ · W₁ · Escalar estándar",
    description: "Cada vaso conserva exactamente las proporciones de la receta base.",
    foodImage: "assets/food-batido.svg"
  },
  majadito: {
    key: "majadito",
    name: "Majadito con Charque",
    short: "Majadito",
    quantityLabel: "Cantidad de platos",
    quantityModeLabel: "Por cantidad de platos",
    unitSingular: "plato",
    unitPlural: "platos",
    space: "R⁴",
    subspace: "W",
    dimension: 1,
    base: [100, 200, 1, 1],
    ingredients: ["Arroz", "Charque", "Plátano", "Huevo"],
    units: ["g", "g", "un", "un"],
    commercialUnits: ["kg", "kg", "kg", "un"],
    prices: [9, 65, 7, 1],
    priceLabels: ["Bs/kg", "Bs/kg", "Bs/kg", "Bs/un"],
    conversions: ["g ÷ 1000", "g ÷ 1000", "1 un ≈ 0,15 kg", "se mantiene en unidades"],
    commercialize: (value, index) => index === 0 || index === 1 ? value / 1000 : index === 2 ? value * 0.15 : value,
    defaultN: 50,
    ingredientDefaults: [5000, 10000, 50, 50],
    vectorLabel: "V<sub>base</sub> = (100, 200, 1, 1)<sup>T</sup>",
    subtitle: "R⁴ · W · Escalar estándar",
    description: "En este caso la cantidad se expresa en platos. El informe de referencia usa 50 platos.",
    foodImage: "assets/food-majadito.svg",
    sourceNote: "Valores del caso Majadito tomados del informe de referencia: arroz 9 Bs/kg, charque 65 Bs/kg, plátano 7 Bs/kg y huevo 1 Bs/un."
  }
};

let ACTIVE_CASE = "batido";
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
function currentCase(){ return CASES[ACTIVE_CASE]; }

window.addEventListener("load", () => {
  setTimeout(() => $("#splash")?.classList.add("hide"), 1000);
  updateClock();
  setInterval(updateClock, 1000);
  initializeNavigation();
  initializeCases();
  initializeModes();
  initializeExercises();
  initializeTheory();
  $("#calculateBtn")?.addEventListener("click", calculateRecipe);
  [$("#nInput"), $("#ingredientSelect"), $("#ingredientInput")].forEach(input => {
    if (!input) return;
    input.addEventListener("input", calculateRecipe);
    input.addEventListener("change", () => {
      if(input.id === "ingredientSelect") syncIngredientDefault();
      calculateRecipe();
    });
  });
  $("#procedureBtn")?.addEventListener("click", toggleProcedure);
  configureCaseUI();
  calculateRecipe();
  activateRevealAnimation();
  createWaterRipples();
});

function updateClock(){
  const now = new Date();
  const hour = now.getHours();
  $("#greeting").textContent = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  $("#clock").textContent = now.toLocaleTimeString("es-BO");
}

function initializeNavigation(){
  $("#menuBtn")?.addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $$(".nav-link").forEach(button => button.addEventListener("click", () => {
    $$(".nav-link").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    showSection(button.dataset.section);
    $("#sidebar").classList.remove("open");
  }));
  $$('[data-go]').forEach(button => button.addEventListener("click", () => {
    const section = button.dataset.go;
    showSection(section);
    $$(".nav-link").forEach(item => item.classList.toggle("active", item.dataset.section === section));
  }));
}

function showSection(id){
  $$(".section").forEach(section => section.classList.remove("active-section"));
  const target = $("#" + id);
  if (!target) return;
  target.classList.add("active-section");
  window.scrollTo({top: 0, behavior: "smooth"});
  setTimeout(() => target.querySelectorAll(".reveal").forEach((element,index) => setTimeout(() => element.classList.add("revealed"), index * 60)), 100);
}

function initializeCases(){
  $$(".case-btn").forEach(button => button.addEventListener("click", () => {
    ACTIVE_CASE = button.dataset.case;
    $$(".case-btn").forEach(item => item.classList.toggle("active", item.dataset.case === ACTIVE_CASE));
    configureCaseUI();
    calculateRecipe();
    showToast(`Caso cambiado: ${currentCase().name}`);
  }));
}

function configureCaseUI(){
  const data = currentCase();
  const activeMode = document.querySelector(".mode-btn.active")?.dataset.mode || "vasos";
  $("#resolverTitle").textContent = `Resolver ${data.name}`;
  $("#quantityLabel").textContent = data.quantityLabel;
  $("#quantityModeBtn").textContent = data.quantityModeLabel;
  $("#quantityHelp").textContent = `N representa el número de ${data.unitPlural}. Cada ${data.unitSingular} multiplica toda la receta base.`;
  $("#nInput").value = data.defaultN;
  $("#ingredientSelect").innerHTML = data.ingredients.map((name,index) => `<option value="${index}">${name} — ${data.units[index]}</option>`).join("");
  $("#ingredientInput").value = data.ingredientDefaults[0];
  $("#ingredientUnitHint").textContent = data.units[0];
  $("#baseBox").innerHTML = `
    <span class="mini-label">VECTOR BASE · ${data.space}</span>
    <div class="vector-display"><span>(</span>${data.base.map(value => `<b>${value}</b>`).join("")}<span>)<sup>T</sup></span></div>
    <p>${data.ingredients.join(" · ")}</p>
    <small>${data.description}</small>
  `;
  $$(".mode-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === activeMode));
  $("#vasosMode").classList.toggle("hidden", activeMode !== "vasos");
  $("#ingredienteMode").classList.toggle("hidden", activeMode !== "ingrediente");
  renderRecipeInfo();
}

function renderRecipeInfo(){
  const data = currentCase();
  const cards = data.ingredients.map((name,index) => `
    <div class="recipe-item">
      <div class="recipe-icon">${index === 0 ? "🌿" : index === 1 ? "🍫" : index === 2 ? "🍯" : index === 3 ? "🥛" : "🌼"}</div>
      <div class="recipe-main"><strong>${name}</strong><span>${formatNumber(data.base[index])} ${data.units[index]} por ${data.unitSingular}</span></div>
      <div class="recipe-price"><strong>Bs ${formatNumber(data.prices[index])}</strong><span>${data.priceLabels[index]}</span></div>
    </div>
  `).join("");
  $("#recipeInfo").innerHTML = `
    <div class="recipe-info-head">
      <div><span class="eyebrow">FICHA DE RECETA</span><h3>${data.name}</h3><p>${data.description}</p></div>
      <div class="recipe-space"><b>${data.space}</b><span>${data.subspace} · dim = ${data.dimension}</span></div>
    </div>
    <div class="recipe-items">${cards}</div>
    <div class="recipe-note">${data.sourceNote || "Precios base definidos en la guía del proyecto."}</div>
  `;
}

function syncIngredientDefault(){
  const data = currentCase();
  const index = parseInt($("#ingredientSelect").value, 10) || 0;
  $("#ingredientInput").value = data.ingredientDefaults[index];
  $("#ingredientUnitHint").textContent = data.units[index];
}

function initializeModes(){
  $$(".mode-btn").forEach(button => button.addEventListener("click", () => {
    $$(".mode-btn").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.mode;
    $("#vasosMode").classList.toggle("hidden", mode !== "vasos");
    $("#ingredienteMode").classList.toggle("hidden", mode !== "ingrediente");
    calculateRecipe();
  }));
}

function calculateRecipe(){
  const data = currentCase();
  const activeMode = document.querySelector(".mode-btn.active")?.dataset.mode || "vasos";
  let N;
  let ingredientIndex = null;
  let knownQuantity = null;

  if (activeMode === "vasos") {
    N = parseFloat($("#nInput").value);
  } else {
    ingredientIndex = parseInt($("#ingredientSelect").value, 10);
    knownQuantity = parseFloat($("#ingredientInput").value);
    if (!Number.isFinite(knownQuantity) || knownQuantity <= 0) return;
    N = knownQuantity / data.base[ingredientIndex];
  }

  if (!Number.isFinite(N) || N <= 0) return;

  const totalVector = data.base.map(value => value * N);
  const commercialVector = totalVector.map((value,index) => data.commercialize(value,index));
  const ingredientCosts = commercialVector.map((quantity,index) => quantity * data.prices[index]);
  const totalCost = ingredientCosts.reduce((sum,cost) => sum + cost, 0);
  const unitCost = totalCost / N;

  renderResult(N,totalVector,commercialVector,ingredientCosts,totalCost,unitCost,activeMode,data,ingredientIndex,knownQuantity);
  renderProcedure(N,totalVector,commercialVector,ingredientCosts,totalCost,unitCost,data,activeMode,ingredientIndex,knownQuantity);
}

function renderResult(N,totalVector,commercialVector,ingredientCosts,totalCost,unitCost,activeMode,data,ingredientIndex,knownQuantity){
  if(activeMode === "ingrediente"){
    $("#resultTitle").textContent = `Resultado proporcional: ${formatNumber(N)} ${N === 1 ? data.unitSingular : data.unitPlural}`;
    $("#totalCostLabel").textContent = "COSTO DE LA CANTIDAD INGRESADA";
    $("#unitCostLabel").textContent = `COSTO EQUIVALENTE POR ${data.unitSingular.toUpperCase()}`;
  } else {
    $("#resultTitle").textContent = `Para ${formatNumber(N)} ${N === 1 ? data.unitSingular : data.unitPlural}`;
    $("#totalCostLabel").textContent = "COSTO TOTAL DE LOS INGREDIENTES";
    $("#unitCostLabel").textContent = `COSTO REAL POR ${data.unitSingular.toUpperCase()}`;
  }

  $("#ingredientTable").innerHTML = totalVector.map((value,index) => `
    <div class="ingredient-row">
      <div><strong>${data.ingredients[index]}</strong><small>${formatNumber(commercialVector[index])} ${data.commercialUnits[index]} · precio ${formatMoney(data.prices[index])}/${data.commercialUnits[index]}</small></div>
      <div class="ingredient-result"><strong>${formatNumber(value)} ${data.units[index]}</strong><small class="ingredient-cost">${formatMoney(ingredientCosts[index])}</small></div>
    </div>
  `).join("");
  $("#totalCost").textContent = formatMoney(totalCost);
  $("#unitCost").textContent = formatMoney(unitCost);
}

function renderProcedure(N,totalVector,commercialVector,ingredientCosts,totalCost,unitCost,data,activeMode,ingredientIndex,knownQuantity){
  const vectorText = totalVector.map(formatNumber).join(", ");
  const commercialText = commercialVector.map(formatNumber).join(", ");
  const calculations = data.base.map((value,index) => `${data.ingredients[index]}: ${formatNumber(N)} × ${value} = ${formatNumber(value*N)} ${data.units[index]}`);
  const conversionText = data.ingredients.map((name,index) => `${name}: ${formatNumber(totalVector[index])} ${data.units[index]} → ${formatNumber(commercialVector[index])} ${data.commercialUnits[index]} (${data.conversions[index]})`).join("<br>");
  const productText = ingredientCosts.map((cost,index) => `${formatNumber(commercialVector[index])} × ${formatNumber(data.prices[index])}`).join(" + ");
  const inverseText = activeMode === "ingrediente" ? `N = x<sub>${ingredientIndex+1}</sub> / V<sub>base,${ingredientIndex+1}</sub> = ${formatNumber(knownQuantity)} / ${formatNumber(data.base[ingredientIndex])} = ${formatNumber(N)}` : `N = ${formatNumber(N)} porque se indicó la cantidad de ${data.unitPlural}.`;

  $("#procedureContent").innerHTML = `
    <div class="step"><span class="step-label">PASO 1</span><h4>Determinar el escalar N</h4><p>${inverseText}</p><div class="math-box">N = ${formatNumber(N)}</div></div>
    <div class="step"><span class="step-label">PASO 2</span><h4>Vector base y restricción</h4><p>El subespacio exige conservar las proporciones del vector base.</p><div class="math-box">${data.vectorLabel}<br>W = {N · V<sub>base</sub> : N ∈ ℝ}</div></div>
    <div class="step"><span class="step-label">PASO 3</span><h4>Combinación lineal</h4><p>Se aplica V<sub>T</sub> = N · V<sub>base</sub>.</p><div class="math-box">V<sub>T</sub> = ${formatNumber(N)} · (${data.base.join(", ")})<sup>T</sup> = (${vectorText})<sup>T</sup></div></div>
    <div class="step"><span class="step-label">PASO 4</span><h4>Cálculo de cada ingrediente</h4>${calculations.map(item => `<div class="math-box">${item}</div>`).join("")}</div>
    <div class="step"><span class="step-label">PASO 5</span><h4>Conversión a unidades comerciales</h4><p>${conversionText}</p><div class="math-box">V<sub>comercial</sub> = (${commercialText})<sup>T</sup></div></div>
    <div class="step"><span class="step-label">PASO 6</span><h4>Producto escalar de costos</h4><p>P = (${data.prices.join(", ")})<sup>T</sup></p><div class="math-box">C = V<sub>comercial</sub><sup>T</sup> · P = ${productText} = ${formatMoney(totalCost)}</div></div>
    <div class="step"><span class="step-label">PASO 7</span><h4>Costo por ${data.unitSingular}</h4><div class="math-box">C<sub>u</sub> = ${formatMoney(totalCost)} ÷ ${formatNumber(N)} = ${formatMoney(unitCost)} / ${data.unitSingular}</div></div>
  `;
}

function toggleProcedure(){
  const procedure = $("#procedure");
  procedure.classList.toggle("hidden");
  const visible = !procedure.classList.contains("hidden");
  $("#procedureBtn").textContent = visible ? "✕ Ocultar procedimiento" : "👁 Ver procedimiento paso a paso";
}

// ============================================================
// TEORÍA
// ============================================================
function initializeTheory(){
  $$(".theory-link").forEach(button => button.addEventListener("click", () => {
    $$(".theory-link").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderTheory(button.dataset.topic);
  }));
  renderTheory("r5");
}

function renderTheory(topic){
  const content = $("#theoryContent");
  const topics = {
    r5: `<span class="eyebrow">CONCEPTO 01</span><h3>Espacio vectorial R⁵</h3><p>R⁵ representa un vector con cinco coordenadas reales. En el batido, cada coordenada representa un ingrediente.</p><img class="theory-inline-image" src="assets/diagram-vector.svg" alt="Vector y componentes"><div class="formula-big">V = (x₁,x₂,x₃,x₄,x₅)<sup>T</sup></div><p><strong>x₁</strong> = Asaí · <strong>x₂</strong> = Copoazú · <strong>x₃</strong> = Miel · <strong>x₄</strong> = Leche de Castaña · <strong>x₅</strong> = Vainilla.</p>`,
    axiomas: `<span class="eyebrow">CONCEPTO 02</span><h3>Los 10 axiomas de R⁵</h3><p>Las operaciones de suma vectorial y multiplicación por escalares cumplen las propiedades necesarias para formar un espacio vectorial.</p><div class="axiom-list">${["Cerradura de la suma","Conmutatividad de la suma","Asociatividad de la suma","Existencia del vector cero","Existencia del inverso aditivo","Cerradura del producto por escalar","Distributividad respecto a la suma vectorial","Distributividad respecto a la suma de escalares","Asociatividad del producto por escalar","Identidad multiplicativa"].map((x,i)=>`<div class="axiom"><b>${i+1}.</b> ${x}</div>`).join("")}</div><div class="formula-big">u + v ∈ R⁵ &nbsp; | &nbsp; αu ∈ R⁵</div>`,
    w1: `<span class="eyebrow">CONCEPTO 03</span><h3>Subespacio W₁ · Escalar estándar</h3><p>La restricción del proyecto exige que todas las recetas mantengan las proporciones exactas del vector base.</p><img class="theory-inline-image" src="assets/diagram-subspace.svg" alt="Subespacio W1"><div class="formula-big">W₁ = { N(150,100,20,200,5)<sup>T</sup> : N ∈ R }</div><h4>Comprobación del subespacio</h4><p><strong>1. 0 ∈ W₁:</strong> con N = 0 se obtiene el vector nulo.</p><p><strong>2. Cerradura bajo suma:</strong> si u = N₁v y v = N₂v, entonces u+v=(N₁+N₂)v ∈ W₁.</p><p><strong>3. Cerradura bajo escalar:</strong> si u=Nv, entonces ku=(kN)v ∈ W₁.</p>`,
    base: `<span class="eyebrow">CONCEPTO 04</span><h3>Base e independencia lineal</h3><p>El conjunto generador contiene un único vector no nulo.</p><div class="formula-big">B<sub>W₁</sub> = { (150,100,20,200,5)<sup>T</sup> }</div><p>Si α(150,100,20,200,5)<sup>T</sup> = 0, la primera coordenada da 150α=0, por lo que α=0. Por tanto, el vector es linealmente independiente.</p><div class="callout">Una sola base es suficiente para generar todas las recetas proporcionales.</div>`,
    dimension: `<span class="eyebrow">CONCEPTO 05</span><h3>Dimensión del subespacio</h3><img class="theory-inline-image" src="assets/diagram-subspace.svg" alt="Representación de dimensión 1"><div class="formula-big">dim(W₁) = 1</div><p>El sistema necesita un único grado de libertad: el escalar <strong>N</strong>. Cuando N cambia, todas las coordenadas cambian de forma proporcional.</p>`,
    costos: `<span class="eyebrow">CONCEPTO 06</span><h3>Producto escalar y costos</h3><p>Primero se transforma el vector físico a unidades comerciales y luego se multiplica por el vector de precios.</p><img class="theory-inline-image" src="assets/diagram-costos.svg" alt="Producto escalar para costos"><div class="formula-big">C = V<sub>comercial</sub><sup>T</sup> · P</div><p>En el batido, P=(35,40,50,18,120)<sup>T</sup>. En Majadito, P=(9,65,7,1)<sup>T</sup>.</p>`,
    majadito: `<span class="eyebrow">CASO COMPLEMENTARIO</span><h3>Majadito con Charque · R⁴</h3><img class="theory-inline-image" src="assets/food-majadito.svg" alt="Ilustración del Majadito"><p>Este es un caso complementario basado en el informe de referencia. La cantidad se expresa en <strong>platos</strong>, no en vasos.</p><div class="formula-big">V<sub>base</sub> = (100 g, 200 g, 1 un, 1 un)<sup>T</sup></div><p>Por cada plato: <strong>100 g de arroz</strong>, <strong>200 g de charque</strong>, <strong>1 plátano</strong> y <strong>1 huevo</strong>.</p><div class="price-strip"><span>Arroz: 9 Bs/kg</span><span>Charque: 65 Bs/kg</span><span>Plátano: 7 Bs/kg</span><span>Huevo: 1 Bs/un</span></div><p>Para el ejemplo del informe: <strong>N=50 platos</strong>.</p><div class="math-box">V<sub>T</sub>=(5000 g,10000 g,50 un,50 un)<sup>T</sup><br>V<sub>comercial</sub>=(5 kg,10 kg,7,5 kg,50 un)<sup>T</sup><br>CostoTotal=797,50 Bs<br>CostoPlato=15,95 Bs/plato</div>`
  };
  content.innerHTML = topics[topic] || topics.r5;
}

// ============================================================
// EJERCICIOS
// ============================================================
function initializeExercises(){
  $$(".exercise-btn").forEach(button => button.addEventListener("click", () => {
    const N = parseFloat(button.dataset.n);
    const data = button.dataset.case === "majadito" ? CASES.majadito : CASES.batido;
    const card = button.closest(".exercise-card");
    const answer = card.querySelector(".exercise-answer");
    const vector = data.base.map(value => value * N);
    const commercial = vector.map((v,i)=>data.commercialize(v,i));
    const costs = commercial.map((v,i)=>v*data.prices[i]);
    const total = costs.reduce((a,b)=>a+b,0);
    answer.innerHTML = `<strong>Procedimiento:</strong><br><br>V<sub>T</sub> = ${N} · (${data.base.join(",")})<sup>T</sup><br><br><strong>Resultado:</strong><br>V<sub>T</sub> = (${vector.map(formatNumber).join(", ")})<sup>T</sup><br><br>${vector.map((value,index) => `${data.ingredients[index]}: ${formatNumber(value)} ${data.units[index]}<br>`).join("")}<br><strong>Costo total:</strong> ${formatMoney(total)}<br><strong>Costo por ${data.unitSingular}:</strong> ${formatMoney(total/N)}`;
    answer.classList.remove("hidden");
    button.textContent = "✓ Resuelto";
    showToast("Ejercicio resuelto ✓");
  }));
}

function activateRevealAnimation(){
  if (!window.IntersectionObserver) { $$(".reveal").forEach(e => e.classList.add("revealed")); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("revealed"); }), {threshold:.12});
  $$(".reveal").forEach(element => observer.observe(element));
}

function createWaterRipples(){
  $$(".primary-btn, .case-btn, .theory-link, .mode-btn, .outline-btn, .google-images-btn").forEach(button => {
    button.addEventListener("pointerdown", e => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "water-ripple";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      button.appendChild(ripple);
      setTimeout(()=>ripple.remove(),650);
    });
  });
}

function formatNumber(number){ return Number(number).toLocaleString("es-BO", {maximumFractionDigits:3}); }
function formatMoney(number){ return "Bs " + Number(number).toLocaleString("es-BO", {minimumFractionDigits:2,maximumFractionDigits:2}); }
function showToast(message){ const toast=$("#toast"); toast.textContent=message; toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),2200); }

// Imágenes externas: si GitHub Pages o el navegador bloquean una fuente remota,
// se reemplaza automáticamente por el diagrama local equivalente.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback && img.src !== new URL(img.dataset.fallback, document.baseURI).href) {
        img.src = img.dataset.fallback;
      }
    }, { once: true });
  });
});
