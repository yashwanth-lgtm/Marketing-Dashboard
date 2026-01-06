
import React, { useState, useEffect } from 'react';
import { fetchLiveMarketIntel } from '../services/geminiService';
import { LiveMarketReport } from '../types';

interface MarketIntelPanelProps {
  channel: string;
}

const MarketIntelPanel: React.FC<MarketIntelPanelProps> = ({ channel }) => {
  const [report, setReport] = useState<LiveMarketReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveMarketIntel(channel);
      setReport(data);
    } catch (err) {
      setError("Failed to fetch live market data. Please check connection or API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [channel]);

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('#')) {
        return <h3 key={i} className="text-lg font-bold text-slate-900 mt-4 mb-2">{line.replace(/#/g, '')}</h3>;
      }
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        return <li key={i} className="ml-5 text-slate-600 mb-1 list-disc">{line.substring(line.indexOf('*') + 1 || line.indexOf('-') + 1)}</li>;
      }
      return <p key={i} className="text-slate-600 mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <span className="text-xl">🌐</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Market Intelligence</h2>
              <p className="text-sm text-slate-500">Pulling real-time benchmarks & competitor moves for {channel}</p>
            </div>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-2"
          >
            {loading ? 'Fetching...' : '🔄 Refresh Data'}
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 animate-pulse">Scanning the web for latest benchmarks...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 italic">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 prose prose-slate max-w-none">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                {report && renderContent(report.summary)}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <span>🔗</span> Grounding Sources
                </h4>
                <p className="text-xs text-indigo-700 mb-4 uppercase tracking-wider font-semibold">Verified Web Data</p>
                <ul className="space-y-3">
                  {report?.sources.map((source, i) => (
                    <li key={i}>
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline block truncate font-medium"
                        title={source.title}
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                  {(!report?.sources || report.sources.length === 0) && (
                    <p className="text-sm text-slate-500 italic">No external sources cited.</p>
                  )}
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 mb-2">Pro Tip</h4>
                <p className="text-sm text-amber-800">
                  Market benchmarks fluctuate weekly. We recommend pulling this report before your Monday team sync.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketIntelPanel;
