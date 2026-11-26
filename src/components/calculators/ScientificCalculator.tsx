import React, { useState } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { useHistory } from '../../context/HistoryContext';
import { calculateSciFunction, SciAngleMode } from '../../lib/calculators/scientific';

interface ScientificCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();
  const [display, setDisplay] = useState('0');
  const [expr, setExpr] = useState('');
  const [mode, setMode] = useState<SciAngleMode>('deg');
  const [pendingOp, setPendingOp] = useState<string | null>(null);
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [newNum, setNewNum] = useState(true);

  const handleInput = (val: string) => {
    if (['+', '-', '*', '/'].includes(val)) {
      setPrevVal(parseFloat(display));
      setPendingOp(val);
      setExpr(`${display} ${val}`);
      setNewNum(true);
      return;
    }

    if (newNum) {
      setDisplay(val === '.' ? '0.' : val);
      setNewNum(false);
    } else {
      if (val === '.' && display.includes('.')) return;
      setDisplay(prev => (prev === '0' && val !== '.' ? val : prev + val));
    }
  };

  const handleFn = (fn: string) => {
    const x = parseFloat(display);

    if (fn === 'AC') {
      setDisplay('0');
      setExpr('');
      setPendingOp(null);
      setPrevVal(null);
      setNewNum(true);
      return;
    }

    if (fn === 'del') {
      setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }

    if (fn === 'pi') {
      setDisplay(String(Math.PI));
      setNewNum(true);
      return;
    }

    if (fn === 'e') {
      setDisplay(String(Math.E));
      setNewNum(true);
      return;
    }

    if (fn === '=') {
      if (pendingOp && prevVal !== null) {
        let res = 0;
        if (pendingOp === '+') res = prevVal + x;
        else if (pendingOp === '-') res = prevVal - x;
        else if (pendingOp === '*') res = prevVal * x;
        else if (pendingOp === '/') res = x === 0 ? NaN : prevVal / x;
        else if (pendingOp === 'pow') res = Math.pow(prevVal, x);

        const formatted = isNaN(res) ? 'Error' : String(res);
        const fullExpr = `${prevVal} ${pendingOp} ${x} =`;
        setExpr(fullExpr);
        setDisplay(formatted);
        setPendingOp(null);
        setPrevVal(null);
        setNewNum(true);

        addHistory({
          calculatorId: 'scientific',
          calculatorTitle: 'Scientific Calculator',
          summary: fullExpr,
          result: formatted,
        });
      }
      return;
    }

    if (fn === 'pow') {
      setPrevVal(x);
      setPendingOp('pow');
      setExpr(`${x} ^ `);
      setNewNum(true);
      return;
    }

    const { result, expr: fnExpr } = calculateSciFunction(fn, x, mode);
    const formatted = isNaN(result) ? 'Error' : String(result);
    setExpr(fnExpr);
    setDisplay(formatted);
    setNewNum(true);

    addHistory({
      calculatorId: 'scientific',
      calculatorTitle: 'Scientific Calculator',
      summary: fnExpr,
      result: formatted,
    });
  };

  return (
    <CalculatorWrapper
      title="Scientific Calculator"
      subtitle="Advanced math: Trigonometric functions, logarithms, roots, powers, and constants"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="max-w-md mx-auto">
        {/* Angle mode toggle */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-slate-400">Angle Mode:</span>
          <div className="flex rounded-lg bg-white/5 border border-white/10 p-0.5">
            <button
              onClick={() => setMode('deg')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                mode === 'deg' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              DEG
            </button>
            <button
              onClick={() => setMode('rad')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                mode === 'rad' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              RAD
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="p-4 rounded-2xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-200 text-right mb-4 min-h-[90px] flex flex-col justify-end">
          <div className="text-xs text-slate-400 font-mono min-h-[18px]">{expr}</div>
          <div className="text-2xl font-display font-extrabold tracking-tight text-white [data-theme='light']:text-slate-900 overflow-x-auto">
            {display}
          </div>
        </div>

        {/* Scientific Keypad */}
        <div className="grid grid-cols-5 gap-2 text-xs">
          <button onClick={() => handleFn('sin')} className="btn-calc btn-calc-fn">sin</button>
          <button onClick={() => handleFn('cos')} className="btn-calc btn-calc-fn">cos</button>
          <button onClick={() => handleFn('tan')} className="btn-calc btn-calc-fn">tan</button>
          <button onClick={() => handleFn('log')} className="btn-calc btn-calc-fn">log</button>
          <button onClick={() => handleFn('ln')} className="btn-calc btn-calc-fn">ln</button>

          <button onClick={() => handleFn('sqrt')} className="btn-calc btn-calc-fn">√</button>
          <button onClick={() => handleFn('sq')} className="btn-calc btn-calc-fn">x²</button>
          <button onClick={() => handleFn('cube')} className="btn-calc btn-calc-fn">x³</button>
          <button onClick={() => handleFn('pow')} className="btn-calc btn-calc-fn">xʸ</button>
          <button onClick={() => handleFn('fact')} className="btn-calc btn-calc-fn">n!</button>

          <button onClick={() => handleFn('pi')} className="btn-calc btn-calc-fn">π</button>
          <button onClick={() => handleFn('e')} className="btn-calc btn-calc-fn">e</button>
          <button onClick={() => handleFn('inv')} className="btn-calc btn-calc-fn">1/x</button>
          <button onClick={() => handleFn('del')} className="btn-calc btn-calc-action">⌫</button>
          <button onClick={() => handleFn('AC')} className="btn-calc btn-calc-action">AC</button>

          <button onClick={() => handleInput('7')} className="btn-calc">7</button>
          <button onClick={() => handleInput('8')} className="btn-calc">8</button>
          <button onClick={() => handleInput('9')} className="btn-calc">9</button>
          <button onClick={() => handleInput('/')} className="btn-calc btn-calc-op">÷</button>
          <button onClick={() => handleInput('*')} className="btn-calc btn-calc-op">×</button>

          <button onClick={() => handleInput('4')} className="btn-calc">4</button>
          <button onClick={() => handleInput('5')} className="btn-calc">5</button>
          <button onClick={() => handleInput('6')} className="btn-calc">6</button>
          <button onClick={() => handleInput('-')} className="btn-calc btn-calc-op">−</button>
          <button onClick={() => handleInput('+')} className="btn-calc btn-calc-op">+</button>

          <button onClick={() => handleInput('1')} className="btn-calc">1</button>
          <button onClick={() => handleInput('2')} className="btn-calc">2</button>
          <button onClick={() => handleInput('3')} className="btn-calc">3</button>
          <button onClick={() => handleInput('.')} className="btn-calc">.</button>
          <button onClick={() => handleFn('=')} className="btn-calc btn-calc-eq">=</button>

          <button onClick={() => handleInput('0')} className="btn-calc col-span-5">0</button>
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="Scientific Calculation & Trigonometry"
        formulaDesc="Our scientific calculator supports both Degree (DEG) and Radian (RAD) modes for trigonometry (sine, cosine, tangent), common logs (log10), natural log (ln), power expressions, and factorials."
        howItWorks={[
          'Select DEG or RAD mode for angular calculations.',
          'Enter your number and tap functions like sin, cos, sqrt (√), or x² for immediate evaluation.',
          'For binary operations like xʸ, enter the base, tap xʸ, enter the exponent, and press =.',
        ]}
        faqs={[
          {
            question: 'What is the difference between DEG and RAD?',
            answer: 'Degree mode assumes a full circle is 360 degrees (common in geometry and physics). Radian mode defines a full circle as 2π radians (used in higher mathematics and calculus).',
          },
          {
            question: 'How does factorial work?',
            answer: 'n! multiplies all positive integers up to n (e.g., 5! = 5 × 4 × 3 × 2 × 1 = 120).',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
