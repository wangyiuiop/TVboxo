const FlowDiagram = () => {
  const pipeColor = "#6B7280";
  const pipeWidth = 3;
  const bgColor = "#E0F2FE";

  return (
    <svg
      viewBox="0 0 2500 1200"
      className="w-full h-auto bg-sky-100"
      style={{ backgroundColor: bgColor }}
    >
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="50%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#shadow)">
        <rect x="20" y="280" width="80" height="30" rx="5" fill="#9CA3AF" stroke={pipeColor} strokeWidth={pipeWidth} />
        <text x="60" y="300" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">市政</text>
      </g>

      <line x1="100" y1="295" x2="160" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="190" cy="295" r="15" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="190" y="299" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">P</text>
      </g>

      <line x1="205" y1="295" x2="260" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="260" y="285" width="40" height="20" rx="3" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="280" cy="295" r="6" fill="#1F2937" />
        <text x="280" y="294" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
      </g>

      <line x1="300" y1="295" x2="360" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="390" cy="295" r="15" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="390" y="299" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">F</text>
      </g>

      <line x1="405" y1="295" x2="470" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="470,280 500,295 470,310 440,295" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="470" cy="295" r="8" fill="#1F2937" />
      </g>

      <line x1="500" y1="295" x2="560" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="560" y1="295" x2="560" y2="340" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="560" y1="340" x2="650" y2="340" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="650" y1="340" x2="650" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="650" y1="295" x2="700" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="720" cy="280" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="720" y="284" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">P</text>
      </g>

      <line x1="700" y1="295" x2="780" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="780" y="200" width="60" height="130" rx="5" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <rect x="785" y="290" width="50" height="40" fill="#4B5563" opacity="0.6" />
        <line x1="785" y1="290" x2="835" y2="290" stroke="#374151" strokeWidth="3" strokeDasharray="4,4" />
        <line x1="785" y1="298" x2="835" y2="298" stroke="#374151" strokeWidth="3" strokeDasharray="4,4" />
        <line x1="785" y1="306" x2="835" y2="306" stroke="#374151" strokeWidth="3" strokeDasharray="4,4" />
        <line x1="785" y1="314" x2="835" y2="314" stroke="#374151" strokeWidth="3" strokeDasharray="4,4" />
        <line x1="785" y1="322" x2="835" y2="322" stroke="#374151" strokeWidth="3" strokeDasharray="4,4" />
        <circle cx="810" cy="200" r="8" fill="#1F2937" />
      </g>

      <line x1="780" y1="265" x2="700" y2="265" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="700" y1="265" x2="700" y2="220" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="700" y1="220" x2="800" y2="220" stroke={pipeColor} strokeWidth={pipeWidth} />
      <circle cx="800" cy="220" r="4" fill="#1F2937" />
      <line x1="800" y1="220" x2="900" y2="220" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="900" y="200" width="60" height="130" rx="5" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <rect x="905" y="290" width="50" height="40" fill="#4B5563" opacity="0.6" />
        <line x1="905" y1="290" x2="955" y2="290" stroke="#6B7280" strokeWidth="3" />
        <line x1="905" y1="298" x2="955" y2="298" stroke="#6B7280" strokeWidth="3" />
        <line x1="905" y1="306" x2="955" y2="306" stroke="#6B7280" strokeWidth="3" />
        <line x1="905" y1="314" x2="955" y2="314" stroke="#6B7280" strokeWidth="3" />
        <line x1="905" y1="322" x2="955" y2="322" stroke="#6B7280" strokeWidth="3" />
        <circle cx="930" cy="200" r="8" fill="#1F2937" />
      </g>

      <line x1="960" y1="265" x2="1040" y2="265" stroke={pipeColor} strokeWidth={pipeWidth} />
      <circle cx="1040" cy="265" r="4" fill="#1F2937" />
      <line x1="1040" y1="265" x2="1100" y2="265" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="1130" cy="265" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1130" y="269" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">C</text>
      </g>

      <line x1="1100" y1="265" x2="1200" y2="265" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1200" y1="265" x2="1200" y2="320" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="1185" y="320" width="30" height="70" rx="3" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <rect x="1190" y="370" width="20" height="20" fill="#1F2937" />
      </g>

      <line x1="1200" y1="320" x2="1200" y2="280" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1200" y1="280" x2="1280" y2="280" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="1310" cy="280" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1310" y="284" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">P</text>
      </g>

      <line x1="1280" y1="280" x2="1360" y2="280" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="1360" y="270" width="40" height="20" rx="3" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="1380" cy="280" r="6" fill="#1F2937" />
        <text x="1380" y="279" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
      </g>

      <line x1="1400" y1="280" x2="1480" y2="280" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="1480" y="160" width="30" height="120" rx="3" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1495" y="225" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">1</text>
      </g>

      <g filter="url(#shadow)">
        <rect x="1520" y="160" width="30" height="120" rx="3" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1535" y="225" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">2</text>
      </g>

      <g filter="url(#shadow)">
        <rect x="1560" y="160" width="30" height="120" rx="3" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1575" y="225" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">3</text>
      </g>

      <line x1="1480" y1="200" x2="1400" y2="200" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1400" y1="200" x2="1400" y2="160" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1400" y1="160" x2="1600" y2="160" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1600" y1="160" x2="1600" y2="200" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1600" y1="200" x2="1590" y2="200" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="1590" y1="280" x2="1650" y2="280" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="1650" y="270" width="40" height="20" rx="3" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="1670" cy="280" r="6" fill="#1F2937" />
        <text x="1670" y="279" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
      </g>

      <line x1="1690" y1="280" x2="1750" y2="280" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1750" y1="280" x2="1750" y2="350" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1750" y1="350" x2="1800" y2="350" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="1800,335 1830,350 1800,365 1770,350" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="1800" cy="350" r="8" fill="#1F2937" />
      </g>

      <line x1="1830" y1="350" x2="1920" y2="350" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="1920" y="340" width="40" height="20" rx="3" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="1940" cy="350" r="6" fill="#1F2937" />
        <text x="1940" y="349" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
      </g>

      <line x1="1960" y1="350" x2="1960" y2="160" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1960" y1="160" x2="2060" y2="160" stroke={pipeColor} strokeWidth={pipeWidth} />
      <circle cx="2060" cy="160" r="4" fill="#1F2937" />
      <line x1="2060" y1="160" x2="2160" y2="160" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="2160" y="270" width="40" height="20" rx="3" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="2180" cy="280" r="6" fill="#1F2937" />
        <text x="2180" y="279" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
      </g>

      <line x1="2200" y1="280" x2="2200" y2="200" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="2200" y1="200" x2="2350" y2="200" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <ellipse cx="2400" cy="260" rx="70" ry="80" fill="#F3F4F6" stroke={pipeColor} strokeWidth={3} />
        <ellipse cx="2400" cy="180" rx="70" ry="20" fill="#D1D5DB" stroke={pipeColor} strokeWidth={2} />
        <circle cx="2360" cy="180" r="6" fill="#1F2937" />
        <circle cx="2400" cy="180" r="6" fill="#1F2937" />
        <circle cx="2440" cy="180" r="6" fill="#1F2937" />
        <circle cx="2455" cy="220" r="5" fill="#1F2937" />
        <circle cx="2455" cy="260" r="5" fill="#1F2937" />
        <circle cx="2455" cy="300" r="5" fill="#1F2937" />
      </g>

      <line x1="2330" y1="200" x2="2330" y2="260" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="2400" y1="340" x2="2400" y2="380" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="2400" y1="380" x2="2300" y2="380" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="2300,400 2270,420 2300,440 2330,420" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="2285" y1="405" x2="2315" y2="435" stroke="#1F2937" strokeWidth={2} />
        <line x1="2285" y1="435" x2="2315" y2="405" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="2300" y1="420" x2="2200" y2="420" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="2200" y1="420" x2="2200" y2="460" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="2200" y1="460" x2="2120" y2="460" stroke={pipeColor} strokeWidth={pipeWidth} />
      <path d="M2120 460 L2080 460 L2080 500 L2040 500" stroke={pipeColor} strokeWidth={pipeWidth} fill="none" />
      <polygon points="2040,500 2030,490 2030,510" fill={pipeColor} />

      <line x1="2400" y1="380" x2="2450" y2="380" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="2450" y1="380" x2="2450" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="2450" y1="580" x2="2350" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="2320" cy="580" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="2320" y="584" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">F</text>
      </g>

      <g filter="url(#shadow)">
        <circle cx="2260" cy="580" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="2260" y="584" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">P</text>
      </g>

      <line x1="2350" y1="580" x2="2150" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="2150,565 2180,580 2150,595 2120,580" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="2150" cy="580" r="8" fill="#1F2937" />
      </g>

      <line x1="2120" y1="580" x2="2020" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="1900" y="520" width="200" height="60" rx="5" fill="#D1D5DB" stroke={pipeColor} strokeWidth={2} />
      </g>

      <line x1="2020" y1="580" x2="1900" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="1900" y1="580" x2="1800" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="1770" cy="580" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1770" y="584" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">F</text>
      </g>

      <line x1="1800" y1="580" x2="1550" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="1550,565 1580,580 1550,595 1520,580" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="1535" y1="565" x2="1565" y2="595" stroke="#1F2937" strokeWidth={2} />
        <line x1="1535" y1="595" x2="1565" y2="565" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="1520" y1="580" x2="1420" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />
      <circle cx="1420" cy="580" r="4" fill="#1F2937" />
      <line x1="1420" y1="580" x2="1320" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="1290" cy="580" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="1290" y="584" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">C</text>
      </g>

      <line x1="1320" y1="580" x2="800" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="770" cy="580" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="770" y="584" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">F</text>
      </g>

      <line x1="800" y1="580" x2="700" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="700,565 730,580 700,595 670,580" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="685" y1="565" x2="715" y2="595" stroke="#1F2937" strokeWidth={2} />
        <line x1="685" y1="595" x2="715" y2="565" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="670" y1="580" x2="570" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <ellipse cx="500" cy="680" rx="70" ry="80" fill="#F3F4F6" stroke={pipeColor} strokeWidth={3} />
        <ellipse cx="500" cy="600" rx="70" ry="20" fill="#D1D5DB" stroke={pipeColor} strokeWidth={2} />
        <circle cx="460" cy="600" r="6" fill="#1F2937" />
        <circle cx="500" cy="600" r="6" fill="#1F2937" />
        <circle cx="540" cy="600" r="6" fill="#1F2937" />
        <circle cx="555" cy="640" r="5" fill="#1F2937" />
        <circle cx="555" cy="680" r="5" fill="#1F2937" />
        <circle cx="555" cy="720" r="5" fill="#1F2937" />
      </g>

      <line x1="570" y1="580" x2="530" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="530" y1="580" x2="530" y2="600" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="530" y1="600" x2="570" y2="600" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="570" y="590" width="60" height="40" rx="5" fill="#1F2937" />
        <text x="600" y="615" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">PLC</text>
      </g>

      <line x1="570" y1="600" x2="570" y2="650" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="570" y1="650" x2="500" y2="650" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="500" y1="760" x2="500" y2="800" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="500" y1="800" x2="420" y2="800" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="420,785 450,800 420,815 390,800" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="405" y1="785" x2="435" y2="815" stroke="#1F2937" strokeWidth={2} />
        <line x1="405" y1="815" x2="435" y2="785" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="390" y1="800" x2="300" y2="800" stroke={pipeColor} strokeWidth={pipeWidth} />
      <path d="M300 800 L260 800 L260 840 L220 840" stroke={pipeColor} strokeWidth={pipeWidth} fill="none" />
      <polygon points="220,840 210,830 210,850" fill={pipeColor} />

      <line x1="420" y1="800" x2="420" y2="760" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="420" y1="760" x2="350" y2="760" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="350,745 380,760 350,775 320,760" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="350" cy="760" r="8" fill="#1F2937" />
      </g>

      <line x1="320" y1="760" x2="240" y2="760" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="210" cy="760" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="210" y="764" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">P</text>
      </g>

      <g filter="url(#shadow)">
        <circle cx="150" cy="760" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="150" y="764" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">C</text>
      </g>

      <line x1="240" y1="760" x2="100" y2="760" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <rect x="70" y="680" width="60" height="80" rx="3" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <line x1="75" y1="700" x2="125" y2="700" stroke="#9CA3AF" strokeWidth="2" />
        <line x1="75" y1="715" x2="125" y2="715" stroke="#9CA3AF" strokeWidth="2" />
        <line x1="75" y1="730" x2="125" y2="730" stroke="#9CA3AF" strokeWidth="2" />
        <line x1="75" y1="745" x2="125" y2="745" stroke="#9CA3AF" strokeWidth="2" />
      </g>

      <line x1="100" y1="760" x2="100" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="100" y1="580" x2="300" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <circle cx="270" cy="580" r="12" fill="#F3F4F6" stroke={pipeColor} strokeWidth={2} />
        <text x="270" y="584" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">C</text>
      </g>

      <line x1="300" y1="580" x2="400" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="400,565 430,580 400,595 370,580" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <circle cx="400" cy="580" r="8" fill="#1F2937" />
      </g>

      <line x1="430" y1="580" x2="500" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="500" y1="580" x2="600" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="600,565 630,580 600,595 570,580" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="585" y1="565" x2="615" y2="595" stroke="#1F2937" strokeWidth={2} />
        <line x1="585" y1="595" x2="615" y2="565" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="630" y1="580" x2="700" y2="580" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="1600" y1="620" x2="1600" y2="680" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1600" y1="680" x2="1520" y2="680" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="1520,665 1550,680 1520,695 1490,680" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="1505" y1="665" x2="1535" y2="695" stroke="#1F2937" strokeWidth={2} />
        <line x1="1505" y1="695" x2="1535" y2="665" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="1490" y1="680" x2="1400" y2="680" stroke={pipeColor} strokeWidth={pipeWidth} />
      <path d="M1400 680 L1360 680 L1360 720 L1320 720" stroke={pipeColor} strokeWidth={pipeWidth} fill="none" />
      <polygon points="1320,720 1310,710 1310,730" fill={pipeColor} />

      <line x1="1600" y1="620" x2="1750" y2="620" stroke={pipeColor} strokeWidth={pipeWidth} />

      <g filter="url(#shadow)">
        <polygon points="1750,605 1780,620 1750,635 1720,620" fill="#9CA3AF" stroke={pipeColor} strokeWidth={2} />
        <line x1="1735" y1="605" x2="1765" y2="635" stroke="#1F2937" strokeWidth={2} />
        <line x1="1735" y1="635" x2="1765" y2="605" stroke="#1F2937" strokeWidth={2} />
      </g>

      <line x1="1720" y1="620" x2="1620" y2="620" stroke={pipeColor} strokeWidth={pipeWidth} />
      <path d="M1620 620 L1580 620 L1580 660 L1540 660" stroke={pipeColor} strokeWidth={pipeWidth} fill="none" />
      <polygon points="1540,660 1530,650 1530,670" fill={pipeColor} />

      <line x1="1780" y1="620" x2="1900" y2="620" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="1590" y1="280" x2="1590" y2="350" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1590" y1="350" x2="1650" y2="350" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1650" y1="350" x2="1650" y2="390" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="1650" y1="390" x2="1500" y2="390" stroke={pipeColor} strokeWidth={pipeWidth} />
      <path d="M1500 390 L1460 390 L1460 430 L1420 430" stroke={pipeColor} strokeWidth={pipeWidth} fill="none" />
      <polygon points="1420,430 1410,420 1410,440" fill={pipeColor} />

      <line x1="560" y1="295" x2="560" y2="230" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="560" y1="230" x2="470" y2="230" stroke={pipeColor} strokeWidth={pipeWidth} />
      <circle cx="470" cy="230" r="4" fill="#1F2937" />
      <line x1="470" y1="230" x2="380" y2="230" stroke={pipeColor} strokeWidth={pipeWidth} />
      <line x1="380" y1="230" x2="380" y2="295" stroke={pipeColor} strokeWidth={pipeWidth} />

      <line x1="700" y1="295" x2="700" y2="265" stroke={pipeColor} strokeWidth={pipeWidth} />
    </svg>
  );
};

export default FlowDiagram;
