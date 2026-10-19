import React, { useState } from 'react';
import { 
  Coffee, ShoppingBag, Plus, Minus, Trash2, CheckCircle, Search, Receipt, 
  Lock, User, DollarSign, ShieldAlert, Percent, XSquare, Clock, LogOut, Layers
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'breakfast', name: '🍳 Breakfast' },
  { id: 'pizza', name: '🍕 Pizza' },
  { id: 'coffee', name: '☕ Espresso & Hot' },
  { id: 'cold', name: '🧊 Cold & Blended' },
  { id: 'beverage', name: '🍹 Mocktails & Tea' },
  { id: 'bakery', name: '🥐 Bakery' }
];

const MENU_ITEMS = [
  { id: 1, name: 'Full English Breakfast Platter', category: 'breakfast', price: 810, tag: 'Signature' },
  { id: 2, name: 'Croissant Sandwich', category: 'breakfast', price: 610, tag: 'Popular' },
  { id: 3, name: 'Golden Brown Pancake', category: 'breakfast', price: 380, tag: 'Sweet' },
  { id: 4, name: 'Margherita Classico Pizza', category: 'pizza', price: 500, tag: 'Wood-Fired' },
  { id: 5, name: 'Meat Lovers Supreme Pizza', category: 'pizza', price: 550, tag: 'Bestseller' },
  { id: 6, name: 'Double Espresso', category: 'coffee', price: 150, tag: 'Hot' },
  { id: 7, name: 'Cappuccino / Latte', category: 'coffee', price: 210, tag: 'Hot' },
  { id: 8, name: 'Iced Spanish Latte', category: 'cold', price: 270, tag: 'Cold Bar' },
  { id: 9, name: 'Iced Matcha Latte', category: 'cold', price: 300, tag: 'Specialty' },
  { id: 10, name: 'Peach Iced Tea', category: 'beverage', price: 200, tag: 'Refreshing' },
  { id: 11, name: 'Virgin Mojito', category: 'beverage', price: 350, tag: 'Mocktail' },
  { id: 12, name: 'Butter Croissant', category: 'bakery', price: 180, tag: 'Fresh' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('Dine-In');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [tillAmount] = useState(15000);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableTotal = subtotal - discountAmount;
  const serviceCharge = Math.round(taxableTotal * 0.10);
  const total = taxableTotal + serviceCharge;

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderComplete(true);
    setTimeout(() => {
      setCart([]);
      setDiscountPercent(0);
      setOrderComplete(false);
    }, 2500);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#1E120B] flex flex-col items-center justify-center text-white px-4">
        <div className="w-18 h-18 rounded-2xl bg-[#2B1B12] border border-[#483325] flex items-center justify-center text-2xl font-bold mb-4 shadow-2xl text-[#D98848]">☕</div>
        <h2 className="text-2xl font-bold serif mb-2">Terminal is Locked</h2>
        <p className="text-[#A39081] text-sm mb-6">Enter cashier PIN or password to resume operations.</p>
        <button 
          onClick={() => setIsLocked(false)}
          className="bg-[#D98848] hover:bg-[#c27637] text-white font-bold px-8 py-3 rounded-full transition shadow-lg cursor-pointer"
        >
          Unlock Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#2C1E18] flex flex-col font-sans antialiased selection:bg-[#D98848] selection:text-white">
      
      {/* Top Header Bar */}
      <header className="bg-[#1E120B] text-[#F5F1EB] px-6 py-3.5 flex justify-between items-center shadow-lg border-b border-[#362317]">
        <div className="flex items-center gap-3.5">
          {/* Logo Brand Emblem */}
          <div className="w-11 h-11 rounded-xl bg-[#2B1B12] border border-[#4E372A] flex items-center justify-center font-bold text-base text-[#D98848] shadow-inner relative overflow-hidden group">
            <span className="serif text-lg tracking-tighter">L·J</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight serif flex items-center gap-2">
              Lekali Java <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 rounded bg-[#362317] text-[#D98848] border border-[#483325]">PRO POS</span>
            </h1>
            <p className="text-[11px] text-[#A39081]">Samakhusi Townplanning Terminal #1</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden md:flex items-center gap-2 text-xs bg-[#2B1B12] px-3.5 py-1.5 rounded-full border border-[#402B1D] text-[#D4C4B7]">
            <Clock className="w-3.5 h-3.5 text-[#D98848]" /> 20 Oct 2026, 12:13 AM
          </div>
          <span className="bg-[#2B1B12] text-[#E5A973] px-4 py-1.5 rounded-full border border-[#402B1D] text-xs font-semibold flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E5A973] animate-pulse"></span> Cashier: Kenish
          </span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 max-w-[1600px] mx-auto w-full">
        
        {/* Left Section: Catalog & Quick Action Toolbar */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Search & Order Type Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3.5 rounded-2xl border border-[#E6DDD3] shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8A766A]" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F5F1EB] border border-[#E6DDD3] text-sm focus:outline-none focus:border-[#D98848] transition"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#F5F1EB] p-1 rounded-xl border border-[#E6DDD3] w-full sm:w-auto">
              {['Dine-In', 'Take Away', 'Delivery'].map(type => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${orderType === type ? 'bg-[#2B1B12] text-white shadow-xs' : 'text-[#5C473C] hover:text-[#1E120B]'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category Horizontal Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 border cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'bg-[#2B1B12] text-white border-[#2B1B12] shadow-xs' 
                    : 'bg-white text-[#5C473C] border-[#E6DDD3] hover:border-[#2B1B12]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 overflow-y-auto max-h-[calc(100vh-360px)] pr-1">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-3.5 rounded-2xl border border-[#E6DDD3] text-left flex flex-col justify-between hover:border-[#D98848] hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer h-28"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#F3EDE2] text-[#A65D24]">{item.tag}</span>
                  <h3 className="font-bold text-[#1E120B] text-xs mt-1.5 line-clamp-2 group-hover:text-[#D98848] transition">{item.name}</h3>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-[#2B1B12] text-xs">Rs. {item.price}</span>
                  <div className="w-6 h-6 rounded-full bg-[#F5F1EB] group-hover:bg-[#D98848] group-hover:text-white flex items-center justify-center transition">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Professional Control Toolbar */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-white p-3 rounded-2xl border border-[#E6DDD3] shadow-xs">
            <button onClick={() => setActiveModal('till')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EFE6DD] text-[#2B1B12] transition text-[11px] font-semibold gap-1 cursor-pointer">
              <Layers className="w-4 h-4 text-[#D98848]" /> Close Till
            </button>
            <button onClick={() => setActiveModal('petty')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EFE6DD] text-[#2B1B12] transition text-[11px] font-semibold gap-1 cursor-pointer">
              <DollarSign className="w-4 h-4 text-[#D98848]" /> Petty Cash
            </button>
            <button onClick={() => setActiveModal('safedrop')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EFE6DD] text-[#2B1B12] transition text-[11px] font-semibold gap-1 cursor-pointer">
              <ShieldAlert className="w-4 h-4 text-[#D98848]" /> Safe Drop
            </button>
            <button onClick={() => setDiscountPercent(prev => prev === 0 ? 10 : 0)} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EFE6DD] text-[#2B1B12] transition text-[11px] font-semibold gap-1 cursor-pointer">
              <Percent className="w-4 h-4 text-[#D98848]" /> {discountPercent > 0 ? 'Disc Active' : 'Discount'}
            </button>
            <button onClick={() => setCart([])} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-red-50 text-[#2B1B12] hover:text-red-600 transition text-[11px] font-semibold gap-1 cursor-pointer">
              <XSquare className="w-4 h-4 text-red-500" /> Void Order
            </button>
            <button onClick={() => alert("Customer loyalty profile assigned.")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EFE6DD] text-[#2B1B12] transition text-[11px] font-semibold gap-1 cursor-pointer">
              <User className="w-4 h-4 text-[#D98848]" /> Customer
            </button>
            <button onClick={() => setIsLocked(true)} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EFE6DD] text-[#2B1B12] transition text-[11px] font-semibold gap-1 cursor-pointer">
              <Lock className="w-4 h-4 text-[#D98848]" /> Lock Screen
            </button>
            <button onClick={() => alert("Session Ended.")} className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F5F1EB] hover:bg-red-50 text-red-600 transition text-[11px] font-semibold gap-1 cursor-pointer">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

        </div>

        {/* Right Section: Active Cart & Professional Billing Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E6DDD3] p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center border-b border-[#E6DDD3] pb-3 mb-3">
              <h2 className="text-sm font-bold text-[#1E120B] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D98848]" /> Current Order ({orderType})
              </h2>
              <span className="text-[11px] bg-[#F3EDE2] text-[#A65D24] px-2 py-0.5 rounded-full font-semibold">
                {cart.reduce((a, b) => a + b.qty, 0)} Items
              </span>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto max-h-[calc(100vh-420px)] space-y-2.5 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[#8A766A]">
                  <Coffee className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#2B1B12]" />
                  <p className="text-xs font-medium">Register is ready.</p>
                  <p className="text-[11px] mt-0.5 text-[#A69488]">Tap menu items on the left to add.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#F5F1EB] border border-[#EFE6DD]">
                    <div className="flex-1 pr-2">
                      <h4 className="text-xs font-bold text-[#1E120B]">{item.name}</h4>
                      <p className="text-[11px] text-[#D98848] font-semibold">Rs. {item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded-full bg-white border border-[#D5C7B8] flex items-center justify-center hover:bg-[#E6DDD3] transition cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded-full bg-white border border-[#D5C7B8] flex items-center justify-center hover:bg-[#E6DDD3] transition cursor-pointer"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeItem(item.id)} className="ml-1 text-[#A67C74] hover:text-red-600 transition cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout & Financial Calculations */}
          <div className="border-t border-[#E6DDD3] pt-3 mt-3">
            
            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${paymentMethod === 'cash' ? 'bg-[#2B1B12] text-white border-[#2B1B12]' : 'bg-[#F5F1EB] text-[#5C473C] border-[#E6DDD3]'}`}
              >
                💵 Cash Payment
              </button>
              <button 
                onClick={() => setPaymentMethod('fonepay')}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${paymentMethod === 'fonepay' ? 'bg-[#2B1B12] text-white border-[#2B1B12]' : 'bg-[#F5F1EB] text-[#5C473C] border-[#E6DDD3]'}`}
              >
                📱 Fonepay / QR
              </button>
            </div>

            <div className="space-y-1 text-xs mb-3 text-[#665349]">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#D98848]"><span>Discount ({discountPercent}%)</span><span>- Rs. {discountAmount}</span></div>
              )}
              <div className="flex justify-between"><span>Service Charge (10%)</span><span>Rs. {serviceCharge}</span></div>
              <div className="flex justify-between text-sm font-bold text-[#1E120B] pt-2 border-t border-[#EFE6DD]">
                <span>Total Amount</span>
                <span className="text-base text-[#D98848]">Rs. {total}</span>
              </div>
            </div>

            {orderComplete ? (
              <div className="w-full bg-[#E8F3EC] text-[#2F6B48] py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs animate-pulse shadow-xs">
                <CheckCircle className="w-4 h-4" /> Transaction Successful!
              </div>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-[#2B1B12] hover:bg-[#D98848] disabled:opacity-40 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
              >
                <Receipt className="w-4 h-4" /> Tender / Charge (Rs. {total})
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Active Modal Overlay for Till / Petty Cash / Safe Drop */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E6DDD3] shadow-2xl">
            <h3 className="text-lg font-bold text-[#1E120B] mb-2">
              {activeModal === 'till' && 'Close Till / Drawer Reconciliation'}
              {activeModal === 'petty' && 'Record Petty Cash Expense'}
              {activeModal === 'safedrop' && 'Safe Drop Cash Transfer'}
            </h3>
            <p className="text-xs text-[#665349] mb-4">
              {activeModal === 'till' && `Current opening balance in drawer: Rs. ${tillAmount}`}
              {activeModal === 'petty' && 'Enter cash amount paid out for urgent store supplies.'}
              {activeModal === 'safedrop' && 'Transfer cash drawer surplus securely to store safe.'}
            </p>
            <input 
              type="number" 
              placeholder="Enter amount in NPR..." 
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F1EB] border border-[#E6DDD3] text-sm mb-4 focus:outline-none focus:border-[#D98848]"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 rounded-xl text-xs font-bold bg-[#F5F1EB] text-[#5C473C] cursor-pointer">Cancel</button>
              <button onClick={() => { alert("Recorded successfully."); setActiveModal(null); }} className="px-5 py-2 rounded-xl text-xs font-bold bg-[#2B1B12] text-white hover:bg-[#D98848] transition cursor-pointer">Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}