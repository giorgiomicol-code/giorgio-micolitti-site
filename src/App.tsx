import { useState } from 'react'
import './App.css'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }

const profileParagraphs: Copy[] = [
  {
    it: "Ingegnere Civile e Project & Construction Manager con oltre 24 anni di esperienza nella progettazione e realizzazione di infrastrutture civili di trasporto, pilota UAV certificato EASA A1/A2/A3. Ha maturato la propria esperienza nella Direzione Investimenti, nella Direzione Tecnica e nella Direzione Centrale Strategie e Pianificazione di Ferrovie dello Stato Italiane, per poi ricoprire per 11 anni ruoli di responsabilità crescente nella Direzione Operativa Territoriale di Roma di RFI. Attualmente è Responsabile della Struttura di Ingegneria dei Collegamenti Ferroviari di Stretto di Messina S.p.A.",
    en: "Civil Engineer and Project & Construction Manager with more than 24 years of experience in the design and delivery of civil transport infrastructure, and an EASA A1/A2/A3 certified UAV pilot. His career has included FS Italiane Investment, Technical, and Central Strategy & Planning directorates, followed by 11 years of progressively senior responsibilities within RFI's Rome Territorial Operations. He is currently Head of Railway Connections Engineering at Stretto di Messina S.p.A."
  },
  {
    it: "Specializzato in infrastrutture ferroviarie civili — con particolare focus su ponti, gallerie e armamento — valutazione della redditività degli investimenti, standardizzazione tecnica con autorità nazionali ed europee, gestione di sito e HSE, due diligence, nuove costruzioni e realizzazione di stazioni. Esperienza consolidata anche in impianti tecnologici speciali, sostenibilità, mitigazione sismica e acustica, risk analysis e ottimizzazione dei consumi energetici.",
    en: "Specialised in civil railway infrastructure — particularly bridges, tunnels and trackwork — investment profitability assessment, technical standardisation with national and European authorities, site and HSE management, due diligence, new construction and station delivery. Additional consolidated experience includes special technological systems, sustainability, seismic and acoustic mitigation, risk analysis and energy optimisation."
  },
  {
    it: "A livello internazionale è stato membro di numerosi gruppi di lavoro presso le principali istituzioni europee di settore (UIC, AEIF, CER, EU-FIT) e ha collaborato con le principali partecipate RFI in ambito gallerie transfrontaliere (Brenner Basis Tunnel e Torino–Lione). In FS Italiane ha affiancato a queste competenze la definizione di strategie industriali e di mercato di Gruppo, occupandosi per diversi anni della pianificazione e del monitoraggio dei KPI per lo sviluppo strategico del business immobiliare e di trasporto.",
    en: "Internationally, he served in working groups at major European rail-sector institutions (UIC, AEIF, CER, EU-FIT) and collaborated with RFI-associated cross-border tunnel organisations, including Brenner Base Tunnel and Turin–Lyon. At FS Italiane he also worked on Group industrial and market strategy, planning and monitoring KPIs for the strategic development of real-estate and transport businesses."
  },
  {
    it: "Le competenze manageriali trasversali sono state sviluppate attraverso un Executive Master in General Management e consolidate all'interno della Direzione Strategie di Ferrovie dello Stato Italiane S.p.A., con impatto diretto sulla pianificazione industriale del Gruppo FS: individuazione e reportistica dei rischi, proposta di soluzioni a supporto del Direttore Strategie di Gruppo.",
    en: "Cross-functional management skills were developed through an Executive Master in General Management and consolidated within FS Italiane's Strategy Directorate, contributing directly to Group industrial planning through risk identification and reporting and the development of solutions in support of the Group Strategy Director."
  },
  {
    it: "Conoscenza completa dell'intero processo realizzativo — dall'ideazione al completamento del progetto — con capacità di selezionare efficacemente le risorse operative e allineare i processi di pianificazione e budgeting. Ruolo di collegamento, guida e motivazione per team, consulenti, enti locali, subappaltatori e clienti, per la consegna dei progetti nei tempi, nel budget e secondo i più elevati standard qualitativi. Esperienza nella gestione di team eterogenei, con supervisione diretta fino a circa 100 persone in cinque dipartimenti.",
    en: "Complete knowledge of the delivery process — from concept to completion — with the ability to select operational resources and align planning and budgeting processes. A connecting, leadership and motivational role across teams, consultants, local authorities, subcontractors and clients, supporting delivery on time, within budget and to high quality standards. Experience managing heterogeneous teams, with direct supervision of up to approximately 100 people across five departments."
  },
  {
    it: "Docente di Tecnica dei Cantieri Infrastrutturali presso il Master Sapienza in Ingegneria delle Infrastrutture e dei Sistemi Ferroviari (IIS), edizioni 2020, 2021 e 2022.",
    en: "Lecturer in Infrastructure Construction Site Techniques within Sapienza University's Master in Infrastructure and Railway Systems Engineering (IIS), editions 2020, 2021 and 2022."
  },
]

const experience = [
  ['Nov 2023 — Presente','Responsabile Ingegneria Collegamenti Ferroviari','Stretto di Messina S.p.A. · Roma','Guida la Struttura Organizzativa “Ingegneria Collegamenti Ferroviari” di Stretto di Messina S.p.A.'],
  ['Dic 2017 — Set 2023','Responsabile Ingegneria Civile, Armamento, Patrimonio e Autorizzazioni, Ponti e Verifiche','RFI S.p.A. · Direzione Operativa Infrastrutture Roma','Guida la Struttura di Ingegneria Civile con circa 100 risorse e circa 1 miliardo di euro di investimenti; prima parte dell’Anello Ferroviario di Roma, adeguamento D4 del Nodo di Roma con 38 nuovi ponti, certificazione PC80 TEN-T, sicurezza in 16 gallerie e oltre 20 interventi complessivi in galleria.'],
  ['Mar 2016 — Nov 2017','Responsabile Opere Civili, Fabbricati e Impianti Speciali','RFI S.p.A. · Direzione Territoriale Produzione Roma','Coordina progettazione e lavori della linea Vigna Clara–Valle Aurelia; upgrade TEN-T; stazioni, armamento e pensiline; piano annuale lavori, uffici di direzione lavori e strumenti contrattuali.'],
  ['Mag 2014 — Feb 2016','Responsabile U.O. Team Sviluppo Locale Opere Civili','RFI S.p.A. · Direzione Territoriale Produzione Roma','Guida lavori di armamento nei PRG di Roma Tiburtina, Casilina, Scalo San Lorenzo e Campo Leone; raccordi ferroviari; 56 km di barriere antirumore AV Roma–Napoli; controllo opere d’arte, rischio in sotterraneo e vulnerabilità sismica.'],
  ['Mag 2011 — Apr 2014','Assistente Project Manager e Referente Task Force Sicurezza nelle Gallerie','RFI S.p.A. · Direzione Territoriale Produzione Roma','Dirige lavori civili e tecnologici; coordina sicurezza CSP/CSE per interventi fino a 15 milioni di euro; gestisce stakeholder e conduce analisi di rischio e vulnerabilità sismica.'],
  ['Mag 2009 — Apr 2011','Referente Pianificazione Industriale e Monitoraggio KPI – Business Immobiliare e Trasporto','Ferrovie dello Stato Italiane S.p.A. · Direzione Centrale Strategie e Pianificazione','Pianificazione industriale Real Estate, Business Plan e operazioni straordinarie, mercati europeo e nazionale, KPI di Gruppo e gruppi UIC Financial Indicators / Statistics.'],
  ['Nov 2006 — Apr 2009','Ingegnere di Progetto – Opere Civili, Strutture in Sotterraneo e Sicurezza','RFI S.p.A. · Direzione Tecnica, Ingegneria Civile','Rappresentanza europea AEIF, CEN, UIC, FIT; gallerie transfrontaliere BBT e Torino–Lione; verifiche di appaltabilità >20 M€; aerodinamica AV e nuove tecnologie in galleria.'],
  ['Apr 2002 — Ott 2006','Ingegnere di Progetto – Progettazione e Pianificazione Infrastrutture','RFI S.p.A. · Direzione Investimenti','Procedure per diagnosi e manutenzione delle strutture in sotterraneo; modelli prestazionali di rischio; innovazione tecnologica; conformità sicurezza gallerie AV e dossier economico-finanziari per il Comitato Investimenti.'],
  ['Apr 2001 — Apr 2002','Ingegnere di Progetto','DMS Engineering S.r.l.','Progettazione geotecnica e strutturale di opere stradali, ferroviarie e civili, in superficie e in sotterraneo.'],
  ['Lug 2000 — Apr 2001','Ingegnere – Area Tecnico-Patrimoniale','Azienda U.S.L. Latina','Valutazioni di sicurezza statica degli asset immobiliari dell’Azienda.'],
]

const expertise: Copy[] = [
  {it:'Ingegneria civile applicata alle infrastrutture ferroviarie',en:'Civil engineering for railway infrastructure'},
  {it:'Opere in sotterraneo, gallerie e armamento',en:'Underground works, tunnels and trackwork'},
  {it:'Fire Engineering e sicurezza antincendio in galleria',en:'Fire engineering and tunnel fire safety'},
  {it:'Aerodinamica gallerie e treni Alta Velocità',en:'Tunnel aerodynamics and high-speed trains'},
  {it:'Risk analysis, mitigazione sismica e idrogeologica',en:'Risk analysis, seismic and hydrogeological mitigation'},
  {it:'Specifiche Tecniche di Interoperabilità (TSI) e normativa UE',en:'Technical Specifications for Interoperability (TSI) and EU regulation'},
  {it:'Project & Construction Management',en:'Project & Construction Management'},
  {it:'Capital budgeting e valutazioni economico-finanziarie',en:'Capital budgeting and economic-financial appraisal'},
  {it:'Pianificazione e controllo costi / tempi / qualità',en:'Cost, schedule and quality planning and control'},
  {it:'Coordinamento sicurezza cantieri (D.Lgs. 81/08 – CSP/CSE)',en:'Construction-site safety coordination'},
  {it:'Collaudo statico e verifiche tecnico-amministrative (CTA)',en:'Structural testing and technical-administrative inspection'},
  {it:'Leadership di team eterogenei',en:'Leadership of heterogeneous teams'},
]

const areas: Copy[] = [
  {it:'Ponti e opere d’arte ferroviarie',en:'Railway bridges and civil structures'},
  {it:'Gallerie, sicurezza e fire engineering',en:'Tunnels, safety and fire engineering'},
  {it:'Armamento, stazioni e impianti speciali',en:'Trackwork, stations and special systems'},
  {it:'Corridoi TEN-T e interoperabilità',en:'TEN-T corridors and interoperability'},
  {it:'Potenziamento, rinnovo e manutenzione della rete',en:'Network upgrading, renewal and maintenance'},
  {it:'Strategia, investimenti e capital budgeting',en:'Strategy, investments and capital budgeting'},
  {it:'Collaudi, verifiche e certificazioni tecniche',en:'Testing, inspections and technical certification'},
  {it:'Standardizzazione e rappresentanza tecnica europea',en:'European technical standardisation and representation'},
]

const results: Copy[] = [
  {it:'≈ 1 miliardo € · investimenti infrastrutturali realizzati 2017–2023',en:'≈ €1 billion · infrastructure investments delivered 2017–2023'},
  {it:'38 · nuovi ponti per l’adeguamento D4 del Nodo di Roma',en:'38 · new bridges for Rome node D4 load-category upgrading'},
  {it:'PC80 · certificazione del corridoio TEN-T Scandinavia–Mediterraneo',en:'PC80 · certification of the Scandinavian–Mediterranean TEN-T corridor'},
  {it:'20+ · interventi complessivi in galleria',en:'20+ · tunnel interventions delivered'},
  {it:'16 · gallerie con interventi di sicurezza tecnologica e civile',en:'16 · tunnels with technological and civil safety upgrades'},
  {it:'≈ 100 · persone coordinate direttamente',en:'≈ 100 · people directly supervised'},
  {it:'5 · dipartimenti coordinati',en:'5 · departments coordinated'},
  {it:'24+ · anni di esperienza professionale',en:'24+ · years of professional experience'},
  {it:'15 M€ · valore fino al quale ha coordinato CSP/CSE',en:'€15m · projects up to this value under CSP/CSE safety coordination'},
  {it:'56 km · barriere antirumore riprogettate sulla AV Roma–Napoli',en:'56 km · noise barriers redesigned on the Rome–Naples high-speed line'},
  {it:'> 20 M€ · progetti verificati come Organismo di Ispezione Tipo B',en:'> €20m · projects reviewed as a Type B Inspection Body'},
  {it:'3 · edizioni del Master Sapienza: 2020, 2021, 2022',en:'3 · Sapienza Master editions: 2020, 2021, 2022'},
]

const diary = [
  ['arco-sottovia.webp','Dal ponte ad arco in muratura al sottovia scatolare','From masonry arch bridge to box underpass'],
  ['ponte-zambra.webp','Ponte Zambra','Zambra bridge'],
  ['interno-galleria.webp','Interno galleria: opere, sicurezza e manutenzione','Tunnel interior: works, safety and maintenance'],
  ['consolidamento-pendio.webp','Consolidamento e mitigazione del dissesto idrogeologico','Slope stabilisation and hydrogeological risk mitigation'],
  ['posa-micropali.webp','Posa di micropali','Micropile installation'],
  ['restauro-ponte-storico.webp','Restauro di ponte storico','Historic bridge restoration'],
  ['demolizione-viadotto.webp','Demolizione di viadotto','Viaduct demolition'],
  ['sottovia-aereo.webp','Sottovia ferroviario — vista aerea','Railway underpass — aerial view'],
]

const publications = [
  ['01','2009','La Normativa europea per la sicurezza delle gallerie','Tecnica Professionale n. 3/09, CIFI'],
  ['01','2006','Fire Safe Design for Rail Tunnels','European Community 5th Framework Programme'],
  ['01','2005','Regulation Guidelines for Fire Safe Design in Rail Tunnels','European Community 5th Framework Programme'],
  ['02','2007','Modernizzazione e competitività del Paese attraverso il rilancio del trasporto ferroviario','Notizie Speciale Ferrovie – Federmanager'],
  ['02','2006','Fenomeni aerodinamici indotti dal transito dei treni AV','Ingegneria Ferroviaria, CIFI'],
  ['03','2003',"L'evoluzione del concetto di sicurezza nelle gallerie ferroviarie",'Tecnica Professionale n. 9/03'],
  ['03','2001','Analisi ad elementi distinti di cavità sotterranee in ammassi rocciosi stratificati','Gallerie e Grandi Opere in Sotterraneo n. 65, Ed. Patron'],
]

function App() {
  const [lang, setLang] = useState<Lang>('it')
  const t = (x: Copy) => x[lang]

  return <div className="site-shell">
    <header className="site-header">
      <a className="brand" href="#top"><span className="brand-mark">GM</span><span>Giorgio Micolitti</span></a>
      <nav>
        <a href="#profile">{lang==='it'?'Profilo':'Profile'}</a>
        <a href="#rfi">25 anni RFI</a>
        <a href="#expertise">{lang==='it'?'Competenze':'Expertise'}</a>
        <a href="#areas">{lang==='it'?'Aree':'Areas'}</a>
        <a href="#results">{lang==='it'?'Risultati':'Results'}</a>
        <a href="#bridge">Ponte</a>
        <a href="#diary">Project diary</a>
        <a href="#teaching">{lang==='it'?'Docenza':'Teaching'}</a>
        <div className="pub-nav"><a href="#publications">{lang==='it'?'Pubblicazioni':'Publications'}</a><span><a href="#pub-01">01</a> · <a href="#pub-02">02</a> · <a href="#pub-03">03</a></span></div>
      </nav>
      <div className="lang"><button className={lang==='it'?'active':''} onClick={()=>setLang('it')}>IT</button><span>/</span><button className={lang==='en'?'active':''} onClick={()=>setLang('en')}>EN</button></div>
    </header>

    <main id="top">
      <section className="hero dark">
        <div className="wrap hero-grid">
          <div>
            <p className="kicker">CIVIL ENGINEERING · RAILWAY INFRASTRUCTURE</p>
            <h1>Civil Engineering Works,<br/>Infrastructure Constructions,<br/>Tunnels &amp; Safety</h1>
            <p className="hero-sub">Sustainability challenges in a constantly evolving framework</p>
            <p className="hero-name">Giorgio Micolitti</p>
          </div>
          <div className="hero-photo"><img src="./images/ritratto.webp" alt="Giorgio Micolitti"/></div>
        </div>
      </section>

      <section id="profile" className="light">
        <div className="wrap section-head"><p className="kicker">01 · {lang==='it'?'PROFILO PROFESSIONALE':'PROFESSIONAL PROFILE'}</p><h2>{lang==='it'?'Profilo professionale completo':'Full professional profile'}</h2></div>
        <div className="wrap profile-grid">
          <div className="profile-copy">{profileParagraphs.map((p,i)=><p key={i}>{t(p)}</p>)}</div>
          <aside className="profile-aside">
            <h3>{lang==='it'?'Esperienza professionale':'Professional experience'}</h3>
            {experience.map((e,i)=><article className="experience-item" key={i}><span>{e[0]}</span><h4>{e[1]}</h4><strong>{e[2]}</strong><p>{e[3]}</p></article>)}
            <div className="mini-section">
              <h3>{lang==='it'?'Collaudi e Certificazioni Tecniche':'Testing and Technical Certifications'}</h3>
              <p>{lang==='it'?'Collaudatore Statico e Direttore CTA per numerosi interventi infrastrutturali RFI realizzati tra il 2014 e il 2021: travate metalliche e ponti, sottopassi, rampe, scale e marciapiedi, pensiline, opere di accessibilità, rinnovo deviatoi e riqualificazione stazioni Easy/Smart Station e Wi‑Fi Station.':'Structural Tester and CTA Director for numerous RFI infrastructure works delivered between 2014 and 2021, including steel spans and bridges, underpasses, ramps, stairs and platforms, canopies, accessibility works, turnout renewals and Easy/Smart Station and Wi‑Fi Station upgrades.'}</p>
            </div>
            <div className="mini-section">
              <h3>{lang==='it'?'Lingue':'Languages'}</h3>
              <p>Italiano — madrelingua · English — {lang==='it'?'ottimo scritto e parlato':'excellent written and spoken'} · Français — {lang==='it'?'buono':'good'}</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="rfi" className="editorial dark">
        <div className="wrap editorial-grid">
          <div><p className="kicker">02 · 25 ANNI DI RFI</p><h2>{lang==='it'?'Un percorso progressivamente esteso.':'An experience progressively broadened over time.'}</h2></div>
          <div>
            <p className="lead">{lang==='it'?'Dalla pianificazione infrastrutturale e dagli standard tecnici e normativi, alla strategia e valutazione degli investimenti, fino alla gestione operativa, manutenzione e realizzazione delle opere.':'From infrastructure planning and technical standards to strategy and investment appraisal, and then to operational management, maintenance and delivery of works.'}</p>
            <p>{lang==='it'?'Dal 2002 il percorso in RFI e nel Gruppo FS ha attraversato Direzione Investimenti, Direzione Tecnica, Direzione Centrale Strategie e Pianificazione e Direzione Operativa Territoriale di Roma, fino all’attuale responsabilità in Stretto di Messina S.p.A.':'Since 2002, the career within RFI and the FS Group has spanned Investment, Technical, Central Strategy & Planning and Rome Territorial Operations directorates, leading to the current responsibility at Stretto di Messina S.p.A.'}</p>
            <img src="./images/cantiere-team.webp" alt="" className="editorial-image"/>
          </div>
        </div>
      </section>

      <section id="expertise" className="light">
        <div className="wrap section-head"><p className="kicker">03 · {lang==='it'?'COMPETENZE':'EXPERTISE'}</p><h2>{lang==='it'?'Competenze tecniche e manageriali':'Technical and management capabilities'}</h2></div>
        <div className="wrap two-col-list">{expertise.map((x,i)=><div key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{t(x)}</p></div>)}</div>
      </section>

      <section id="areas" className="slate">
        <div className="wrap section-head"><p className="kicker">04 · {lang==='it'?'AREE DI ATTIVITÀ':'AREAS OF ACTIVITY'}</p><h2>{lang==='it'?'Infrastrutture, sistemi, processi':'Infrastructure, systems, processes'}</h2></div>
        <div className="wrap areas-grid">{areas.map((x,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><h3>{t(x)}</h3></article>)}</div>
      </section>

      <section id="results" className="light">
        <div className="wrap section-head"><p className="kicker">05 · {lang==='it'?'RISULTATI CHIAVE':'KEY RESULTS'}</p><h2>{lang==='it'?'Numeri che descrivono la scala delle responsabilità':'Numbers that describe the scale of responsibility'}</h2></div>
        <div className="wrap results-grid">{results.map((x,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{t(x)}</p></article>)}</div>
      </section>

      <section id="bridge" className="bridge dark">
        <div className="wrap bridge-grid">
          <div><p className="kicker">06 · PONTE SULLO STRETTO</p><h2>{lang==='it'?'Collegamenti ferroviari del Ponte sullo Stretto':'Railway connections to the Strait of Messina Bridge'}</h2></div>
          <div>
            <p className="lead">{lang==='it'?'Dal novembre 2023 Giorgio Micolitti è Responsabile Ingegneria Collegamenti Ferroviari di Stretto di Messina S.p.A. e guida la relativa Struttura Organizzativa.':'Since November 2023, Giorgio Micolitti has served as Head of Railway Connections Engineering at Stretto di Messina S.p.A., leading the related organisational unit.'}</p>
            <p>{lang==='it'?'La sezione raccoglie il focus professionale attuale sulle opere ferroviarie connesse al sistema infrastrutturale dello Stretto, mantenendo il profilo del ruolo aderente al CV aggiornato.':'This section presents the current professional focus on railway works connected with the Strait infrastructure system, keeping the role description aligned with the updated CV.'}</p>
          </div>
        </div>
      </section>

      <section id="diary" className="light">
        <div className="wrap section-head"><p className="kicker">07 · PROJECT DIARY</p><h2>{lang==='it'?'Opere e cantieri, senza ritagliare le immagini':'Works and construction sites, with images shown in full'}</h2></div>
        <div className="wrap diary">{diary.map((d,i)=><article className={i%2?'diary-row reverse':'diary-row'} key={d[0]}>
          <div className="diary-copy"><span>{String(i+1).padStart(2,'0')}</span><h3>{d[1]}</h3><p className="caption-en">{d[2]}</p></div>
          <figure><img src={`./images/${d[0]}`} alt={d[1]} loading="lazy"/><figcaption>{d[1]}<em>{d[2]}</em></figcaption></figure>
        </article>)}</div>
      </section>

      <section id="august-2022" className="editorial slate">
        <div className="wrap editorial-grid">
          <div><p className="kicker">08 · AGOSTO 2022</p><h2>{lang==='it'?'Il suono di due treni su un’opera appena realizzata':'The sound of two trains on a newly completed civil work'}</h2></div>
          <div>
            <p className="lead">{lang==='it'?'Uno dei lavori estivi eseguiti dalla squadra di Ingegneria Civile della DOIT Roma, in finestre operative complesse e programmate nei mesi di minore traffico.':'One of the summer works delivered by the DOIT Rome Civil Engineering team within complex possessions planned during lower-traffic periods.'}</p>
            <a className="video-link" href="https://www.youtube.com/watch?v=B2XEBK2oEao" target="_blank" rel="noreferrer">{lang==='it'?'Guarda il video':'Watch the video'} ↗</a>
          </div>
        </div>
      </section>

      <section id="teaching" className="light">
        <div className="wrap teaching-grid"><div><p className="kicker">09 · {lang==='it'?'DOCENZA':'TEACHING'}</p><h2>Sapienza<br/>Università di Roma</h2></div><div><p className="lead">{lang==='it'?'Docente di Tecnica dei Cantieri Infrastrutturali presso il Master Sapienza in Ingegneria delle Infrastrutture e dei Sistemi Ferroviari (IIS), edizioni 2020, 2021 e 2022.':'Lecturer in Infrastructure Construction Site Techniques within Sapienza University’s Master in Infrastructure and Railway Systems Engineering (IIS), editions 2020, 2021 and 2022.'}</p></div></div>
      </section>

      <section id="publications" className="publications ivory">
        <div className="wrap section-head"><p className="kicker">10 · {lang==='it'?'PUBBLICAZIONI SELEZIONATE':'SELECTED PUBLICATIONS'}</p><h2>{lang==='it'?'Ricerca, sicurezza, normativa e geotecnica':'Research, safety, regulation and geotechnics'}</h2></div>
        {['01','02','03'].map(group=><div id={`pub-${group}`} className="wrap pub-group" key={group}>
          <div className="pub-group-title">{group}</div>
          <div>{publications.filter(p=>p[0]===group).map((p,i)=><article className="pub-item" key={i}><span>{p[1]}</span><div><h3>{p[2]}</h3><p>{p[3]}</p></div></article>)}</div>
        </div>)}
        <div className="wrap covers">
          <figure><img src="./images/cover-gallerie-magazine.webp" alt="Gallerie e Grandi Opere in Sotterraneo"/><figcaption>Gallerie e Grandi Opere in Sotterraneo</figcaption></figure>
          <figure><img src="./images/cover-standard-sicurezza.webp" alt="Standard sicurezza gallerie"/><figcaption>Standard sicurezza gallerie</figcaption></figure>
          <figure><img src="./images/cover-tecnica-professionale-cifi2005.webp" alt="La Tecnica Professionale"/><figcaption>La Tecnica Professionale</figcaption></figure>
        </div>
        <div className="wrap awards">
          <h3>{lang==='it'?'Premi e riconoscimenti':'Awards and recognition'}</h3>
          <div><strong>2001</strong><span>1° Premio Nazionale Società Italiana Gallerie</span></div>
          <div><strong>2005</strong><span>1° Premio Nazionale CIFI — Collegio Ingegneri Ferroviari Italiani</span></div>
          <div><strong>2008</strong><span>2° Premio Nazionale CIFI</span></div>
          <div><strong>2011</strong><span>2° Premio Nazionale CIFI</span></div>
        </div>
      </section>

      <footer className="dark"><div className="wrap footer-grid"><div><strong>Giorgio Micolitti</strong><p>Civil &amp; Geotechnical Engineering · Railway Infrastructure</p></div><div><a href="mailto:giorgiomicol@gmail.com">giorgiomicol@gmail.com</a><a href="https://www.linkedin.com/in/giorgiomicolitti/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></footer>
    </main>
  </div>
}
export default App
