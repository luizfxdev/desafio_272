// ============================================
// CONFIGURAÇÃO DOS MAPAS E DADOS
// ============================================
// 5 mapas com matrizes e sequências diferentes
const maps = [
  {
    matrix: [
      [7, 8, 3, 4, 5],
      [5, 9, 8, 3, 7],
      [1, 5, 7, 8, 9],
      [2, 3, 5, 8, 6],
      [9, 2, 5, 3, 4]
    ],
    sequence: [9, 7, 8],
    expectedOutput: '(1, 1, diagonal)',
    title: 'Matriz do Orbe Flamejante',
    difficulty: 'Iniciante'
  },
  {
    matrix: [
      [2, 0, 1, 9],
      [1, 5, 2, 8],
      [3, 2, 5, 8],
      [4, 1, 8, 7]
    ],
    sequence: [2, 5, 8],
    expectedOutput: '(2, 1, horizontal)',
    title: 'Matriz das Chamas Sussurrantes',
    difficulty: 'Fácil'
  },
  {
    matrix: [
      [3, 7, 2, 9, 4],
      [8, 4, 6, 1, 5],
      [5, 9, 3, 7, 2],
      [2, 1, 8, 4, 6],
      [6, 3, 5, 9, 1]
    ],
    sequence: [4, 3, 4],
    expectedOutput: '(1, 1, diagonal)',
    title: 'Matriz do Pesadelo Ardente',
    difficulty: 'Médio'
  },
  {
    matrix: [
      [6, 3, 9, 2, 7, 1],
      [1, 8, 5, 7, 4, 3],
      [4, 2, 8, 3, 6, 9],
      [9, 7, 1, 6, 2, 5],
      [3, 5, 4, 9, 8, 7],
      [2, 6, 7, 1, 3, 4]
    ],
    sequence: [8, 3, 2],
    expectedOutput: '(1, 1, diagonal)',
    title: 'Matriz do Vazio Ígneo',
    difficulty: 'Difícil'
  },
  {
    matrix: [
      [8, 3, 1, 2, 9, 5, 7],
      [4, 8, 3, 1, 6, 2, 4],
      [9, 4, 8, 3, 2, 7, 1],
      [1, 2, 9, 4, 5, 8, 6],
      [7, 6, 5, 2, 8, 3, 9],
      [3, 1, 7, 9, 4, 6, 2],
      [5, 9, 2, 6, 1, 7, 8]
    ],
    sequence: [8, 3, 1],
    expectedOutput: '(0, 1, vertical)',
    title: 'Matriz do Destino Rubescente',
    difficulty: 'Expert'
  }
];

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let currentMapIndex = 0;
let isCalculating = false;

// ============================================
// ELEMENTOS DO DOM
// ============================================
const elements = {
  audio: document.getElementById('theme-audio'),
  playBtn: document.getElementById('play-audio'),
  pauseBtn: document.getElementById('pause-audio'),
  calculateBtn: document.getElementById('calculate-btn'),
  nextBtn: document.getElementById('next-btn'),
  matrixDisplay: document.getElementById('matrix-display'),
  matrixGrid: document.getElementById('matrix-grid'),
  sequenceDisplay: document.getElementById('sequence-display'),
  resultSection: document.getElementById('result-section'),
  resultSteps: document.getElementById('result-steps'),
  resultValue: document.getElementById('result-value'),
  resultValidation: document.getElementById('result-validation'),
  loading: document.getElementById('loading'),
  mapTitle: document.getElementById('map-title'),
  mapDifficulty: document.getElementById('map-difficulty'),
  mapProgress: document.getElementById('map-progress')
};

// ============================================
// FUNÇÕES DE ÁUDIO
// ============================================
// Função para tocar o áudio
function playAudio() {
  if (elements.audio) {
    elements.audio.play();
  }
}

// Função para pausar o áudio
function pauseAudio() {
  if (elements.audio) {
    elements.audio.pause();
  }
}

// ============================================
// FUNÇÕES DE CORES
// ============================================
// Função para obter cor baseada no valor da célula
function getCellColor(value, isInSequence = false) {
  // Se faz parte da sequência encontrada, destaca em verde
  if (isInSequence) {
    return '#00ff88';
  }
  // Caso contrário, cor neutra cinza
  return '#888';
}

// ============================================
// FUNÇÕES DE RENDERIZAÇÃO
// ============================================
// Função para atualizar informações do mapa
function updateMapInfo() {
  const currentMap = maps[currentMapIndex];
  elements.mapTitle.textContent = currentMap.title;
  elements.mapDifficulty.textContent = `Nível: ${currentMap.difficulty}`;
  elements.mapProgress.textContent = `Mapa ${currentMapIndex + 1} de ${maps.length}`;
}

// Função para renderizar a matriz
function renderMatrix(highlightResult = null) {
  const currentMap = maps[currentMapIndex];
  const matrix = currentMap.matrix;
  const cols = matrix[0].length;

  // Limpar grid existente
  elements.matrixGrid.innerHTML = '';

  // Configurar grid columns
  elements.matrixGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Criar células
  matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'matrix-cell';

      // Verificar se esta célula faz parte da sequência encontrada
      let isInSequence = false;
      if (highlightResult) {
        const [startRow, startCol] = highlightResult.position;
        const seqLen = currentMap.sequence.length;

        if (highlightResult.direction === 'horizontal') {
          isInSequence = i === startRow && j >= startCol && j < startCol + seqLen;
        } else if (highlightResult.direction === 'vertical') {
          isInSequence = j === startCol && i >= startRow && i < startRow + seqLen;
        } else if (highlightResult.direction === 'diagonal') {
          // Verificar diagonal principal (↘)
          const isDiagonalMain =
            i >= startRow &&
            i < startRow + seqLen &&
            j >= startCol &&
            j < startCol + seqLen &&
            i - startRow === j - startCol;

          // Verificar diagonal secundária (↙)
          const isDiagonalSecondary =
            i >= startRow &&
            i < startRow + seqLen &&
            j <= startCol &&
            j > startCol - seqLen &&
            i - startRow === startCol - j;

          isInSequence = isDiagonalMain || isDiagonalSecondary;
        }
      }

      cellDiv.style.background = getCellColor(cell, isInSequence);
      cellDiv.textContent = cell;
      elements.matrixGrid.appendChild(cellDiv);
    });
  });

  // Atualizar display da sequência
  elements.sequenceDisplay.textContent = `Sequência Mágica: [${currentMap.sequence.join(', ')}]`;

  // Mostrar matriz
  elements.matrixDisplay.style.display = 'block';
}

// ============================================
// ALGORITMO DE BUSCA DA SEQUÊNCIA
// ============================================
// Função principal para encontrar a sequência na matriz
function findSequence(matrix, sequence) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const seqLen = sequence.length;
  const steps = [];

  // Verificar horizontal (esquerda para direita)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j <= cols - seqLen; j++) {
      let match = true;
      for (let k = 0; k < seqLen; k++) {
        if (matrix[i][j + k] !== sequence[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        steps.push(
          `🔍 Verificando linha ${i}: encontrada sequência [${sequence.join(', ')}] iniciando na posição (${i}, ${j})`
        );
        return {
          position: [i, j],
          direction: 'horizontal',
          steps
        };
      }
    }
  }

  // Verificar vertical (cima para baixo)
  for (let i = 0; i <= rows - seqLen; i++) {
    for (let j = 0; j < cols; j++) {
      let match = true;
      for (let k = 0; k < seqLen; k++) {
        if (matrix[i + k][j] !== sequence[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        steps.push(
          `🔍 Verificando coluna ${j}: encontrada sequência [${sequence.join(', ')}] iniciando na posição (${i}, ${j})`
        );
        return {
          position: [i, j],
          direction: 'vertical',
          steps
        };
      }
    }
  }

  // Verificar diagonal principal (↘ de cima-esquerda para baixo-direita)
  for (let i = 0; i <= rows - seqLen; i++) {
    for (let j = 0; j <= cols - seqLen; j++) {
      let match = true;
      const sequenceFound = [];
      for (let k = 0; k < seqLen; k++) {
        sequenceFound.push(matrix[i + k][j + k]);
        if (matrix[i + k][j + k] !== sequence[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        steps.push(
          `🔍 Verificando diagonal principal (↘): encontrada sequência [${sequenceFound.join(
            ', '
          )}] iniciando na posição (${i}, ${j})`
        );
        return {
          position: [i, j],
          direction: 'diagonal',
          steps
        };
      }
    }
  }

  // Verificar diagonal secundária (↙ de cima-direita para baixo-esquerda)
  for (let i = 0; i <= rows - seqLen; i++) {
    for (let j = seqLen - 1; j < cols; j++) {
      let match = true;
      const sequenceFound = [];
      for (let k = 0; k < seqLen; k++) {
        sequenceFound.push(matrix[i + k][j - k]);
        if (matrix[i + k][j - k] !== sequence[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        steps.push(
          `🔍 Verificando diagonal secundária (↙): encontrada sequência [${sequenceFound.join(
            ', '
          )}] iniciando na posição (${i}, ${j})`
        );
        return {
          position: [i, j],
          direction: 'diagonal',
          steps
        };
      }
    }
  }

  steps.push(`❌ Sequência [${sequence.join(', ')}] não encontrada na matriz`);
  return null;
}

// ============================================
// FUNÇÕES DE RESULTADO
// ============================================
// Função para exibir o resultado
function displayResult(result) {
  const currentMap = maps[currentMapIndex];

  // Renderizar matriz novamente com destaque
  renderMatrix(result);

  // Limpar e preparar seção de resultado
  elements.resultSteps.innerHTML = '';

  // Adicionar título dos passos
  const stepsTitle = document.createElement('strong');
  stepsTitle.textContent = 'Passo a Passo da Validação:';
  elements.resultSteps.appendChild(stepsTitle);
  elements.resultSteps.appendChild(document.createElement('br'));

  // Adicionar cada passo
  result.steps.forEach(step => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'result-step';
    stepDiv.textContent = `➤ ${step}`;
    elements.resultSteps.appendChild(stepDiv);
  });

  // Adicionar informações adicionais
  const positionInfo = document.createElement('div');
  positionInfo.style.marginTop = '15px';
  positionInfo.innerHTML = `✨ Posição encontrada: linha ${result.position[0]}, coluna ${result.position[1]}`;
  elements.resultSteps.appendChild(positionInfo);

  const directionInfo = document.createElement('div');
  directionInfo.innerHTML = `✨ Direção: ${result.direction}`;
  elements.resultSteps.appendChild(directionInfo);

  // Atualizar valor de saída
  elements.resultValue.textContent = `(${result.position[0]}, ${result.position[1]}, '${result.direction}')`;

  // Verificar se está correto
  const expectedOutput = `(${result.position[0]}, ${result.position[1]}, ${result.direction})`;
  const isCorrect = currentMap.expectedOutput === expectedOutput;

  elements.resultValidation.textContent = isCorrect ? '✅ Validação: CORRETO!' : '⚠️ Validação: VERIFICAR';
  elements.resultValidation.style.color = isCorrect ? '#00ff88' : '#ff7c00';

  // Mostrar seção de resultado
  elements.resultSection.style.display = 'block';
}

// ============================================
// FUNÇÕES DOS BOTÕES
// ============================================
// Função para calcular a matriz
function calculateMatrix() {
  if (isCalculating) return;

  isCalculating = true;
  const currentMap = maps[currentMapIndex];

  // Mostrar matriz se ainda não estiver visível
  if (elements.matrixDisplay.style.display === 'none') {
    renderMatrix();
  }

  // Mostrar loading
  elements.loading.style.display = 'block';
  elements.resultSection.style.display = 'none';
  elements.calculateBtn.textContent = 'CALCULANDO...';
  elements.calculateBtn.disabled = true;

  // Simular processamento (1 segundo)
  setTimeout(() => {
    const result = findSequence(currentMap.matrix, currentMap.sequence);

    if (result) {
      displayResult(result);
    }

    // Esconder loading
    elements.loading.style.display = 'none';
    elements.calculateBtn.textContent = 'CALCULAR MATRIZ';
    elements.calculateBtn.disabled = false;
    isCalculating = false;
  }, 1000);
}

// Função para ir para a próxima matriz
function nextMatrix() {
  // Avançar para o próximo mapa ou voltar ao primeiro
  if (currentMapIndex < maps.length - 1) {
    currentMapIndex++;
  } else {
    currentMapIndex = 0;
  }

  // Resetar interface
  elements.matrixDisplay.style.display = 'none';
  elements.resultSection.style.display = 'none';
  elements.loading.style.display = 'none';

  // Atualizar informações do mapa
  updateMapInfo();
}

// ============================================
// EVENT LISTENERS
// ============================================
// Controles de áudio
elements.playBtn.addEventListener('click', playAudio);
elements.pauseBtn.addEventListener('click', pauseAudio);

// Botões de ação
elements.calculateBtn.addEventListener('click', calculateMatrix);
elements.nextBtn.addEventListener('click', nextMatrix);

// ============================================
// INICIALIZAÇÃO
// ============================================
// Inicializar a página ao carregar
document.addEventListener('DOMContentLoaded', () => {
  updateMapInfo();
  console.log('🔥 O Núcleo do Androide carregado com sucesso!');
  console.log(`📊 Total de mapas disponíveis: ${maps.length}`);
});
