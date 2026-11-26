import React, { useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import { CALCULATORS_REGISTRY } from './lib/calculators/registry';

// Layout & Modals
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ShareModal } from './components/common/ShareModal';
import { HistoryDrawer } from './components/common/HistoryDrawer';
import { SearchModal } from './components/common/SearchModal';
import { HomeHub } from './components/home/HomeHub';

// 11 Modular Calculators
import { BasicCalculator } from './components/calculators/BasicCalculator';
import { ScientificCalculator } from './components/calculators/ScientificCalculator';
import { AgeCalculator } from './components/calculators/AgeCalculator';
import { BmiCalculator } from './components/calculators/BmiCalculator';
import { TaxCalculator } from './components/calculators/TaxCalculator';
import { ProfitLossCalculator } from './components/calculators/ProfitLossCalculator';
import { LoanCalculator } from './components/calculators/LoanCalculator';
import { PercentageCalculator } from './components/calculators/PercentageCalculator';
import { UnitConverter } from './components/calculators/UnitConverter';
import { CompoundInterestCalculator } from './components/calculators/CompoundInterestCalculator';
import { DiscountCalculator } from './components/calculators/DiscountCalculator';

export const App: React.FC = () => {
  const { route, navigateTo } = useHashRoute();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const activeCalculatorMeta = CALCULATORS_REGISTRY.find(c => c.id === route.calculatorId);

  const getShareUrl = () => {
    return window.location.href;
  };

  const renderCalculator = () => {
    switch (route.calculatorId) {
      case 'basic':
        return <BasicCalculator onBack={() => navigateTo('home')} onShare={() => setIsShareOpen(true)} />;
      case 'scientific':
        return <ScientificCalculator onBack={() => navigateTo('home')} onShare={() => setIsShareOpen(true)} />;
      case 'age':
        return (
          <AgeCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialDob={route.params.get('dob') || undefined}
            initialTarget={route.params.get('target') || undefined}
          />
        );
      case 'bmi':
        return (
          <BmiCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialWeight={route.params.get('w') ? parseFloat(route.params.get('w')!) : undefined}
            initialHeight={route.params.get('h') ? parseFloat(route.params.get('h')!) : undefined}
          />
        );
      case 'tax':
        return (
          <TaxCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialIncome={route.params.get('income') ? parseFloat(route.params.get('income')!) : undefined}
            initialRate={route.params.get('rate') ? parseFloat(route.params.get('rate')!) : undefined}
          />
        );
      case 'profit-loss':
        return (
          <ProfitLossCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialCP={route.params.get('cp') ? parseFloat(route.params.get('cp')!) : undefined}
            initialSP={route.params.get('sp') ? parseFloat(route.params.get('sp')!) : undefined}
          />
        );
      case 'loan-emi':
        return (
          <LoanCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialAmount={route.params.get('amt') ? parseFloat(route.params.get('amt')!) : undefined}
            initialRate={route.params.get('rate') ? parseFloat(route.params.get('rate')!) : undefined}
            initialTerm={route.params.get('term') ? parseFloat(route.params.get('term')!) : undefined}
          />
        );
      case 'percentage':
        return <PercentageCalculator onBack={() => navigateTo('home')} onShare={() => setIsShareOpen(true)} />;
      case 'converter':
        return <UnitConverter onBack={() => navigateTo('home')} onShare={() => setIsShareOpen(true)} />;
      case 'compound-interest':
        return (
          <CompoundInterestCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialPrincipal={route.params.get('p') ? parseFloat(route.params.get('p')!) : undefined}
            initialRate={route.params.get('r') ? parseFloat(route.params.get('r')!) : undefined}
            initialYears={route.params.get('y') ? parseInt(route.params.get('y')!) : undefined}
          />
        );
      case 'discount':
        return (
          <DiscountCalculator
            onBack={() => navigateTo('home')}
            onShare={() => setIsShareOpen(true)}
            initialPrice={route.params.get('price') ? parseFloat(route.params.get('price')!) : undefined}
            initialDiscount={route.params.get('disc') ? parseFloat(route.params.get('disc')!) : undefined}
          />
        );
      default:
        return <HomeHub onSelectCalculator={id => navigateTo(id)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500/30">
      {/* Background Orbs & Overlay */}
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-orb w-[600px] h-[600px] bg-indigo-600 top-[-180px] left-[-120px]" />
        <div className="bg-orb w-[500px] h-[500px] bg-sky-500 bottom-[-150px] right-[-100px]" style={{ animationDelay: '-6s' }} />
        <div className="bg-orb w-[350px] h-[350px] bg-pink-500 top-[50%] left-[50%]" style={{ animationDelay: '-3s' }} />
      </div>
      <div className="grid-overlay" aria-hidden="true" />

      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNavigateHome={() => navigateTo('home')}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar currentId={route.calculatorId} onSelect={id => navigateTo(id)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto overflow-hidden">
          {renderCalculator()}
        </main>
      </div>

      {/* Footer */}
      <Footer onSelectCalculator={id => navigateTo(id)} />

      {/* Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={id => navigateTo(id)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectCalculator={id => navigateTo(id)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={activeCalculatorMeta?.title || 'CalcHub Online Calculator'}
        shareUrl={getShareUrl()}
        description={activeCalculatorMeta?.shortDesc}
      />
    </div>
  );
};
