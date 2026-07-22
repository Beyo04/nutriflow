import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Crown, Truck, BotMessageSquare, Check, Clock, Sparkles } from "lucide-react"

const HowItWorks = () => {
  const features = [
    {
      title: "Goal-Based Nutrition",
      desc: "Choose breakfasts tailored to your health goals.",
      image: "/nutrition_benefit.png",
      bgColor: "#FCF7F0",
      illustration: "nutrition"
    },
    {
      title: "Flexible Membership",
      desc: "Plan & Customize meals, Pause deliveries with ease.",
      image: "/membership_benefit.png",
      bgColor: "#F5F5FA",
      illustration: "membership"
    },
    {
      title: "Fresh Daily Delivery",
      desc: "Fresh breakfasts, wherever you need them.",
      image: "/delivery_benefit.png",
      bgColor: "#EAF3EC",
      illustration: "delivery"
    },
    {
      title: "AI Health Assistant",
      desc: "Get instant AI-powered nutrition guidance and meal insights.",
      image: "/ai_assistant_benefit.png",
      bgColor: "#F0F7F4",
      illustration: "chat"
    }
  ]

  const FlipCard = ({ item, idx }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1, y: 0,
            transition: { type: 'spring', stiffness: 60, damping: 18, delay: idx * 0.15 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        className="aspect-[3/4] rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* FRONT FACE */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[32px]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <h3 className="absolute bottom-0 left-0 right-0 p-5 pb-6 text-white text-lg font-bold z-10">
              {item.title}
            </h3>
          </div>

          {/* BACK FACE */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[32px] border border-slate-100/80 flex flex-col p-4 pt-5 text-left"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              backgroundColor: item.bgColor
            }}
          >
            <h3 className="text-[15px] font-bold text-slate-900 text-center mb-3">
              {item.title}
            </h3>

            {/* ILLUSTRATION AREA */}
            <div className="flex-1 bg-white/60 rounded-2xl p-3.5 backdrop-blur-sm border border-white/80">

              {item.illustration === "nutrition" && (
                <div className="space-y-3.5">
                  {/* Calorie header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Today's Intake</span>
                    <span className="text-[11px] font-bold text-[#1F4D2C]">1,286 kcal</span>
                  </div>

                  {/* Protein bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[11px] font-medium text-slate-600">Protein</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">85g / 100g</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* Carbs bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[11px] font-medium text-slate-600">Carbs</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">120g / 150g</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>

                  {/* Fat bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-[11px] font-medium text-slate-600">Fat</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">38g / 50g</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-300 to-rose-400 rounded-full" style={{ width: "76%" }} />
                    </div>
                  </div>

                  {/* Bottom stat */}
                  <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-slate-100">
                    <Sparkles className="w-3 h-3 text-[#4DB552]" />
                    <span className="text-[10px] font-semibold text-[#1F4D2C]">AI Match: 98%</span>
                  </div>
                </div>
              )}

              {item.illustration === "membership" && (
                <div className="space-y-2">
                  {/* Weekly */}
                  <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Target className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700 leading-none">Weekly</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Per week</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700">$15<span className="text-[9px] font-normal text-slate-400">/wk</span></span>
                  </div>

                  {/* Monthly - Popular */}
                  <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border-2 border-[#4DB552] relative">
                    <div className="absolute -top-2 right-2 bg-[#4DB552] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Popular</div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#EAF7EB] flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-[#4DB552]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700 leading-none">Monthly</p>
                        <p className="text-[9px] text-[#4DB552] mt-0.5 font-medium">Save 35%</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-[#1F4D2C]">$39<span className="text-[9px] font-normal text-slate-400">/mo</span></span>
                  </div>

                  {/* Quarterly */}
                  <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700 leading-none">Quarterly</p>
                        <p className="text-[9px] text-[#4DB552] mt-0.5 font-medium">Save 47%</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700">Rs.149<span className="text-[9px] font-normal text-slate-400">/qtr</span></span>
                  </div>

                  {/* Cancel note */}
                  <p className="text-[9px] text-slate-400 text-center pt-1">Cancel or pause anytime</p>
                </div>
              )}

              {item.illustration === "delivery" && (
                <div className="space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#4DB552] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="w-0.5 h-5 bg-[#4DB552]/30" />
                    </div>
                    <div className="pb-3">
                      <p className="text-[11px] font-semibold text-slate-700">06:00 AM — Fresh Prep</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Chef-cooked with local ingredients</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#4DB552] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="w-0.5 h-5 bg-[#4DB552]/30" />
                    </div>
                    <div className="pb-3">
                      <p className="text-[11px] font-semibold text-slate-700">07:00 AM — Cold Chain Ship</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Insulated bag, 4°C constant</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Truck className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#1F4D2C]">07:15 AM — At Your Door</p>
                      <p className="text-[9px] text-amber-500 font-medium mt-0.5">Arriving in ~15 min 🚗</p>
                    </div>
                  </div>
                </div>
              )}

              {item.illustration === "chat" && (
                <div className="space-y-2.5">
                  {/* User bubble */}
                  <div className="flex justify-end">
                    <div className="bg-slate-100 rounded-2xl rounded-br-md px-3 py-2 max-w-[85%]">
                      <p className="text-[10px] text-slate-700 leading-relaxed">Can I have a snack today?</p>
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#1F4D2C] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2 border border-slate-100 max-w-[85%]">
                      <p className="text-[10px] text-slate-600 leading-relaxed">Yes! You have ~200kcal left. Try Greek yogurt + blueberries 🫐</p>
                    </div>
                  </div>

                  {/* Quick replies */}
                  <div className="flex gap-1.5 pl-7 pt-0.5">
                    <span className="text-[9px] bg-[#EAF7EB] text-[#1F4D2C] font-medium px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#d4f0d6] transition-colors">Sounds good 👍</span>
                    <span className="text-[9px] bg-slate-50 text-slate-500 font-medium px-2.5 py-1 rounded-full cursor-pointer hover:bg-slate-100 transition-colors">Alternative</span>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom description */}
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed text-center mt-3 px-1">
              {item.desc}
            </p>
          </div>

        </motion.div>
      </motion.div>
    )
  }

  return (
    <section id="why-nutriflow" className="relative py-[120px] bg-[#FAFBFF] z-30">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose <span className="bg-linear-to-r from-[hsl(128,26%,17%)]  via-[hsl(136,35%,33%)] to-[hsl(132,48%,40%)] bg-clip-text text-transparent  font-serif">NutriFlow</span>
          </h2>
          <div className="w-12 h-1 bg-[#1F4D2C] rounded-full mt-4" />
        </div>

        {/* 4-Column Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1246px] mx-auto">
          {features.map((item, idx) => (
            <FlipCard key={idx} item={item} idx={idx} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks