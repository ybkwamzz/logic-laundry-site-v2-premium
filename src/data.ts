import { ServiceItem, PricingTier, Testimonial, OrderStatus } from './types';

export const servicesData: ServiceItem[] = [
  {
    id: 'washing',
    icon: '🧺',
    titleEn: 'Washing & Folding',
    titleSw: 'Kuosha na Kukunja',
    descEn: 'Machine or gentle hand-wash using premium detergents. Sorted carefully by colour and fabric sensitivity to protect your garments.',
    descSw: 'Kuosha kwa mashine au kwa mkono kwa kutumia sabuni ya heri. Kutofautishwa kwa rangi na aina ya kitambaa ili kulinda nguo zako.',
    priceEn: 'KSH 80 / kg',
    priceSw: 'KSH 80 / kilo',
    category: 'wash'
  },
  {
    id: 'folding',
    icon: '👕',
    titleEn: 'Pinterest-Perfect Folding',
    titleSw: 'Kukunja Kilaini',
    descEn: 'Every item folded with military precision. Pinterest-perfect rows that slide beautifully right back into your drawers.',
    descSw: 'Kila nguo inakunjwa kwa usahihi wa hali ya juu. Mpangilio safi sana unaofaa kuingia kwenye droo yako mara moja.',
    priceEn: 'Included',
    priceSw: 'Imejumuishwa',
    category: 'dry'
  },
  {
    id: 'ironing',
    icon: '✨',
    titleEn: 'Ironing & Steam Pressing',
    titleSw: 'Kupasi Nguo safi',
    descEn: 'Crisp, wrinkle-free steam pressing for shirts, trousers, suits, and dresses. Show up looking sharp and standard for any meeting.',
    descSw: 'Kupasi kwa mvuke bila mikunjo kwa mashati, suruali, suti na nguo za kike. Tokeza ukiwa maridadi kwa mkutano wowote.',
    priceEn: 'KSH 30 / item',
    priceSw: 'KSH 30 / nguo',
    category: 'iron'
  },
  {
    id: 'stain_removal',
    icon: '🧪',
    titleEn: 'Stain Pre-Treatment',
    titleSw: 'Kuondoa Madoa',
    descEn: 'Red wine? Coffee spill? Mysterious playground mud? Our custom pre-treatments bust stubborn stains without fabric damage.',
    descSw: 'Mvinyo mwekundu? Kahawa iliyomwagika? Matope ya siri? Matibabu yetu maalum huondoa madoa magumu bila kuharibu nguo.',
    priceEn: 'Free with Wash',
    priceSw: 'Bure na Osho',
    category: 'special'
  },
  {
    id: 'bedding_curtains',
    icon: '🛏️',
    titleEn: 'Duvets & Heavy Linen',
    titleSw: 'Blanketi na Mapazia',
    descEn: 'Deep cleaning, sanitisation, and complete drying of bulky duvets, blankets, pillows, and room-length floor draperies.',
    descSw: 'Usafishaji wa kina, kuondoa vijidudu, na kukausha kabisa kwa magodoro, blanketi, mito, na mapazia makubwa ya ukuta.',
    priceEn: 'From KSH 300',
    priceSw: 'Kuanzia KSH 300',
    category: 'special'
  },
  {
    id: 'corporate',
    icon: '🏢',
    titleEn: 'Corporate Business Laundry',
    titleSw: 'Dobi ya Mashirika',
    descEn: 'Flexible, high-volume laundry cycles with custom billing for hotels, beauty spas, nail salons, health clinics, and workplaces.',
    descSw: 'Dobi ya kiwango kikubwa na malipo maalum kwa hoteli, spa, saluni za kucha, kliniki za afya na mazingira ya kazi.',
    priceEn: 'Custom Quote',
    priceSw: 'Bei ya Makubaliano',
    category: 'special'
  }
];

export const pricingTiers: PricingTier[] = [
  {
    id: 'per_kilo',
    icon: '⚖️',
    titleEn: 'Per Kilo Rate',
    titleSw: 'Bei ya Kilo',
    priceEn: '80',
    priceSw: '80',
    unitEn: 'KSH / kilo',
    unitSw: 'KSH / kilo',
    featuresEn: [
      'Complete Wash & Dry',
      'Skin-safe Detergents',
      'Pinterest-quality Folding',
      'Free Pickup over KSH 500',
      'Care label compliance check'
    ],
    featuresSw: [
      'Kufua na kukausha kamili',
      'Sabuni salama kwa ngozi',
      'Kukunja kwa kiwango cha juu',
      'Kuchukuliwa Bure juu ya KSH 500',
      'Kukagua maagizo ya lebo ya nguo'
    ],
    type: 'kilo'
  },
  {
    id: 'express',
    icon: '⚡',
    titleEn: 'Express Same-Day',
    titleSw: 'Express Siku Hiyohiyo',
    priceEn: '120',
    priceSw: '120',
    unitEn: 'KSH / kilo',
    unitSw: 'KSH / kilo',
    featuresEn: [
      'Ready in under 6 hours!',
      'Priority single-load washing',
      'Rapid hot air tumble-drying',
      'Immediate delivery dispatch',
      'Free SMS / Chat status updates'
    ],
    featuresSw: [
      'Safi chini ya saa 6 pekee!',
      'Kufuliwa kwa kipaumbele cha juu',
      'Kukaushwa kwa hewa moto haraka',
      'Kusafirishwa mara moja kwa mteja',
      'Ujumbe wa sms wa maendeleo bure'
    ],
    isFeatured: true,
    type: 'express'
  },
  {
    id: 'bedding_set',
    icon: '🛏️',
    titleEn: 'Bedding Set Combo',
    titleSw: 'Kifurushi cha Vitanda',
    priceEn: '500',
    priceSw: '500',
    unitEn: 'KSH / set',
    unitSw: 'KSH / seti',
    featuresEn: [
      '1 Duvet cover deep clean',
      '1 Bedsheet sanitised wash',
      '2 Matching pillowcases',
      'Aromatic lavender textile spray',
      'Wrapped in sanitary seal'
    ],
    featuresSw: [
      'Kuoshwa kwa kava 1 ya duvet',
      'Kuoshwa kwa shuka 1 ya kitanda',
      'Foronya 2 za mito zinazolingana',
      'Kupuliziwa manukato ya lavenda',
      'Kufungwa kwa plastiki safi'
    ],
    type: 'bedding'
  },
  {
    id: 'curtains_pair',
    icon: '🪟',
    titleEn: 'Premium Curtains',
    titleSw: 'Mapazia Bora',
    priceEn: '300',
    priceSw: '300',
    unitEn: 'KSH / pair',
    unitSw: 'KSH / jozi',
    featuresEn: [
      'Up to 2.5m drop height',
      'Soft allergen extraction cycle',
      'Eco-friendly steam pressing',
      'Dust-repellent protection coating',
      'Ready to hang instantly'
    ],
    featuresSw: [
      'Hadi urefu wa mita 2.5',
      'Mzunguko wa kuondoa vizio/vumbi',
      'Kupiga pasi na mvuke wa kiikolojia',
      'Zisizoshika vumbi haraka',
      'Ziko tayari kuning\'inizwa'
    ],
    type: 'curtains'
  },
  {
    id: 'corporate_tier',
    icon: '🏢',
    titleEn: 'Corporate Business',
    titleSw: 'Biashara/Mashirika',
    priceEn: 'Call',
    priceSw: 'Piga Simu',
    unitEn: 'Volume Deal',
    unitSw: 'Mkataba Maalum',
    featuresEn: [
      'Dedicated account messenger',
      'Substantial weight discounts',
      'Direct monthly invoice billing',
      'Pre-scheduled weekly collection',
      'Sanitary thermal disinfection'
    ],
    featuresSw: [
      'Msafirishaji maalum wa akaunti',
      'Punguzo kubwa kwa mzigo mkubwa',
      'Malipo ya ankara ya kila mwezi',
      'Kuchukuliwa kila wiki kwa ratiba',
      'Kusafisha kwa joto/disinfekta'
    ],
    type: 'corporate'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    stars: 5,
    reviewEn: 'I used to dread laundry day. Now I just send a WhatsApp and everything comes back folded better than I ever managed. My bedding feels like a 5-star hotel in Kilimani!',
    reviewSw: 'Niliogopa sana siku ya kufua. Sasa natuma tu WhatsApp na nguo zinarudishwa zikiwa zimekunjwa vizuri kuliko nilivyoweza mwenyewe. Shuka zangu sasa zinahisi kama hoteli ya nyota 5 kule Kilimani!',
    author: 'Wanjiru Kamau',
    locationEn: 'Kasarani, Nairobi',
    locationSw: 'Kasarani, Nairobi',
    avatarText: 'WK'
  },
  {
    id: 't2',
    stars: 5,
    reviewEn: 'As a busy med student with literally zero minutes of free time, Logic Laundry is a lifesaver. The prompt door pickup is highly reliable and the stain removal on my white lab coats is absolutely miraculous.',
    reviewSw: 'Kama mwanafunzi wa udaktari mwenye shughuli nyingi asiye na dakika hata moja ya kupoteza, Logic Laundry ni mkombozi. Kuchukua nguo mlangoni ni kwa hakika na kuondoa madoa kwenye koti langu jeupe ni muujiza.',
    author: 'Brian Mutua',
    locationEn: 'Westlands, Nairobi',
    locationSw: 'Westlands, Nairobi',
    avatarText: 'BM'
  },
  {
    id: 't3',
    stars: 5,
    reviewEn: 'We have forty towels at our beauty salon that need regular cycles. Safeguarded, fragrant, and returned fluffy like clouds. Our clients have literally commented on how clean they feel!',
    reviewSw: 'Tuna taulo arobaini katika saluni yetu ambazo zinahitaji kuoshwa mara kwa mara. Zinalindwa, zinanukia vizuri na kurudishwa zikiwa laini kama mawingu. Wateja wetu wenyewe wametoa maoni jinsi zinavyohisi utamu!',
    author: 'Aisha Ndungu',
    locationEn: 'Kilimani, Nairobi',
    locationSw: 'Kilimani, Nairobi',
    avatarText: 'AN'
  }
];

export const mockOrders: OrderStatus[] = [
  {
    orderId: 'LL-4927',
    phone: '0711223344',
    name: 'Wanjiru Kamau',
    status: 'Delivered',
    weight: 5.2,
    priceEstimate: 416,
    orderDate: '2026-05-28 09:12 AM',
    deliveryDate: '2026-05-29 03:30 PM',
    itemsSummaryEn: '5.2 Kilos of regular garments, sorted wash, tumble dry and fold',
    itemsSummarySw: 'Kilo 5.2 za nguo za kawaida, kufua kwa makundi, kukausha na kukunja',
    notesEn: 'Softener added, fragrant lavender scent requested.',
    notesSw: 'Iliyongezwa lainishi ya nguo, yenye harufu nzuri ya lavenda.'
  },
  {
    orderId: 'LL-8831',
    phone: '0722334455',
    name: 'Brian Mutua',
    status: 'Washing',
    weight: 4.0,
    priceEstimate: 480, // Express service
    orderDate: '2026-06-01 08:30 AM',
    deliveryDate: '2026-06-01 03:00 PM',
    itemsSummaryEn: '4.0 Kilos of surgical scrubs & lab coats, express high-temp sanitisation',
    itemsSummarySw: 'Kilo 4.0 za mavazi ya kliniki na koti za maabara, usafishaji wa haraka joto la juu',
    notesEn: 'Heavy stain treatment on collar and sleeves. High urgency.',
    notesSw: 'Kuondoa madoa magumu kwenye kola na mikono. Haraka sana.'
  },
  {
    orderId: 'LL-2391',
    phone: '0799887766',
    name: 'Kamau Njoroge',
    status: 'Sorting',
    weight: 8.5,
    priceEstimate: 1180, // 8.5 * 80 + 1 bedding set (500)
    orderDate: '2026-06-01 10:15 AM',
    deliveryDate: '2026-06-03 11:00 AM',
    itemsSummaryEn: '8.5 Kilos of family garments + 1 Duvet set combo wash',
    itemsSummarySw: 'Kilo 8.5 za nguo za familia + Seti 1 ya duvet kuoshwa kwa pamoja',
    notesEn: 'Please handle the delicate woollen sweaters with hand-wash setting.',
    notesSw: 'Tafadhali shughulikia sweta laini za sufu kwa mikono.'
  }
];
