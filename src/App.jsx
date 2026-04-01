import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, BarChart3, Wallet, Settings, Bell, Search, 
  TrendingUp, CheckCircle2, Clock, XCircle, Menu, X, Plus, User, Shield, Moon, Eye, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// --- DATI MOCK ---
const chartData = [
  { name: 'Gen', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
  { name: 'Mag', revenue: 6000 }, { name: 'Giu', revenue: 5500 },
  { name: 'Lug', revenue: 7000 },
];

const transactionsData = [
  { id: "#TR-8842", user: "Marco Rossi", date: "01 Apr 2026", amount: "€1,200.00", status: "Completed" },
  { id: "#TR-8843", user: "Elena Bianchi", date: "31 Mar 2026", amount: "€850.50", status: "Pending" },
  { id: "#TR-8844", user: "Luca Verdi", date: "30 Mar 2026", amount: "€2,400.00", status: "Completed" },
  { id: "#TR-8845", user: "Giulia Neri", date: "29 Mar 2026", amount: "€150.00", status: "Canceled" },
];

const walletPieData = [
  { name: 'Bitcoin (BTC)', value: 45, color: '#06b6d4' },
  { name: 'Ethereum (ETH)', value: 25, color: '#8b5cf6' },
  { name: 'Solana (SOL)', value: 15, color: '#eab308' },
  { name: 'Stablecoins', value: 10, color: '#10b981' },
  { name: 'Others', value: 5, color: '#6366f1' },
];

// --- COMPONENTI UI ---
const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={20} /> <span className="font-medium text-sm">{label}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/20",
    Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Canceled: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return <span className={`px-2 py-1 rounded-full border text-[10px] uppercase font-bold ${styles[status]}`}>{status}</span>;
};

// --- PAGINA OVERVIEW ---
const OverviewPage = ({ searchTerm }) => {
  const filteredTransactions = useMemo(() => {
    return transactionsData.filter(tx => tx.user.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl shadow-xl"><p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Balance</p><h3 className="text-3xl font-bold text-white tracking-tight">€42,890.00</h3></div>
          <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl shadow-xl"><p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Monthly Growth</p><h3 className="text-3xl font-bold text-cyan-500 tracking-tight">+24.5%</h3></div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-[350px] shadow-2xl">
          <h4 className="font-bold text-white mb-6">Revenue Analytics</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#111827]/50 border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <h4 className="font-bold text-white mb-6">Recent Transactions</h4>
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-slate-500 text-[10px] uppercase font-bold border-b border-slate-800"><th className="pb-4">Customer</th><th className="pb-4">Amount</th><th className="pb-4">Status</th></tr></thead><tbody className="text-xs">
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/30"><td className="py-4"><p className="text-white font-bold">{tx.user}</p><p className="text-slate-500 text-[10px]">{tx.id}</p></td><td className="py-4 font-bold text-white">{tx.amount}</td><td className="py-4"><StatusBadge status={tx.status} /></td></tr>
                ))}
          </tbody></table></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <h4 className="font-bold text-white mb-6 italic tracking-tight uppercase text-xs">Active Projects</h4>
          <div className="space-y-6">
            <ProjectItem name="Restaurant App" progress={85} color="bg-cyan-500" />
            <ProjectItem name="Medical Portfolio" progress={60} color="bg-purple-500" />
            <ProjectItem name="SaaS Dashboard" progress={45} color="bg-yellow-500" />
          </div>
        </div>
        <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-3xl text-center shadow-xl">
           <div className="w-12 h-12 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center border border-slate-700">
              <Settings className="text-slate-500 animate-spin" size={20} />
           </div>
           <p className="text-white font-bold text-xs uppercase">System Status</p>
           <p className="text-green-500 text-[10px] font-bold mt-1 tracking-widest uppercase">● Operational</p>
        </div>
      </div>
    </div>
  );
};

const ProjectItem = ({ name, progress, color }) => (
  <div>
    <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-wider"><span className="text-slate-400">{name}</span><span className="text-slate-500">{progress}%</span></div>
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${color}`} /></div>
  </div>
);

// --- PAGINA MARKET ---
const MarketPage = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=20&page=1&sparkline=false');
        setCoins(res.data);
        setLoading(false);
      } catch (err) { console.error("API Error", err); }
    };
    fetchMarket();
  }, []);

  const filteredCoins = coins.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h3 className="text-2xl font-bold text-white italic tracking-tight">Crypto Market Explorer</h3><p className="text-slate-500 text-xs">Monitora i prezzi e i trend in tempo reale</p></div>
        <div className="relative w-full md:w-64">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
           <input type="text" placeholder="Filtra Crypto..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-xs w-full focus:ring-1 ring-cyan-500 outline-none" />
        </div>
      </div>

      <div className="bg-[#111827]/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? <div className="p-10 text-center text-slate-500 italic">Caricamento mercato...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-bold border-b border-slate-800 bg-slate-800/20">
                  <th className="p-5">Asset</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">24h %</th>
                  <th className="p-5 hidden md:table-cell">Market Cap</th>
                  <th className="p-5 hidden lg:table-cell">High/Low 24h</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCoins.map(coin => (
                  <tr key={coin.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all">
                    <td className="p-5 flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <div><p className="font-bold text-white leading-none">{coin.name}</p><span className="text-[10px] text-slate-500 uppercase">{coin.symbol}</span></div>
                    </td>
                    <td className="p-5 font-bold text-white">€{coin.current_price.toLocaleString()}</td>
                    <td className={`p-5 font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="p-5 text-slate-400 hidden md:table-cell text-xs">€{coin.market_cap.toLocaleString()}</td>
                    <td className="p-5 text-slate-400 hidden lg:table-cell text-xs">
                      <div className="flex flex-col"><span className="text-green-500/50 font-bold">H: €{coin.high_24h.toLocaleString()}</span><span className="text-red-500/50 font-bold">L: €{coin.low_24h.toLocaleString()}</span></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- PAGINA WALLET ---
const WalletPage = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl">
      <h4 className="font-bold text-white mb-8 italic tracking-tight">Portfolio Allocation</h4>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={walletPieData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
              {walletPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="space-y-6">
       <div className="bg-slate-800/20 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest text-slate-500">Your Main Holdings</h4>
          <div className="space-y-4">
             {walletPieData.map(item => (
                <div key={item.name} className="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-slate-700/30 hover:border-cyan-500/20 transition-all">
                   <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div><span className="font-bold text-white text-sm">{item.name}</span></div>
                   <span className="font-bold text-cyan-500">{item.value}%</span>
                </div>
             ))}
          </div>
       </div>
    </div>
  </div>
);

// --- PAGINA SETTINGS ---
const SettingsPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl text-left space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 text-cyan-500 mb-2"><User size={20}/><h4 className="font-bold text-white text-sm uppercase tracking-wider">Account Profile</h4></div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2"><label className="text-[10px] text-slate-500 font-bold uppercase">Display Name</label><input type="text" defaultValue="Emidio Tullio" className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-sm focus:ring-1 ring-cyan-500 outline-none text-white"/></div>
          <div className="flex flex-col gap-2"><label className="text-[10px] text-slate-500 font-bold uppercase">Email Address</label><input type="email" defaultValue="emidio@nexus.it" className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-sm outline-none text-slate-400" disabled/></div>
        </div>
        <button className="w-full py-3 bg-cyan-500 text-slate-900 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Salva Modifiche</button>
      </div>

      <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 text-purple-500 mb-2"><Shield size={20}/><h4 className="font-bold text-white text-sm uppercase tracking-wider">Security</h4></div>
        <div className="space-y-4">
           <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30"><div><p className="text-xs font-bold text-white">2FA Auth</p><p className="text-[10px] text-slate-500">Secure your account</p></div><div className="w-10 h-5 bg-cyan-500 rounded-full relative p-1"><div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm"></div></div></div>
           <button className="w-full py-3 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-bold transition-all text-white">Change Password</button>
        </div>
      </div>
    </div>
    
    <div className="bg-slate-800/20 border border-slate-800 p-8 rounded-3xl flex flex-wrap gap-8 justify-between items-center">
       <div className="flex items-center gap-6"><div className="flex items-center gap-2 text-yellow-500"><Globe size={18}/><span className="text-xs font-bold text-white uppercase">Language</span></div><p className="text-sm text-slate-500">Italiano (IT)</p></div>
       <div className="flex items-center gap-6"><div className="flex items-center gap-2 text-cyan-500"><Moon size={18}/><span className="text-xs font-bold text-white uppercase">Theme</span></div><p className="text-sm text-slate-500">Deep Space (Dark)</p></div>
    </div>
  </motion.div>
);

// --- APP PRINCIPALE ---
export default function App() {
  const [activePage, setActivePage] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800/50 p-6 flex flex-col gap-8 hidden lg:flex bg-[#0a0f1c] sticky top-0 h-screen text-left shadow-2xl">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20"><TrendingUp size={22} className="text-slate-900" /></div>
          <h1 className="text-xl font-bold text-white tracking-tighter italic">Nexus<span className="text-cyan-500">Auth</span></h1>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activePage === 'Overview'} onClick={() => setActivePage('Overview')} />
          <SidebarItem icon={BarChart3} label="Market" active={activePage === 'Market'} onClick={() => setActivePage('Market')} />
          <SidebarItem icon={Wallet} label="Wallet" active={activePage === 'Wallet'} onClick={() => setActivePage('Wallet')} />
          <div className="my-4 border-t border-slate-800/50"></div>
          <SidebarItem icon={Settings} label="Settings" active={activePage === 'Settings'} onClick={() => setActivePage('Settings')} />
        </nav>

        {/* BOX ABBONAMENTO */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-5 rounded-2xl border border-slate-700/50 text-center shadow-inner">
          <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-cyan-500/20 font-bold italic text-sm">PRO</div>
          <p className="text-white font-bold text-sm mb-1 tracking-tight">Piano Professionale</p>
          <p className="text-slate-500 text-[10px] mb-4 uppercase font-bold tracking-widest">Active Member</p>
          <button className="w-full py-2.5 bg-cyan-500 text-slate-900 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/10">Manage Subscription</button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-10">
          <div className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu className="text-slate-400 cursor-pointer" /></div>
          <div className="hidden md:block text-left">
            <h2 className="text-2xl font-bold text-white italic tracking-tight">{activePage}</h2>
            <p className="text-slate-500 text-sm italic">Benvenuto nel cuore di NexusAuth.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="bg-slate-800/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 ring-cyan-500/50 outline-none w-40 md:w-64 transition-all" />
            </div>
            <div className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl cursor-pointer text-slate-400 hover:text-cyan-500 transition-all shadow-lg"><Bell size={20} /></div>
          </div>
        </header>

        <div className="min-h-[70vh]">
          {activePage === 'Overview' && <OverviewPage searchTerm={searchTerm} />}
          {activePage === 'Market' && <MarketPage />}
          {activePage === 'Wallet' && <WalletPage />}
          {activePage === 'Settings' && <SettingsPage />}
        </div>
      </main>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed inset-y-0 left-0 w-72 bg-[#0a0f1c] z-50 p-8 border-r border-slate-800 lg:hidden text-left flex flex-col">
               <div className="flex justify-between items-center mb-10"><h1 className="text-xl font-bold text-cyan-500 italic tracking-tighter uppercase">NexusAuth</h1><X onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500" /></div>
               <nav className="flex flex-col gap-4 flex-1">
                  <SidebarItem icon={LayoutDashboard} label="Overview" active={activePage === 'Overview'} onClick={() => { setActivePage('Overview'); setIsMobileMenuOpen(false); }} />
                  <SidebarItem icon={BarChart3} label="Market" active={activePage === 'Market'} onClick={() => { setActivePage('Market'); setIsMobileMenuOpen(false); }} />
                  <SidebarItem icon={Wallet} label="Wallet" active={activePage === 'Wallet'} onClick={() => { setActivePage('Wallet'); setIsMobileMenuOpen(false); }} />
                  <SidebarItem icon={Settings} label="Settings" active={activePage === 'Settings'} onClick={() => { setActivePage('Settings'); setIsMobileMenuOpen(false); }} />
               </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}