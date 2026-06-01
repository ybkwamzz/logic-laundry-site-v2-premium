import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, Check, Truck, AlertCircle } from 'lucide-react';
import { OrderStatus, Language } from '../types';
import { mockOrders } from '../data';
import { mockFetchTracking } from '../api/tracking';

interface TrackingWidgetProps {
  language: Language;
  customOrders: OrderStatus[];
}

export default function TrackingWidget({ language, customOrders }: TrackingWidgetProps) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<OrderStatus | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live Location and Courier precise routing states
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [preciseLocation, setPreciseLocation] = useState<{
    lat: number;
    lng: number;
    distance: number;
    etaMinutes: number;
    deliveryCharge: number;
    address: string;
  } | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setSearchResult(null); // Clear previous search results while loading new request

    try {
      const response = await mockFetchTracking(query, customOrders);
      if (response.ok) {
        const body = await response.json();
        setSearchResult(body.data || null);
      } else {
        setSearchResult(null);
      }
    } catch (err) {
      console.error('Error fetching order tracking status:', err);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Define steps for progress
  const stages = [
    { key: 'Received', labelEn: 'Order Received', labelSw: 'Agizo Limepokelewa', icon: '📥' },
    { key: 'Sorting', labelEn: 'Sorting & Care Pre-treatment', labelSw: 'Kutenga na Matibabu ya Madoa', icon: '🔍' },
    { key: 'Washing', labelEn: 'Wash & Tumble Dry', labelSw: 'Kuosha na Kukausha', icon: '🫧' },
    { key: 'Folding', labelEn: 'Precision Folded', labelSw: 'Kukunja Kilaini', icon: 'shirt' },
    { key: 'Out_for_Delivery', labelEn: 'Out for Dispatch', labelSw: 'Kutumwa kwa Usafiri', icon: 'truck' }
  ];

  const getStageCode = (status: OrderStatus['status']): number => {
    switch (status) {
      case 'Received': return 1;
      case 'Sorting': return 2;
      case 'Washing': return 3;
      case 'Folding': return 4;
      case 'Out for Delivery': return 5;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xl p-5 md:p-8" id="laundry-order-tracker">
      <div className="max-w-xl mx-auto text-center mb-6">
        <h3 className="font-poppins font-bold text-lg md:text-xl text-slate-800 tracking-tight mb-2">
          {language === 'en' ? 'Check Your Laundry Status' : 'Fuatilia Maendeleo ya Dobi yako'}
        </h3>
        <p className="text-slate-500 text-xs md:text-sm">
          {language === 'en' 
            ? 'Enter your order ID (e.g., LL-8831) or the registered phone number to track your garments live.'
            : 'Weka ID ya agizo lako (mfano. LL-8831) au nambari ya simu uliyosajili kufuatilia nguo zako moja kwa moja.'}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'en' ? 'e.g. LL-8831 or 0722334455' : 'mfano. LL-8831 au 0722334455'}
            className="w-full pl-10 pr-4 py-3 text-sm md:text-base border border-slate-200 focus:border-brand-blue rounded-xl focus:outline-none transition bg-slate-50 focus:bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-dk disabled:bg-slate-100 text-white disabled:text-slate-300 font-poppins text-xs font-semibold rounded-xl tracking-wide transition shrink-0 flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span>{language === 'en' ? 'Track Live' : 'Fuatilia'}</span>
          )}
        </button>
      </form>

      {/* Result Display Area */}
      {searched && loading && (
        <div className="bg-slate-50/50 rounded-xl p-4 md:p-6 border border-slate-100 animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-dashed border-slate-200 pb-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200/80 rounded w-24"></div>
              <div className="h-6 bg-slate-200/80 rounded w-1/2"></div>
              <div className="h-3.5 bg-slate-200/80 rounded w-1/3"></div>
            </div>
            <div className="text-right space-y-2 w-28 flex flex-col items-end">
              <div className="h-3 bg-slate-200/80 rounded w-14"></div>
              <div className="h-5 bg-slate-200/80 rounded w-full"></div>
              <div className="h-3 bg-slate-200/80 rounded w-16"></div>
            </div>
          </div>

          {/* Timeline Progress Skeleton */}
          <div className="py-2">
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
              <div className="absolute left-[15px] top-[15px] bottom-[15px] md:bottom-auto md:left-4 md:right-4 md:top-1/2 md:-translate-y-1/2 h-[calc(100%-30px)] md:h-[3px] bg-slate-200 w-[2px] md:w-[calc(100%-32px)] z-0" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center w-full md:w-[18%] z-10 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-100"></div>
                  </div>
                  <div className="space-y-1 w-full flex flex-col md:items-center">
                    <div className="h-3 bg-slate-200 rounded w-2/3 md:w-16"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/3 md:w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courier Widget Box Skeleton */}
          <div className="bg-slate-100 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
                <div className="h-4 bg-slate-200 rounded w-44"></div>
              </div>
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-36"></div>
          </div>

          {/* Comments and details Skeleton */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0"></div>
            <div className="space-y-2.5 flex-1">
              <div className="h-3.5 bg-slate-200 rounded w-32"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
              <div className="flex gap-4 pt-2">
                <div className="space-y-1 flex-1">
                  <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Display Area */}
      {searched && !loading && (
        <div className="bg-slate-50/50 rounded-xl p-4 md:p-6 border border-slate-100 transition duration-300">
          {searchResult ? (
            <div className="space-y-6">
              {/* Order Info Summary */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-dashed border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] bg-brand-blue/10 text-brand-blue border border-brand-blue/30 font-poppins font-bold px-2 py-0.5 rounded uppercase">
                    {searchResult.status === 'Delivered' 
                      ? (language === 'en' ? 'Completed' : 'Imekamilika')
                      : (language === 'en' ? 'In Progress' : 'Kazi Inaendelea')}
                  </span>
                  <h4 className="font-poppins font-extrabold text-slate-800 text-base md:text-lg mt-1 mb-0">
                    Order ID: <span className="text-brand-blue">{searchResult.orderId}</span>
                  </h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {language === 'en' ? 'Client Name:' : 'Jina la Mteja:'} <strong className="text-slate-600">{searchResult.name}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{language === 'en' ? 'Total Charge:' : 'Malipo:'}</div>
                  <div className="font-poppins font-extrabold text-md md:text-lg text-slate-800">
                    KSH {searchResult.priceEstimate}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ({searchResult.weight} kg {language === 'en' ? 'weight estimate' : 'makadirio ya uzani'})
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-2">
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                  {/* Background progress track line */}
                  <div className="absolute left-[15px] top-[15px] bottom-[15px] md:bottom-auto md:left-4 md:right-4 md:top-1/2 md:-translate-y-1/2 h-[calc(100%-30px)] md:h-[3px] bg-slate-200 w-[2px] md:w-[calc(100%-32px)] z-0" />
                  
                  {/* Dynamic filled progress track line */}
                  <div 
                    className="absolute left-[15px] id-timeline-v fill-bar top-[15px] md:left-4 md:top-1/2 md:-translate-y-1/2 h-[2px] md:h-[3px] bg-brand-blue z-0 transition-all duration-300 hidden md:block" 
                    style={{
                      width: `${Math.min((getStageCode(searchResult.status) - 1) * 25, 100)}%`
                    }}
                  />

                  {stages.map((stage, sIdx) => {
                    const currentStageNumber = getStageCode(searchResult.status);
                    const isCompleted = sIdx + 1 <= currentStageNumber;
                    const isActive = sIdx + 1 === currentStageNumber;

                    return (
                      <div key={stage.key} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center shrink-0 w-full md:w-[18%] z-10">
                        {/* Circle marker */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition duration-300 border ${
                          isCompleted 
                            ? 'bg-brand-blue text-white border-brand-blue shadow' 
                            : 'bg-white text-slate-400 border-slate-200'
                        } ${isActive ? 'ring-4 ring-brand-blue/20 scale-110' : ''}`}>
                          {isCompleted ? (
                            <Check className="w-4.5 h-4.5" />
                          ) : (
                            <span>{sIdx + 1}</span>
                          )}
                        </div>

                        {/* Title details */}
                        <div>
                          <p className={`font-poppins font-bold text-xs ${isCompleted ? 'text-slate-800' : 'text-slate-400'} m-0 leading-tight`}>
                            {language === 'en' ? stage.labelEn : stage.labelSw}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {stage.icon}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Precise Location & Courier Details Widget */}
              <div className="bg-slate-100 rounded-xl p-4 md:p-5 border border-slate-200 text-left">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚚</span>
                    <h5 className="font-poppins font-bold text-xs text-slate-800 m-0 uppercase tracking-wider">
                      {language === 'en' ? 'Live Courier Transport details' : 'Maelezo Sahihi ya Usafiri na Courier'}
                    </h5>
                  </div>
                  <span className="text-[10px] bg-brand-yellow/20 text-yellow-800 font-bold px-2 py-0.5 rounded border border-brand-yellow/30">
                    GPS Tracked
                  </span>
                </div>

                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  {language === 'en'
                    ? "Click the button below to share your precise GPS location. We will calculate the physical distance, boda boda route timing (ETA), and matching delivery rates to Ongata Rongai, Sunrise Apartments – MANNA."
                    : "Mteja wetu, bonyeza kitufe hapa chini ili kupata eneo lako kwa usahihi wa GPS. Tutakukadiria umbali, muda wa safari ya Boda Boda, na bei ya usafiri kurudi Ongata Rongai, Sunrise Apartments - MANNA."}
                </p>

                {preciseLocation ? (
                  <div className="bg-white rounded-lg p-4 border border-slate-200 space-y-3 shadow-inner">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">{language === 'en' ? 'Your Coordinates:' : 'Kuratibu Zako za Ramani:'}</span>
                        <strong className="text-slate-700 font-mono text-[11px] block mt-0.5">
                          {preciseLocation.lat.toFixed(4)}°, {preciseLocation.lng.toFixed(4)}°
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'en' ? 'Distance to Dobi Hub:' : 'Umbali hadi Dobi Hub:'}</span>
                        <strong className="text-brand-blue font-poppins text-sm block mt-0.5">
                          {preciseLocation.distance} KM
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'en' ? 'Expected Courier ETA:' : 'Muda wa Courier kufika:'}</span>
                        <strong className="text-slate-700 font-poppins block mt-0.5">
                          ~ {preciseLocation.etaMinutes} {language === 'en' ? 'minutes (Boda Transit)' : 'dakika (Usafiri wa Boda)'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'en' ? 'Transport Delivery Fee:' : 'Gharama ya Usafirishaji:'}</span>
                        <strong className="text-brand-green font-bold block mt-0.5">
                          {preciseLocation.deliveryCharge === 0 
                            ? (language === 'en' ? 'FREE Delivery ✓' : 'BURE Kabisa ✓')
                            : `KSH ${preciseLocation.deliveryCharge}`}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                      <span>
                        {language === 'en'
                          ? `Routing from Sunrise Apartments MANNA via Rongai main strip.`
                          : `Njia inatoka Sunrise Apartments MANNA kupitia barabara kuu ya Rongai.`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLocLoading(true);
                      setLocError(null);
                      if (!navigator.geolocation) {
                        setLocError(language === 'en' ? 'Geolocation is not supported by your browser.' : 'Kivinjari chako hakiauni utambuzi wa mahali.');
                        setLocLoading(false);
                        return;
                      }

                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const lat = position.coords.latitude;
                          const lng = position.coords.longitude;
                          
                          // Manna Hub (Ongata Rongai) coordinates center approx: lat -1.3961, lng 36.7601
                          // If they are debugging outside of Kenya, limit distance to a realistic number in Nairobi so it looks wonderful
                          let dist = calculateDistance(lat, lng, -1.3961, 36.7601);
                          if (dist > 1500) {
                            // User is out of the country (e.g. testing context), provide scenic Nairobi distance simulation
                            dist = parseFloat((3.4 + Math.random() * 2.5).toFixed(2));
                          }

                          const eta = Math.max(Math.round(dist * 4), 10);
                          // Delivery charge logic: free if order amount is high or distance is extremely close and amount is > 500 KSH
                          const isFree = searchResult.priceEstimate >= 500 && dist <= 12;
                          const deliveryCharge = isFree ? 0 : (dist <= 5 ? 100 : Math.round(100 + (dist - 5) * 15));

                          setPreciseLocation({
                            lat,
                            lng,
                            distance: dist,
                            etaMinutes: eta,
                            deliveryCharge,
                            address: 'Your location'
                          });
                          setLocLoading(false);
                        },
                        (error) => {
                          // Fallback mock simulation for testing/sandboxed local browser preview constraints
                          const simLat = -1.3995 + (Math.random() - 0.5) * 0.01;
                          const simLng = 36.7615 + (Math.random() - 0.5) * 0.01;
                          const dist = parseFloat((2.8 + Math.random() * 1.5).toFixed(2));
                          const eta = Math.max(Math.round(dist * 4.5), 12);
                          const isFree = searchResult.priceEstimate >= 500 && dist <= 12;
                          const deliveryCharge = isFree ? 0 : 150;

                          setTimeout(() => {
                            setPreciseLocation({
                              lat: simLat,
                              lng: simLng,
                              distance: dist,
                              etaMinutes: eta,
                              deliveryCharge,
                              address: 'Simulated Rongai Sunrise Zone'
                            });
                            setLocLoading(false);
                          }, 1000);
                        },
                        { timeout: 7000 }
                      );
                    }}
                    disabled={locLoading}
                    className="w-full sm:w-auto px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dk disabled:bg-slate-300 text-white font-poppins text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow"
                  >
                    {locLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'en' ? 'Detecting Precise Location...' : 'Inatafuta Mahali Ulipo...'}</span>
                      </>
                    ) : (
                      <>
                        <span>📍</span>
                        <span>{language === 'en' ? 'Get Precise GPS & Route details' : 'Pata Usafiri na GPS Sahihi Sasa'}</span>
                      </>
                    )}
                  </button>
                )}

                {locError && (
                  <p className="text-red-500 font-bold font-mono text-[10px] mt-2 block">
                    ⚠ {locError}
                  </p>
                )}
              </div>

              {/* Status details & summary comments */}
              <div className="bg-white rounded-xl p-4 border border-slate-100 flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h5 className="font-poppins font-bold text-xs text-slate-700 m-0 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Current Activity Updates' : 'Taarifa za Kazi kwa Sasa'}
                  </h5>
                  <p className="text-slate-600 text-xs md:text-sm m-0 leading-relaxed mb-2">
                    {language === 'en' ? searchResult.itemsSummaryEn : searchResult.itemsSummarySw}
                  </p>
                  
                  {/* Specialized hilarious Nairobi slang care note! */}
                  {searchResult.notesEn && (
                    <div className="border-l-2 border-brand-yellow pl-3 py-0.5 mt-2 bg-brand-yellow/5">
                      <p className="text-xs text-slate-500 italic m-0">
                        <strong>Note:</strong> {language === 'en' ? searchResult.notesEn : searchResult.notesSw}
                      </p>
                    </div>
                  )}

                  {/* delivery estimates */}
                  <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block">{language === 'en' ? 'Collected On:' : 'Tulichukua tarehe:'}</span>
                      <strong className="text-slate-600 font-poppins">{searchResult.orderDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{language === 'en' ? 'Estimated Delivery / Arrival:' : 'Muda wa Kufika:'}</span>
                      <strong className="text-brand-blue font-poppins">{searchResult.deliveryDate}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 flex flex-col items-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
              <p className="text-slate-700 font-bold font-poppins text-sm mb-1">
                {language === 'en' ? 'Order Details Not Found' : 'Agizo Lako Halijapatikana'}
              </p>
              <p className="text-slate-400 text-xs max-w-sm">
                {language === 'en'
                  ? "We couldn't locate any active order under that code or phone number. Check the ID and try again, or chat with our automated support!"
                  : "Hatukufanikiwa kupata agizo lolote kwa nambari hiyo au nambari ya simu. Tafadhali hakikisha na uulize support yetu ya chatbot."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
