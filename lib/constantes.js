export const MARCAS_COMPUTADORAS = [
  { value: 'DELL', label: 'DELL' },
  { value: 'HP', label: 'HP' },
  { value: 'LENOVO', label: 'LENOVO' },
  { value: 'ASUS', label: 'ASUS' },
  { value: 'ACER', label: 'ACER' },
  { value: 'APPLE', label: 'APPLE' },
  { value: 'MSI', label: 'MSI' },
  { value: 'SAMSUNG', label: 'SAMSUNG' },
  { value: 'TOSHIBA', label: 'TOSHIBA' },
  { value: 'IBM', label: 'IBM' },
  { value: 'MICROSOFT', label: 'MICROSOFT' },
  { value: 'ALIENWARE', label: 'ALIENWARE' },
  { value: 'HUAWEI', label: 'HUAWEI' },
  { value: 'OTRO', label: 'OTRO' },
]

export const MODELOS_POR_MARCA = {
  DELL: [
    'Inspiron 15', 'Inspiron 14', 'Inspiron 16', 'XPS 13', 'XPS 15', 'XPS 17',
    'Latitude 3420', 'Latitude 3520', 'Latitude 5420', 'Precision 5560',
    'Vostro 3400', 'Vostro 3500', 'OptiPlex 3080', 'OptiPlex 5090',
    'Alienware m15', 'Alienware m17', 'Alienware x17'
  ],
  HP: [
    'Pavilion 15', 'Pavilion 14', 'Pavilion x360', 'Spectre x360',
    'EliteBook 840', 'EliteBook 850', 'ProBook 450', 'ProBook 455',
    'PROBOOK 445R G6', 'Omen 15', 'Omen 16', 'Envy 13', 'Envy x360',
    'Chromebook 14', 'ZBook Studio', 'ZBook Fury'
  ],
  LENOVO: [
    'ThinkPad E14', 'ThinkPad E15', 'ThinkPad T14', 'ThinkPad T15', 'ThinkPad T490',
    'IdeaPad 3', 'IdeaPad 5', 'IdeaPad Flex 5', 'Legion 5', 'Legion 7',
    'Yoga 9i', 'Yoga 6', 'ThinkBook 14', 'ThinkBook 15'
  ],
  ASUS: [
    'VivoBook 15', 'VivoBook 14', 'VivoBook S14', 'ZenBook 13', 'ZenBook 14', 'ZenBook 15',
    'ROG Strix', 'ROG Zephyrus', 'ROG Flow', 'TUF Gaming F15', 'TUF Gaming A15',
    'ExpertBook B1', 'ProArt Studiobook'
  ],
  ACER: [
    'Aspire 5', 'Aspire 3', 'Aspire 7', 'Swift 3', 'Swift 5',
    'Nitro 5', 'Predator Helios', 'Chromebook Spin', 'TravelMate'
  ],
  APPLE: [
    'MacBook Air M1', 'MacBook Air M2', 'MacBook Pro 13 M1', 'MacBook Pro 14 M1', 
    'MacBook Pro 16 M1', 'MacBook Pro 14 M2', 'MacBook Pro 16 M2'
  ],
  MSI: [
    'GF63 Thin', 'GS66 Stealth', 'GP76 Leopard', 'GE76 Raider', 'Creator Z16',
    'Prestige 14', 'Modern 15'
  ],
  SAMSUNG: [
    'Galaxy Book Pro', 'Galaxy Book Pro 360', 'Galaxy Book Flex', 'Galaxy Book S'
  ],
  TOSHIBA: [
    'Satellite Pro', 'Tecra A40', 'Tecra A50', 'Portégé X30'
  ],
  IBM: [
    'ThinkPad Legacy'
  ],
  MICROSOFT: [
    'Surface Laptop 4', 'Surface Laptop Studio', 'Surface Pro 8', 'Surface Pro 7+'
  ],
  ALIENWARE: [
    'm15 R7', 'm17 R5', 'x14', 'x15 R2', 'x17 R2', 'Area-51m'
  ],
  HUAWEI: [
    'MateBook D14', 'MateBook D15', 'MateBook 14', 'MateBook X Pro'
  ],
  OTRO: [
    'Otro'
  ]
}

export const PROCESADORES = [
  'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
  'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9',
  'Apple M1', 'Apple M2', 'Intel Celeron', 'Intel Pentium',
  'AMD Athlon', 'AMD A-Series'
]

export const OPCIONES_RAM = [
  { value: '4', label: '4 GB' },
  { value: '8', label: '8 GB' },
  { value: '16', label: '16 GB' },
  { value: '32', label: '32 GB' },
  { value: '64', label: '64 GB' },
  { value: '128', label: '128 GB' },
]

export const OPCIONES_DISCO = [
  { value: '128', label: '128 GB' },
  { value: '256', label: '256 GB' },
  { value: '512', label: '512 GB' },
  { value: '1024', label: '1 TB' },
  { value: '2048', label: '2 TB' },
  { value: '4096', label: '4 TB' },
]

export const UNIDADES_ALMACENAMIENTO = [
  { value: 'GB', label: 'GB' },
  { value: 'TB', label: 'TB' },
  { value: 'MB', label: 'MB' },
]

export const TIPOS_PERIFERICOS = [
  { value: 'Mouse', label: 'Mouse' },
  { value: 'Teclado', label: 'Teclado' },
  { value: 'AdaptadorUSB', label: 'Adaptador USB' },
  { value: 'MemoriaSD', label: 'Memoria SD' },
  { value: 'Audifonos', label: 'Audífonos' },
  { value: 'Webcam', label: 'Webcam' },
  { value: 'DiscoExterno', label: 'Disco Externo' },
]

export const MARCAS_PERIFERICOS = [
  { value: 'LOGITECH', label: 'LOGITECH' },
  { value: 'MICROSOFT', label: 'MICROSOFT' },
  { value: 'GENIUS', label: 'GENIUS' },
  { value: 'SAMSUNG', label: 'SAMSUNG' },
  { value: 'KINGSTON', label: 'KINGSTON' },
  { value: 'SANDISK', label: 'SANDISK' },
  { value: 'WESTERN DIGITAL', label: 'WESTERN DIGITAL' },
  { value: 'SEAGATE', label: 'SEAGATE' },
  { value: 'DELL', label: 'DELL' },
  { value: 'HP', label: 'HP' },
  { value: 'LENOVO', label: 'LENOVO' },
  { value: 'ASUS', label: 'ASUS' },
  { value: 'OTRO', label: 'OTRO' },
]

export const TIPOS_AUDIOVISUALES = [
  { value: 'VideoBeam', label: 'Video Beam' },
  { value: 'Proyector', label: 'Proyector' },
  { value: 'Microfono', label: 'Micrófono' },
  { value: 'Parlantes', label: 'Parlantes' },
  { value: 'Pantalla', label: 'Pantalla' },
  { value: 'Camara', label: 'Cámara' },
]

export const MARCAS_AUDIOVISUALES = [
  { value: 'EPSON', label: 'EPSON' },
  { value: 'BENQ', label: 'BENQ' },
  { value: 'SONY', label: 'SONY' },
  { value: 'VIEWSONIC', label: 'VIEWSONIC' },
  { value: 'OPTOMA', label: 'OPTOMA' },
  { value: 'ACER', label: 'ACER' },
  { value: 'CANON', label: 'CANON' },
  { value: 'PANASONIC', label: 'PANASONIC' },
  { value: 'LG', label: 'LG' },
  { value: 'PHILIPS', label: 'PHILIPS' },
  { value: 'SHURE', label: 'SHURE' },
  { value: 'SENNHEISER', label: 'SENNHEISER' },
  { value: 'AKG', label: 'AKG' },
  { value: 'JBL', label: 'JBL' },
  { value: 'BOSCH', label: 'BOSCH' },
  { value: 'OTRO', label: 'OTRO' },
]

export const MODELOS_AUDIOVISUALES = {
  EPSON: ['PowerLite 1795F', 'PowerLite 2155W', 'Home Cinema 2350', 'EB-980W', 'EB-992F'],
  BENQ: ['MH733', 'MW535A', 'MH550', 'TK800M', 'HT3550'],
  SONY: ['VPL-PHZ10', 'VPL-CWZ10', 'VPL-EX455', 'VPL-FH31'],
  VIEWSONIC: ['PG701HD', 'PA503W', 'PX701HD', 'THD151'],
  OPTOMA: ['HD143X', 'EH416', 'GT1080Darbee'],
  ACER: ['H5382BD', 'P1155', 'S1386WHn'],
  CANON: ['LV-WU360', 'LV-HD320', 'XEED WUX500'],
  PANASONIC: ['PT-VZ580', 'PT-RZ120', 'PT-LB300'],
  LG: ['HF85LA', 'HF80JA', 'BU60PMS'],
  PHILIPS: ['NeoPix 230', 'PPX4935'],
  SHURE: ['SM58', 'SM57', 'Beta 58A', 'MV7'],
  SENNHEISER: ['E835', 'E845', 'MKH 416', 'MKE 600'],
  AKG: ['C414', 'P420', 'C391B'],
  JBL: ['EON610', 'EON712', 'PartyBox 310'],
  BOSCH: ['LBB 1938/20', 'LBB 1965/00'],
  OTRO: ['Otro']
}

export const COLORES = [
  { value: 'NEGRO', label: 'Negro' },
  { value: 'BLANCO', label: 'Blanco' },
  { value: 'GRIS', label: 'Gris' },
  { value: 'PLATA', label: 'Plata' },
  { value: 'AZUL', label: 'Azul' },
  { value: 'ROJO', label: 'Rojo' },
  { value: 'DORADO', label: 'Dorado' },
]
