// Seleção dos elementos do DOM de forma limpa
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const btnCalculate = document.getElementById("btn-calculate");

const resultSection = document.getElementById("result-section");
const imcValueDisplay = document.getElementById("imc-value");
const imcStatusDisplay = document.getElementById("imc-status");
const imcPointer = document.getElementById("imc-pointer");

/* ==========================================================================
   CONTROLE DO TEMA (CLARO / ESCURO)
   ========================================================================== */
themeToggle.addEventListener("click", () => {
  // Verifica o tema ativo no atributo data-theme do HTML
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Atualiza o atributo no HTML para disparar as cores CSS
  htmlElement.setAttribute("data-theme", newTheme);

  // Altera dinamicamente o ícone do botão (Sol para escuro, Lua para claro)
  if (newTheme === "dark") {
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line>`;
  } else {
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
});

/* ==========================================================================
   LÓGICA DO CÁLCULO DE IMC
   ========================================================================== */
function calculateIMC() {
  // Conversão explícita para valores flutuantes
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);

  // Validação básica para evitar divisões por zero ou valores vazios
  if (!weight || !height || weight <= 0 || height <= 0) {
    alert("Por favor, insira valores válidos de peso e altura.");
    return;
  }

  // Aplicação da fórmula oficial do IMC
  const imc = weight / (height * height);

  // Formatação do número para exibir apenas 1 casa decimal (ex: 23.4)
  imcValueDisplay.textContent = imc.toFixed(1);

  // Variáveis que armazenarão as propriedades visuais do resultado
  let statusText = "";
  let statusColor = "";
  let pointerPercentage = 0; // Controlará onde o ponteiro se posicionará na régua (0% a 100%)

  // Classificação conforme diretrizes da OMS e cálculo do posicionamento visual
  if (imc < 18.5) {
    statusText = "Abaixo do Peso";
    statusColor = "#3b82f6"; // Azul
    // Mapeia proporcionalmente o IMC de 10 a 18.5 para o primeiro quadrante (0% a 25%)
    pointerPercentage = Math.max(0, ((imc - 10) / (18.5 - 10)) * 25);
  } else if (imc >= 18.5 && imc < 25.0) {
    statusText = "Peso Normal";
    statusColor = "#10b981"; // Verde
    // Mapeia de 18.5 a 25 para o segundo quadrante (25% a 50%)
    pointerPercentage = 25 + ((imc - 18.5) / (25 - 18.5)) * 25;
  } else if (imc >= 25.0 && imc < 30.0) {
    statusText = "Sobrepeso";
    statusColor = "#f59e0b"; // Amarelo
    // Mapeia de 25 a 30 para o terceiro quadrante (50% a 75%)
    pointerPercentage = 50 + ((imc - 25) / (30 - 25)) * 25;
  } else {
    statusText = "Obesidade";
    statusColor = "#ef4444"; // Vermelho
    // Mapeia de 30 a 40 (ou mais) para o último quadrante (75% a 100%)
    pointerPercentage = 75 + Math.min(25, ((imc - 30) / (40 - 30)) * 25);
  }

  // Atualização dos elementos gráficos da interface
  imcStatusDisplay.textContent = statusText;
  imcStatusDisplay.style.backgroundColor = statusColor;

  // Move o ponteiro de forma suave usando CSS transform
  imcPointer.style.left = `${pointerPercentage}%`;

  // Revela a seção de resultados removendo a classe utilitária de ocultação
  resultSection.classList.remove("hidden");
}

// Vincula a função de cálculo ao clique do botão
btnCalculate.addEventListener("click", calculateIMC);

// Permite calcular também ao pressionar a tecla "Enter" dentro de qualquer input
[weightInput, heightInput].forEach((input) => {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      calculateIMC();
    }
  });
});
