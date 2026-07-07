// FIFA Fan & Arena IQ 2026 - Mock Database & AI Router

// Stadium layout node coordinates (scaled for SVG map rendering: 0 to 400 space)
export const stadiumNodes = {
  // Gates (Outer Perimeter)
  "Gate A": { x: 75, y: 110, type: 'gate', label: 'Gate A (North)' },
  "Gate B": { x: 325, y: 110, type: 'gate', label: 'Gate B (East)' },
  "Gate C": { x: 325, y: 290, type: 'gate', label: 'Gate C (South)' },
  "Gate D": { x: 75, y: 290, type: 'gate', label: 'Gate D (West)' },

  // Sections (Inner Seating Ring)
  "Sec 101": { x: 200, y: 115, type: 'section', label: 'Section 101' },
  "Sec 104": { x: 270, y: 135, type: 'section', label: 'Section 104' },
  "Sec 108": { x: 290, y: 200, type: 'section', label: 'Section 108' },
  "Sec 112": { x: 270, y: 265, type: 'section', label: 'Section 112' },
  "Sec 116": { x: 200, y: 285, type: 'section', label: 'Section 116' },
  "Sec 120": { x: 130, y: 265, type: 'section', label: 'Section 120' },
  "Sec 124": { x: 110, y: 200, type: 'section', label: 'Section 124' },
  "Sec 128": { x: 130, y: 135, type: 'section', label: 'Section 128' },

  // Concessions & Amenities
  "Concession 1": { x: 165, y: 140, type: 'concession', label: 'Concession Hub 1' },
  "Concession 2": { x: 235, y: 260, type: 'concession', label: 'Concession Hub 2' },
  "EcoHub A": { x: 235, y: 140, type: 'green', label: 'Sustainability Hub A' },
  "EcoHub B": { x: 165, y: 260, type: 'green', label: 'Sustainability Hub B' },
  "First Aid North": { x: 200, y: 80, type: 'medical', label: 'First Aid North' },
  "First Aid South": { x: 200, y: 320, type: 'medical', label: 'First Aid South' }
};

// Initialized Stadium Operations Incident Logs
export const initialIncidents = [
  {
    id: "INC-901",
    title: "Crowd Bottleneck at Gate B",
    desc: "Gate B ticket scanner 4 malfunctioned. Ingress flow is stalled, security lines exceeded 28 minutes. High density detected.",
    location: "Gate B",
    priority: "high",
    status: "active",
    reportedAt: "10:32 AM",
    aiRecommendation: "Recommend redirecting incoming transit shuttles to drop off at Gate A. Dispatch Volunteer Group 1 (Standby) to help marshal fans to open scanner lanes.",
    impactMapUpdates: {
      "Gate B": "heat-high",
      "Sec 104": "heat-medium",
      "Sec 108": "heat-medium"
    }
  },
  {
    id: "INC-902",
    title: "Medical Alert in Section 114",
    desc: "Fan reporting severe heat exhaustion and dehydration in Row 14, Seat 8. Requires immediate evaluation.",
    location: "Sec 112",
    priority: "high",
    status: "active",
    reportedAt: "10:38 AM",
    aiRecommendation: "Alert Medical Team 2 at First Aid South. Deploy volunteer runner with immediate hydration kit. Notify nearby safety marshals.",
    impactMapUpdates: {
      "Sec 112": "heat-high"
    }
  },
  {
    id: "INC-903",
    title: "EcoHub A Full Bin Alert",
    desc: "Sensors report the commemorative cup smart sorting bin at EcoHub A is at 92% capacity. Risk of overflow.",
    location: "EcoHub A",
    priority: "low",
    status: "active",
    reportedAt: "10:35 AM",
    aiRecommendation: "Notify Stadium Sustainability Team to empty sorting unit at EcoHub A. Direct users seeking points to EcoHub B via live Fan Companion app routing.",
    impactMapUpdates: {
      "EcoHub A": "heat-medium"
    }
  },
  {
    id: "INC-904",
    title: "Beverage Spill near Concession 1",
    desc: "Large liquid spill on concrete concourse creating slipping hazard. High foot traffic zone.",
    location: "Concession 1",
    priority: "medium",
    status: "active",
    reportedAt: "10:39 AM",
    aiRecommendation: "Deploy Cleanup Crew 1 (Zone 1) for rapid cleanup. Erect wet-floor indicator sign. Temporary crowd control to guide pedestrians.",
    impactMapUpdates: {
      "Concession 1": "heat-medium"
    }
  }
];

// Seeded Volunteers and Staff Units
export const initialVolunteers = [
  { id: "VOL-01", name: "Volunteer Unit 1 (Ingress)", status: "standby", assignment: "None", location: "Gate A" },
  { id: "VOL-02", name: "Volunteer Unit 2 (Wayfinding)", status: "active", assignment: "Marshaling Gate A", location: "Gate A" },
  { id: "VOL-03", name: "Medical Team 2", status: "standby", assignment: "First Aid South Hub", location: "First Aid South" },
  { id: "VOL-04", name: "Cleanup Crew 1", status: "standby", assignment: "Concourse Central", location: "Concession 2" },
  { id: "VOL-05", name: "Sustainability Team 1", status: "active", assignment: "EcoHub B Operations", location: "EcoHub B" },
  { id: "VOL-06", name: "Volunteer Unit 3 (Multilingual)", status: "busy", assignment: "Translating Gate D", location: "Gate D" }
];

// Transit Schedules
export const transitSchedules = [
  { id: "TR-01", type: "train", line: "EXP", name: "Secaucus Junction Express Rail", status: "On Time - Normal Flow", time: "4 mins" },
  { id: "TR-02", type: "shuttle", line: "SH1", name: "P&R Stadium Shuttle Service A", status: "Heavily Loaded - Expect delays", time: "9 mins" },
  { id: "TR-03", type: "rideshare", line: "RIDE", name: "Uber/Lyft Dedicated Pickup Zone", status: "Surge pricing active", time: "12 mins" },
  { id: "TR-04", type: "shuttle", line: "SH2", name: "EcoShuttle (Electric Ingress Route)", status: "Eco-bonus Active (Double Pts)", time: "6 mins" }
];

// GenAI Conversational Simulator Router
export function getAIResponse(query, language = 'en') {
  const q = query.toLowerCase().trim();

  // Languages supported: en, es, fr, pt, ar
  const responses = {
    en: {
      navigation: "🗺️ **Interactive Wayfinding Routing Activated:**\nTo go from **$gate** to **$section**, head through the concourse and follow the glowing neon green arrows on the map. \n\n*Estimated walking time:* 4 minutes. The route is fully wheelchair accessible.",
      navigation_default: "🗺️ **Wayfinding:**\nI can calculate your walking route inside the stadium! Tell me: *'How do I get from Gate A to Section 112?'* or click on the map nodes to visualize the shortest path.",
      transit: "🚌 **Smart Transit Update:**\n- **Secaucus Express Rail:** Running every 5 mins from MetLife Station.\n- **Electric Shuttle SH2:** 6-min wait. *Tip:* Using the shuttle earns you 20 Green Points!\n- **Rideshare Zone:** Located at Lot E, wait time is approx 12 mins.",
      sustainability: "🌱 **Green Footprint rewards:**\nRecycle your FIFA 2026 commemorative cup at **EcoHub A** or **EcoHub B** to get **15 Green Points**. Scan the QR code on the smart bin to claim your digital 'Eco-Champion' badge!",
      wc: "🚻 **Restroom Locations:**\nThe closest restrooms to the center concourse are adjacent to **Section 104** (Family & Accessible) and **Section 120**. Check the live map overlay for real-time occupancy estimates.",
      medical: "🚨 **Medical Assistance:**\nFirst Aid stations are located at **First Aid North** and **First Aid South**. If this is an active emergency, click the red Alert button in your interface to dispatch a nearby medic unit immediately.",
      accessibility: "♿ **Accessibility Resources:**\n- **Elevators:** Located near Gate A and Section 112.\n- **Sensory Rooms:** Quiet room located behind Section 101 for fans needing sensory relief.\n- **Wheelchair Escorts:** Ask any volunteer wearing a bright green arm band.",
      default: "🤖 **FIFA GenAI Assistant:**\nWelcome to MetLife Stadium! I can help you with wayfinding directions, crowd status, transportation schedules, accessibility options, and earning eco-rewards. Try asking:\n- *'How do I get to Section 112 from Gate A?'*\n- *'Where can I recycle my cup?'*\n- *'What is the quickest way back to Manhattan?'*"
    },
    es: {
      navigation: "🗺️ **Navegación Interactiva Activada:**\nPara ir desde **$gate** hasta **$section**, camine por el pasillo principal y siga las flechas verdes brillantes en el mapa. \n\n*Tiempo estimado de caminata:* 4 minutos. La ruta es totalmente accesible.",
      navigation_default: "🗺️ **Navegación:**\n¡Puedo calcular su ruta de caminata dentro del estadio! Dígame: *'¿Cómo voy de la Puerta A a la Sección 112?'* o haga clic en el mapa.",
      transit: "🚌 **Información de Tránsito:**\n- **Tren Express Secaucus:** Salidas cada 5 minutos desde la estación.\n- **Transbordador Eléctrico SH2:** Espera de 6 minutos. *¡Gane 20 Puntos Verdes por usarlo!*\n- **Zona Rideshare (Uber/Lyft):** Ubicada en el Estacionamiento E.",
      sustainability: "🌱 **Acción Ecológica:**\nRecicle su vaso conmemorativo en el **EcoHub A** o **EcoHub B** para recibir **15 Puntos Verdes** y desbloquear insignias digitales.",
      wc: "🚻 **Sanitarios:**\nLos baños más cercanos se encuentran al lado de la **Sección 104** (Familiar y Accesible) y la **Sección 120**.",
      medical: "🚨 **Primeros Auxilios:**\nLas estaciones médicas están en **First Aid North** y **First Aid South**. Si es una emergencia, avise a cualquier personal de chaleco verde.",
      accessibility: "♿ **Accesibilidad:**\n- **Ascensores:** Cerca de la Puerta A y la Sección 112.\n- **Sala Sensorial:** Espacio tranquilo detrás de la Sección 101.\n- **Sillas de ruedas:** Solicite asistencia con los voluntarios en el pasillo.",
      default: "🤖 **Asistente GenAI de FIFA:**\n¡Bienvenido al Estadio! Le puedo ayudar con rutas, estado del tráfico, accesibilidad, y cómo ganar premios ecológicos. Intente preguntar:\n- *'¿Cómo llego a la sección 112 desde la puerta A?'*\n- *'¿Dónde puedo reciclar mi vaso?'*\n- *'¿Cuál es la forma más rápida de volver a Manhattan?'*"
    },
    fr: {
      navigation: "🗺️ **Itinéraire de Guidage Activé:**\nPour aller de la **$gate** à la **$section**, suivez les flèches lumineuses sur la carte interactive. \n\n*Temps de marche:* ~4 minutes. Accessible aux fauteuils roulants.",
      transit: "🚌 **Planificateur de Transport:**\n- **Express Rail:** Toutes les 5 minutes.\n- **Éco-navette SH2:** 6 min d'attente. *+20 Points Éco!*\n- **Zone Uber/Lyft:** Parking E (12 min d'attente).",
      sustainability: "🌱 **Éco-Responsabilité:**\nDéposez vos gobelets consignés aux **EcoHub A** ou **EcoHub B** pour accumuler **15 Points Verts**.",
      wc: "🚻 **Toilettes:**\nSituées près de la **Section 104** (Accessibilité renforcée) et de la **Section 120**.",
      medical: "🚨 **Urgences Médicales:**\nPostes de secours disponibles à **First Aid North** et **First Aid South**.",
      accessibility: "♿ **Accessibilité:**\n- **Ascenseurs:** Près de la Porte A et de la Section 112.\n- **Espace Sensoriel:** Disponible derrière la Section 101.",
      default: "🤖 **Assistant GenAI FIFA:**\nBienvenue au stade! Je peux vous guider, vous informer sur les navettes ou vous aider à recycler. Exemples de questions:\n- *'Comment aller à la section 112 depuis la porte A?'*\n- *'Où recycler mon gobelet?'*"
    },
    pt: {
      navigation: "🗺️ **Navegação do Estádio Ativada:**\nPara ir do **$gate** para a **$section**, siga pelo corredor principal seguindo as setas brilhantes no mapa. \n\n*Tempo estimado:* 4 minutos.",
      transit: "🚌 **Trânsito e Transporte:**\n- **Trem Expresso Secaucus:** A cada 5 minutos.\n- **EcoShuttle SH2:** 6 minutos de espera (Ganhe 20 Pontos Verdes).\n- **Uber/Lyft:** Lote E.",
      sustainability: "🌱 **Sustentabilidade:**\nRecicle seu copo oficial no **EcoHub A** ou **EcoHub B** para ganhar **15 Pontos Verdes**.",
      wc: "🚻 **Banheiros:**\nLocalizados junto à **Seção 104** (Família e Acessível) e à **Seção 120**.",
      medical: "🚨 **Assistência Médica:**\nPostos médicos em **First Aid North** e **First Aid South**.",
      accessibility: "♿ **Acessibilidade:**\nElevadores na Porta A e Seção 112. Sala Sensorial atrás da Seção 101.",
      default: "🤖 **Assistente GenAI FIFA:**\nOlá! Posso ajudar com rotas, transporte, pontos verdes e acessibilidade. Experimente perguntar:\n- *'Como vou da Porta A para a Seção 112?'*\n- *'Onde posso reciclar meu copo?'*"
    },
    ar: {
      navigation: "🗺️ **تم تفعيل نظام التوجيه التفاعلي:**\nللانتقال من **$gate** إلى **$section**، اتجه عبر الممر الرئيسي واتبع الأسهم المضيئة على الخريطة.\n\n*الوقت المتوقع سيرًا على الأقدام:* 4 دقائق. المسار مجهز بالكامل لذوي الاحتياجات الخاصة.",
      transit: "🚌 **تحديثات وسائل النقل الذكية:**\n- **قطار سيكوكوس السريع:** يعمل كل 5 دقائق.\n- **الحافلة الكهربائية SH2:** فترة الانتظار 6 دقائق (احصل على 20 نقطة خضراء).\n- **منطقة سيارات الأجرة:** تقع في الموقف E.",
      sustainability: "🌱 **نقاط الاستدامة الخضراء:**\nقم بإعادة تدوير كوب FIFA التذكاري في **EcoHub A** أو **EcoHub B** للحصول على **15 نقطة خضراء**.",
      wc: "🚻 **مواقع دورات المياه:**\nأقرب دورات مياه تقع بجوار **القسم 104** (للعائلات وذوي الاحتياجات) و**القسم 120**.",
      medical: "🚨 **المساعدة الطبية:**\nتوجد نقاط الإسعافات الأولية في **الجهة الشمالية** و**الجهة الجنوبية**.",
      accessibility: "♿ **خدمات ذوي الاحتياجات الخاصة:**\n- **المصاعد:** بالقرب من البوابة A والقسم 112.\n- **غرفة تخفيف الحث الحسي:** تقع خلف القسم 101.",
      default: "🤖 **مساعد FIFA المدعوم بالذكاء الاصطناعي:**\nمرحباً بك في الملعب! يمكنني مساعدتك في العثور على الاتجاهات، وجدول النقل، ونقاط الاستدامة. جرب سؤال:\n- *'كيف أصل للقسم 112 من البوابة A؟'*\n- *'أين يمكنني تدوير الأكواب التذكارية؟'*"
    }
  };

  // Select appropriate language pack
  const langPack = responses[language] || responses['en'];

  // 1. Detect Ingress/Navigation Patterns
  const gateMatch = q.match(/gate\s*([a-d])|puerta\s*([a-d])|porte\s*([a-d])|بوابة\s*([a-d])/i);
  const secMatch = q.match(/sec(tion)?\s*(\d+)|seccion\s*(\d+)|section\s*(\d+)|القسم\s*(\d+)/i);

  if (gateMatch || secMatch) {
    const gateChar = gateMatch ? (gateMatch[1] || gateMatch[2] || gateMatch[3] || gateMatch[4]).toUpperCase() : 'A';
    const secNum = secMatch ? (secMatch[2] || secMatch[3] || secMatch[4] || secMatch[5]) : '112';
    
    const gateName = `Gate ${gateChar}`;
    const secName = `Sec ${secNum}`;
    
    // Replace placeholders
    let navText = langPack.navigation || responses['en'].navigation;
    navText = navText.replace('$gate', gateName).replace('$section', secName);
    
    return {
      text: navText,
      intent: 'navigation',
      data: { from: gateName, to: secName }
    };
  }

  // 2. Keyword Router
  if (q.includes('transit') || q.includes('bus') || q.includes('train') || q.includes('subway') || q.includes('uber') || q.includes('lyft') || q.includes('rideshare') || q.includes('transporte') || q.includes('tren') || q.includes('autobus') || q.includes('navette') || q.includes('قطار') || q.includes('حافلة')) {
    return { text: langPack.transit, intent: 'transit' };
  }
  
  if (q.includes('sustain') || q.includes('recycle') || q.includes('eco') || q.includes('green') || q.includes('cup') || q.includes('points') || q.includes('reciclar') || q.includes('sostenible') || q.includes('vaso') || q.includes('gobelet') || q.includes('تدوير') || q.includes('بيئة')) {
    return { text: langPack.sustainability, intent: 'sustainability' };
  }
  
  if (q.includes('restroom') || q.includes('bathroom') || q.includes('toilet') || q.includes('wc') || q.includes('baño') || q.includes('sanitario') || q.includes('toilette') || q.includes('دورة مياه') || q.includes('حمام')) {
    return { text: langPack.wc, intent: 'wc' };
  }
  
  if (q.includes('medical') || q.includes('first aid') || q.includes('doctor') || q.includes('medic') || q.includes('injury') || q.includes('hurt') || q.includes('médico') || q.includes('primeros auxilios') || q.includes('secours') || q.includes('طبيب') || q.includes('إسعاف')) {
    return { text: langPack.medical, intent: 'medical' };
  }
  
  if (q.includes('access') || q.includes('wheelchair') || q.includes('elevator') || q.includes('sensory') || q.includes('lift') || q.includes('disab') || q.includes('silla de ruedas') || q.includes('ascensor') || q.includes('fauteuil') || q.includes('مصعد') || q.includes('احتياجات خاصة')) {
    return { text: langPack.accessibility, intent: 'accessibility' };
  }

  // 3. Default response
  return { text: langPack.default, intent: 'general' };
}
