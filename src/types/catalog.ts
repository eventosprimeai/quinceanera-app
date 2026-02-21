export interface ServiceItem {
    id: string;
    name: string;
    description?: string;
    pricingType?: 'fixed' | 'perPerson' | 'perHour' | 'perUnit' | 'quoteOnly' | 'range';
    priceUSD?: number | null;
    priceRange?: {
        min: number;
        max: number;
        raw: string;
    };
    unitLabel: string;
    imageQuery?: string;
    imageUrl?: string;
    defaultQty?: number | null;
    allowCustomQty?: boolean;
    freeWithBundle?: boolean;
    popupInfo?: {
        shortText: string;
        buttonText: string;
        title: string;
        imageQuery?: string;
        includedText: string[];
        factorsText?: string[];
        realValueText?: string;
    };
}

export interface ServiceSubcategory {
    id: string;
    name: string;
    items?: ServiceItem[];
    subcategories?: ServiceSubcategory[];
}

export interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    items?: ServiceItem[];
    subcategories?: ServiceSubcategory[];
}

export interface LocationRules {
    baseCity: string;
    outsideCityLogisticsRule: {
        modeOptions: string[];
        defaultMode: string;
        percentDefault: number;
        fixedFeeDefaultUSD: number;
        note: string;
    };
    outsideCityLogisticsItem: ServiceItem;
}

export interface ServiceCatalog {
    version: string;
    currency: string;
    locationRules: LocationRules;
    categories: ServiceCategory[];
}

export interface QuoteFormData {
    fullName: string;
    email: string;
    whatsapp: string;
    city: string;
    isOutsideGuayaquil: boolean;
    tentativeDate: string;
    guestCount: number;
    eventHours: number;
}

export interface SelectedItem {
    item: ServiceItem;
    categoryName: string;
    subcategoryName?: string;
    quantity: number;
}
