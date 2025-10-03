# Form Filler - Preenchedor Automático

Extensão para Chrome que preenche automaticamente formulários web com dados de teste, facilitando o desenvolvimento e testes de aplicações.

## 📋 Funcionalidades

- **Detecção Automática de Formulários**: Identifica todos os formulários na página atual
- **3 Modos de Preenchimento**:
  - **Automático**: Detecta inteligentemente o tipo de campo e preenche com dados apropriados
  - **Apenas Texto**: Preenche todos os campos com valores de texto aleatórios
  - **Apenas Números**: Preenche com números aleatórios (quantidade de dígitos configurável)

## 🚀 Instalação

1. Clone ou baixe este repositório
2. Abra o Chrome e acesse `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

## 💡 Como Usar

1. Navegue até uma página com formulários
2. Clique no ícone da extensão na barra de ferramentas
3. Selecione o formulário que deseja preencher
4. Escolha um modo de preenchimento:
   - **Automático**: Preenche campos de email com emails, telefones com números de telefone, etc.
   - **Apenas Texto**: Preenche tudo com texto aleatório
   - **Apenas Números**: Preenche com números (configure a quantidade de dígitos)

## 🔍 Detecção Inteligente (Modo Automático)

O modo automático reconhece diversos tipos de campos:

- **Email**: Preenche com endereços de email válidos
- **Telefone**: Preenche com números de telefone formatados
- **CPF/CNPJ**: Gera números com quantidade correta de dígitos
- **Data/Hora**: Preenche com datas e horários válidos
- **URL**: Preenche com URLs de exemplo
- **Nome/Endereço**: Detecta por palavras-chave e preenche adequadamente
- **Textarea**: Preenche com textos mais longos
- **Select/Checkbox/Radio**: Seleciona opções aleatoriamente
- **Color/Range**: Preenche com valores apropriados para cada tipo

## 🎯 Casos de Uso

- **Desenvolvimento**: Teste rapidamente formulários durante o desenvolvimento
- **QA/Testes**: Agilize testes de validação e integração
- **Demonstrações**: Preencha formulários rapidamente em demos

## 🛠️ Tecnologias

- JavaScript (Vanilla)
- Chrome Extension Manifest V3
- Chrome Scripting API

## 📝 Estrutura do Projeto

```
form-filler/
├── manifest.json      # Configuração da extensão
├── popup.html         # Interface do popup
├── popup.js           # Lógica de detecção e preenchimento
├── popup.css          # Estilos do popup
└── icon.png           # Ícone da extensão
```

## ⚙️ Permissões

A extensão requer as seguintes permissões:

- `activeTab`: Para acessar a aba atual
- `scripting`: Para executar scripts na página e preencher formulários

## 🔒 Privacidade

Esta extensão:

- ✅ Funciona apenas quando você clica no ícone
- ✅ Não coleta ou envia dados para servidores externos
- ✅ Não armazena informações pessoais
- ✅ Executa todo o processamento localmente no navegador

## 👨‍💻 Autor

**Raphael Azeredo**

- Email: rgazeredo@gmail.com
- GitHub: [@rgazeredo](https://github.com/rgazeredo)
