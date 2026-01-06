
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import { ChannelSpendChart, PerformanceTrendChart } from './components/DashboardCharts';
import CompetitorInsights from './components/CompetitorInsights';
import AiInsightsPanel from './components/AiInsightsPanel';
import MarketIntelPanel from './components/MarketIntelPanel';
import SettingsPanel from './components/SettingsPanel';
import SeoSuitePanel from './components/SeoSuitePanel';
import SocialHubPanel from './components/SocialHubPanel';
import WorkflowPanel from './components/WorkflowPanel';
import AgentHubPanel from './components/AgentHubPanel';
import { ViewMode } from './types';
import { MOCK_DASHBOARD_DATA, CHANNELS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.OVERVIEW);
  const [selectedChannel, setSelectedChannel] = useState<string>('All Channels');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.OVERVIEW:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_DASHBOARD_DATA.metrics.map((metric) => (
                <StatCard key={metric.label} metric={metric} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ChannelSpendChart channels={MOCK_DASHBOARD_DATA.channelPerformance} />
              <PerformanceTrendChart historical={MOCK_DASHBOARD_DATA.historicalData} />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Channel Performance Detail</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Channel</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Spend</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Impressions</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">CTR</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_DASHBOARD_DATA.channelPerformance.map((item) => (
                      <tr key={item.channel} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-900">{item.channel}</td>
                        <td className="px-6 py-5 text-slate-600 font-medium">${item.spend.toLocaleString()}</td>
                        <td className="px-6 py-5 text-slate-600">{(item.impressions / 1000).toFixed(0)}k</td>
                        <td className="px-6 py-5 text-slate-600">{((item.clicks / item.impressions) * 100).toFixed(2)}%</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${item.roas >= 4 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                            {item.roas}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case ViewMode.SEO_SUITE:
        return <SeoSuitePanel />;
      case ViewMode.SOCIAL_HUB:
        return <SocialHubPanel />;
      case ViewMode.WORKFLOWS:
        return <WorkflowPanel />;
      case ViewMode.COMPETITORS:
        return <CompetitorInsights competitors={MOCK_DASHBOARD_DATA.competitors} />;
      case ViewMode.MARKET_INTEL:
        return <MarketIntelPanel channel={selectedChannel === 'All Channels' ? 'Digital Marketing' : selectedChannel} />;
      case ViewMode.AI_STRATEGY:
        return <AgentHubPanel />;
      case ViewMode.SETTINGS:
        return <SettingsPanel />;
      default:
        return <div className="text-center py-20 text-slate-400 font-medium">Coming Soon...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto px-8 py-8 lg:px-12 lg:py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">
              {currentView.replace('_', ' ')}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              {selectedChannel} • {dateRange}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full p-3 shadow-sm transition-all"
            >
              {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
            </select>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 flex items-center gap-2 whitespace-nowrap"
              onClick={() => alert('Exporting report...')}
            >
              🚀 Export
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
