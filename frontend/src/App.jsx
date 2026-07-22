import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Membership from './pages/Membership'
import OrderToday from './pages/OrderToday'
import Cart from './pages/Cart'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import History from './pages/History'
import ContactUs from './pages/ContactUs'
import ChatBot from './components/ChatBot'
import OTPModal from './components/OTPModal'
import { useLenis } from './hooks/useLenis'

const App = () => {
  useLenis()
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")

  const [cartItems, setCartItems] = useState([])
  const [cartQuantities, setCartQuantities] = useState({})

  const addToCart = (menuItem) => {
    setCartQuantities(prev => ({
      ...prev,
      [menuItem._id]: (prev[menuItem._id] || 0) + 1
    }))
    setCartItems(prev => {
      const exists = prev.find(i => i._id === menuItem._id)
      if (exists) return prev
      return [...prev, menuItem]
    })
  }

  const updateCartQty = (itemId, newQty) => {
    if (newQty <= 0) {
      setCartQuantities(prev => {
        const copy = { ...prev }
        delete copy[itemId]
        return copy
      })
      setCartItems(prev => prev.filter(i => i._id !== itemId))
    } else {
      setCartQuantities(prev => ({ ...prev, [itemId]: newQty }))
    }
  }

  const clearCart = () => {
    setCartItems([])
    setCartQuantities({})
  }

  const [checkoutMode, setCheckoutMode] = useState("idle") // idle, subscription, orderNow

  return (
    <div className="bg-[#FAFBFF] text-slate-500 font-sans min-h-screen relative overflow-x-hidden dot-grid">

      {/* Background Noise Layer — STATIC, no animation, lower z-index, no blend mode */}
      <div className="fixed inset-0 noise-overlay opacity-[0.02] z-0 pointer-events-none" />

      {/* Background Floating Orbs — removed blur, using solid soft gradients instead */}
      <div
        className="absolute top-[10%] right-[-5%] w-112.5 h-112.5 rounded-full pointer-events-none animate-float-slow will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-[40%] left-[-10%] w-95 h-95 rounded-full pointer-events-none animate-float-fast will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[20%] right-[10%] w-137.5 h-137.5 rounded-full pointer-events-none animate-float will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.05) 0%, transparent 70%)' }}
      />

      {/* Navigation */}
      <Navbar 
        onOpenOTP={() => setIsOtpModalOpen(true)} 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "Membership") setCheckoutMode("subscription");
          setActiveTab(tab);
        }}
        cartCount={Object.values(cartQuantities).reduce((sum, qty) => sum + qty, 0)}
      />

      {/* Main Page Content */}
      {activeTab === "Membership" ? (
        <Membership 
          setActiveTab={setActiveTab} 
          onGoToMeals={() => setActiveTab("Membership")} 
          onOpenOTP={() => setIsOtpModalOpen(true)}
          checkoutMode={checkoutMode}
          setCheckoutMode={setCheckoutMode}
          cartItems={cartItems}
          cartQuantities={cartQuantities}
          clearCart={clearCart}
        />
      ) : activeTab === "Order Today" ? (
        <OrderToday 
          onOpenOTP={() => setIsOtpModalOpen(true)} 
          setActiveTab={setActiveTab} 
          cartItems={cartItems} 
          cartQuantities={cartQuantities} 
          addToCart={addToCart} 
          updateCartQty={updateCartQty} 
        />
      ) : activeTab === "Cart" ? (
        <Cart 
          setActiveTab={setActiveTab} 
          onOpenOTP={() => setIsOtpModalOpen(true)} 
          cartItems={cartItems} 
          cartQuantities={cartQuantities} 
          updateCartQty={updateCartQty} 
          clearCart={clearCart}
          setCheckoutMode={setCheckoutMode}
        />
      ) : activeTab === "About" ? (
        <About setActiveTab={setActiveTab} />
      ) : activeTab === "Profile" ? (
        <Profile setActiveTab={setActiveTab} onOpenOTP={() => setIsOtpModalOpen(true)} />
      ) : activeTab === "History" ? (
        <History setActiveTab={setActiveTab} />
      ) : (activeTab === "Contact Us" || activeTab === "ContactUs") ? (
        <ContactUs setActiveTab={setActiveTab} />
      ) : activeTab === "Home" ? (
        (() => {
          const token = localStorage.getItem('nutriflow_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
          if (token) {
            return <Dashboard setActiveTab={setActiveTab} />
          }
          return (
            <Home setActiveTab={(tab) => {
              if (tab === "Membership") setCheckoutMode("subscription");
              setActiveTab(tab);
            }} onOpenOTP={() => setIsOtpModalOpen(true)} />
          )
        })()
      ) : (
        <Home setActiveTab={(tab) => {
          if (tab === "Membership") setCheckoutMode("subscription");
          setActiveTab(tab);
        }} onOpenOTP={() => setIsOtpModalOpen(true)} />
      )}

      {/* Standalone Floating AI Chatbot Overlay */}
      <ChatBot />

      {/* NutriFlow OTP Verification Modal */}
      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </div>
  )
}

export default App