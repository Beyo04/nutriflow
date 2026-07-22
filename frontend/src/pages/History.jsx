import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Crown, Clock, Check, X, Download, Filter } from 'lucide-react';
import axios from 'axios';
import Footer from '../components/Footer';
import PauseDeliveryModal from '../components/PauseDeliveryModal';

export default function History({ setActiveTab }) {
  const [activeView, setActiveView] = useState("orders"); // "memberships" or "orders"
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);

  // Fallback Data definitions
  const FALLBACK_MEMBERSHIPS = {
    active: {
      tier: "Premium",
      plan: "High Protein Weekly Plan",
      startDate: "21 Jul 2026",
      status: "Active",
      tomorrowSlot: "7:00 AM",
      completedBreakfasts: 3,
      totalBreakfasts: 5
    },
    previous: [
      {
        tier: "Standard",
        plan: "Balanced Diet Weekly Plan",
        startDate: "15 May 2026",
        endDate: "10 Jun 2026",
        status: "Cancelled",
        durationWeeks: 4
      },
      {
        tier: "Premium",
        plan: "Weight Loss Weekly Plan",
        startDate: "10 Mar 2026",
        endDate: "7 Apr 2026",
        status: "Completed",
        durationWeeks: 4
      }
    ]
  };

  const FALLBACK_ORDERS = [
    {
      _id: "o1",
      orderNumber: "NT24581",
      dishName: "Herb Grilled Chicken Sandwich",
      dishImage: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=150&h=150&fit=crop",
      status: "Delivered",
      totalAmount: 249,
      date: "21 Jul 2026"
    },
    {
      _id: "o2",
      orderNumber: "NT24578",
      dishName: "Greek Yogurt Fruit Bowl",
      dishImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop",
      status: "Delivered",
      totalAmount: 189,
      date: "20 Jul 2026"
    },
    {
      _id: "o3",
      orderNumber: "NT24562",
      dishName: "Peri Peri Chicken Sandwich",
      dishImage: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=150&h=150&fit=crop",
      status: "Cancelled",
      totalAmount: 229,
      date: "19 Jul 2026"
    }
  ];

  const FALLBACK_ORDER_SUMMARY = {
    totalOrders: 14,
    totalSpent: 3450,
    savings: 420
  };

  // Filter lists based on status filter & query
  const filteredOrders = FALLBACK_ORDERS.filter(order => {
    const matchesSearch = order.dishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredMemberships = {
    active: FALLBACK_MEMBERSHIPS.active.plan.toLowerCase().includes(searchQuery.toLowerCase()) && 
            (statusFilter === "All" || statusFilter === "Active") ? FALLBACK_MEMBERSHIPS.active : null,
    previous: FALLBACK_MEMBERSHIPS.previous.filter(p => {
      const matchesSearch = p.plan.toLowerCase().includes(searchQuery.toLowerCase()) || p.tier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesFilter;
    })
  };

  const handleDownloadReport = () => {
    // Generate trigger download mockup
    const element = document.createElement("a");
    const file = new Blob(["Order History Report Mock"], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "NutriFlow_Report.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="bg-[#FAFBFF] min-h-screen relative font-sans overflow-x-hidden pt-20">
      {/* Glow effect background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[#EDF8EF]/60 opacity-70 blur-[120px] pointer-events-none -z-10" />

      {/* 1. PAGE HEADER */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">History</h1>
        <p className="text-xs text-slate-400 mt-1 font-semibold">Track your breakfast orders and memberships with high-resolution details and progress insights.</p>
      </div>

      {/* 2. SEARCH & SUB-TAB TOGGLES */}
      <div className="max-w-6xl mx-auto px-6 mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:border-[#1F4D2C]/40 focus:outline-none transition-all shadow-sm"
          />
        </div>

        {/* Toggle view tabs */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 self-start sm:self-auto">
          <button
            onClick={() => { setActiveView("orders"); setStatusFilter("All"); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === "orders" 
                ? "bg-[#1F4D2C] text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🛍️ Order Today</span>
          </button>
          <button
            onClick={() => { setActiveView("memberships"); setStatusFilter("All"); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === "memberships" 
                ? "bg-[#1F4D2C] text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📋 Membership</span>
          </button>
        </div>

      </div>

      {/* 3. STATUS FILTERS */}
      <div className="max-w-6xl mx-auto px-6 mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none text-left">
        {activeView === "memberships" ? (
          ["All", "Completed", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === f 
                  ? "bg-[#1F4D2C] text-white" 
                  : "bg-white border border-gray-200 text-slate-500 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))
        ) : (
          ["All", "Delivered", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === f 
                  ? "bg-[#1F4D2C] text-white" 
                  : "bg-white border border-gray-200 text-slate-500 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))
        )}
      </div>

      {/* TAB CONTENT VIEWS */}
      <div className="max-w-6xl mx-auto px-6 pb-28 text-left">
        <AnimatePresence mode="wait">
          
          {activeView === "memberships" ? (
            <motion.div
              key="memberships"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Active Membership Section */}
              {filteredMemberships.active && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                  {/* Left green tag decoration */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1F4D2C]" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Premium Membership</h2>
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>Active</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GOAL</span>
                          <strong className="text-xs text-slate-700 font-extrabold mt-1 block">High Protein</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PLAN</span>
                          <strong className="text-xs text-slate-700 font-extrabold mt-1 block">Weekly Plan</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">STARTED</span>
                          <strong className="text-xs text-slate-700 font-extrabold mt-1 block">21 Jul 2026</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NEXT BREAKFAST</span>
                          <strong className="text-xs text-[#1F4D2C] font-extrabold mt-1 block">Tomorrow 7:00 AM</strong>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2 pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-end text-[11px] font-semibold text-slate-500">
                          <span>3 of 5 breakfasts completed</span>
                          <span className="text-[#1F4D2C] font-bold">73% Progress</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1F4D2C] rounded-full" style={{ width: '73%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => setIsPauseModalOpen(true)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-[#1F4D2C] hover:bg-[#173C22] text-white rounded-xl text-xs font-bold transition shadow-md shadow-green-950/10 cursor-pointer text-center"
                      >
                        Pause
                      </button>
                      <button 
                        onClick={() => setActiveTab("Membership")}
                        className="flex-1 md:flex-none px-6 py-2.5 border border-gray-200 hover:border-gray-300 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer text-center"
                      >
                        View Weekly Menu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Memberships Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Previous Memberships</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMemberships.previous.map((p, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 text-slate-400 flex items-center justify-center">
                          {p.status === "Cancelled" ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-700">{p.tier} Membership</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{p.plan} • Mar 2026</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        p.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              
              {/* Left Order lists */}
              <div className="lg:col-span-8 space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5 items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-gray-100 flex-shrink-0">
                        <img src={order.dishImage} alt={order.dishName} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{order.dishName}</h4>
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono font-medium">Order {order.orderNumber} • {order.date}</p>
                        <strong className="text-sm text-[#1F4D2C] font-extrabold font-mono block">₹{order.totalAmount}</strong>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab("Order Today")}
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#1F4D2C] hover:bg-[#173C22] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Summary sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-left space-y-5 sticky top-28">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-gray-50">Order Summary</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Orders this month</span>
                      <strong className="text-slate-800 font-extrabold font-mono">{FALLBACK_ORDER_SUMMARY.totalOrders}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Total Spent</span>
                      <strong className="text-slate-800 font-extrabold font-mono">₹{FALLBACK_ORDER_SUMMARY.totalSpent}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Savings</span>
                      <strong className="text-green-600 font-extrabold font-mono">₹{FALLBACK_ORDER_SUMMARY.savings}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={handleDownloadReport}
                    className="w-full py-3 bg-[#EAF7EB] hover:bg-[#1F4D2C] hover:text-white border border-[#1F4D2C]/10 text-[#1F4D2C] rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Monthly Report</span>
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Pause Modal */}
      <PauseDeliveryModal 
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        onPauseSuccess={() => {}}
      />

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
