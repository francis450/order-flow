import { CatalogItem, Customer, WhatsAppOrder, MpesaTransaction } from '../types';

export const FMCG_CATALOG: CatalogItem[] = [
  {
    id: 'fmcg-1',
    sku: 'FLOUR-PEM-2K12',
    name: 'Pembe Maize Flour 2kg x 12',
    category: 'Milling & Grains',
    catalogType: 'fmcg',
    unit: 'Bale',
    unitPrice: 2150,
    packDetails: '12 packets of 2kg (24kg total)',
    stockAvailable: 450,
    taxRate: 0, // Zero rated staple
    aliases: ['pembe', 'unga pembe', 'pembe 2kg', 'bales pembe', 'unga ya ugali pembe']
  },
  {
    id: 'fmcg-2',
    sku: 'FLOUR-JOG-2K12',
    name: 'Jogoo Maize Meal 2kg x 12',
    category: 'Milling & Grains',
    catalogType: 'fmcg',
    unit: 'Bale',
    unitPrice: 2280,
    packDetails: '12 packets of 2kg (24kg total)',
    stockAvailable: 600,
    taxRate: 0,
    aliases: ['jogoo', 'unga jogoo', 'jogoo 2kg', 'bales jogoo', 'unga ya kuku']
  },
  {
    id: 'fmcg-3',
    sku: 'OIL-GF-1LX12',
    name: 'Golden Fry Cooking Oil 1L x 12',
    category: 'Edible Oils & Fats',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 3450,
    packDetails: '12 bottles of 1 Litre',
    stockAvailable: 220,
    taxRate: 0.16,
    aliases: ['golden fry', 'golden fry 1l', 'mafuta golden fry', 'gf 1 litre', 'ctn golden fry']
  },
  {
    id: 'fmcg-4',
    sku: 'OIL-FF-2LX6',
    name: 'Fresh Fri Vegetable Oil 2L x 6',
    category: 'Edible Oils & Fats',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 3920,
    packDetails: '6 bottles of 2 Litres',
    stockAvailable: 185,
    taxRate: 0.16,
    aliases: ['fresh fri', 'fresh fri 2l', 'mafuta fresh fry', 'freshfry 2 litre']
  },
  {
    id: 'fmcg-5',
    sku: 'SPICE-ROY-5G240',
    name: 'Royco Mchuzi Beef Cubes 5g Display',
    category: 'Condiments & Seasoning',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 1180,
    packDetails: '240 cubes (40 strips x 6 cubes, 5 bob pack)',
    stockAvailable: 310,
    taxRate: 0.16,
    aliases: ['royco', 'royco cubes', 'royco beef', 'royco 5 bob', 'cubes za 5 bob', 'mchuzi mix cubes']
  },
  {
    id: 'fmcg-6',
    sku: 'DET-OMO-500G24',
    name: 'Omo Hand Washing Powder 500g x 24',
    category: 'Home Care & Laundry',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 3600,
    packDetails: '24 pouches of 500g',
    stockAvailable: 140,
    taxRate: 0.16,
    aliases: ['omo', 'omo 500g', 'sabuni omo', 'omo powder', 'carton ya omo']
  },
  {
    id: 'fmcg-7',
    sku: 'SOAP-MEN-800G20',
    name: 'Menengai Cream Bar Soap 800g x 20',
    category: 'Home Care & Laundry',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 2900,
    packDetails: '20 bars of 800g long bars',
    stockAvailable: 290,
    taxRate: 0.16,
    aliases: ['menengai', 'menengai soap', 'sabuni menengai', 'bar soap 800g', 'menengai cream']
  },
  {
    id: 'fmcg-8',
    sku: 'SUG-KAB-1K24',
    name: 'Kabras Pure White Sugar 1kg x 24',
    category: 'Sugar & Sweeteners',
    catalogType: 'fmcg',
    unit: 'Bale',
    unitPrice: 3840,
    packDetails: '24 packets of 1kg',
    stockAvailable: 520,
    taxRate: 0,
    aliases: ['kabras', 'sukari kabras', 'sugar 1kg', 'kabras 1kg', 'bales za sukari']
  },
  {
    id: 'fmcg-9',
    sku: 'MILK-BS-500M12',
    name: 'Brookside Long Life Milk 500ml x 12',
    category: 'Dairy & Beverages',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 1020,
    packDetails: '12 cartons of 500ml pouch',
    stockAvailable: 340,
    taxRate: 0,
    aliases: ['brookside', 'brookside 500ml', 'maziwa ya pouch', 'brookside maziwa', 'uht milk']
  },
  {
    id: 'fmcg-10',
    sku: 'TEA-KET-100S12',
    name: 'Ketepa Pride Tea Bags 100s x 12',
    category: 'Beverages',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 2850,
    packDetails: '12 boxes of 100 tea bags',
    stockAvailable: 110,
    taxRate: 0.16,
    aliases: ['ketepa', 'ketepa tea bags', 'chai ya ketepa', 'ketepa 100s']
  },
  {
    id: 'fmcg-11',
    sku: 'SPREAD-BB-500G12',
    name: 'Blue Band Margarine 500g x 12',
    category: 'Breakfast Spreads',
    catalogType: 'fmcg',
    unit: 'Carton',
    unitPrice: 2750,
    packDetails: '12 tubs of 500g',
    stockAvailable: 215,
    taxRate: 0.16,
    aliases: ['blue band', 'blueband', 'bb 500g', 'blue band 500g', 'mafuta ya mkate']
  }
];

export const PHARMA_CATALOG: CatalogItem[] = [
  {
    id: 'pharma-1',
    sku: 'MED-PAN-EXT100',
    name: 'Panadol Extra 500/65mg 100s',
    category: 'Analgesics & Antipyretics',
    catalogType: 'pharma',
    unit: 'Carton',
    unitPrice: 3200,
    packDetails: 'Carton with 20 boxes of 100 tablets',
    stockAvailable: 150,
    taxRate: 0,
    aliases: ['panadol', 'panadol extra', 'panadol nyekundu', 'panadol 100s']
  },
  {
    id: 'pharma-2',
    sku: 'MED-AMX-500100',
    name: 'Amoxil (Amoxicillin) 500mg 100s Caps',
    category: 'Antibiotics',
    catalogType: 'pharma',
    unit: 'Box',
    unitPrice: 850,
    packDetails: 'Box of 10 blisters x 10 capsules',
    stockAvailable: 320,
    taxRate: 0,
    aliases: ['amoxil', 'amoxil 500', 'amoxicillin', 'amoxil capsules']
  },
  {
    id: 'pharma-3',
    sku: 'MED-CRT-20120',
    name: 'Coartem 20/120mg Malaria 24s x 10',
    category: 'Antimalarials',
    catalogType: 'pharma',
    unit: 'Pack',
    unitPrice: 4500,
    packDetails: '10 patient treatment packs (24 tabs each)',
    stockAvailable: 80,
    taxRate: 0,
    aliases: ['coartem', 'coartem 20/120', 'dawa ya malaria', 'coartem 6x4']
  },
  {
    id: 'pharma-4',
    sku: 'MED-BET-100M12',
    name: 'Betadine Antiseptic Solution 100ml x 12',
    category: 'Antiseptics & Wound Care',
    catalogType: 'pharma',
    unit: 'Carton',
    unitPrice: 2100,
    packDetails: '12 bottles of 100ml',
    stockAvailable: 95,
    taxRate: 0,
    aliases: ['betadine', 'betadine 100ml', 'antiseptic solution', 'dawa ya kidonda']
  },
  {
    id: 'pharma-5',
    sku: 'MED-VEN-100MCG',
    name: 'Ventolin Inhaler 100mcg (Pack of 10)',
    category: 'Respiratory',
    catalogType: 'pharma',
    unit: 'Pack',
    unitPrice: 4800,
    packDetails: '10 individual aerosol inhalers',
    stockAvailable: 60,
    taxRate: 0,
    aliases: ['ventolin', 'inhaler', 'ventolin 100mcg', 'salbutamol inhaler']
  },
  {
    id: 'pharma-6',
    sku: 'MED-CIP-500100',
    name: 'Ciprofloxacin 500mg 100s Tabs',
    category: 'Antibiotics',
    catalogType: 'pharma',
    unit: 'Box',
    unitPrice: 950,
    packDetails: 'Box of 10 blisters x 10 tablets',
    stockAvailable: 210,
    taxRate: 0,
    aliases: ['cipro', 'ciprofloxacin', 'cipro 500mg']
  }
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Mama Fatuma Muriithi',
    businessName: 'Mama Fatuma Wholesale & General Duka',
    phone: '+254 722 418 902',
    location: 'River Road, OTC Building, Nairobi CBD',
    route: 'Route A - Nairobi Central / Downtown',
    taxPin: 'P051892341Z',
    creditLimit: 150000,
    currentBalance: 135200,
    aging: {
      current: 65200,
      overdue30: 35000,
      overdue60: 35000,
      overdue90: 0
    },
    creditStatus: 'WARN',
    paymentTermsDays: 14,
    lastPaymentDate: '2026-09-21',
    lastPaymentAmount: 45000
  },
  {
    id: 'cust-2',
    name: 'Abdi Hassan Mohamed',
    businessName: 'QuickMart Eastleigh Sub-Agent',
    phone: '+254 733 891 045',
    location: '1st Avenue, Section 3, Eastleigh, Nairobi',
    route: 'Route B - Eastlands / Thika Superhighway',
    taxPin: 'P052009182A',
    creditLimit: 450000,
    currentBalance: 180000,
    aging: {
      current: 180000,
      overdue30: 0,
      overdue60: 0,
      overdue90: 0
    },
    creditStatus: 'CLEAR',
    paymentTermsDays: 21,
    lastPaymentDate: '2026-09-28',
    lastPaymentAmount: 120000
  },
  {
    id: 'cust-3',
    name: 'Dr. Julius Kimani',
    businessName: 'Apex Medicare Chemist & Pharmacy',
    phone: '+254 710 654 321',
    location: 'Kawangware Stage 2, Naivasha Road, Nairobi',
    route: 'Route C - Westlands & Dagoretti Axis',
    taxPin: 'P051187422B',
    creditLimit: 80000,
    currentBalance: 94500, // EXCEEDS LIMIT!
    aging: {
      current: 20000,
      overdue30: 30000,
      overdue60: 44500,
      overdue90: 0
    },
    creditStatus: 'BLOCKED',
    paymentTermsDays: 30,
    lastPaymentDate: '2026-08-14',
    lastPaymentAmount: 25000
  },
  {
    id: 'cust-4',
    name: 'Karanja Ndung\'u',
    businessName: 'Githurai 44 Wholesalers Depot',
    phone: '+254 728 991 234',
    location: 'Githurai 44 Roundabout, Kiambu Border',
    route: 'Route B - Eastlands / Thika Superhighway',
    taxPin: 'P051449830X',
    creditLimit: 250000,
    currentBalance: 45000,
    aging: {
      current: 45000,
      overdue30: 0,
      overdue60: 0,
      overdue90: 0
    },
    creditStatus: 'CLEAR',
    paymentTermsDays: 14,
    lastPaymentDate: '2026-09-26',
    lastPaymentAmount: 85000
  },
  {
    id: 'cust-5',
    name: 'Sister Mary Wanjiru',
    businessName: 'St. Jude Community Pharmacy',
    phone: '+254 791 223 889',
    location: 'Umoja Innercore, Near Chief\'s Camp',
    route: 'Route D - Outering / Donholm Corridor',
    taxPin: 'P051992011M',
    creditLimit: 120000,
    currentBalance: 118000, // Dangerously close to limit
    aging: {
      current: 78000,
      overdue30: 40000,
      overdue60: 0,
      overdue90: 0
    },
    creditStatus: 'WARN',
    paymentTermsDays: 30,
    lastPaymentDate: '2026-09-10',
    lastPaymentAmount: 30000
  }
];

export const INITIAL_ORDERS: WhatsAppOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'WO-2026-0901',
    customerId: 'cust-1',
    customerName: 'Mama Fatuma Muriithi',
    customerPhone: '+254 722 418 902',
    customerLocation: 'River Road, OTC Building, Nairobi CBD',
    route: 'Route A - Nairobi Central / Downtown',
    rawMessage: 'Niaje Kelvin, tupatie bales 12 za Pembe 2kg, bale 8 za Jogoo, na carton 3 za Golden Fry 1L. Ongeza carton 2 za Royco cubes zile za 5 bob. Deliver kesho saa tatu asubuhi kwa duka River Road. Tutalipa balance ya jana na hii order pamoja kwa Till ya Kifaru.',
    messageType: 'text',
    receivedAt: 'Today, 08:14 AM',
    status: 'PARSED',
    catalogType: 'fmcg',
    items: [
      {
        id: 'li-1',
        rawText: 'bales 12 za Pembe 2kg',
        matchedSku: 'FLOUR-PEM-2K12',
        itemName: 'Pembe Maize Flour 2kg x 12',
        quantity: 12,
        unit: 'Bale',
        unitPrice: 2150,
        lineTotal: 25800,
        confidence: 0.98,
        inStock: true
      },
      {
        id: 'li-2',
        rawText: 'bale 8 za Jogoo',
        matchedSku: 'FLOUR-JOG-2K12',
        itemName: 'Jogoo Maize Meal 2kg x 12',
        quantity: 8,
        unit: 'Bale',
        unitPrice: 2280,
        lineTotal: 18240,
        confidence: 0.97,
        inStock: true
      },
      {
        id: 'li-3',
        rawText: 'carton 3 za Golden Fry 1L',
        matchedSku: 'OIL-GF-1LX12',
        itemName: 'Golden Fry Cooking Oil 1L x 12',
        quantity: 3,
        unit: 'Carton',
        unitPrice: 3450,
        lineTotal: 10350,
        confidence: 0.99,
        inStock: true
      },
      {
        id: 'li-4',
        rawText: 'carton 2 za Royco cubes zile za 5 bob',
        matchedSku: 'SPICE-ROY-5G240',
        itemName: 'Royco Mchuzi Beef Cubes 5g Display',
        quantity: 2,
        unit: 'Carton',
        unitPrice: 1180,
        lineTotal: 2360,
        confidence: 0.95,
        inStock: true
      }
    ],
    subtotal: 56750,
    vatTotal: 2033.6,
    grandTotal: 56750,
    deliveryDatePreference: 'Tomorrow 09:00 AM',
    deliveryNotes: 'Drop at River Road OTC building front entrance, assist with offloading',
    creditCheckResult: {
      allowed: false,
      decision: 'WARN',
      customerBalance: 135200,
      orderAmount: 56750,
      projectedBalance: 191950,
      creditLimit: 150000,
      overdueAmount: 35000,
      oldestInvoiceDays: 42,
      recommendedAction: 'Customer exceeds KES 150,000 credit limit by KES 41,950 and has 42-day overdue invoice. Require minimum M-Pesa clearance of KES 42,000 before loading truck.',
      requiredDownpayment: 42000,
      reasons: [
        'Projected ledger debt KES 191,950 exceeds facility ceiling (KES 150,000)',
        'Unpaid invoice #INV-4901 is 42 days old (over agreed 14-day terms)'
      ]
    }
  },
  {
    id: 'ord-102',
    orderNumber: 'WO-2026-0902',
    customerId: 'cust-2',
    customerName: 'Abdi Hassan Mohamed',
    customerPhone: '+254 733 891 045',
    customerLocation: '1st Avenue, Section 3, Eastleigh, Nairobi',
    route: 'Route B - Eastlands / Thika Superhighway',
    rawMessage: 'As-salamu alaykum Kelvin. Order ya asubuhi: 20 bales Kabras sugar 1kg, 15 cartons Menengai soap 800g, and 10 cartons Omo 500g. Also add 10 cartons Brookside 500ml milk pouch. Send with 11 AM Eastleigh delivery canter.',
    messageType: 'text',
    receivedAt: 'Today, 08:42 AM',
    status: 'APPROVED',
    catalogType: 'fmcg',
    items: [
      {
        id: 'li-201',
        rawText: '20 bales Kabras sugar 1kg',
        matchedSku: 'SUG-KAB-1K24',
        itemName: 'Kabras Pure White Sugar 1kg x 24',
        quantity: 20,
        unit: 'Bale',
        unitPrice: 3840,
        lineTotal: 76800,
        confidence: 0.99,
        inStock: true
      },
      {
        id: 'li-202',
        rawText: '15 cartons Menengai soap 800g',
        matchedSku: 'SOAP-MEN-800G20',
        itemName: 'Menengai Cream Bar Soap 800g x 20',
        quantity: 15,
        unit: 'Carton',
        unitPrice: 2900,
        lineTotal: 43500,
        confidence: 0.98,
        inStock: true
      },
      {
        id: 'li-203',
        rawText: '10 cartons Omo 500g',
        matchedSku: 'DET-OMO-500G24',
        itemName: 'Omo Hand Washing Powder 500g x 24',
        quantity: 10,
        unit: 'Carton',
        unitPrice: 3600,
        lineTotal: 36000,
        confidence: 0.98,
        inStock: true
      },
      {
        id: 'li-204',
        rawText: '10 cartons Brookside 500ml milk pouch',
        matchedSku: 'MILK-BS-500M12',
        itemName: 'Brookside Long Life Milk 500ml x 12',
        quantity: 10,
        unit: 'Carton',
        unitPrice: 1020,
        lineTotal: 10200,
        confidence: 0.97,
        inStock: true
      }
    ],
    subtotal: 166500,
    vatTotal: 12720,
    grandTotal: 166500,
    deliveryDatePreference: 'Today 11:00 AM',
    deliveryNotes: 'Eastleigh Canter KDD 412X',
    creditCheckResult: {
      allowed: true,
      decision: 'APPROVED',
      customerBalance: 180000,
      orderAmount: 166500,
      projectedBalance: 346500,
      creditLimit: 450000,
      overdueAmount: 0,
      oldestInvoiceDays: 12,
      recommendedAction: 'Approved for automatic dispatch. Balance remains within 21-day facility limit.',
      requiredDownpayment: 0,
      reasons: [
        'Within authorized credit limit (KES 346,500 / KES 450,000 used)',
        'Zero overdue invoices, exemplary payment track record'
      ]
    }
  },
  {
    id: 'ord-103',
    orderNumber: 'WO-2026-0903',
    customerId: 'cust-3',
    customerName: 'Dr. Julius Kimani',
    customerPhone: '+254 710 654 321',
    customerLocation: 'Kawangware Stage 2, Naivasha Road, Nairobi',
    route: 'Route C - Westlands & Dagoretti Axis',
    rawMessage: 'Urgently dispatch: 5 cartons Panadol Extra, 12 boxes Amoxil 500mg, 4 packs Coartem 20/120, and 3 cartons Betadine 100ml. Please put on our 30-day invoice. Send by motorbike rider.',
    messageType: 'text',
    receivedAt: 'Today, 09:12 AM',
    status: 'CREDIT_HOLD',
    catalogType: 'pharma',
    items: [
      {
        id: 'li-301',
        rawText: '5 cartons Panadol Extra',
        matchedSku: 'MED-PAN-EXT100',
        itemName: 'Panadol Extra 500/65mg 100s',
        quantity: 5,
        unit: 'Carton',
        unitPrice: 3200,
        lineTotal: 16000,
        confidence: 0.99,
        inStock: true
      },
      {
        id: 'li-302',
        rawText: '12 boxes Amoxil 500mg',
        matchedSku: 'MED-AMX-500100',
        itemName: 'Amoxil (Amoxicillin) 500mg 100s Caps',
        quantity: 12,
        unit: 'Box',
        unitPrice: 850,
        lineTotal: 10200,
        confidence: 0.98,
        inStock: true
      },
      {
        id: 'li-303',
        rawText: '4 packs Coartem 20/120',
        matchedSku: 'MED-CRT-20120',
        itemName: 'Coartem 20/120mg Malaria 24s x 10',
        quantity: 4,
        unit: 'Pack',
        unitPrice: 4500,
        lineTotal: 18000,
        confidence: 0.98,
        inStock: true
      },
      {
        id: 'li-304',
        rawText: '3 cartons Betadine 100ml',
        matchedSku: 'MED-BET-100M12',
        itemName: 'Betadine Antiseptic Solution 100ml x 12',
        quantity: 3,
        unit: 'Carton',
        unitPrice: 2100,
        lineTotal: 6300,
        confidence: 0.97,
        inStock: true
      }
    ],
    subtotal: 50500,
    vatTotal: 0,
    grandTotal: 50500,
    deliveryDatePreference: 'Urgent today',
    deliveryNotes: 'Motorbike rider dispatch requested',
    creditCheckResult: {
      allowed: false,
      decision: 'BLOCKED',
      customerBalance: 94500,
      orderAmount: 50500,
      projectedBalance: 145000,
      creditLimit: 80000,
      overdueAmount: 74500,
      oldestInvoiceDays: 68,
      recommendedAction: 'HARD STOP: Existing unpaid debt (KES 94,500) already exceeds KES 80,000 credit ceiling. Overdue debt of KES 44,500 is 68 days aged. No dispatch permitted until at least KES 65,000 is settled via M-Pesa.',
      requiredDownpayment: 65000,
      reasons: [
        'Hard credit ceiling breach: Current balance KES 94,500 > Limit KES 80,000',
        'Critical overdue aging: KES 44,500 is 68 days past due (Policy stop at 45 days)',
        'ERP auto-lock enabled by Credit Control committee'
      ]
    }
  },
  {
    id: 'ord-104',
    orderNumber: 'WO-2026-0904',
    customerId: 'cust-4',
    customerName: 'Karanja Ndung\'u',
    customerPhone: '+254 728 991 234',
    customerLocation: 'Githurai 44 Roundabout, Kiambu Border',
    route: 'Route B - Eastlands / Thika Superhighway',
    rawMessage: 'Voice Note Transcribed (0:22): "Halo bwana Kelvin, niko hapa kwa stoo Githurai. Tuma unga Pembe bales 25, Fresh fri 2L carton tano, na Blue band 500g carton nne. Lori ya Thika ikipita i drop hapa asubuhi. Pesa iko tayari kwa Mpesa."',
    messageType: 'voice_note',
    audioDurationSeconds: 22,
    receivedAt: 'Today, 09:35 AM',
    status: 'PARSED',
    catalogType: 'fmcg',
    items: [
      {
        id: 'li-401',
        rawText: 'unga Pembe bales 25',
        matchedSku: 'FLOUR-PEM-2K12',
        itemName: 'Pembe Maize Flour 2kg x 12',
        quantity: 25,
        unit: 'Bale',
        unitPrice: 2150,
        lineTotal: 53750,
        confidence: 0.99,
        inStock: true
      },
      {
        id: 'li-402',
        rawText: 'Fresh fri 2L carton tano',
        matchedSku: 'OIL-FF-2LX6',
        itemName: 'Fresh Fri Vegetable Oil 2L x 6',
        quantity: 5,
        unit: 'Carton',
        unitPrice: 3920,
        lineTotal: 19600,
        confidence: 0.98,
        inStock: true
      },
      {
        id: 'li-403',
        rawText: 'Blue band 500g carton nne',
        matchedSku: 'SPREAD-BB-500G12',
        itemName: 'Blue Band Margarine 500g x 12',
        quantity: 4,
        unit: 'Carton',
        unitPrice: 2750,
        lineTotal: 11000,
        confidence: 0.97,
        inStock: true
      }
    ],
    subtotal: 84350,
    vatTotal: 4220,
    grandTotal: 84350,
    deliveryDatePreference: 'Today morning with Thika lori',
    deliveryNotes: 'Githurai 44 junction shop',
    creditCheckResult: {
      allowed: true,
      decision: 'APPROVED',
      customerBalance: 45000,
      orderAmount: 84350,
      projectedBalance: 129350,
      creditLimit: 250000,
      overdueAmount: 0,
      oldestInvoiceDays: 9,
      recommendedAction: 'Clear to dispatch. Generates KES 84,350 revenue well inside KES 250,000 credit ceiling.',
      requiredDownpayment: 0,
      reasons: ['Ledger in good standing', 'Payment history 100% compliant']
    }
  }
];

export const SAMPLE_PROMPTS = [
  {
    title: 'FMCG Mixed Sheng & Swahili Order',
    category: 'fmcg' as const,
    customerId: 'cust-1',
    text: 'Niaje Kelvin, tupatie bales 15 za Unga Pembe 2kg, bale 10 za Jogoo, na carton 4 za Fresh Fri 2L. Ongeza carton 3 za Royco cubes za 5 bob na bale 5 za sukari Kabras. Tuma kesho asubuhi na canter ya River Road. Asante mkubwa.'
  },
  {
    title: 'Pharma Fast Chemist Restock',
    category: 'pharma' as const,
    customerId: 'cust-3',
    text: 'Morning Sales team. Urgent chemist restock: 8 cartons Panadol Extra 100s, 20 boxes Amoxil 500mg, 5 packs Coartem 20/120, and 6 packs Ventolin Inhalers. Deliver by 2 PM Kawangware Stage 2. Update our ledger invoice.'
  },
  {
    title: 'Colloquial Voice Note Transcription',
    category: 'fmcg' as const,
    customerId: 'cust-4',
    text: 'Halo bwana Kelvin, niko kwa duka Githurai 44. Leta bales 30 Jogoo maize meal, carton 6 Golden Fry 1L, na carton 8 Menengai soap 800g. Tupe delivery note na driver wa Thika Road. Lipa na M-Pesa paybill.'
  },
  {
    title: 'High Credit Risk Breach Test',
    category: 'fmcg' as const,
    customerId: 'cust-1',
    text: 'Kelvin ongeza bales 40 za Pembe na cartons 20 za Fresh Fri 2L haraka sana kwa order ya River Road. Tutalipa wiki ijayo yote.'
  }
];

export const MPESA_RECONCILIATION_FEED: MpesaTransaction[] = [
  {
    id: 'mp-1',
    mpesaReceiptNo: 'QBH8941MN7',
    customerName: 'Mama Fatuma Wholesale',
    phone: '+254 722 418 902',
    amount: 45000,
    timestamp: 'Today, 09:41 AM',
    status: 'COMPLETED',
    matchedOrderId: 'ord-101'
  },
  {
    id: 'mp-2',
    mpesaReceiptNo: 'QBH7712KP4',
    customerName: 'Abdi Hassan Mohamed',
    phone: '+254 733 891 045',
    amount: 120000,
    timestamp: 'Today, 08:30 AM',
    status: 'RECONCILED'
  },
  {
    id: 'mp-3',
    mpesaReceiptNo: 'QBG4419LL0',
    customerName: 'Karanja Ndung\'u',
    phone: '+254 728 991 234',
    amount: 85000,
    timestamp: 'Yesterday, 04:15 PM',
    status: 'RECONCILED'
  }
];
