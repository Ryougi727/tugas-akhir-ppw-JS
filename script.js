let displayValue = '0';
let currentInput = ''; 
let memory = 0;
let history = [];

const display = document.getElementById('display');
const currentInputEl = document.getElementById('currentInput');
const historyListEl = document.getElementById('historyList');

function updateDisplay() {
  display.textContent = displayValue;
  currentInputEl.textContent = currentInput;
}

function inputDigit(digit) {
  if (displayValue === '0' && digit !== '0') {
    displayValue = digit;
  } else if (displayValue === '0' && digit === '0') {
   
  } else if (displayValue === 'Error') {
    displayValue = digit;
    currentInput = '';
  } else {
    displayValue += digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (displayValue === 'Error') {
    displayValue = '0.';
    currentInput = '';
  } else if (!displayValue.includes('.')) {
    displayValue += '.';
  }
  updateDisplay();
}

function clearEntry() {
  displayValue = '0';
  updateDisplay();
}

function clearAll() {
  displayValue = '0';
  currentInput = '';
  updateDisplay();
}

function inputOperator(op) {
  if (displayValue === 'Error') return;


  if (currentInput !== '') {
    try {
      const result = evaluateLeftToRight(currentInput + displayValue);
      displayValue = String(result);
    } catch (e) {
      displayValue = 'Error';
      updateDisplay();
      return;
    }
  }

  
  currentInput = displayValue + op;
  displayValue = '0';
  updateDisplay();
}

function evaluateLeftToRight(expr) {
  const tokens = expr.match(/(\d+\.?\d*|[+\-*/%])/g);
  if (!tokens || tokens.length === 0) throw new Error('Invalid');

  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const next = parseFloat(tokens[i + 1]);
    if (isNaN(next)) throw new Error('Invalid number');
    switch (op) {
      case '+': result += next; break;
      case '-': result -= next; break;
      case '*': result *= next; break;
      case '/':
        if (next === 0) throw new Error('Division by zero');
        result /= next;
        break;
      case '%': result %= next; break;
      default: throw new Error('Invalid op');
    }
  }
  return result;
}

function calculate() {
  if (currentInput === '' || displayValue === 'Error') return;

  const fullExpr = currentInput + displayValue;
  try {
    const result = evaluateLeftToRight(fullExpr);
    
    const exprDisplay = fullExpr.replace(/\*/g, '×').replace(/\//g, '÷');
    const historyItem = `${exprDisplay} = ${result}`;

    history.unshift(historyItem);
    if (history.length > 5) history.pop();
    historyListEl.innerHTML = history.map(item => `<li>${item}</li>`).join('');

    displayValue = String(result);
    currentInput = '';
  } catch (e) {
    displayValue = 'Error';
    setTimeout(clearAll, 1500);
  }
  updateDisplay();
}


function memoryAdd() {
  if (displayValue !== 'Error') memory += parseFloat(displayValue);
}
function memorySub() {
  if (displayValue !== 'Error') memory -= parseFloat(displayValue);
}
function memoryRecall() {
  displayValue = String(memory);
  updateDisplay();
}
function memoryClear() {
  memory = 0;
}


document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') clearEntry();
  else if (e.key === '+' || e.key === '-' || e.key === '%') inputOperator(e.key);
  else if (e.key === '*') inputOperator('*');
  else if (e.key === '/') inputOperator('/');
  else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  }
});