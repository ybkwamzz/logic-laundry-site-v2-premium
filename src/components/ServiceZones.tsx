import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Language } from '../types';

interface ServiceZonesProps {
  language: Language;
}

interface EstateZone {
  name: string;
  suburbs: string[];
  daysEn: string;
  daysSw: string;
  speedEn: string;
  speedSw: string;
  isFreeDelivery: boolean;
}

export default function ServiceZones({ language }: ServiceZonesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    estateName: string;
    details?: EstateZone;
  } | null>(null);

  const zones: EstateZone[] = [
    {
      name: 'Central Nairobi Zones',
      suburbs: ['Westlands', 'Kilimani', 'Lavington', 'Kileleshwa', 'Hurlingham', 'Parklands', 'Milimani'],
      daysEn: 'Daily (Mon - Sat)',
      daysSw: 'Kila siku (Jumatatu - Jumamosi)',
      speedEn: 'Express (6h) / Standard (24h)',
      speedSw: 'Express (Saa 6) / Kawaida (Saa 24)',
      isFreeDelivery: true
    },
    {
      name: 'Eastlands & Thika Road',
      suburbs: ['Kasarani', 'Roysambu', 'Githurai', 'Donholm', 'South B', 'South C', 'Kahawa', 'Pangani'],
      daysEn: 'Daily (Mon - Sat)',
      daysSw: 'Kila siku (Jumatatu - Jumamosi)',
      speedEn: 'Express (6h) / Standard (24h)',
      speedSw: 'Express (Saa 6) / Kawaida (Saa 24)',
      isFreeDelivery: true
    },
    {
      name: 'Northern Nairobi Suburbs',
      suburbs: ['Runda', 'Gigiri', 'Muthaiga', 'Ridgeways', 'Kiambu Road', 'Fourways Junction'],
      daysEn: 'Every Mon, Wed, Fri',
      daysSw: 'Kila Jumatatu, Jumatano, Ijumaa',
      speedEn: 'Standard Delivery (24 hours)',
      speedSw: 'Kawaida (Saa 24)',
      isFreeDelivery: true
    },
    {
      name: 'Outer Nairobi Zones',
      suburbs: ['Karen', 'Langata', 'Rongai', 'Ngong', 'Syokimau', 'Kitengela', 'Ruaka'],
      daysEn: 'Every Tue, Thu, Sat',
      daysSw: 'Kila Jumanne, Alhamisi, Jumamosi',
      speedEn: 'Standard Delivery (24-48 hours)',
      speedSw: 'Kawaida (Saa 24-48)',
      isFreeDelivery: false // Outside the free zone limit unless order is KSH 1500+
    }
  ];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return;

    let foundDetail: EstateZone | undefined;
    let MatchedSub = '';

    for (const zone of zones) {
      const match = zone.suburbs.find(s => s.toLowerCase().includes(cleanQuery) || cleanQuery.includes(s.toLowerCase()));
      if (match) {
        foundDetail = zone;
        MatchedSub = match;
        break;
      }
    }

    if (foundDetail) {
      setLookupResult({
        found: true,
        estateName: MatchedSub,
        details: foundDetail
      });
    } else {
      setLookupResult({
        found: false,
        estateName: searchQuery.trim()
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden" id="service-zones-section">
      <div className="p-5 md:p-8 border-b border-slate-100">
        <h3 className="font-poppins font-bold text-lg md:text-xl text-slate-800 flex items-center gap-2 mb-2">
          <MapPin className="w-5.5 h-5.5 text-brand-blue" />
          <span>{language === 'en' ? 'Check Your Estate Coverage' : 'Angalia Kama Tunajiri Estate Yako'}</span>
        </h3>
        <p className="text-slate-500 text-xs md:text-sm">
          {language === 'en'
            ? 'We offer door-to-door laundry service across Nairobi. Check your estate coverage days and active speeds.'
            : 'Tunatoa huduma ya dobi mlango-kwa-mlango Nairobi nzima. Angalia siku na kasi ya kusafiri katika estate yako.'}
        </p>
      </div>

      <div className="p-5 md:p-8 bg-slate-50/50">
        {/* Lookup Checker */}
        <form onSubmit={handleLookup} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Type your estate e.g., Westlands, Roysambu...' : 'Mfano. Kasarani, Lavington, Karen...'}
              className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 focus:border-brand-blue rounded-xl focus:outline-none transition bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-brand-navy hover:bg-slate-800 text-white font-poppins text-xs font-semibold rounded-xl tracking-wide transition shrink-0"
          >
            {language === 'en' ? 'Check' : 'Angalia'}
          </button>
        </form>

        {/* Lookup Result Box */}
        {lookupResult && (
          <div className={`p-4 rounded-xl border mb-6 text-left transition duration-300 ${
            lookupResult.found 
              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
              : 'bg-amber-50/50 border-amber-100 text-amber-800'
          }`}>
            {lookupResult.found && lookupResult.details ? (
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-poppins font-bold text-sm text-slate-800 m-0">
                    {lookupResult.estateName} — {language === 'en' ? 'Active Coverage Zone! 🚚' : 'Tunafika Bure Kabisa! 🚚'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {language === 'en' ? 'Pickup Schedule:' : 'Siku za Huduma:'} <strong>{language === 'en' ? lookupResult.details.daysEn : lookupResult.details.daysSw}</strong>.
                    <br />
                    {language === 'en' ? 'Delivery speeds:' : 'Saa za kurejesha:'} <strong>{language === 'en' ? lookupResult.details.speedEn : lookupResult.details.speedSw}</strong>.
                    <br />
                    {lookupResult.details.isFreeDelivery ? (
                      <span className="text-emerald-700 font-semibold">{language === 'en' ? '✓ Free pickup & delivery for orders above KSH 500!' : '✓ Kusafirishwa bure kwa oda juu ya KSH 500!'}</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">{language === 'en' ? '• Outer area: Free delivery for orders above KSH 1,500.' : '• Biashara Maalum: Kusafirishwa bure kwa oda kuanzia KSH 1,500.'}</span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-poppins font-bold text-sm text-slate-800 m-0">
                    {lookupResult.estateName} — {language === 'en' ? 'Out of Standard Free-Coverage Area' : 'Karibu, lakini iko nje kidogo ya Free delivery zone!'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {language === 'en' 
                      ? "We definitely still serve your estate! However, outer Nairobi areas may require a custom distance fee (KSH 150-200) depending on total order weight. Reach out on WhatsApp or Call to arrange a convenient time."
                      : "Tunafika hadi kwako pia! Lakini kwa sababu iko mbali kidogo na duka letu, usafirishaji unaweza kugharimu KSH 150-200 kutegemea na uzito wa dobi lako. Wasiliana nasi kwa WhatsApp kuelewana haraka."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {zones.map((zone, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm text-left">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-poppins font-bold text-xs text-slate-800 tracking-wide uppercase">
                  {zone.name}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded font-poppins font-bold ${
                  zone.isFreeDelivery ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {zone.isFreeDelivery ? (language === 'en' ? 'Free Zone' : 'Bure') : 'Outer Zone'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                {zone.suburbs.join(' • ')}
              </p>
              <div className="flex gap-2 items-center text-[10.5px] text-slate-500 pt-2 border-t border-slate-50">
                <Info className="w-3.5 h-3.5 text-brand-blue" />
                <span>
                  {language === 'en' ? zone.daysEn : zone.daysSw} ({language === 'en' ? 'Active Standard Delivery' : 'Safi na salama'})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
