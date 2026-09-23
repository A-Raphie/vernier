'use client';

import React, { useState, useEffect } from 'react';
import { ChromeHeader, SurfaceTab } from '../components/navigation/ChromeHeader';
import { Surface1FrontDoor } from '../components/surfaces/Surface1FrontDoor';
import { Surface2Cockpit } from '../components/surfaces/Surface2Cockpit';
import { Surface3ProofRail } from '../components/surfaces/Surface3ProofRail';
import { Surface4PitchDeck } from '../components/surfaces/Surface4PitchDeck';
import { SCENARIOS } from '../data/attack-vectors';

export default function VernierApp() {
  const [activeTab, setActiveTab] = useState<SurfaceTab>('overview');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(10);

  // Sync with URL hash if present
  useEffect(() => {
    const handleHashSync = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '') as SurfaceTab;
        if (hash === 'overview' || hash === 'cockpit' || hash === 'proof' || hash === 'deck') {
          setActiveTab(hash);
        }
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleTabChange = (tab: SurfaceTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* 1-Chrome-Row Header (Gate 1 Purge) */}
      <ChromeHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Surface 1: High-Authority Front Door */}
      {activeTab === 'overview' && (
        <Surface1FrontDoor
          onNavigateTab={handleTabChange}
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
        />
      )}

      {/* Surface 2: The Working Cockpit */}
      {activeTab === 'cockpit' && (
        <Surface2Cockpit
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
          activeStepIndex={activeStepIndex}
          setActiveStepIndex={setActiveStepIndex}
          onNavigateTab={handleTabChange}
        />
      )}

      {/* Surface 3: Dedicated Proof & Evidence Rail */}
      {activeTab === 'proof' && (
        <Surface3ProofRail
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={setSelectedScenarioId}
          onNavigateTab={handleTabChange}
        />
      )}

      {/* Surface 4: Pitch Deck Presentation */}
      {activeTab === 'deck' && (
        <Surface4PitchDeck />
      )}
    </main>
  );
}
