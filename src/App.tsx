import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Phone, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  MapPin, 
  Star, 
  Menu, 
  X, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  Droplet, 
  DollarSign, 
  Globe, 
  Volume2, 
  Layers,
  HelpCircle,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { ThemeVersion, Language, OrderStatus, PricingTier } from './types';
import { servicesData, pricingTiers, testimonialsData } from './data';
import AIAssistant from './components/AIAssistant';
import TrackingWidget from './components/TrackingWidget';
import ServiceZones from './components/ServiceZones';

export default function App() {
  // Global States
  const [selectedTheme, setSelectedTheme] = useState<ThemeVersion>('Minimal Premium');
  const [language, setLanguage] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Real Brand Enhancements States
  const [showQuoteModal, setShowQuoteModal] = useState(true);
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0);

  // Dynamic state to hold newly created appointments so they can be searched immediately!
  const [customOrders, setCustomOrders] = useState<OrderStatus[]>([]);

  // Interactive booking calculator states
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingEstate, setBookingEstate] = useState('');
  const [bookingServiceType, setBookingServiceType] = useState<string>('per_kilo');
  const [bookingWeight, setBookingWeight] = useState<number>(5);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingIroning, setBookingIroning] = useState(false);
  const [bookingDetergent, setBookingDetergent] = useState('Standard');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  // Interactive price calculator states
  const [calcKilos, setCalcKilos] = useState<number>(5);
  const [calcServiceType, setCalcServiceType] = useState<string>('per_kilo');
  const [calcIroning, setCalcIroning] = useState<boolean>(false);
  const [calcDuvetSet, setCalcDuvetSet] = useState<boolean>(false);

  // General contact feedback state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Tracking page header scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-load default booking date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Pricing calculator math
  const getCalculatedPrice = (kilos: number, serviceType: string, withIroning: boolean, withDuvet: boolean): number => {
    let baseRate = 80;
    if (serviceType === 'express') baseRate = 120;
    
    let total = kilos * baseRate;

    // Bedding/combo add ons
    if (serviceType === 'bedding_set') total = 500;
    if (serviceType === 'curtains_pair') total = 300;
    if (serviceType === 'corporate_tier') return 0; // Requires quote

    // Add extra duvet combo
    if (withDuvet && serviceType !== 'bedding_set' && serviceType !== 'curtains_pair') {
      total += 500;
    }

    // Add ironing surcharge (KSH 30 per item, assume average 4 items per 5kg)
    if (withIroning) {
      const estimatedItemsCount = Math.max(kilos * 1.5, 3);
      total += Math.round(estimatedItemsCount * 30);
    }

    return total;
  };

  const currentBookingPrice = getCalculatedPrice(
    bookingWeight,
    bookingServiceType,
    bookingIroning,
    false
  );

  // Generate dynamic WhatsApp and Order Registration on Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingEstate || !bookingServiceType) {
      alert(language === 'en' ? 'Please fill out all required fields!' : 'Tafadhali jaza sehemu zote zinazohitajika!');
      return;
    }

    // Generate random order code
    const randomCode = 'LL-' + Math.floor(1000 + Math.random() * 9000);
    
    const newOrder: OrderStatus = {
      orderId: randomCode,
      phone: bookingPhone,
      name: bookingName,
      status: 'Received',
      weight: bookingWeight,
      priceEstimate: currentBookingPrice,
      orderDate: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryDate: new Date(Date.now() + 86400000 * (bookingServiceType === 'express' ? 0.25 : 2)).toLocaleDateString('en-GB') + ' (Estimated)',
      itemsSummaryEn: `${bookingWeight}kg laundry load under ${bookingServiceType} scheduling, ${bookingIroning ? 'with dynamic ironing request' : 'no ironing'}.`,
      itemsSummarySw: `Kilo ${bookingWeight} za dobi ya ${bookingServiceType}, ${bookingIroning ? 'pamoja na kupasiwa nguo' : 'bila kupasiwa'}.`,
      notesEn: `Detergent: ${bookingDetergent}. Extra notes: ${bookingNotes || 'None'}`,
      notesSw: `Sabuni: ${bookingDetergent}. Habari zaidi: ${bookingNotes || 'Hakuna'}`
    };

    // Add dynamically to local state
    setCustomOrders(prev => [newOrder, ...prev]);
    setBookingSuccessCode(randomCode);

    // Format WhatsApp pre-filled text
    const pricingUnit = bookingServiceType === 'bedding_set' ? 'set' : (bookingServiceType === 'curtains_pair' ? 'pair' : 'kilos');
    const serviceLabel = pricingTiers.find(t => t.id === bookingServiceType)?.titleEn || bookingServiceType;

    const whatsappMessage = encodeURIComponent(
      `Hi Logic Laundry Services! 👋\n\n` +
      `🧺 *NEW APPOINTMENT BOOKING [${randomCode}]*\n` +
      `---------------------------------------------\n` +
      `👤 *Name:* ${bookingName}\n` +
      `📞 *Phone:* ${bookingPhone}\n` +
      `📅 *Pickup Date:* ${bookingDate}\n` +
      `🕐 *Preferred Slot:* ${bookingTime || 'Anytime'}\n` +
      `📍 *Estate / Estate:* ${bookingEstate}\n` +
      `👔 *Service:* ${serviceLabel} (${bookingWeight} ${pricingUnit})\n` +
      `🌿 *Detergent preference:* ${bookingDetergent}\n` +
      `✨ *With Ironing:* ${bookingIroning ? 'Yes (KSH 30/item)' : 'No'}\n` +
      `📝 *Custom Instructions:* ${bookingNotes || 'None'}\n` +
      `💸 *Estimated Cost:* KSH ${currentBookingPrice || 'To be weighed'}\n\n` +
      `Please register my pickup. Ningependa hii nguo ifanyiwe kazi safi sana!`
    );

    window.open(`https://wa.me/254715617654?text=${whatsappMessage}`, '_blank', 'noreferrer');

    // Reset fields except client identity
    setBookingNotes('');
    setBookingSuccessCode(randomCode);
  };

  // Handle contact messaging simulation
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;

    setContactSuccess(true);
    setContactName('');
    setContactPhone('');
    setContactMsg('');

    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  // Inline styling parameters tailored to each active brand theme variant
  const getThemeWrapperStyles = () => {
    switch (selectedTheme) {
      case 'Tech-Forward':
        return {
          fontFamily: 'Montserrat, sans-serif',
          background: '#0a0f1d',
          color: '#f8fafc',
          primaryColor: '#00F2FE',
          bodyBg: 'bg-slate-950',
          cardBg: 'bg-slate-900 border-slate-800 text-white',
          headerBg: scrolled ? 'bg-slate-950/95 border-b border-slate-800' : 'bg-transparent',
          textColorMuted: 'text-slate-400',
          headingColor: 'text-white'
        };
      case 'Corporate':
        return {
          fontFamily: 'Lato, sans-serif',
          background: '#FFFDF9',
          color: '#1e293b',
          primaryColor: '#002147',
          bodyBg: 'bg-warm-gray-50/50',
          cardBg: 'bg-white border-amber-200 shadow-sm text-slate-800',
          headerBg: scrolled ? 'bg-white/95 border-b border-amber-200/60 shadow-sm' : 'bg-transparent',
          textColorMuted: 'text-slate-500',
          headingColor: 'font-merriweather text-slate-900'
        };
      case 'Minimal Premium':
      default:
        return {
          fontFamily: 'Inter, sans-serif',
          background: '#F4F7FE',
          color: '#111827',
          primaryColor: '#1A73E8',
          bodyBg: 'bg-slate-50',
          cardBg: 'bg-white border-slate-100 shadow-sm text-slate-900',
          headerBg: scrolled ? 'bg-white/95 border-b border-slate-100 shadow-md' : 'bg-transparent',
          textColorMuted: 'text-slate-500',
          headingColor: 'font-poppins text-slate-900'
        };
    }
  };

  const themeTokens = getThemeWrapperStyles();

  return (
    <div 
      className={`min-h-screen transition-all-theme ${themeTokens.bodyBg} text-slate-800 select-none overflow-x-hidden`}
      style={{ fontFamily: themeTokens.fontFamily }}
    >
      
      {/* Oscillating Background Wash Bubbles System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 min-h-screen">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="washing-bubble"
            style={{
              left: `${(i * 6.5) % 95}%`,
              width: `${15 + ((i * 7) % 35)}px`,
              height: `${15 + ((i * 7) % 35)}px`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${14 + (i % 8)}s`,
            }}
          />
        ))}
      </div>

      {/* "Get Your Free Quote Today" Interactive Lightbox Overlay Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col p-6 md:p-8 text-left animate-in fade-in zoom-in-95 duration-300">
            {/* Ambient bubble decorations in popup corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-brand-yellow/10 rounded-full blur-lg pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>

            {/* Opening Headline greeting */}
            <div className="mb-4">
              <span className="text-[10px] bg-brand-blue/15 text-brand-blue-dk font-poppins font-black uppercase tracking-widest px-2.5 py-1 rounded">
                ⚡ Get your free quote today!
              </span>
              <h3 className="font-poppins font-black text-2xl text-slate-900 tracking-tight mt-2.5">
                {language === 'en' ? 'Get Your Free Quote Today!' : 'Jipatie Makadirio Bure Leo!'}
              </h3>
            </div>

            {/* The Humorous Swahili tagline highlighted in the visual design */}
            <div className="bg-brand-yellow/15 border-l-4 border-[#F5B800] p-4 rounded-r-2xl mb-5 text-left">
              <p className="font-poppins font-extrabold text-xs text-[#B28200] leading-none mb-1">
                Swahili Tagline Energy:
              </p>
              <blockquote className="font-poppins font-black text-[15px] md:text-[16px] text-slate-800 leading-tight italic m-0 select-text">
                "Ukiendelea hivi, nguo zitakuitisha meeting!"
              </blockquote>
              <p className="text-[10px] text-slate-500 mt-1.5 m-0 leading-normal">
                {language === 'en' 
                  ? 'Translation: "If you carry on like this, your dirty clothes will convene a status meeting to protest!"'
                  : 'Nguo zimechoka kurundikana! Let us wash and deliver them fresh to Sunrise Apartments.'}
              </p>
            </div>

            {/* Quick interactive calculator form */}
            <div className="space-y-3.5 flex-1">
              <div>
                <label className="block text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Your Name' : 'Jina Lako'}
                </label>
                <input 
                  type="text" 
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="e.g. John Kamau"
                  className="w-full text-sm border border-slate-200 focus:border-brand-blue rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Your Phone (WhatsApp)' : 'Nambari ya Simu'}
                  </label>
                  <input 
                    type="tel" 
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="e.g. +254 715..."
                    className="w-full text-sm border border-slate-200 focus:border-brand-blue rounded-xl px-4 py-2.5 bg-slate-50 focus:bg-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-poppins font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Estimated Weight' : 'Kilo za Dobi'}
                  </label>
                  <select 
                    value={bookingWeight}
                    onChange={(e) => {
                      setBookingWeight(Number(e.target.value));
                      setCalcKilos(Number(e.target.value));
                    }}
                    className="w-full text-sm border border-slate-200 focus:border-brand-blue rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white outline-none transition"
                  >
                    <option value={5}>5 Kilos (Standard)</option>
                    <option value={8}>8 Kilos (Medium)</option>
                    <option value={12}>12 Kilos (Full basket)</option>
                    <option value={18}>18+ Kilos (Big Load)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price calculation output summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 my-4 text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Estimated Price Estimate</span>
              <strong className="text-2xl text-brand-blue font-poppins font-black mt-1 block">
                KSH {bookingWeight * 80}
              </strong>
              <span className="text-[9.5px] text-emerald-600 font-bold block mt-1">
                ✓ Free pickup & delivery for Ongata Rongai Sunrise Apartments orders!
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-2 pt-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowQuoteModal(false);
                  const estimatorEl = document.getElementById('instant-estimator');
                  if (estimatorEl) {
                    estimatorEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue-dk text-white font-poppins font-bold text-xs uppercase tracking-wide rounded-2xl shadow transition cursor-pointer text-center"
              >
                {language === 'en' ? 'Accept Estimate & Arrange Pickup 🚀' : 'Kubali bei na Uchukuliwe Nguo 🚀'}
              </button>

              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-poppins text-[11px] font-semibold rounded-xl transition cursor-pointer text-center"
              >
                {language === 'en' ? 'Close & explore services first' : 'Funga nipitie tovuti kwanza'}
              </button>
            </div>

            {/* Real Footprint Indicators footer inside quote modal */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap justify-between items-center text-[10px] text-slate-400">
              <span>📍 Sunrise Apartments - MANNA</span>
              <span className="font-bold text-slate-600">+254 715 617 654</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 
        ========================================================================
        CLIENT STRATEGIC COMPARISON TOOLBAR SPECIAL FEATURE
        Side-by-side agency quality presentation panel at the very top.
        ========================================================================
      */}
      <div className="bg-brand-navy text-white text-xs py-3 px-4 sticky top-0 z-50 shadow-inner flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="bg-brand-yellow text-slate-900 px-2 py-0.5 rounded font-poppins font-bold text-[10px] uppercase">
            Portfolio Showcase
          </span>
          <p className="m-0 text-slate-200 font-sans tracking-wide">
            {language === 'en' 
              ? 'Switch between premium design options dynamically to compare agency-grade aesthetics:' 
              : 'Badilisha mifumo mitatu ya muundo hapa chini ili kulinganisha dobi ya kisasa:'}
          </p>
        </div>

        {/* The 3 Themes Toggles */}
        <div className="flex items-center bg-white/10 p-1 rounded-lg border border-white/10 shrink-0">
          {(['Minimal Premium', 'Tech-Forward', 'Corporate'] as ThemeVersion[]).map(t => (
            <button
              key={t}
              onClick={() => {
                setSelectedTheme(t);
                // Switch language preference naturally for Corporate theme demo (English & Swahili toggle)
                if (t === 'Corporate') setLanguage('sw');
                else setLanguage('en');
              }}
              className={`px-3 py-1.5 rounded-md font-poppins font-semibold text-[10.5px] transition duration-200 cursor-pointer ${
                selectedTheme === t
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'Minimal Premium' && '⭐ Version 1 — Minimal'}
              {t === 'Tech-Forward' && '🚀 Version 2 — Tech-Forward'}
              {t === 'Corporate' && '👑 Version 3 — Corporate'}
            </button>
          ))}
        </div>

        {/* Swahili / English Language toggler right inside comparative header */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Globe className="w-3.5 h-3.5 text-brand-yellow" />
          <div className="flex bg-slate-900 border border-slate-700 rounded overflow-hidden">
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-2 py-1 text-[10px] font-bold ${language === 'en' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('sw')} 
              className={`px-2 py-1 text-[10px] font-bold ${language === 'sw' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >
              SW
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        STICKY NAVIGATION BAR
        ========================================================================
      */}
      <header className={`w-full sticky top-[48px] z-40 transition-all duration-300 ${themeTokens.headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          
          <a href="#" className="flex items-center gap-2 select-none no-underline">
            <span className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center font-poppins font-extrabold text-base border-2 border-brand-yellow shadow-md">
              ◈
            </span>
            <span className="flex flex-col text-left">
              <span className={`font-poppins font-black tracking-tight text-md leading-none ${selectedTheme === 'Tech-Forward' ? 'text-white' : 'text-slate-900'}`}>
                Logic <span className="text-brand-blue">Laundry</span>
              </span>
              <span className="text-[9.5px] text-slate-400 font-sans tracking-widest leading-none mt-1">SERVICES</span>
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#services" 
              className={`text-sm font-semibold transition hover:text-brand-blue select-none ${selectedTheme === 'Tech-Forward' ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {language === 'en' ? 'Services' : 'Huduma zetu'}
            </a>
            <a 
              href="#pricing" 
              className={`text-sm font-semibold transition hover:text-brand-blue select-none ${selectedTheme === 'Tech-Forward' ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {language === 'en' ? 'Pricing Table' : 'Jedwali la bei'}
            </a>
            <a 
              href="#why-us" 
              className={`text-sm font-semibold transition hover:text-brand-blue select-none ${selectedTheme === 'Tech-Forward' ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {language === 'en' ? 'Why Logic' : 'Kwanini tuchague'}
            </a>
            <a 
              href="#coverage" 
              className={`text-sm font-semibold transition hover:text-brand-blue select-none ${selectedTheme === 'Tech-Forward' ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {language === 'en' ? 'Service Areas' : 'Maestate tunayofika'}
            </a>
          </nav>

          {/* Call / WhatsApp quick buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:+254715617654" 
              className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold transition hover:bg-slate-100 ${
                selectedTheme === 'Tech-Forward' ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>+254 715 617 654</span>
            </a>
            <a 
              href="https://wa.me/254715617654" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2 bg-brand-green hover:bg-emerald-600 text-white font-poppins text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              🫧 {language === 'en' ? 'Order' : 'Agiza'} WhatsApp
            </a>
          </div>

          {/* Mobile menu toggle toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border ${
              selectedTheme === 'Tech-Forward' ? 'border-slate-800 text-white' : 'border-slate-100 text-slate-700'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel slide-in drawer and blur backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Blur backdrop mask covering main content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[90]"
              />

              {/* Slide-in Navigation Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] shadow-2xl z-[100] flex flex-col h-full border-l ${
                  selectedTheme === 'Tech-Forward' 
                    ? 'bg-slate-950 border-slate-800 text-white' 
                    : (selectedTheme === 'Corporate' ? 'bg-[#FCFAF2] border-amber-100 text-[#2D2A26]' : 'bg-white border-slate-150 text-slate-800')
                }`}
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-dashed flex items-center justify-between shrink-0 border-current/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧺</span>
                    <span className="font-poppins font-black text-sm tracking-tight uppercase">
                      Logic Laundry
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Menu Links */}
                <div className="flex-1 overflow-y-auto py-6 px-5 space-y-4">
                  <div className="text-[10px] uppercase tracking-wider opacity-40 font-bold mb-3">
                    {language === 'en' ? 'Quick Navigation' : 'Njia za Haraka'}
                  </div>
                  
                  <a 
                    href="#services" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 font-bold text-sm transition"
                  >
                    <span className="text-base">🫧</span>
                    <span>{language === 'en' ? 'Our Services' : 'Huduma Zetu'}</span>
                  </a>

                  <a 
                    href="#pricing" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 font-bold text-sm transition"
                  >
                    <span className="text-base">💰</span>
                    <span>{language === 'en' ? 'Pricing Plans' : 'Jedwali la bei'}</span>
                  </a>

                  <a 
                    href="#why-us" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 font-bold text-sm transition"
                  >
                    <span className="text-base">✨</span>
                    <span>{language === 'en' ? 'Why Logic Laundry' : 'Kwanini tuchague'}</span>
                  </a>

                  <a 
                    href="#coverage" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 font-bold text-sm transition"
                  >
                    <span className="text-base">📍</span>
                    <span>{language === 'en' ? 'Active Estates Coverage' : 'Maestate yetu'}</span>
                  </a>

                  <div className="pt-4 border-t border-dashed border-current/10">
                    <div className="text-[10px] uppercase tracking-wider opacity-40 font-bold mb-3">
                      {language === 'en' ? 'Swahili Tagline Energy' : 'Ujumbe wa Swahili'}
                    </div>
                    <blockquote className="text-xs p-3 bg-brand-yellow/10 rounded-xl m-0 border-l-2 border-brand-yellow/80 select-text italic">
                      "Ukiendelea hivi, nguo zitakuitisha meeting!"
                    </blockquote>
                  </div>
                </div>

                {/* Drawer Footer with Quick Pickup support buttons */}
                <div className="p-5 border-t border-current/10 shrink-0 space-y-3.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <a 
                      href="tel:+254715617654" 
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Call Support' : 'Pigia Simu'}</span>
                    </a>
                    <a 
                      href="https://wa.me/254715617654" 
                      target="_blank" 
                      rel="noreferrer"
                      className="py-2.5 bg-brand-green hover:bg-emerald-600 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1 shadow transition"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] opacity-60 block">
                      Ongata Rongai, Sunrise Apartments – MANNA
                    </span>
                    <span className="text-[9.5px] opacity-40 block mt-0.5">
                      © {new Date().getFullYear()} Logic Laundry Services
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* 
        ========================================================================
        A. HERO SECTION
        Dynamic brand voice translation and aesthetic styles
        ========================================================================
      */}
      <section className="relative py-12 md:py-20 overflow-hidden" id="hero-sec">
        {/* Decorative ambient elements */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-brand-blue/5 blur-3xl animate-bubble-1" />
          <div className="absolute bottom-1/4 right-1/10 w-80 h-80 rounded-full bg-brand-yellow/5 blur-3xl animate-bubble-2" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
            
            {/* Left Column Copy with Version Toggles */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Dynamic tag depending on theme */}
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-black uppercase tracking-wider ${
                  selectedTheme === 'Tech-Forward' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : (selectedTheme === 'Corporate' ? 'bg-amber-100 text-amber-900 font-serif border border-amber-200' : 'bg-brand-blue/10 text-brand-blue')
                }`}>
                  <Sparkles className="w-3.5 h-3.5 animate-spin-seal" />
                  <span>{language === 'en' ? 'Free Pickup & Delivery • KSH 80 Per Kilo' : 'Maji Safi • KSH 80 Pekee Kwa Kilo • Delivery Bure'}</span>
                </span>
              </div>

              {/* Headline with smart dynamic formatting based on selected design version */}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight md:leading-none ${
                selectedTheme === 'Corporate' ? 'font-serif text-slate-900 italic' : 'text-slate-900 ' + themeTokens.headingColor
              }`}>
                {language === 'en' ? (
                  <>
                    Laundry Made <span className="text-brand-blue underline decoration-brand-yellow decoration-6 underline-offset-4">Simple.</span>
                  </>
                ) : (
                  <>
                    Nguo Safi, <span className="text-brand-blue">Bila Stress!</span>
                  </>
                )}
              </h1>

              {/* Subheadline with premium local copy */}
              <p className={`text-sm md:text-base leading-relaxed max-w-xl ${
                selectedTheme === 'Tech-Forward' ? 'text-slate-300' : themeTokens.textColorMuted
              }`}>
                {language === 'en' ? (
                  "Laundry shouldn't stress you. We pick it up, clean it, fold it, and bring it back fresher than your weekend plans. Standard 48h freshness guaranteed!"
                ) : (
                  "Dobi isiwe sababu ya wewe kupoteza wikendi yako maridadi. Tunakuja kwako, kubeba mzigo, kupiga pasi safi na kukunja kisasa jinsi unavyopenda. Siku hiyohiyo inawezekana!"
                )}
              </p>

              {/* Pricing teaser pill */}
              <div className="inline-flex items-center gap-3 bg-white/75 border border-slate-100 rounded-2xl p-3 shadow-sm select-none backdrop-blur-sm">
                <span className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center text-sm">
                  ⚖️
                </span>
                <div className="text-left">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">
                    {language === 'en' ? 'Our pricing model starts from' : 'Kiwango cha malipo yetu ya duka'}
                  </span>
                  <span className="font-poppins font-extrabold text-slate-800 text-md">
                    KSH 80 <small className="text-xs text-slate-400 font-medium">/ kilo</small>
                  </span>
                </div>
              </div>

              {/* CALL TO ACTION BUTTONS */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="#booking-widget-sec"
                  className="px-7 py-3.5 bg-brand-blue hover:bg-brand-blue-dk text-white font-poppins text-xs font-bold rounded-xl shadow-lg hover:shadow-xl transition tracking-wide flex items-center gap-2 cursor-pointer border border-brand-blue"
                >
                  <span>{language === 'en' ? 'Book Free Pickup' : 'Ratibu Dobi Bure'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="tel:+254715617654"
                  className={`px-7 py-3.5 border rounded-xl font-poppins text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    selectedTheme === 'Tech-Forward' 
                      ? 'border-slate-700 text-white hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-800 bg-white hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <Phone className="w-4 h-4 text-brand-blue" />
                  <span>{language === 'en' ? 'Call Now' : 'Piga Simu Sasa'}</span>
                </a>
              </div>

              {/* Satisfaction Guarantee text nodes */}
              <div className="flex flex-wrap gap-4 items-center pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-brand-green" />
                  <span>{language === 'en' ? 'Same-day service available' : 'Kazi kumalizika siku hiyohiyo'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-brand-green" />
                  <span>{language === 'en' ? 'Eco-friendly skin safe detergents' : 'Sabuni salama za kiasili (Eco)'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-brand-green" />
                  <span>{language === 'en' ? '48-hr freshness guarantee' : 'Garatini ya upya ya kishujaa (saa 48)'}</span>
                </span>
              </div>

            </div>

            {/* Right Column Visual Box - Interactive Brand Flyers Showcase */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 select-none z-10 flex flex-col items-center">
              
              {/* Interactive Flyer Carousel Card wrapper */}
              <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                
                {/* Visual Slide 1: standard blue flyer */}
                {activeFlyerIndex === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-blue via-[#185CAF] to-[#0A1128] text-white flex flex-col justify-between p-5 relative">
                    <div className="text-center space-y-1.5 mt-3">
                      <p className="text-[9.5px] text-[#F5B800] font-poppins font-black tracking-widest uppercase m-0 leading-none">Logic Laundry Services</p>
                      <h4 className="font-poppins font-black text-2xl leading-none text-white tracking-tight mt-1 m-0 select-none italic">
                        if laundry <br className="hidden sm:inline" /> could talk
                      </h4>
                    </div>

                    <div className="relative my-4 flex-1 flex items-center justify-center">
                      <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white/20 bg-slate-300">
                        <img 
                          src="https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=300&q=80"
                          alt="Smiling Kenyan youth with clean washing"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Price stamp circle badge of first flyer */}
                      <div className="absolute top-2 right-4 bg-white text-slate-800 w-16 h-16 rounded-full border-4 border-[#F5B800] flex flex-col items-center justify-center font-poppins font-black shadow-lg">
                        <span className="text-[8.5px] uppercase text-[#F5B800] tracking-tighter -mb-1 font-bold">KSH</span>
                        <span className="text-lg text-slate-900 leading-none">80</span>
                        <span className="text-[8px] uppercase tracking-tighter font-extrabold -mt-1 block">per kilo</span>
                      </div>

                      {/* Delivery tag pill of first flyer */}
                      <div className="absolute bottom-2 left-4 bg-brand-yellow text-slate-900 border border-white font-poppins font-black text-[9.5px] px-3.5 py-1 rounded-full uppercase shadow-md leading-none">
                        Free Pickup & Delivery
                      </div>
                    </div>

                    <div className="text-center pb-2">
                      <p className="text-xs font-semibold m-0 text-white italic">
                        good thing it can't, bring to us
                      </p>
                    </div>

                    {/* Footer brand footer coordinates identical to flyers */}
                    <div className="bg-[#0A1128] border-t border-white/10 p-3 -mx-5 -mb-5 flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-brand-yellow text-slate-950 flex items-center justify-center text-[8.5px] shrink-0 font-bold">📍</span>
                        <span className="font-bold text-white leading-tight truncate">Ongata Rongai, Sunrise Apartments – MANNA</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-brand-yellow text-slate-950 flex items-center justify-center text-[8.5px] shrink-0 font-bold">📞</span>
                        <span className="font-mono font-bold text-brand-yellow tracking-wider">+254 715 617 654</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Slide 2: white background flyer */}
                {activeFlyerIndex === 1 && (
                  <div className="absolute inset-0 bg-white text-slate-800 flex flex-col justify-between p-5 relative">
                    <div className="text-center space-y-1.5 mt-3">
                      <p className="text-[9.5px] text-brand-blue font-poppins font-black tracking-widest uppercase m-0 leading-none">Logic Laundry Services</p>
                      <h4 className="font-poppins font-black text-2xl leading-none text-slate-800 tracking-tight mt-1 m-0 select-none italic">
                        if laundry <br className="hidden sm:inline" /> could talk
                      </h4>
                    </div>

                    <div className="relative my-4 flex-1 flex items-center justify-center">
                      <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-slate-100 bg-slate-300 shadow">
                        <img 
                          src="https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=300&q=80"
                          alt="Smiling Kenyan youth with clean washing"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition duration-300"
                        />
                      </div>
                      
                      {/* Price stamp Circle */}
                      <div className="absolute top-2 right-4 bg-white text-slate-800 w-16 h-16 rounded-full border-4 border-[#F5B800] flex flex-col items-center justify-center font-poppins font-black shadow-lg">
                        <span className="text-[8.5px] uppercase text-[#F5B800] tracking-tighter -mb-1 font-bold">KSH</span>
                        <span className="text-lg text-slate-900 leading-none">80</span>
                        <span className="text-[8px] uppercase tracking-tighter font-extrabold -mt-1 block">per kilo</span>
                      </div>

                      {/* Delivery tag pill */}
                      <div className="absolute bottom-2 left-4 bg-brand-yellow text-slate-900 border border-slate-100 font-poppins font-black text-[9.5px] px-3.5 py-1 rounded-full uppercase shadow-md leading-none">
                        Free Pickup & Delivery
                      </div>
                    </div>

                    <div className="text-center pb-2">
                      <p className="text-xs font-semibold m-0 text-[#1a6fcc] italic">
                        good thing it can't, bring to us
                      </p>
                    </div>

                    {/* Footer brand coordinates identical to flyer */}
                    <div className="bg-[#0A1128] border-t border-slate-800 p-3 -mx-5 -mb-5 flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-brand-yellow text-slate-950 flex items-center justify-center text-[8.5px] shrink-0 font-bold">📍</span>
                        <span className="font-bold text-white leading-tight truncate">Ongata Rongai, Sunrise Apartments – MANNA</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-brand-yellow text-slate-950 flex items-center justify-center text-[8.5px] shrink-0 font-bold">📞</span>
                        <span className="font-mono font-bold text-brand-yellow tracking-wider">+254 715 617 654</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Slide 3: Swahili tagline meeting flyer with yellow bottom and basket */}
                {activeFlyerIndex === 2 && (
                  <div className="absolute inset-0 bg-brand-blue text-white flex flex-col justify-between p-5 relative overflow-hidden">
                    {/* Skewed diagonal background wave division of laundry 3 */}
                    <div className="absolute bottom-0 right-0 left-0 h-[38%] bg-[#F5B800] transform skew-y-3 origin-bottom-right z-0" />
                    
                    <div className="text-center space-y-1 mt-3 relative z-10">
                      <p className="text-[9.5px] text-brand-yellow font-poppins font-black tracking-widest uppercase m-0 leading-none">Logic Laundry Services</p>
                      <h4 className="font-poppins font-black text-[20px] leading-tight text-white tracking-wide mt-2 m-0 select-none drop-shadow-md">
                        Ukiendelea hivi, nguo zitakuitisha meeting!
                      </h4>
                    </div>

                    <div className="relative my-4 flex-1 flex items-center justify-center z-10">
                      <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white/30 bg-slate-200">
                        <img 
                          src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=300&q=80"
                          alt="White laundry basket full of colorful fabrics"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Price stamp Circle badge */}
                      <div className="absolute top-2 right-4 bg-white text-slate-800 w-16 h-16 rounded-full border-4 border-[#F5B800] flex flex-col items-center justify-center font-poppins font-black shadow-lg">
                        <span className="text-[8.5px] uppercase text-[#F5B800] tracking-tighter -mb-1 font-bold">KSH</span>
                        <span className="text-lg text-slate-900 leading-none">80</span>
                        <span className="text-[8px] uppercase tracking-tighter font-extrabold -mt-1 block">per kilo</span>
                      </div>

                      {/* Delivery pill tag of third flyer */}
                      <div className="absolute bottom-2 left-4 bg-brand-blue text-white border border-[#F5B800] font-poppins font-black text-[9.5px] px-3.5 py-1 rounded-full uppercase shadow-md leading-none">
                        Free Pickup & Delivery
                      </div>
                    </div>

                    <div className="text-center pb-2 relative z-10">
                      <p className="text-[11px] font-bold m-0 text-slate-950 uppercase tracking-wider">
                        Good thing it can't, bring to us!
                      </p>
                    </div>

                    {/* Footer brand coordinates identical to flyer */}
                    <div className="bg-[#0A1128] border-t border-[#F5B800]/20 p-3 -mx-5 -mb-5 flex flex-col gap-1 text-left relative z-10">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-brand-yellow text-slate-950 flex items-center justify-center text-[8.5px] shrink-0 font-bold">📍</span>
                        <span className="font-bold text-white leading-tight truncate">Ongata Rongai, Sunrise Apartments – MANNA</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-4 h-4 rounded-full bg-brand-yellow text-slate-950 flex items-center justify-center text-[8.5px] shrink-0 font-bold">📞</span>
                        <span className="font-mono font-bold text-brand-yellow tracking-wider">+254 715 617 654</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Left Navigation arrow indicator */}
                <button 
                  onClick={() => setActiveFlyerIndex(prev => (prev === 0 ? 2 : prev - 1))}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition cursor-pointer z-25"
                  aria-label="Previous flyer"
                >
                  ◀
                </button>

                {/* Right Navigation arrow indicator */}
                <button 
                  onClick={() => setActiveFlyerIndex(prev => (prev === 2 ? 0 : prev + 1))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition cursor-pointer z-25"
                  aria-label="Next flyer"
                >
                  ▶
                </button>

                {/* Bottom carousel tracker dot indicators */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-25">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveFlyerIndex(idx)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                        activeFlyerIndex === idx ? 'bg-white scale-125 shadow-md w-4' : 'bg-white/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>

              {/* Instant action connector */}
              <button
                onClick={() => {
                  setCalcKilos(7);
                  if (activeFlyerIndex === 2) {
                    setCalcServiceType('express');
                    setLanguage('sw');
                  } else {
                    setCalcServiceType('per_kilo');
                    setLanguage('en');
                  }
                  const priceBlock = document.getElementById('instant-estimator');
                  if (priceBlock) {
                    priceBlock.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full max-w-[300px] mt-4 py-2.5 bg-brand-navy hover:bg-slate-800 text-white font-poppins text-xs font-bold leading-none rounded-xl flex items-center justify-center gap-2 transition outline-none cursor-pointer shadow uppercase tracking-wide"
              >
                <span>🫧 {language === 'en' ? 'Get Instant Quote from This Flyer' : 'Pata Makadirio ya Flyer Hii Sasa'}</span>
                <ChevronRight className="w-4 h-4 text-brand-yellow" />
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        ORDER TRACKING TEASER NODE
        ========================================================================
      */}
      <div className="bg-brand-blue border-y border-brand-blue-dk py-3.5 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📍</span>
            <p className="text-xs sm:text-sm m-0 text-white/90 font-medium">
              <strong>{language === 'en' ? 'Track your laundry status instantly:' : 'Fuatilia nguo zako papo hapo:'}</strong>
              {language === 'en' 
                ? ' Search your order number in our tracking system below to see your socks laundry status live!'
                : ' Tafuta nambari yako ya kuagiza katika sehemu yetu ya fuatilia hapa chini kujua maendeleo!'}
            </p>
          </div>
          <span className="bg-brand-yellow text-slate-900 border border-amber-300 font-poppins font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider scale-95 shrink-0">
            {language === 'en' ? 'Status Tracker Live' : 'Mfumo Uko Tayari'}
          </span>
        </div>
      </div>

      {/* 
        ========================================================================
        B. SERVICES SECTION
        ========================================================================
      */}
      <section className={`py-16 ${themeTokens.textColorMuted}`} id="services">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {language === 'en' ? 'Expert Fabric Solvers' : 'Utaalam wa Nguo'}
            </span>
            <h2 className={`text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-2 ${themeTokens.headingColor}`}>
              {language === 'en' ? 'Every Fabric, Perfectly Handled' : 'Kila Kitambaa Tunashughulikia'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-2">
              {language === 'en' 
                ? "From your everyday casual jeans to boardroom luxury curtains, we treat every single item like a premium assets."
                : "Kuanzia nguo zako za jeans za kila siku hadi mapazia ya ofisi yako, tunatunza kila kitambaa kwa ubora wa kishujaa."}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {servicesData.map((service, idx) => {
              const isHighlight = service.id === 'washing' || service.id === 'folding';
              return (
                <div 
                  key={service.id}
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isHighlight && selectedTheme !== 'Corporate'
                      ? 'bg-gradient-to-br from-brand-blue to-brand-blue-dk border-transparent text-white'
                      : 'bg-white border-slate-100 text-slate-800'
                  }`}
                  id={`service-${service.id}`}
                >
                  <div>
                    {/* Floating Icon bubble */}
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-inner mb-4 border border-slate-100">
                      {service.icon}
                    </div>
                    
                    <h3 className={`font-poppins font-black text-sm md:text-base tracking-tight mb-2 ${
                      isHighlight && selectedTheme !== 'Corporate' ? 'text-white' : 'text-slate-800'
                    }`}>
                      {language === 'en' ? service.titleEn : service.titleSw}
                    </h3>
                    
                    <p className={`text-xs md:text-xs leading-relaxed mb-4 ${
                      isHighlight && selectedTheme !== 'Corporate' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {language === 'en' ? service.descEn : service.descSw}
                    </p>
                  </div>

                  <span className={`inline-block self-start text-[10.5px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    isHighlight && selectedTheme !== 'Corporate'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {language === 'en' ? service.priceEn : service.priceSw}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        INTERACTIVE ESTIMATION AND LIVE PRICE CALCULATOR WIDGET
        Allows client simulation to drive maximum satisfaction.
        ========================================================================
      */}
      <section className="py-12 bg-slate-100/60 border-y border-slate-200" id="instant-estimator">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] bg-brand-yellow font-bold text-amber-900 border border-brand-yellow-dk rounded px-2.5 py-1 uppercase tracking-wider inline-block">
                {language === 'en' ? 'Interactive Quote tool' : 'Kikokotoo cha bei papo hapo'}
              </span>
              <h3 className="font-poppins font-black text-xl md:text-2xl text-slate-800 tracking-tight m-0 leading-tight">
                {language === 'en' ? 'Simulate Your Invoice Estimation' : 'Gundua na Ukadirie Bei ya Dobi yako'}
              </h3>
              <p className="text-slate-500 text-xs md:text-sm">
                {language === 'en' 
                  ? 'Drag the sliders and select optional add-ons to preview standard laundry quotes live. No surprises during collection!'
                  : 'Sogeza kitelezi na uchague vifurushi tofauti ili ujue kiasi unachotakiwa kulipa utakapokabidhi dobi yako kwetu.'}
              </p>

              {/* Slider for weight kilos */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{language === 'en' ? 'Estimated Weight:' : 'Uzani wa Makadirio:'}</span>
                  <span className="text-brand-blue font-poppins text-sm">{calcKilos} {language === 'en' ? 'kilos' : 'kilo'}</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="30" 
                  value={calcKilos} 
                  onChange={(e) => setCalcKilos(parseInt(e.target.value))}
                  className="w-full select-none cursor-pointer accent-brand-blue h-1.5 bg-slate-300 rounded"
                />
                <span className="text-[10px] text-slate-400 block italic">
                  {language === 'en' ? 'Minimum order limit is 3kg.' : 'Uzani wa chini kabisa ni kilo 3.'}
                </span>
              </div>

              {/* Add ons checkbox widgets */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={calcIroning} 
                    onChange={(e) => setCalcIroning(e.target.checked)}
                    className="w-4 h-4 text-brand-blue cursor-pointer rounded border-slate-300 focus:ring-brand-blue"
                  />
                  <span>{language === 'en' ? 'Add Professional Ironing 👔' : 'Ongeza Kupasiwa safi 👔'}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={calcDuvetSet} 
                    onChange={(e) => setCalcDuvetSet(e.target.checked)}
                    className="w-4 h-4 text-brand-blue cursor-pointer rounded border-slate-300 focus:ring-brand-blue"
                  />
                  <span>{language === 'en' ? 'Include Duvet Set Combo (+KSH 500) 🛏️' : 'Pamoja na Blanketi la Duvet (+KSH 500) 🛏️'}</span>
                </label>
              </div>

            </div>

            {/* Price Output Display Card */}
            <div className="lg:col-span-6 bg-white border border-slate-200 shadow-xl rounded-2xl p-6">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                  <span className="text-slate-400 uppercase tracking-widest font-bold">
                    {language === 'en' ? 'Selected Service Tier:' : 'Aina ya Huduma:'}
                  </span>
                  
                  <select 
                    value={calcServiceType} 
                    onChange={(e) => setCalcServiceType(e.target.value)}
                    className="border border-slate-200 rounded-lg p-1 text-xs font-semibold text-slate-600 bg-slate-50 focus:bg-white"
                  >
                    <option value="per_kilo">{language === 'en' ? 'Standard Wash (KSH 80/kg)' : 'Standard (KSH 80/kg)'}</option>
                    <option value="express">{language === 'en' ? 'Express 6-Hour (KSH 120/kg)' : 'Express 6-Hour (KSH 120/kg)'}</option>
                    <option value="bedding_set">{language === 'en' ? 'Bedding Set Combo (Flat KSH 500)' : 'Seti ya Vitanda (Flat KSH 500)'}</option>
                    <option value="curtains_pair">{language === 'en' ? 'Curtains Combo (Flat KSH 300)' : 'Mapazia (Flat KSH 300)'}</option>
                  </select>
                </div>

                {/* Estimation Calculations Breakdown */}
                <div className="space-y-2 text-xs text-slate-500 text-left">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Garment weight rate:' : 'Bei ya uzani wa nguo:'}</span>
                    <span className="font-poppins">{calcServiceType === 'bedding_set' ? 'KSH 500 Flat' : (calcServiceType === 'curtains_pair' ? 'KSH 300 Flat' : `${calcKilos}kg x KSH ${calcServiceType === 'express' ? '120' : '80'}`)}</span>
                  </div>
                  {calcIroning && (
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Professional ironing surcharge (est.):' : 'Gharama ya kupiga pasi (kadirio):'}</span>
                      <span className="font-poppins">+ KSH {Math.round(Math.max(calcKilos * 1.5, 3) * 30)}</span>
                    </div>
                  )}
                  {calcDuvetSet && calcServiceType !== 'bedding_set' && calcServiceType !== 'curtains_pair' && (
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Bulky Duvet combo add-on:' : 'Blanketi tanzu maalum la duvet kuoshwa:'}</span>
                      <span className="font-poppins">+ KSH 500</span>
                    </div>
                  )}
                  
                  {/* Delivery coverage logic display */}
                  <div className="flex justify-between pt-2 border-t border-slate-50">
                    <span>{language === 'en' ? 'Pickup & Return Delivery:' : 'Usafiri wa duka letu:'}</span>
                    <span className="text-brand-green font-bold uppercase">
                      {getCalculatedPrice(calcKilos, calcServiceType, calcIroning, calcDuvetSet) >= 500 
                        ? (language === 'en' ? 'FREE 🚚' : 'BURE 🚚') 
                        : (language === 'en' ? 'KSH 150 (Free over 500)' : 'KSH 150 (Bure juu ya 500)')}
                    </span>
                  </div>
                </div>

                {/* Master estimation totals */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-left">
                  <div>
                    <h4 className="font-poppins font-black text-xs text-slate-400 uppercase tracking-wider block m-0">
                      {language === 'en' ? 'TOTAL ESTIMATED PRICE' : 'JUMLA YA MAKADIRIO'}
                    </h4>
                    <span className="text-slate-300 text-[10px] block">
                      {language === 'en' ? 'Actual ticket weighed at clinic' : 'Uzito wa kweli utapimwa duka kwetu'}
                    </span>
                  </div>
                  <div className="font-poppins font-black text-2xl text-brand-blue">
                    KSH {getCalculatedPrice(calcKilos, calcServiceType, calcIroning, calcDuvetSet)}
                  </div>
                </div>

                <div className="pt-2">
                  <a 
                    href="#booking-widget-sec" 
                    onClick={() => {
                      setBookingWeight(calcKilos);
                      setBookingServiceType(calcServiceType);
                      setBookingIroning(calcIroning);
                    }}
                    className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dk text-white font-poppins text-[11px] font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <span>{language === 'en' ? 'Apply these specs to booking form' : 'Weka hizi spec kwenye Agizo letu'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        C. PRICING SECTION
        ========================================================================
      */}
      <section className="py-16 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {language === 'en' ? 'Honest Pricing Matrix' : 'Jedwali la Bei yetu'}
            </span>
            <h2 className={`text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-2 ${themeTokens.headingColor}`}>
              {language === 'en' ? 'Transparent Tier Matrices' : 'Jedwali rahisi bila mahesabu ya siri'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-2">
              {language === 'en' 
                ? 'Choose the tier that maps perfectly to your home requirements. Same-day express is always active.'
                : 'Chagua kifurushi kinachofaa mahitaji yako na ya familia yako kuanzia leo.'}
            </p>
          </div>

          {/* Pricing cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
            {pricingTiers.map(tier => {
              const isPopular = tier.isFeatured;
              return (
                <div
                  key={tier.id}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                    isPopular && selectedTheme !== 'Corporate'
                      ? 'bg-brand-blue text-white border-transparent shadow-xl scale-102 hover:scale-103'
                      : 'bg-white border-slate-100 text-slate-800'
                  }`}
                  id={`price-tier-${tier.id}`}
                >
                  <div className="space-y-4">
                    {/* Header bar */}
                    <div className="flex justify-between items-center">
                      <span className="text-xl">{tier.icon}</span>
                      {isPopular && (
                        <span className="bg-brand-yellow text-slate-900 text-[9px] font-bold font-poppins px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {language === 'en' ? 'Popular' : 'Moto moto'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-poppins font-black text-xs uppercase tracking-wider block m-0">
                        {language === 'en' ? tier.titleEn : tier.titleSw}
                      </h4>
                      <div className="mt-2 text-left">
                        <span className={`font-poppins font-black text-2xl leading-none ${
                          isPopular && selectedTheme !== 'Corporate' ? 'text-white' : 'text-slate-950'
                        }`}>
                          {language === 'en' ? tier.priceEn : tier.priceSw}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {language === 'en' ? tier.unitEn : tier.unitSw}
                        </span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <ul className="text-left space-y-2 border-t border-slate-100 pt-3 select-none">
                      {(language === 'en' ? tier.featuresEn : tier.featuresSw).map((feat, fIdx) => (
                        <li key={fIdx} className="text-[11px] leading-relaxed flex items-start gap-1.5 list-none">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular && selectedTheme !== 'Corporate' ? 'text-brand-yellow' : 'text-brand-green'}`} />
                          <span className={isPopular && selectedTheme !== 'Corporate' ? 'text-blue-100' : 'text-slate-500'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-50">
                    <a
                      href="#booking-widget-sec"
                      onClick={() => setBookingServiceType(tier.id)}
                      className={`w-full py-2 border rounded-xl text-[11px] font-poppins font-bold tracking-wider uppercase flex items-center justify-center transition ${
                        isPopular && selectedTheme !== 'Corporate'
                          ? 'bg-white border-transparent text-brand-blue hover:bg-brand-yellow hover:text-slate-900 shadow-md'
                          : 'border-slate-200 text-slate-700 hover:border-brand-blue hover:text-brand-blue bg-white'
                      }`}
                    >
                      {language === 'en' ? 'Select Tier' : 'Chagua hii'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing surcharge fineprint warning card */}
          <div className="max-w-3xl mx-auto mt-8 bg-brand-blue/5 border border-brand-blue/10 p-4 rounded-xl flex gap-3 text-left">
            <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed m-0">
              {language === 'en' 
                ? 'Minimum order limit strictly is 3kg. Free door-to-door pickup and returns are globally valid for all orders crossing KSH 500 within standard active estate zones. Ironing requests are evaluated individually at the duka clinic at a nominal KSH 30 per shirt/trouser surcharge.'
                : 'Kiwango cha chini kabisa cha uagizaji ni kilo 3. Kuchukuliwa na kurudishwa kwa dobi ni bure kwa oda zote zinazozidi KSH 500 ndani ya maestate yetu. Kupasiwa nguo hupigwa hesabu ya kuanzia KSH 30 kwa kila shati au suruali.'}
            </p>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        ORDER TRACKING DASHBOARD WIDGET PLATFORM SYSTEM
        Fully interactive simulator loaded in development.
        ========================================================================
      */}
      <section className="py-16 bg-slate-50 border-t border-slate-100" id="live-order-tracking">
        <div className="max-w-4xl mx-auto px-4">
          <TrackingWidget language={language} customOrders={customOrders} />
        </div>
      </section>

      {/* 
        ========================================================================
        🍀 PICKUP SCHEDULING WIDGET (BOOKING SECTION)
        Binds form inputs, estimates dynamic totals, registers order to state.
        ========================================================================
      */}
      <section className="py-16 bg-white" id="booking-widget-sec">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {language === 'en' ? 'Nairobi Quick Booking' : 'Kusajili na Kupanga Dobi'}
            </span>
            <h2 className={`text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-2 ${themeTokens.headingColor}`}>
              {language === 'en' ? 'Book Your Appointment in 60s' : 'Agiza na Upange Kuchukuliwa kwa Saa 1'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-2">
              {language === 'en' 
                ? "Configure your laundry load parameters, view live calculations, and submit to launch a pre-formatted WhatsApp schedule request. Our dispatch team reviews instantly!"
                : "Jaza fomu hapa chini kuhesabu gharama ya dobi yako, kisha bonyeza kitufe kutuma ratiba moja kwa moja kwenye nambari yetu kuu ya WhatsApp."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xl relative">
              
              <h3 className="font-poppins font-black text-slate-800 text-base md:text-lg mb-4 flex items-center gap-1.5">
                <span>📋</span>
                <span>{language === 'en' ? 'Pickup Configuration Sheet' : 'Fomu ya kusanidi Dobi yako'}</span>
              </h3>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block select-none">
                      {language === 'en' ? 'Your Full Name *' : 'Jina lako Kamili *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Wanjiru Kamau"
                      className="w-full px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block select-none">
                      {language === 'en' ? 'WhatsApp / Phone *' : 'Nambari ya Simu ya WhatsApp *'}
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block select-none">
                      {language === 'en' ? 'Preferred Pickup Date *' : 'Tarehe ya Kuchukuliwa *'}
                    </label>
                    <input 
                      type="date" 
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block select-none">
                      {language === 'en' ? 'Preferred Hour Time slot' : 'Kipindi Unachopendelea'}
                    </label>
                    <select 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-4 px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    >
                      <option value="">{language === 'en' ? 'Select Preferred Hours' : 'Chagua Kipindi cha Muda'}</option>
                      <option>7:00 AM – 9:00 AM</option>
                      <option>9:00 AM – 11:00 AM</option>
                      <option>11:00 AM – 1:00 PM</option>
                      <option>1:00 PM – 3:00 PM</option>
                      <option>3:00 PM – 5:00 PM</option>
                      <option>5:00 PM – 7:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block select-none">
                      {language === 'en' ? 'Nairobi Estate / Address *' : 'Nairobi Estate au Mtaa *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={bookingEstate}
                      onChange={(e) => setBookingEstate(e.target.value)}
                      placeholder="e.g. Westlands, Kasarani, Kilimani"
                      className="w-full px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block select-none">
                      {language === 'en' ? 'Laundry Service Class *' : 'Kundi la Huduma ya Dobi *'}
                    </label>
                    <select 
                      value={bookingServiceType}
                      onChange={(e) => setBookingServiceType(e.target.value)}
                      className="w-full px-4 px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    >
                      <option value="per_kilo">{language === 'en' ? 'Standard Washing & Folding (KSH 80/kg)' : 'Standard - Kuosha & Kukunja (KSH 80/kg)'}</option>
                      <option value="express">{language === 'en' ? 'Express 6h Same-Day (KSH 120/kg)' : 'Express 6 Hours (KSH 120/kg)'}</option>
                      <option value="bedding_set">{language === 'en' ? 'Bedding Combo set (Flat KSH 500)' : 'Seti nzima ya Kitanda (Fiat KSH 500)'}</option>
                      <option value="curtains_pair">{language === 'en' ? 'Curtains Combo set (Flat KSH 300)' : 'Dobi ya Mapazia (Fiat KSH 300)'}</option>
                      <option value="corporate_tier">{language === 'en' ? 'Corporate Business Volume Load' : 'Biashara au Hoteli (Makataba)'}</option>
                    </select>
                  </div>
                </div>

                {/* Sub-selectors depending on type */}
                {bookingServiceType !== 'bedding_set' && bookingServiceType !== 'curtains_pair' && bookingServiceType !== 'corporate_tier' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 select-none">
                          {language === 'en' ? 'Estimated weight (kilos):' : 'Maendeleo ya uzito (kilo):'}
                        </label>
                        <span className="text-xs text-brand-blue font-bold">{bookingWeight} kg</span>
                      </div>
                      <input 
                        type="range" 
                        min="3" 
                        max="30" 
                        value={bookingWeight} 
                        onChange={(e) => setBookingWeight(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block select-none">
                        {language === 'en' ? 'Detergent Preference' : 'Sabuni unayopendelea'}
                      </label>
                      <select 
                        value={bookingDetergent}
                        onChange={(e) => setBookingDetergent(e.target.value)}
                        className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                      >
                        <option>Standard Allergen-safe detergent</option>
                        <option>Eco-friendly biodegradable lavender</option>
                        <option>Fragrance-free sensitive skin infant setting</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 select-none pt-1">
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-600">
                    <input 
                      type="checkbox" 
                      checked={bookingIroning}
                      onChange={(e) => setBookingIroning(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 focus:ring-brand-blue cursor-pointer"
                    />
                    <span>{language === 'en' ? 'Add professional steam ironing for garments (+KSH 30/item)' : 'Piga pasi nguo zetu zote (+KSH 30 kwa nguo)'}</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block select-none">
                    {language === 'en' ? 'Any specific care instructions or notes (optional)' : 'Maagizo mengine maalum (hiari)'}
                  </label>
                  <textarea 
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g., Please pay extra attention to collar soil stains, handle the woolen sweater with handwash treatment..."
                    className="w-full px-4.5 py-2.5 text-sm border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  className="w-full py-4.5 bg-brand-green hover:bg-emerald-600 text-white font-poppins text-xs font-black tracking-wide uppercase rounded-xl shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border border-brand-green select-none"
                >
                  <span>🫧</span>
                  <span>{language === 'en' ? 'Generate WhatsApp Ticket Order' : 'Agiza na utume maelezo WhatsApp'}</span>
                </button>

              </form>

              {/* Success validation block with track instruction */}
              {bookingSuccessCode && (
                <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-left">
                  <h4 className="font-poppins font-black text-xs uppercase m-0 flex items-center gap-1">
                    <span>🎉</span>
                    <span>{language === 'en' ? 'Appointment Ticket Registered Successfully!' : 'Tiketi ya dobi imesajiliwa kikamilifu!'}</span>
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-slate-600 mt-2">
                    {language === 'en' 
                      ? `We have created ticket ${bookingSuccessCode} in our platform. WhatsApp checkout window has been launched. Best of all: you can now scroll down immediately to the Live Order Tracker and enter "${bookingPhone}" or "${bookingSuccessCode}" to view your mock progress!`
                      : `Tumesababisha tiketi nambari ${bookingSuccessCode} katika mfumo wetu. Dirisha la WhatsApp sasa limefunguliwa. Zaidi ya hayo: unaweza kuandika nambari yako ya simu "${bookingPhone}" kwenye kikosi cha kufuatilia kilichopo hapa chini ili kujionea maendeleo!`}
                  </p>
                </div>
              )}

            </div>

            {/* Right details column (Value additions & guarantee badge) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-brand-navy text-white rounded-2xl p-6 shadow-xl space-y-4">
                
                <h3 className="font-poppins font-bold text-sm tracking-widest text-brand-yellow uppercase m-0">
                  {language === 'en' ? '48-Hour Freshness Guarantee' : 'Hakikisho La upya masaa 48'}
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  {language === 'en' 
                    ? "If any shirt, duvet cover or towel returns to you smelling anything less than absolute forest fresh within forty-eight hours, let us know via one WhatsApp line. We will dispatch a courier immediately and wash it again. Completely free, no questions. No drama."
                    : "Ikiwa nguo yako yoyote itarudishwa ikiwa na harufu mbaya au isiyopendeza ndani ya saa 48, tujulishe mara moja kwa WhatsApp. Magari yetu yatakuja kuchukua na kufua upya bila malipo kabisa. Bila malumbano!"}
                </p>

                <div className="flex gap-4 pt-3 border-t border-white/10 text-slate-300">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-5 h-5 text-brand-yellow" />
                    <span className="text-[11px] font-bold">100% Secure Care</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="w-5 h-5 text-brand-yellow" />
                    <span className="text-[11px] font-bold">Allergen Safe</span>
                  </div>
                </div>

              </div>

              {/* Dynamic calculator estimates preview banner */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-4">
                <h4 className="font-poppins font-black text-xs text-slate-400 uppercase tracking-widest block m-0">
                  {language === 'en' ? 'Calculated Price Estimate' : 'Makadirio ya Tiketi Sasa'}
                </h4>

                <div className="text-slate-800 text-sm py-1 border-y border-dashed border-slate-200">
                  <div className="flex justify-between font-medium">
                    <span>{language === 'en' ? 'Current weight rate:' : 'Uzito wa dobi: '} ({bookingWeight} kg)</span>
                    <span className="font-poppins">KSH {bookingServiceType === 'bedding_set' ? '500 Flat' : (bookingServiceType === 'curtains_pair' ? '300 Flat' : `${bookingWeight}kg x KSH ${bookingServiceType === 'express' ? '120' : '80'}`)}</span>
                  </div>
                  {bookingIroning && (
                    <div className="flex justify-between font-medium text-xs text-slate-500 mt-1">
                      <span>{language === 'en' ? '+ Garment ironing request:' : '+ Pasi kwa mashati:'}</span>
                      <span className="font-poppins">KSH {Math.round(Math.max(bookingWeight * 1.5, 3) * 30)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold block">
                    {language === 'en' ? 'Estimated Total Pay:' : 'Jumla ya hesabu:'}
                  </span>
                  <div className="font-poppins font-black text-3xl text-brand-blue">
                    KSH {currentBookingPrice}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  {language === 'en' 
                    ? "Our dispatch rider carries an electronic lightweight scale. Your final billing is updated when nguo are verified at check-in clinic."
                    : "Rider wetu anakuja na mashine ya kupimia uzani kielektroniki. Uzito kamili unathibitishwa ukifika duka la kusafishia."}
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        D. WHY CHOOSE US
        ========================================================================
      */}
      <section className="py-16 bg-slate-50 border-t border-slate-100" id="why-us">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {language === 'en' ? 'Local Service Excellence' : 'Kwanini sisi'}
            </span>
            <h2 className={`text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-2 ${themeTokens.headingColor}`}>
              {language === 'en' ? 'We Take the "Chore" Out of Laundry' : 'Ondoa tabu ya kufua nguo milele'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-3">
              {language === 'en' 
                ? "Other laundry shops simply wash your fabrics. We protect them, treat them, fold them perfectly, and save your time."
                : "Sehemu nyingine wanafuli tu. Sisi tunalinda nguo, kuondoa madoa, kukunja vizuri sana, na kuokoa muda wako mwingi."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-2xl block">⏱</span>
              <h4 className="font-poppins font-bold text-slate-800 text-sm tracking-tight m-0 uppercase">
                {language === 'en' ? 'Fast Same-Day Turnaround' : 'Saa 6 Same-Day Turnaround'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">
                {language === 'en' 
                  ? "Standard delivery in 24–48h. Need it quicker for a boardroom presentation? Our urgent express setting completes in under 6 hours."
                  : "Uwasilishaji wa kawaida unafanyika ndani ya saa 24-48 pekee. Je unahitaji upesi? Huduma yetu ya express itakamilisha kazi kwa saa 6 tu."}
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-2xl block">🚚</span>
              <h4 className="font-poppins font-bold text-slate-800 text-sm tracking-tight m-0 uppercase">
                {language === 'en' ? 'Free Pickup & Return Delivery' : 'Usafiri Bure wa duka kwako'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">
                {language === 'en' 
                  ? "No need to sit in Nairobi traffic or walk to a storefront. If your order totals over KSH 500, we pick up and return at zero dispatch costs."
                  : "Huna haja ya kushikamana kwenye foleni ya Nairobi au kutembea hadi dukani. Agizo lolote juu ya KSH 500 tutakuja kuchukua na kurejesha bure."}
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-2xl block">🌿</span>
              <h4 className="font-poppins font-bold text-slate-800 text-sm tracking-tight m-0 uppercase">
                {language === 'en' ? 'Skin-Safe Eco Detergents' : 'Biodegradable Eco Detergents'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">
                {language === 'en' 
                  ? "Washed exclusively using premium biodegradable formulas that treat fabrics gently while remaining completely friendly to sensitive skin."
                  : "Tunafua kwa kutumia sabuni bora ambazo ni rafiki kwa mazingira na salama kabisa kwa ngozi laini ya watoto na mzio."}
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-2xl block">🛡</span>
              <h4 className="font-poppins font-bold text-slate-800 text-sm tracking-tight m-0 uppercase">
                {language === 'en' ? 'Care-Label Compliance' : 'Kukagua lebo za nguo'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">
                {language === 'en' 
                  ? "We carefully read individual fabric tags. Silk, wool, linens, and heavy denim are routed to distinct wash cycles and optimal spin ratios."
                  : "Tunakagua kila agizo kuelewa lebo ya nguo. Vitambaa vya hariri, pamba maalum na jeans hufuliwa kwa njia tofauti ili zisisinyae."}
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-2xl block">💎</span>
              <h4 className="font-poppins font-bold text-slate-800 text-sm tracking-tight m-0 uppercase">
                {language === 'en' ? 'Affordable Luxury standard' : 'Bei Nafuu Kabisa'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">
                {language === 'en' 
                  ? "A truly premium agency-grade cleaning standard, but optimized to remain accessible and highly affordable. KSH 80 per kilo delivers total luxury."
                  : "Ubora mkubwa kwa kiwango cha kishujaa lakini unaotambulika kuwa bei rahisi na thabiti kuliko kwingine kokote Nairobi."}
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="text-2xl block">❤️</span>
              <h4 className="font-poppins font-bold text-slate-800 text-sm tracking-tight m-0 uppercase">
                {language === 'en' ? 'Satisfaction Re-wash Guarantee' : 'Garantini ya kurudishiwa fedha'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed m-0">
                {language === 'en' 
                  ? "Not completely in love with the lavender scent or alignment? We do a prompt rewash completely free of charge. No arguments, no drama."
                  : "Ukiwa hujaridhika kabisa na usafi au kupasiwa? Sisi tutachukua na kufua upya bila kukuuliza maswali yoyote."}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        E. TESTIMONIALS SECTION
        ========================================================================
      */}
      <section className="py-16 bg-white" id="testimonials">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {language === 'en' ? 'Happy Customer Reviews' : 'Maoni ya Wateja Wetu'}
            </span>
            <h2 className={`text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-2 ${themeTokens.headingColor}`}>
              {language === 'en' ? 'Don’t Just Take Our Word For It' : 'Kile Wateja Wetu Wanasema'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-3">
              {language === 'en' 
                ? 'We support hundreds of households, busy medical trainees, salon hubs and guesthouse networks monthly.'
                : 'Muaminifu kwa familia na wataalamu mia nne kote Nairobi kila mwezi.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((test) => (
              <div 
                key={test.id}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left flex flex-col justify-between shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex gap-1 text-brand-yellow mb-3 select-none">
                    {Array.from({ length: test.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                    ))}
                  </div>
                  <p className="text-xs md:text-xs text-slate-500 italic leading-relaxed mb-6 font-sans">
                    "{language === 'en' ? test.reviewEn : test.reviewSw}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 select-none">
                  <div className="w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue font-poppins font-black text-xs flex items-center justify-center border border-brand-blue/20">
                    {test.avatarText}
                  </div>
                  <div className="text-left">
                    <strong className="font-poppins text-xs font-black block text-slate-800 leading-tight">
                      {test.author}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {language === 'en' ? test.locationEn : test.locationSw}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        ACTIVE SERVICE AREAS AND COVERAGE MAP SYSTEM
        Provides client search functionality.
        ========================================================================
      */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-100" id="coverage">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          <ServiceZones language={language} />

          {/* F. Google Maps Placeholder */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 text-left" id="google-maps-placeholder">
            <h4 className="font-poppins font-extrabold text-sm text-slate-800 mb-2 flex items-center gap-1.5">
              <span>📍</span>
              <span>{language === 'en' ? 'Our Central Nairobi Operations Facility' : 'Duka Kuu na Kiwanda Yetu Nairobi'}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Our high-speed washing facilities, steam press machines, and dispatch hub are headquartered centrally. You can embed your authentic live Google Maps location iframe here inside our pre-configured element.
            </p>
            
            {/* Elegant Map Embed or High-Fidelity Static Mock */}
            <div className="w-full h-80 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center">
              {/* Fallback iframe representing real Nairobi location coordinates for highest presentation fidelity */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.162441019672!2d36.81525622153202!3d-1.2863891461973053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49e7%3A0xf6516d24669894e7!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                className="absolute inset-0 w-full h-full border-0 grayscale opacity-85 hover:grayscale-0 transition duration-300" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Logic Laundry Services Nairobi Office Map"
              ></iframe>

              {/* Float helper element over iframe for additional reassurance */}
              <div className="absolute top-4 left-4 bg-brand-navy p-3 rounded-lg text-white text-xs text-left shadow-lg pointer-events-none max-w-xs z-10 border border-white/10">
                <strong className="font-poppins block text-xs m-0">Nairobi Headquarters</strong>
                <span className="text-[10px] text-slate-300 block mt-1">Sunrise Apartments, Ongata Rongai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        G. CONTACT SECTION
        Includes simple message form with active local validation.
        ========================================================================
      */}
      <section className="py-16 bg-white" id="contact">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
            
            {/* Info and operating hour details */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-2">
                <span className="text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Get In Touch' : 'Wasiliana Nasi'}
                </span>
                <h2 className="font-poppins font-black text-2xl md:text-3xl text-slate-900 leading-tight m-0">
                  {language === 'en' ? "We're Always a Message Away" : 'Sisi tuko karibu kila wakati'}
                </h2>
                <p className="text-slate-500 text-xs md:text-sm">
                  {language === 'en' 
                    ? "Reach out via call, send a text, or schedule direct. Our friendly local customer service works around the clock."
                    : "Tupigie simu, tutumie ujumbe, au andika agizo hapa. Support yetu ya WhatsApp inajibu kwa haraka sana."}
                </p>
              </div>

              <div className="space-y-4">
                
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center text-sm shrink-0">
                    📞
                  </div>
                  <div className="text-left">
                    <h4 className="font-poppins font-bold text-xs text-slate-800 m-0 uppercase">{language === 'en' ? 'Call Direct' : 'Piga Simu Moja kwa Moja'}</h4>
                    <a href="tel:+254715617654" className="text-brand-blue font-bold text-sm block mt-0.5 font-poppins">
                      +254 715 617 654
                    </a>
                    <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Mon – Sat: 7am – 8pm' : 'Jumatatu – Jumamosi: 7:00 asubuhi hadi 8:00 jioni'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center text-sm shrink-0">
                    💬
                  </div>
                  <div className="text-left">
                    <h4 className="font-poppins font-bold text-xs text-slate-800 m-0 uppercase">{language === 'en' ? 'WhatsApp Line' : 'Nambari ya WhatsApp'}</h4>
                    <a href="https://wa.me/254715617654" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold text-sm block mt-0.5 font-poppins">
                      +254 715 617 654
                    </a>
                    <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Average response under 10m' : 'Majibu kwa chini ya dakika 10'}</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center text-sm shrink-0">
                    🕐
                  </div>
                  <div className="text-left">
                    <h4 className="font-poppins font-bold text-xs text-slate-800 m-0 uppercase">{language === 'en' ? 'Operating Days' : 'Siku za Kazi'}</h4>
                    <p className="text-xs text-slate-600 leading-normal m-0 mt-0.5">
                      <strong>{language === 'en' ? 'Mon – Sat:' : 'Jumatatu - Jumamosi:'}</strong> 7:00 AM – 8:00 PM <br />
                      <strong>{language === 'en' ? 'Sunday:' : 'Jumapili:'}</strong> 9:00 AM – 4:00 PM
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick contact submission Form */}
            <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-xl">
              
              <h3 className="font-poppins font-black text-slate-800 text-sm md:text-base mb-4 m-0 uppercase tracking-wide">
                {language === 'en' ? 'Send Us a Quick Note' : 'Tuandikie Ujumbe wa Haraka'}
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-600 block">{language === 'en' ? 'First Name' : 'Jina lako'}</label>
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Brian"
                      className="w-full px-4.5 py-2.5 text-xs text-slate-700 border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-600 block">{language === 'en' ? 'Phone Number' : 'Nambari ya Simu'}</label>
                    <input 
                      type="tel" 
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 07XXXXXXXX"
                      className="w-full px-4.5 py-2.5 text-xs text-slate-700 border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-600 block">{language === 'en' ? 'Message' : 'Ujumbe wako kwetu'}</label>
                  <textarea 
                    rows={3}
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder={language === 'en' ? "Tell us how we can assist you..." : "Tuambie jinsi duka letu linavyoweza kukusaidia..."}
                    className="w-full px-4.5 py-2.5 text-xs text-slate-700 border border-slate-200 focus:border-brand-blue focus:outline-none rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-navy hover:bg-slate-800 text-white font-poppins text-xs font-bold rounded-xl transition tracking-wider uppercase col-span-2 select-none"
                >
                  {language === 'en' ? 'Send Message' : 'Tuma Ujumbe'}
                </button>

              </form>

              {contactSuccess && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs">
                  ✅ {language === 'en' ? "Thank you! We've received your note and will reply promptly." : "Asante! Tumeipata ujumbe wako, tutakujibu haraka."}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        FOOTER
        ========================================================================
      */}
      <footer className="bg-brand-navy text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <span className="w-8 h-8 bg-brand-blue text-white rounded-lg flex items-center justify-center font-poppins font-black text-sm">
                  ◈
                </span>
                <span className="font-poppins font-black text-white text-base">
                  Logic <span className="text-brand-blue">Laundry</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'en' 
                  ? "Nairobi's premier elite-grade, modern laundry & folding service shop. High quality care that protects fabrics while protecting client time."
                  : "Mmoja kati ya huduma bora zaidi za dobi za kisasa Nairobi. Tunalinda nguo na kuongeza kasi ya muda wako wa wikendi."}
              </p>
              <div className="text-slate-400 text-[10.5px] italic">
                🌿 {language === 'en' ? 'Proud user of skinsafe detergents' : 'Sisi ni duka linalotumia soap isiyo na vijidudu'}
              </div>
            </div>

            <div>
              <h4 className="font-poppins text-xs font-bold uppercase text-white tracking-widest mb-4">
                {language === 'en' ? 'Our services' : 'Huduma zetu'}
              </h4>
              <ul className="space-y-3 text-xs text-slate-400 p-0 m-0">
                <li><a href="#services" className="hover:text-brand-yellow transition select-none">Washing & Folding</a></li>
                <li><a href="#services" className="hover:text-brand-yellow transition select-none">Garment Steam Pressing</a></li>
                <li><a href="#services" className="hover:text-brand-yellow transition select-none">Stain Pre-treatment clinic</a></li>
                <li><a href="#services" className="hover:text-brand-yellow transition select-none">Duvet & Bedding packages</a></li>
                <li><a href="#services" className="hover:text-brand-yellow transition select-none">Corporate laundry agreements</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins text-xs font-bold uppercase text-white tracking-widest mb-4">
                {language === 'en' ? 'Quick anchors' : 'Viungo vya Haraka'}
              </h4>
              <ul className="space-y-3 text-xs text-slate-400 p-0 m-0">
                <li><a href="#hero-sec" className="hover:text-brand-yellow transition select-none">Home page</a></li>
                <li><a href="#pricing" className="hover:text-brand-yellow transition select-none">Pricing Tables</a></li>
                <li><a href="#why-us" className="hover:text-brand-yellow transition select-none">Why choose Logic</a></li>
                <li><a href="#booking-widget-sec" className="hover:text-brand-yellow transition select-none">Schedule pickup</a></li>
                <li><a href="#live-order-tracking" className="hover:text-brand-yellow transition select-none">Status Tracker</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-poppins text-xs font-bold uppercase text-white tracking-widest mb-4">
                {language === 'en' ? 'Business footprint' : 'Ofisi na Kiwanda'}
              </h4>
              <p className="text-xs text-slate-400 m-0 leading-relaxed">
                Ongata Rongai, Nairobi <br />
                Sunrise Apartments – MANNA <br />
                Support line: <a href="tel:+254715617654" className="text-slate-300 font-bold block mt-1 hover:text-brand-yellow transition">+254 715 617 654</a>
                WhatsApp: <a href="https://wa.me/254715617654" className="text-slate-300 font-bold block mt-0.5 hover:text-brand-yellow transition">wa.me/254715617654</a>
              </p>
            </div>

          </div>

          {/* Copyright bar */}
          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-wrap justify-between items-center gap-4">
            <p className="m-0">
              © 2026 Logic Laundry Services. {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'} Made with ♥ in Nairobi, Kenya.
            </p>
            <p className="m-0 italic">
              {language === 'en' ? '"Because clean clothes change your whole mood!"' : '"Nguo safi hubadilisha jinsi unavyojisikia kikamilifu!"'}
            </p>
          </div>
        </div>
      </footer>

      {/* 
        ========================================================================
        H. VIRTUAL ASSISTANT SLOT
        Real-world responsive Gemini Virtual Assistant Chatbot (Floating Bubble / Drawer)
        ========================================================================
      */}
      <AIAssistant language={language} selectedTheme={selectedTheme} />

    </div>
  );
}
