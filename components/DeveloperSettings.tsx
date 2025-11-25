import React, { useEffect } from 'react';
import useStore from '../store/store';

const DeveloperSettings = () => {
  const {
    apiKey,
    predictiveInventory,
    kitchenOptimization,
    setApiKey,
    setPredictiveInventory,
    setKitchenOptimization,
    fetchSettings,
    saveSettings,
  } = useStore();

  useEffect(() => {
    // Fetch initial settings when the component mounts
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Developer & AI Settings</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="apiKey" style={{ display: 'block', marginBottom: '0.5rem' }}>
            AI API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="Enter your API key"
          />
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="predictiveInventory"
            checked={predictiveInventory}
            onChange={(e) => setPredictiveInventory(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          <label htmlFor="predictiveInventory">
            Enable Predictive Inventory (Voorspellende Analyse voor Voorraadbeheer)
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="kitchenOptimization"
            checked={kitchenOptimization}
            onChange={(e) => setKitchenOptimization(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          <label htmlFor="kitchenOptimization">
            Enable Kitchen Process Optimization (Optimalisatie van Keukenprocessen)
          </label>
        </div>

        <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default DeveloperSettings;
