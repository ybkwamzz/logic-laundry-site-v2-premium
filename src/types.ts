export type ThemeVersion = 'Minimal Premium' | 'Tech-Forward' | 'Corporate';

export type Language = 'en' | 'sw';

export interface ServiceItem {
  id: string;
  icon: string;
  titleEn: string;
  titleSw: string;
  descEn: string;
  descSw: string;
  priceEn: string;
  priceSw: string;
  category: 'wash' | 'dry' | 'iron' | 'special';
}

export interface PricingTier {
  id: string;
  icon: string;
  titleEn: string;
  titleSw: string;
  priceEn: string;
  priceSw: string;
  unitEn: string;
  unitSw: string;
  featuresEn: string[];
  featuresSw: string[];
  isFeatured?: boolean;
  type: 'kilo' | 'express' | 'bedding' | 'curtains' | 'corporate';
}

export interface Testimonial {
  id: string;
  stars: number;
  reviewEn: string;
  reviewSw: string;
  author: string;
  locationEn: string;
  locationSw: string;
  avatarText: string;
  image?: string;
}

export interface OrderStatus {
  orderId: string;
  phone: string;
  name: string;
  status: 'Received' | 'Sorting' | 'Washing' | 'Folding' | 'Out for Delivery' | 'Delivered';
  weight: number;
  priceEstimate: number;
  orderDate: string;
  deliveryDate: string;
  itemsSummaryEn: string;
  itemsSummarySw: string;
  notesEn?: string;
  notesSw?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
