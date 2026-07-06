const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../content');
const outputDirName = 'output-dist';
const outputDirPath = path.join(targetDir, outputDirName);

console.log('Procurando arquivos .tex no diretório content...');

try {
  // Garante que a pasta de destino exista
  if (!fs.existsSync(outputDirPath)) fs.mkdirSync(outputDirPath);
  
  const files = fs.readdirSync(targetDir);
  const texFiles = files.filter(f => f.endsWith('.tex'));
  
  if (texFiles.length === 0) {
    console.log('Nenhum arquivo .tex encontrado para compilar.');
    process.exit(0);
  }
  
  console.log(`Encontrado(s) ${texFiles.length} arquivo(s) .tex para compilar.\n`);
  
  texFiles.forEach(texFile => {
    const texPath = path.join(targetDir, texFile);
    console.log(`Compilando ${texFile} usando latexmk...`);
    
    try {
      // Adicionamos a flag -outdir para que tudo (incluindo os arquivos temporários)
      // seja gerado e salvo na pasta 'output-dist'
      execSync(`latexmk -pdf -interaction=nonstopmode -outdir="${outputDirName}" -cd "${texPath}"`, {stdio: 'inherit'});
      
      console.log(`\n Sucesso! O PDF de ${texFile} foi exportado para content/${outputDirName}/`);
    } catch (error) {
      console.error(`\nErro ao compilar ${texFile}. Verifique a saída acima.`);
    }
  });
  
} catch (err) {
  console.error('Erro ao acessar o diretório:', err.message);
}
