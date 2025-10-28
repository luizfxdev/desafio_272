# 🔥 O Enigma Rubro da Arlequim Ardente

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Algorithm](https://img.shields.io/badge/Algorithm-00D9FF?style=for-the-badge&logo=thealgorithms&logoColor=white)
![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)

## 📖 Sobre o Desafio



> *Nos sussurros instáveis entre realidade e pesadelo, surge a Arlequim Ignivarris, mestra dos paradoxos e guardiã do Orbe Flamejante. No coração de uma floresta enfeitiçada, Ignivarris desafia magos e viajantes dimensionais: dentro do orbe ardente que segura, esconde-se o poder dos números, alinhados em matrizes que refletem as linhas do destino!*

**Missão:** Criar uma função capaz de localizar uma sequência mágica de números dentro de uma matriz bidimensional. A função deve retornar a posição inicial (linha, coluna) e a direção onde a sequência aparece: **horizontal**, **vertical** ou **diagonal**.

### 🎯 Exemplos do Desafio

```javascript
// Exemplo 1
matriz = [
  [7, 8, 3, 4, 5],
  [5, 9, 8, 3, 7],
  [1, 5, 7, 8, 9],
  [2, 3, 5, 8, 6],
  [9, 2, 5, 3, 4]
]
sequencia = [9, 7, 8]
// Saída esperada: (1, 1, 'diagonal')

// Exemplo 2
matriz = [
  [2, 0, 1, 9],
  [1, 5, 2, 8],
  [3, 2, 5, 8],
  [4, 1, 8, 7]
]
sequencia = [2, 5, 8]
// Saída esperada: (2, 1, 'horizontal')
```

---

## 🚀 Aplicações em Projetos Reais

Este desafio resolve problemas práticos de **busca de padrões em estruturas bidimensionais**, aplicáveis em:

### 1. **Processamento de Imagens**
- Detecção de bordas e contornos
- Reconhecimento de padrões em pixels
- Análise de texturas

### 2. **Jogos e Puzzles**
- Validação de jogadas em jogos de tabuleiro (xadrez, damas, go)
- Detecção de combinações em jogos match-3 (Candy Crush, Bejeweled)
- Resolução de caça-palavras digitais

### 3. **Bioinformática**
- Busca de sequências de DNA/RNA em genomas
- Análise de alinhamento de proteínas
- Identificação de padrões em matrizes de expressão gênica

### 4. **Análise de Dados**
- Detecção de tendências em séries temporais multidimensionais
- Identificação de padrões em dashboards de monitoramento
- Análise de correlações em matrizes de dados

### 5. **Segurança e Criptografia**
- Análise de padrões em matrizes de criptografia
- Detecção de anomalias em logs de sistema
- Validação de assinaturas digitais

---

## 🧠 Lógica de Solução

### Algoritmo de Busca Multidirecional

A solução implementa um algoritmo de **busca exaustiva** que verifica todas as direções possíveis:

#### **1. Busca Horizontal (→)**
```javascript
// Percorre cada linha, verificando sequências da esquerda para direita
for (let i = 0; i < rows; i++) {
  for (let j = 0; j <= cols - seqLen; j++) {
    // Verifica se a sequência começa na posição [i][j]
    if (sequenceMatches(i, j, 0, 1)) {
      return { position: [i, j], direction: 'horizontal' };
    }
  }
}
```

#### **2. Busca Vertical (↓)**
```javascript
// Percorre cada coluna, verificando sequências de cima para baixo
for (let i = 0; i <= rows - seqLen; i++) {
  for (let j = 0; j < cols; j++) {
    // Verifica se a sequência começa na posição [i][j]
    if (sequenceMatches(i, j, 1, 0)) {
      return { position: [i, j], direction: 'vertical' };
    }
  }
}
```

#### **3. Busca Diagonal Principal (↘)**
```javascript
// Percorre diagonais de cima-esquerda para baixo-direita
for (let i = 0; i <= rows - seqLen; i++) {
  for (let j = 0; j <= cols - seqLen; j++) {
    // Verifica se a sequência começa na posição [i][j]
    if (sequenceMatches(i, j, 1, 1)) {
      return { position: [i, j], direction: 'diagonal' };
    }
  }
}
```

#### **4. Busca Diagonal Secundária (↙)**
```javascript
// Percorre diagonais de cima-direita para baixo-esquerda
for (let i = 0; i <= rows - seqLen; i++) {
  for (let j = seqLen - 1; j < cols; j++) {
    // Verifica se a sequência começa na posição [i][j]
    if (sequenceMatches(i, j, 1, -1)) {
      return { position: [i, j], direction: 'diagonal' };
    }
  }
}
```

### Complexidade Computacional

- **Tempo:** O(n × m × k × 4), onde:
  - `n` = número de linhas
  - `m` = número de colunas
  - `k` = tamanho da sequência
  - `4` = número de direções verificadas

- **Espaço:** O(k) para armazenar os passos da validação

### Otimizações Possíveis

1. **Early stopping**: Interrompe a busca assim que encontra a primeira ocorrência
2. **Boyer-Moore**: Implementar algoritmo de busca mais eficiente
3. **Hashing**: Usar hash para comparação rápida de subsequências
4. **Paralelização**: Dividir a matriz em quadrantes e processar simultaneamente

---

## 🔧 Função Principal

```javascript
function findSequence(matrix, sequence) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const seqLen = sequence.length;
  const steps = [];

  // Busca Horizontal
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
        steps.push(`🔍 Linha ${i}: sequência [${sequence}] em (${i}, ${j})`);
        return { position: [i, j], direction: 'horizontal', steps };
      }
    }
  }

  // Busca Vertical
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
        steps.push(`🔍 Coluna ${j}: sequência [${sequence}] em (${i}, ${j})`);
        return { position: [i, j], direction: 'vertical', steps };
      }
    }
  }

  // Busca Diagonal Principal (↘)
  for (let i = 0; i <= rows - seqLen; i++) {
    for (let j = 0; j <= cols - seqLen; j++) {
      let match = true;
      for (let k = 0; k < seqLen; k++) {
        if (matrix[i + k][j + k] !== sequence[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        steps.push(`🔍 Diagonal ↘: sequência [${sequence}] em (${i}, ${j})`);
        return { position: [i, j], direction: 'diagonal', steps };
      }
    }
  }

  // Busca Diagonal Secundária (↙)
  for (let i = 0; i <= rows - seqLen; i++) {
    for (let j = seqLen - 1; j < cols; j++) {
      let match = true;
      for (let k = 0; k < seqLen; k++) {
        if (matrix[i + k][j - k] !== sequence[k]) {
          match = false;
          break;
        }
      }
      if (match) {
        steps.push(`🔍 Diagonal ↙: sequência [${sequence}] em (${i}, ${j})`);
        return { position: [i, j], direction: 'diagonal', steps };
      }
    }
  }

  return null; // Sequência não encontrada
}
```

---

## 🐛 Problema Encontrado e Solução

### O Bug da Matriz 1

**Problema Identificado:**
A matriz 1 originalmente tinha a sequência `[5, 8, 9]` com saída esperada `(1, 1, 'diagonal')`, mas a sequência correta nessa posição era `[9, 7, 8]`.

```javascript
// ❌ VERSÃO COM BUG
matrix: [
  [7, 8, 3, 4, 5],
  [5, 9, 8, 3, 7],  // posição (1,1) = 9
  [1, 5, 7, 8, 9],  // posição (2,2) = 7
  [2, 3, 5, 8, 6],  // posição (3,3) = 8
  [9, 2, 5, 3, 4]
],
sequence: [5, 8, 9] // ❌ INCORRETO!
```

**Análise:**
Ao verificar manualmente a diagonal principal iniciando em (1,1):
- Posição [1][1] = `9`
- Posição [2][2] = `7`
- Posição [3][3] = `8`

A sequência real era `[9, 7, 8]` e não `[5, 8, 9]`!

**Solução Aplicada:**
```javascript
// ✅ VERSÃO CORRIGIDA
matrix: [
  [7, 8, 3, 4, 5],
  [5, 9, 8, 3, 7],  // posição (1,1) = 9 ✓
  [1, 5, 7, 8, 9],  // posição (2,2) = 7 ✓
  [2, 3, 5, 8, 6],  // posição (3,3) = 8 ✓
  [9, 2, 5, 3, 4]
],
sequence: [9, 7, 8] // ✅ CORRETO!
expectedOutput: '(1, 1, diagonal)'
```

### Como Encontramos a Solução

1. **Debugging Visual**: Renderizamos a matriz com destaque de cores
2. **Verificação Manual**: Percorremos a diagonal principal manualmente
3. **Console Logging**: Adicionamos logs para rastrear valores encontrados
4. **Teste Unitário**: Validamos cada direção separadamente

**Lição Aprendida:** Sempre validar os dados de entrada antes de debugar o algoritmo. Às vezes o problema não está no código, mas nos dados de teste! 🎯

---

## 🎨 Interface Interativa

- **Design Cyberpunk**: Cores vibrantes e efeitos de brilho
- **Visualização Clara**: Células destacadas em verde quando encontradas
- **Legenda Intuitiva**: Explicação do sistema de cores
- **Responsivo**: Adapta-se a dispositivos móveis
- **Animações Suaves**: Transições e efeitos visuais

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Animações e design cyberpunk
- **JavaScript Vanilla**: Lógica pura sem frameworks
- **Fontes**: Montserrat (principal) e Lora (secundária)

---

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/luizfxdev/desafio_272.git
cd desafio_272
```

2. Adicione os arquivos de mídia na pasta `assets/`:
   - `background.mp4` (vídeo de fundo)
   - `theme.mp3` (música tema)

3. Abra o arquivo `index.html` em seu navegador

---

## 📂 Estrutura do Projeto

```
desafio_272/
│
├── index.html          # Estrutura HTML
├── styles.css          # Estilos e animações
├── script.js           # Lógica do algoritmo
├── README.md           # Documentação
│
└── assets/
    ├── background.mp4  # Vídeo de fundo
    └── theme.mp3       # Música tema
```

## 👨‍💻 Autor

**Luiz Felipe de Oliveira**

- GitHub: [@luizfxdev](https://github.com/luizfxdev)
- Linkedin: [in/luizfxdev](https://www.linkedin.com/in/luizfxdev)
- Portfólio: [luizfxdev.com.br](https://luizfxdev.com.br)

---

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir!

---

## 🌟 Agradecimentos

Desafio inspirado no universo fantástico do **Arlequim Ardente**, onde lógica e magia se encontram em matrizes de números! 🔥✨

---

**⭐ Se este projeto te ajudou, deixe uma estrela no repositório!**

***Não importa o quão insano você é. Existe sempre alguém para completar a sua insanidade.*** (Arlequina)
