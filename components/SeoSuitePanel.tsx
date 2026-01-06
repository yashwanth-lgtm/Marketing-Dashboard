
import React, { useState } from 'react';
import { runSeoAudit } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_SEO_HISTORY = [
  { month: 'Jan', traffic: 4500, ranking: 12 },
  { month: 'Feb', traffic: 5200, ranking: 10 },
  { month: 'Mar', traffic: 4800, ranking: 11 },
  { month: 'Apr', traffic: 6100, ranking: 8 },
  { month: 'May', traffic: 7500, ranking: 5 },
  { month: 'Jun', traffic: 8900, ranking: 3 },
];

const SeoSuitePanel: React.FC = () => {
  const [domain, setDomain] = useState('mybrand.com');
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<{ analysis: string; sources: any[] } | null>(null);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const result = await runSeoAudit(domain);
      setAudit(result);
    } catch (e) {
      alert("Error auditing domain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Domain Analysis</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={domain} 
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                placeholder="Enter domain (e.g., competitor.com)"
              />
              <button 
                onClick={handleAudit}
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Run Audit'}
              </button>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="text-center px-6 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Domain Rating</p>
                <p className="text-2xl font-black text-indigo-600">74</p>
             </div>
             <div className="text-center px-6 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-400 uppercase">Health Score</p>
                <p className="text-2xl font-black text-emerald-600">92%</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-80">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>📈</span> Organic Traffic Growth
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_SEO_HISTORY}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="traffic" stroke="#6366f1" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {audit && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 prose prose-slate max-w-none">
                <h3 className="text-xl font-bold mb-4">Gemini Live Audit Summary</h3>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {audit.analysis}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4">High Potential Keywords</h4>
              <div className="space-y-3">
                {[
                  { kw: 'marketing analytics', vol: '12k', diff: 45 },
                  { kw: 'competitor insights tool', vol: '2.4k', diff: 21 },
                  { kw: 'ai marketing dashboard', vol: '8.1k', diff: 68 },
                  { kw: 'saas reporting api', vol: '1.2k', diff: 12 },
                ].map((item) => (
                  <div key={item.kw} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.kw}</p>
                      <p className="text-[10px] text-slate-400">Vol: {item.vol}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold ${item.diff < 30 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      KD: {item.diff}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200">
              <h4 className="font-bold mb-2">Backlink Opportunity</h4>
              <p className="text-sm text-indigo-100 mb-4">You have 14 broken backlinks pointing to pages that don't exist.</p>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-bold transition-all">
                Export Target List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSuitePanel;
