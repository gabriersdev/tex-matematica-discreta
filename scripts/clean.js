const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../content');
const outputDirName = 'output-dist';
const outputDirPath = path.join(targetDir, outputDirName);

// Extensões de arquivos temporários gerados pelo LaTeX
const extensionsToDelete = [
  '.aux', '.bbl', '.blg', '.dvi', '.fdb_latexmk',
  '.fls', '.log', '.synctex.gz', '.pdf'
];

console.log('Iniciando limpeza inteligente no diretório content...');

fs.readdir(targetDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler o diretório:', err);
    return;
  }

  // 1. Identificar todos os arquivos .tex
  const texFiles = files.filter(f => f.endsWith('.tex'));

  // Set para guardar os arquivos que são usados e não devem ser apagados
  const usedFiles = new Set();
  texFiles.forEach(f => usedFiles.add(f));

  // Função auxiliar para marcar arquivo como usado
  const addUsedFile = (fileName) => {
    if (!fs.existsSync(path.join(targetDir, fileName))) {
       const possibleExts = ['.jpg', '.png', '.pdf', '.eps', '.tex'];
       for (const ext of possibleExts) {
           if (fs.existsSync(path.join(targetDir, fileName + ext))) {
               usedFiles.add(fileName + ext);
               return;
           }
       }
    }
    usedFiles.add(fileName);
  };

  // 2. Ler os arquivos .tex e extrair dependências
  texFiles.forEach(texFile => {
    const texPath = path.join(targetDir, texFile);
    const content = fs.readFileSync(texPath, 'utf8');

    const imgRegex = /\\includegraphics(?:\[.*?\])?\{([^}]+)\}/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) addUsedFile(match[1]);

    const bibRegex = /\\bibliography\{([^}]+)\}/g;
    while ((match = bibRegex.exec(content)) !== null) {
      match[1].split(',').forEach(bib => addUsedFile(bib.trim() + '.bib'));
    }

    const bstRegex = /\\bibliographystyle\{([^}]+)\}/g;
    while ((match = bstRegex.exec(content)) !== null) addUsedFile(match[1] + '.bst');

    const styRegex = /\\usepackage(?:\[.*?\])?\{([^}]+)\}/g;
    while ((match = styRegex.exec(content)) !== null) {
      match[1].split(',').forEach(pkg => addUsedFile(pkg.trim() + '.sty'));
    }
    
    const inputRegex = /\\(?:input|include)\{([^}]+)\}/g;
    while ((match = inputRegex.exec(content)) !== null) {
      let fName = match[1];
      if (!fName.endsWith('.tex')) fName += '.tex';
      addUsedFile(fName);
    }
  });

  let deletedCount = 0;

  // 3. Limpa arquivos desnecessários na pasta content original (raiz)
  files.forEach(file => {
    if (file === outputDirName) return; // Ignora o output-dist agora, vamos tratar ele separadamente depois

    const filePath = path.join(targetDir, file);
    const isTemp = extensionsToDelete.some(e => file.endsWith(e));
    const isUsed = usedFiles.has(file);
    const isDir = fs.lstatSync(filePath).isDirectory();

    if (isTemp || (!isUsed && !isDir)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deletado da origem: ${file}`);
        deletedCount++;
      } catch (err) {
        console.error(`Erro ao deletar ${file}:`, err.message);
      }
    }
  });

  // 4. Limpa tudo dentro da pasta output-dist
  if (fs.existsSync(outputDirPath)) {
    const outputFiles = fs.readdirSync(outputDirPath);
    outputFiles.forEach(file => {
      // Como o output-dist só guarda artefatos gerados, podemos apagar tudo
      // ou apenas os de extensão listada (vamos manter a regra de extensão para segurança)
      const isTemp = extensionsToDelete.some(e => file.endsWith(e));
      if (isTemp) {
        try {
          fs.unlinkSync(path.join(outputDirPath, file));
          console.log(`Deletado de ${outputDirName}: ${file}`);
          deletedCount++;
        } catch (err) {
          console.error(`Erro ao deletar ${file} do output-dist:`, err.message);
        }
      }
    });
  }

  console.log(`\nLimpeza concluída! ${deletedCount} arquivo(s) removido(s).`);
});
