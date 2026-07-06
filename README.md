# Projeto LaTeX - Matemática Discreta

Este é um ambiente moderno e automatizado para a escrita de documentos LaTeX, utilizando o template da Sociedade Brasileira de Computação (SBC). O projeto inclui scripts em Node.js para facilitar a compilação, o gerenciamento de dependências e manter a pasta do projeto sempre limpa.

## 📂 Estrutura do Projeto

```text
tex-matematica-discreta/
├── content/              # Diretório principal onde você escreve o artigo
│   ├── sbc-template.tex  # Arquivo LaTeX principal
│   ├── sbc-template.sty  # Regras de formatação (SBC)
│   ├── sbc-template.bib  # Banco de referências bibliográficas
│   ├── sbc.bst           # Estilo das bibliografias
│   └── output-dist/      # (Autogerada) Recebe o PDF compilado e arquivos temporários
├── scripts/              # Scripts de automação Node.js
│   ├── compile.js        # Script de compilação via latexmk
│   └── clean.js          # Script inteligente de limpeza
├── package.json          # Configuração dos atalhos (NPM Scripts)
└── README.md             # Esta documentação
```

## 🚀 Requisitos

Certifique-se de ter os seguintes programas instalados no seu computador para usar todas as funções:
1. Node.js e NPM: Utilizados para rodar os scripts de automação.
2. Distribuição LaTeX (ex: MiKTeX, TeX Live): Certifique-se de que o comando `latexmk` está disponível no terminal. Ele é a principal engine de compilação escolhida pois processa todas as passagens de referências e bibliografias (`bibtex`) de forma 100% automática.

## 🛠️ Comandos Disponíveis

Você não precisa decorar os caminhos dos scripts. Na raiz do projeto, use os comandos padrão do NPM para gerenciar o documento:

### Compilar o documento
```bash
npm run compile
```
- O que faz: Entra na pasta `content` e compila os arquivos `.tex` encontrados.
- Destino Limpo: Graças ao gerenciamento do script, seu PDF final e os resíduos do LaTeX (`.aux`, `.log`, `.bbl`, etc) são isolados e salvos diretamente na pasta `content/output-dist`, mantendo a raiz do seu texto organizada.

### Limpeza Inteligente
```bash
npm run clean
```
- O que faz: Roda o faxineiro do projeto.
- Remoção de resíduos: Esvazia os resíduos temporários acumulados na pasta `output-dist`.
- Varredura Inteligente (Garbage Collector): O script lê o seu código fonte `.tex` e analisa exatamente quais imagens (`\includegraphics`), pacotes (`\usepackage`) e referências você está utilizando. Se você apagar uma imagem do seu código, o script perceberá que ela não tem mais utilidade e a deletará fisicamente do seu computador, mantendo o projeto o mais leve possível.

### Construir e Limpar (Recomendado)
```bash
npm run build
```
- O que faz: A união perfeita. Executa o `compile` atualizando o seu PDF e, na sequência, roda o `clean` para varrer os rastros da compilação e imagens não utilizadas, entregando apenas o resultado final limpo.

## 💡 Dicas de Uso
- Se você adicionar um novo arquivo `.tex` avulso dentro de `content`, o `npm run compile` o identificará e compilará um PDF separado para ele de forma automática.
- Para imagens e dependências, tome o cuidado de só manter no diretório `content` o que você efetivamente for usar no texto, pois a varredura inteligente do script de limpeza é implacável com arquivos sem referência!
