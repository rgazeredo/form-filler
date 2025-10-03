// Elementos DOM
const formSelect = document.getElementById("formSelect");
const optionsSection = document.getElementById("optionsSection");
const textOnlyBtn = document.getElementById("textOnly");
const numbersOnlyBtn = document.getElementById("numbersOnly");
const automaticBtn = document.getElementById("automatic");
const numberOptions = document.getElementById("numberOptions");
const digitCountInput = document.getElementById("digitCount");
const statusDiv = document.getElementById("status");

let forms = [];

// Carregar formulários da página ao abrir o popup
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: detectForms,
    });

    forms = results[0].result;
    populateFormSelect(forms);
  } catch (error) {
    showStatus("Erro ao detectar formulários", "error");
  }
});

// Função para detectar formulários na página
function detectForms() {
  const forms = document.querySelectorAll("form");
  const formData = [];

  forms.forEach((form, index) => {
    const inputs = form.querySelectorAll("input, textarea, select");
    const formInfo = {
      index: index,
      id: form.id || `Form ${index + 1}`,
      name: form.name || form.id || `Formulário ${index + 1}`,
      fields: inputs.length,
      className: form.className || "Sem classe",
    };

    // Tentar identificar o formulário pelo primeiro label ou placeholder
    const firstInput = form.querySelector("input[placeholder], input[id]");
    if (firstInput) {
      if (firstInput.placeholder) {
        formInfo.description = firstInput.placeholder;
      } else if (firstInput.id) {
        const label = form.querySelector(`label[for="${firstInput.id}"]`);
        if (label) {
          formInfo.description = label.textContent.trim();
        }
      }
    }

    formData.push(formInfo);
  });

  return formData;
}

// Popular o select com os formulários encontrados
function populateFormSelect(forms) {
  formSelect.innerHTML = "";

  if (forms.length === 0) {
    formSelect.innerHTML = "Nenhum formulário encontrado";
    return;
  }

  const option = document.createElement("option");
  option.value = "";
  option.textContent = "Selecione um formulário";
  formSelect.appendChild(option);

  forms.forEach((form) => {
    const option = document.createElement("option");
    option.value = form.index;
    option.textContent = `${form.name} (${form.fields} campos)`;
    if (form.description) {
      option.textContent += ` - ${form.description.substring(0, 30)}...`;
    }
    formSelect.appendChild(option);
  });
}

// Evento de seleção de formulário
formSelect.addEventListener("change", (e) => {
  if (e.target.value !== "") {
    optionsSection.style.display = "block";
    statusDiv.style.display = "none";
  } else {
    optionsSection.style.display = "none";
  }
});

// Evento para mostrar opções de números
numbersOnlyBtn.addEventListener("click", () => {
  numberOptions.style.display = "block";
  setTimeout(() => {
    fillForm("numbers");
  }, 100);
});

// Evento para preencher apenas com texto
textOnlyBtn.addEventListener("click", () => {
  numberOptions.style.display = "none";
  fillForm("text");
});

// Evento para preenchimento automático
automaticBtn.addEventListener("click", () => {
  numberOptions.style.display = "none";
  fillForm("automatic");
});

// Função principal de preenchimento
async function fillForm(mode) {
  const formIndex = parseInt(formSelect.value);
  if (isNaN(formIndex)) {
    showStatus("Selecione um formulário", "error");
    return;
  }

  const digitCount = parseInt(digitCountInput.value) || 5;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: fillFormFields,
      args: [formIndex, mode, digitCount],
    });

    showStatus("Formulário preenchido com sucesso!", "success");
  } catch (error) {
    showStatus("Erro ao preencher formulário", "error");
  }
}

// Função que executa no contexto da página para preencher os campos
function fillFormFields(formIndex, mode, digitCount) {
  const forms = document.querySelectorAll("form");
  const form = forms[formIndex];

  if (!form) return;

  // Dados de exemplo
  const sampleData = {
    texts: [
      "João Silva",
      "Maria Santos",
      "Pedro Oliveira",
      "Ana Costa",
      "Lorem ipsum dolor sit amet",
      "Teste de dados",
      "Exemplo de texto",
      "Rua das Flores",
      "Avenida Principal",
      "Praça Central",
    ],
    emails: [
      "teste@example.com",
      "usuario@teste.com",
      "dev@email.com",
      "joao@empresa.com",
      "maria@gmail.com",
    ],
    phones: [
      "(11) 98765-4321",
      "(21) 99999-8888",
      "(47) 3333-4444",
      "11987654321",
      "21999998888",
    ],
    urls: [
      "https://www.example.com",
      "http://teste.com.br",
      "https://github.com/usuario",
      "www.site.com.br",
    ],
    dates: [
      "2024-01-15",
      "2023-12-25",
      "2024-06-30",
      "1990-05-20",
      "2000-01-01",
    ],
  };

  // Função para gerar número aleatório
  function generateNumber(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  // Função para gerar texto aleatório
  function generateText(length = 20) {
    const words = [
      "lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "do",
      "eiusmod",
      "tempor",
      "incididunt",
      "ut",
      "labore",
      "et",
      "dolore",
      "magna",
    ];
    let result = "";
    const wordCount = Math.ceil(length / 5);
    for (let i = 0; i < wordCount; i++) {
      result += words[Math.floor(Math.random() * words.length)] + " ";
    }
    return result.trim().substring(0, length);
  }

  // Função para obter valor aleatório de array
  function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Processar todos os campos do formulário
  const inputs = form.querySelectorAll("input, textarea, select");

  inputs.forEach((field) => {
    // Pular campos desabilitados ou readonly
    if (field.disabled || field.readOnly) return;

    // Pular campos hidden e submit
    if (
      field.type === "hidden" ||
      field.type === "submit" ||
      field.type === "button"
    )
      return;

    let value = "";

    if (mode === "text") {
      // Modo apenas texto
      if (field.tagName === "SELECT") {
        const options = field.querySelectorAll("option");
        if (options.length > 1) {
          field.selectedIndex =
            Math.floor(Math.random() * (options.length - 1)) + 1;
        }
      } else if (field.type === "checkbox" || field.type === "radio") {
        field.checked = Math.random() > 0.5;
      } else {
        value = getRandomValue(sampleData.texts);
      }
    } else if (mode === "numbers") {
      // Modo apenas números
      if (field.tagName === "SELECT") {
        const options = field.querySelectorAll("option");
        if (options.length > 1) {
          field.selectedIndex =
            Math.floor(Math.random() * (options.length - 1)) + 1;
        }
      } else if (field.type === "checkbox" || field.type === "radio") {
        field.checked = Math.random() > 0.5;
      } else {
        value = generateNumber(digitCount);
      }
    } else if (mode === "automatic") {
      // Modo automático - detecta o tipo do campo
      const fieldType = field.type ? field.type.toLowerCase() : "text";
      const fieldName = (
        field.name +
        field.id +
        field.placeholder
      ).toLowerCase();

      if (field.tagName === "SELECT") {
        const options = field.querySelectorAll("option");
        if (options.length > 1) {
          field.selectedIndex =
            Math.floor(Math.random() * (options.length - 1)) + 1;
        }
      } else if (
        fieldType === "email" ||
        fieldName.includes("email") ||
        fieldName.includes("e-mail")
      ) {
        value = getRandomValue(sampleData.emails);
      } else if (
        fieldType === "tel" ||
        fieldName.includes("phone") ||
        fieldName.includes("telefone") ||
        fieldName.includes("celular")
      ) {
        value = getRandomValue(sampleData.phones);
      } else if (
        fieldType === "url" ||
        fieldName.includes("website") ||
        fieldName.includes("site") ||
        fieldName.includes("url")
      ) {
        value = getRandomValue(sampleData.urls);
      } else if (
        fieldType === "date" ||
        fieldName.includes("data") ||
        fieldName.includes("date")
      ) {
        value = getRandomValue(sampleData.dates);
      } else if (fieldType === "datetime-local") {
        value = getRandomValue(sampleData.dates) + "T12:00";
      } else if (fieldType === "time") {
        value = "14:30";
      } else if (
        fieldType === "number" ||
        fieldName.includes("idade") ||
        fieldName.includes("age") ||
        fieldName.includes("numero") ||
        fieldName.includes("cpf") ||
        fieldName.includes("cnpj")
      ) {
        value = generateNumber(
          fieldName.includes("cpf") ? 11 : fieldName.includes("cnpj") ? 14 : 5
        );
      } else if (fieldType === "checkbox" || fieldType === "radio") {
        field.checked = Math.random() > 0.5;
      } else if (fieldType === "color") {
        value = "#" + Math.floor(Math.random() * 16777215).toString(16);
      } else if (fieldType === "range") {
        const min = parseInt(field.min) || 0;
        const max = parseInt(field.max) || 100;
        value = Math.floor(Math.random() * (max - min + 1)) + min;
      } else if (
        field.tagName === "TEXTAREA" ||
        fieldName.includes("mensagem") ||
        fieldName.includes("message") ||
        fieldName.includes("comentario")
      ) {
        value =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
          generateText(100);
      } else if (fieldName.includes("nome") || fieldName.includes("name")) {
        value = getRandomValue(sampleData.texts.slice(0, 4));
      } else if (
        fieldName.includes("endereco") ||
        fieldName.includes("address") ||
        fieldName.includes("rua")
      ) {
        value = getRandomValue(sampleData.texts.slice(7, 10));
      } else {
        // Campo de texto genérico
        value = getRandomValue(sampleData.texts);
      }
    }

    // Aplicar o valor ao campo
    if (value && field.type !== "checkbox" && field.type !== "radio") {
      field.value = value;

      // Disparar eventos para garantir que validações sejam acionadas
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

// Função para mostrar status
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = "block";

  setTimeout(() => {
    statusDiv.style.display = "none";
  }, 3000);
}
