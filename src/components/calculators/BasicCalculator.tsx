import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { CalculatorLiveHistory } from '../common/CalculatorLiveHistory';
import { useHistory } from '../../context/HistoryContext';
import { BasicOperator, executeBasicOperation, formatFloat } from '../../lib/calculators/basic';

interface BasicCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const BasicCalculator: React.FC<BasicCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();
  const [current, setCurrent] = useState('0');
  const [prev, setPrev] = useState('');
  const [op, setOp] = useState<BasicOperator | null>(null);
  const [newNum, setNewNum] = useState(true);
  const [expr, setExpr] = useState('');

  const handleDigit = (val: string) => {
    if (newNum) {
      if (val === '.') setCurrent('0.');
      else setCurrent(val);
      setNewNum(false);
    } else {
      if (val === '.' && current.includes('.')) return;
      if (current === '0' && val !== '.') setCurrent(val);
      else setCurrent(prevCur => (prevCur.length > 14 ? prevCur : prevCur + val));
    }
  };

  const handleOperator = (nextOp: BasicOperator) => {
    const curVal = parseFloat(current);
    if (op && !newNum && prev !== '') {
      const prevVal = parseFloat(prev);
      const res = executeBasicOperation(prevVal, curVal, op);
      const formatted = isNaN(res) ? 'Error' : String(formatFloat(res));
      setCurrent(formatted);
      setPrev(formatted);
    } else {
      setPrev(current);
    }
    const symMap: Record<BasicOperator, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    setOp(nextOp);
    setExpr(`${current} ${symMap[nextOp]}`);
    setNewNum(true);
  };

  const handleAction = (action: 'AC' | '+/-' | '%' | '=') => {
    const curVal = parseFloat(current);
    if (action === 'AC') {
      setCurrent('0');
      setPrev('');
      setOp(null);
      setNewNum(true);
      setExpr('');
    } else if (action === '+/-') {
      setCurrent(String(-curVal));
    } else if (action === '%') {
      const res = curVal / 100;
      setCurrent(String(res));
    } else if (action === '=') {
      if (!op || prev === '') return;
      const prevVal = parseFloat(prev);
      const res = executeBasicOperation(prevVal, curVal, op);
      const symMap: Record<BasicOperator, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      const fullExpr = `${prev} ${symMap[op]} ${current} =`;
      const formatted = isNaN(res) ? 'Error' : String(formatFloat(res));

      setExpr(fullExpr);
      setCurrent(formatted);
      setPrev('');
      setOp(null);
      setNewNum(true);

      addHistory({
        calculatorId: 'basic',
        calculatorTitle: 'Basic Calculator',
        summary: fullExpr,
        result: formatted,
      });
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ('0123456789.'.includes(e.key)) handleDigit(e.key);
      else if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key as BasicOperator);
      else if (e.key === 'Enter' || e.key === '=') handleAction('=');
      else if (e.key === 'Escape' || e.key === 'Delete') handleAction('AC');
      else if (e.key === 'Backspace') {
        setCurrent(prevCur => (prevCur.length > 1 ? prevCur.slice(0, -1) : '0'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, prev, op, newNum]);

  return (
    <CalculatorWrapper
      title="Basic Calculator"
      subtitle="Standard arithmetic calculations with precision float formatting"
      onBack={onBack}
      onShare={onShare}
    >
      {/* Side-by-Side Container: Keypad on Left, Live History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-4xl mx-auto">
        {/* Left Column: Calculator Keypad & Display */}
        <div className="lg:col-span-6 w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0 lg:ml-auto">
          {/* Display */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 text-right mb-4 min-h-[90px] flex flex-col justify-end shadow-xs">
            <div className="text-xs text-slate-400 font-mono min-h-[18px]">{expr}</div>
            <div className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 overflow-x-auto">
              {current}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2.5">
            <button onClick={() => handleAction('AC')} className="btn-calc btn-calc-action">AC</button>
            <button onClick={() => handleAction('+/-')} className="btn-calc btn-calc-action">+/−</button>
            <button onClick={() => handleAction('%')} className="btn-calc btn-calc-action">%</button>
            <button onClick={() => handleOperator('/')} className="btn-calc btn-calc-op">÷</button>

            <button onClick={() => handleDigit('7')} className="btn-calc">7</button>
            <button onClick={() => handleDigit('8')} className="btn-calc">8</button>
            <button onClick={() => handleDigit('9')} className="btn-calc">9</button>
            <button onClick={() => handleOperator('*')} className="btn-calc btn-calc-op">×</button>

            <button onClick={() => handleDigit('4')} className="btn-calc">4</button>
            <button onClick={() => handleDigit('5')} className="btn-calc">5</button>
            <button onClick={() => handleDigit('6')} className="btn-calc">6</button>
            <button onClick={() => handleOperator('-')} className="btn-calc btn-calc-op">−</button>

            <button onClick={() => handleDigit('1')} className="btn-calc">1</button>
            <button onClick={() => handleDigit('2')} className="btn-calc">2</button>
            <button onClick={() => handleDigit('3')} className="btn-calc">3</button>
            <button onClick={() => handleOperator('+')} className="btn-calc btn-calc-op">+</button>

            <button onClick={() => handleDigit('0')} className="btn-calc col-span-2">0</button>
            <button onClick={() => handleDigit('.')} className="btn-calc">.</button>
            <button onClick={() => handleAction('=')} className="btn-calc btn-calc-eq">=</button>
          </div>
        </div>

        {/* Right Column: Live History & Tape Panel */}
        <div className="lg:col-span-6 w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0 lg:mr-auto">
          <CalculatorLiveHistory
            calculatorId="basic"
            calculatorTitle="Basic Calculator"
            onSelectResult={val => {
              setCurrent(val);
              setNewNum(true);
            }}
          />
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="Basic Math & Precision Arithmetic"
        formulaDesc="CalcHub uses strict IEEE 754 precision correction to prevent standard JavaScript floating-point errors (e.g. 0.1 + 0.2 = 0.3)."
        howItWorks={[
          'Input the initial operand using the keypad or your physical keyboard.',
          'Select an arithmetic operator: addition (+), subtraction (−), multiplication (×), or division (÷).',
          'Press equals (=) or Enter to evaluate the expression.',
        ]}
        faqs={[
          {
            question: 'Can I use keyboard shortcuts?',
            answer: 'Yes! You can use normal number keys, +, -, *, /, Enter to calculate, Escape to Clear (AC), and Backspace to delete numbers.',
          },
          {
            question: 'Does this calculator round numbers?',
            answer: 'Results are calculated at maximum precision and rounded up to 10 decimal digits to eliminate float errors.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
