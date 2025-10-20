// script.js - versão reorganizada

// --- CONFIGURAÇÃO ---
const API_URL = "http://localhost:3000/api/plantas";
const DEBOUNCE_MS = 300;

// --- HELPERS ---
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const debounce = (fn, wait = DEBOUNCE_MS) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

// --- CACHE DO DOM ---
const DOM = {
  catalogo: qs("#catalogo-plantas"),
  filtrosContainer: qs("aside.filtros"),
  btnLimpar: qs(".btn-limpar"),
  buscaInput: qs("#busca"),
  luzSelect: qs("#nivel-de-luz"),
  regaSelect: qs("#filtro-rega"),
  tipoSelect: qs("#filtro-tipo"),
};

// --- API / FETCH ---
function buildUrlFromFilters(filters) {
  const params = new URLSearchParams();
  if (filters.busca) params.append("busca", filters.busca);
  if (filters.luz) params.append("luz", filters.luz);
  if (filters.rega) params.append("rega", filters.rega);
  if (filters.tipo) params.append("tipo", filters.tipo);
  const qsStr = params.toString();
  return qsStr ? `${API_URL}?${qsStr}` : API_URL;
}

async function fetchPlantas(filters = {}) {
  const url = buildUrlFromFilters(filters);
  console.log("Buscando na API:", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao carregar dados da API");
  return res.json();
}

// --- RENDER ---
function clearCatalog() {
  DOM.catalogo.innerHTML = "";
}

function showMessage(msg, className = "no-results") {
  DOM.catalogo.innerHTML = `<p class="${className}">${msg}</p>`;
}

function renderizarPlantas(plantas = []) {
  clearCatalog();

  if (!Array.isArray(plantas) || plantas.length === 0) {
    showMessage("😢 Nenhuma planta encontrada com esses filtros.");
    return;
  }

  const fragment = document.createDocumentFragment();

  plantas.forEach((planta) => {
    const card = document.createElement("div");
    card.className = "card";

    const luzTxt = planta.luz ? planta.luz.replace("-", " ") : "";
    const regaTxt = capitalize(planta.rega);
    const tipoTxt = capitalize(planta.tipo);

    card.innerHTML = `
      <div class="card-img"><img src="${planta.imagem}" alt="${planta.nome}"></div>
      <div class="card-body">
        <h2 class="card-titulo">${planta.nome}</h2>
        <p class="card-descricao">${planta.descricao}</p>
        <div class="card-info">
          <span class="info-tag" title="Nível de Luz">${luzTxt}</span>
          <span class="info-tag" title="Frequência de Rega">${regaTxt}</span>
          <span class="info-tag tipo" title="Tipo">${tipoTxt}</span>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  DOM.catalogo.appendChild(fragment);
}

// --- FILTROS / ESTADO ---
function lerFiltrosDoDOM() {
  return {
    busca: DOM.buscaInput.value.trim(),
    luz: DOM.luzSelect.value,
    rega: DOM.regaSelect.value,
    tipo: DOM.tipoSelect.value,
  };
}

async function aplicarFiltros() {
  try {
    const filtros = lerFiltrosDoDOM();
    const plantas = await fetchPlantas(filtros);
    renderizarPlantas(plantas);
  } catch (err) {
    console.error(err);
    showMessage("Erro ao carregar as plantas. Tente novamente mais tarde.", "error");
  }
}

function limparFiltros() {
  const inputs = DOM.filtrosContainer.querySelectorAll("select, input");
  inputs.forEach((i) => (i.value = ""));
  aplicarFiltros();
}

// --- EVENTOS / INICIALIZAÇÃO ---
function attachEventListeners() {
  // Debounce na busca de texto para evitar muitas requisições
  const buscaDebounced = debounce(aplicarFiltros, DEBOUNCE_MS);
  DOM.buscaInput.addEventListener("input", buscaDebounced);

  // Mudanças em selects disparam imediatamente
  [DOM.luzSelect, DOM.regaSelect, DOM.tipoSelect].forEach((sel) =>
    sel.addEventListener("change", aplicarFiltros)
  );

  DOM.btnLimpar.addEventListener("click", (e) => {
    e.preventDefault();
    limparFiltros();
  });
}

function init() {
  attachEventListeners();
  // Primeira carga: sem filtros (traz tudo)
  aplicarFiltros();
}

document.addEventListener("DOMContentLoaded", init);
