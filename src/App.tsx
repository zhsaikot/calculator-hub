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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('calchub_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('calchub_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNavigateHome={() => navigateTo('home')}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full relative min-h-[calc(100vh-3.5rem)]">
        <Sidebar
          currentId={route.calculatorId}
          onSelect={id => navigateTo(id)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 min-w-0">
          <div className="max-w-6xl mx-auto">
            {renderCalculator()}
          </div>
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
