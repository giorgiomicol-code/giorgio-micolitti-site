import { useEffect, useState } from 'react'
import './App.css'
import { PublicationLinks } from './Flipbook'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }
type ExperienceItem = { years: string; role: Copy; org: string; text: Copy[] }
type DiaryItem = { image: string; title: Copy; text: Copy }
type DiarySubcategory = { title: Copy; images: string[] }
type DiaryCategory = { title: Copy; subcategories: DiarySubcategory[] }
type PublicationItem = { group: '01' | '02' | '03'; year: string; title: Copy; source: string; cover?: string; pdf?: string; pdfEn?: string }
type VideoItem = { id: string; title: Copy; caption: Copy }
type EducationItem = { years: string; title: Copy; org: Copy; detail: Copy }
type AwardItem = { year: string; text: Copy; photos?: string[]; detail?: string[] }
type AreaItem = { title: Copy; detail: Copy }

function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  return playing
    ? <div className="video-player"><iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>
    : <button type="button" className="video-player" aria-label={title} onClick={() => setPlaying(true)}>
        <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={title} loading="lazy"/>
        <span className="play-btn"><span/></span>
      </button>
}

function Portrait({ className = 'profile-portrait' }: { className?: string }) {
  const [broken, setBroken] = useState(false)
  return <figure className={className}>
    {broken
      ? <p className="placeholder">RITRATTO<br/>in attesa del file ritratto.webp</p>
      : <img src="./images/ritratto.webp" alt="Giorgio Micolitti" onError={() => setBroken(true)}/>}
  </figure>
}

function HeroVisual() {
  const [broken, setBroken] = useState(false)
  return <figure className="hero-band">
    {broken
      ? <p className="placeholder">IMMAGINE CANTIERE<br/>in attesa del file head_foto_1584x396.png</p>
      : <img src="./images/head_foto_1584x396.png" alt="Cantieri ferroviari" onError={() => setBroken(true)}/>}
  </figure>
}

function AwardPhotos({ photos, alt, lang }: { photos: string[]; alt: string; lang: Lang }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = () => setOpenIndex(null)
  const prev = () => setOpenIndex(i => (i === null ? i : (i - 1 + photos.length) % photos.length))
  const next = () => setOpenIndex(i => (i === null ? i : (i + 1) % photos.length))
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex(i => (i === null ? i : (i + 1) % photos.length))
      if (e.key === 'ArrowLeft') setOpenIndex(i => (i === null ? i : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, photos.length])
  return <>
    <div className="award-thumbs">
      {photos.map((p, i) => <button type="button" key={p} className="award-thumb" onClick={() => setOpenIndex(i)} aria-label={lang === 'it' ? 'Ingrandisci' : 'Enlarge'}>
        <img src={`./images/${p}`} alt={alt} loading="lazy"/>
      </button>)}
    </div>
    {openIndex !== null && <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label={lang === 'it' ? 'Chiudi' : 'Close'}>✕</button>
      {photos.length > 1 && <button type="button" className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); prev() }} aria-label={lang === 'it' ? 'Precedente' : 'Previous'}>‹</button>}
      <img className="lightbox-image" src={`./images/${photos[openIndex]}`} alt={alt} onClick={e => e.stopPropagation()}/>
      {photos.length > 1 && <button type="button" className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); next() }} aria-label={lang === 'it' ? 'Successivo' : 'Next'}>›</button>}
    </div>}
  </>
}

function DiaryPhotoGrid({ images, lang, tag }: { images: string[]; lang: Lang; tag?: string }) {
  const t = (x: Copy) => x[lang]
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = () => setOpenIndex(null)
  const prev = () => setOpenIndex(i => (i === null ? i : (i - 1 + images.length) % images.length))
  const next = () => setOpenIndex(i => (i === null ? i : (i + 1) % images.length))
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex(i => (i === null ? i : (i + 1) % images.length))
      if (e.key === 'ArrowLeft') setOpenIndex(i => (i === null ? i : (i - 1 + images.length) % images.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, images.length])
  const current = openIndex !== null ? diary.find(x => x.image === images[openIndex])! : null
  return <>
    <div className="diary-grid">{images.map((img, i) => { const d = diary.find(x => x.image === img)!; return <figure key={img}><span className="diary-code">{diaryCodes[img]}</span><button type="button" className="diary-zoom" onClick={() => setOpenIndex(i)} aria-label={lang === 'it' ? 'Ingrandisci' : 'Enlarge'}><img src={`./images/${d.image}`} alt={t(d.title)}/></button><figcaption>{tag && <span className="diary-tag">{tag}</span>}{t(d.title)}</figcaption></figure> })}</div>
    {current && <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={close}>
      <button type="button" className="lightbox-close" onClick={close} aria-label={lang === 'it' ? 'Chiudi' : 'Close'}>✕</button>
      {images.length > 1 && <button type="button" className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); prev() }} aria-label={lang === 'it' ? 'Precedente' : 'Previous'}>‹</button>}
      <img className="lightbox-image" src={`./images/${current.image}`} alt={t(current.title)} onClick={e => e.stopPropagation()}/>
      {images.length > 1 && <button type="button" className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); next() }} aria-label={lang === 'it' ? 'Successivo' : 'Next'}>›</button>}
    </div>}
  </>
}

function ExperienceAccordion({ items, lang }: { items: ExperienceItem[]; lang: Lang }) {
  const t = (x: Copy) => x[lang]
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) => setOpen(prev => {
    const next = new Set(prev)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    return next
  })
  return <div className="exp-accordion">
    {items.map((e, i) => {
      const isOpen = open.has(i)
      const panelId = `exp-panel-${i}`
      return <div className="exp-item" key={i}>
        <span className={`exp-dot${isOpen ? ' exp-dot-open' : ''}`} aria-hidden="true"/>
        <button type="button" className="exp-trigger" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(i)}>
          <span className="exp-meta"><span className="exp-years">{e.years} — {e.org}</span><span className={`exp-chevron${isOpen ? ' exp-chevron-open' : ''}`} aria-hidden="true">▾</span></span>
          <h4>{t(e.role)}</h4>
        </button>
        <div className={`exp-panel${isOpen ? ' exp-panel-open' : ''}`} id={panelId} role="region">
          <div className="exp-panel-inner">{e.text.map((p, j) => <p key={j}>{t(p)}</p>)}</div>
        </div>
      </div>
    })}
  </div>
}

const profileIntro: Copy[] = [
  { it: 'Ingegnere Civile e Dirigente della Rete Ferroviaria Italiana (RFI SpA) con 25 anni di esperienza nella progettazione, realizzazione e gestione di grandi infrastrutture ferroviarie.', en: 'Civil Engineer and Executive at Rete Ferroviaria Italiana (RFI SpA) with 25 years of experience in the design, delivery and management of major railway infrastructure.' },
  { it: 'Il percorso si è sviluppato interamente nel Gruppo FS Italiane, con responsabilità crescenti: dalla Direzione Investimenti alla Direzione Tecnica di RFI, alla pianificazione strategica di FS, fino alla guida dell’ingegneria Civile territoriale della Direzione Operativa di Roma di RFI.', en: 'His career has developed entirely within the FS Italiane Group, with roles of increasing responsibility: from the Investment Directorate to the Technical Directorate at RFI, to strategic planning at FS, through to leading civil engineering for RFI’s Rome Territorial Operations Directorate.' },
  { it: 'Oggi Dirigente Responsabile dell’Ingegneria dei Collegamenti Ferroviari di Stretto di Messina S.p.A., dove coordina le attività multidisciplinari di uno dei programmi infrastrutturali più complessi in Italia.', en: 'Today, Executive Head of Railway Connections Engineering at Stretto di Messina S.p.A., coordinating the multidisciplinary activities of one of Italy’s most complex infrastructure programmes.' },
  { it: 'Un percorso che unisce ingegneria, project management e leadership, con competenza specifica in infrastrutture ferroviarie, gallerie, grandi opere, gestione del rischio e coordinamento di team e stakeholder complessi.', en: 'A path that combines engineering, project management and leadership, with specific expertise in railway infrastructure, tunnels, major works, risk management and the coordination of complex teams and stakeholders.' },
]

const profileCta: Copy = { it: 'Percorso professionale →', en: 'Professional path →' }

const profileQuote: Copy = { it: 'Ci sono risultati che tutti possono vedere. E poi c’è il lavoro quotidiano che li rende possibili.', en: 'There are results that everyone can see. And then there is the daily work that makes them possible.' }

const profileHeading: Copy = { it: 'Profilo professionale', en: 'Professional profile' }

const profile: Copy[] = [
  { it: 'Ingegnere Civile, Dirigente e Project & Construction Manager, con oltre 24 anni di esperienza nella progettazione, realizzazione e gestione di grandi infrastrutture ferroviarie.', en: 'Civil Engineer, Executive and Project & Construction Manager, with over 24 years of experience in the design, delivery and management of major railway infrastructure.' },
  { it: 'Il percorso si è sviluppato interamente nel Gruppo FS Italiane: dalla Direzione Investimenti e dalla Direzione Tecnica di RFI, alla Direzione Centrale Strategie e Pianificazione di Ferrovie dello Stato Italiane, fino a oltre dieci anni di incarichi a responsabilità crescente nella Direzione Operativa Territoriale di Roma di RFI. Attualmente è Responsabile dell’Ingegneria dei Collegamenti Ferroviari di Stretto di Messina S.p.A., dove coordina le attività multidisciplinari per l’integrazione delle opere ferroviarie del Ponte sullo Stretto nella rete nazionale.', en: 'His career has developed entirely within the FS Italiane Group: from RFI’s Investment Directorate and Technical Directorate, to Ferrovie dello Stato Italiane’s Central Strategy and Planning Directorate, through to over ten years in positions of increasing responsibility within RFI’s Rome Territorial Operations Directorate. He currently serves as Head of Railway Connections Engineering at Stretto di Messina S.p.A., where he coordinates the multidisciplinary activities for integrating the Strait of Messina Bridge’s railway works into the national network.' },
  { it: 'L’esperienza tecnica è focalizzata su gallerie, ponti, stazioni, armamento e opere complesse in ambiente sotterraneo, con competenze specifiche in aerodinamica dei treni ad Alta Velocità in galleria, analisi del rischio per la sicurezza dell’esercizio e fire engineering. A queste si affiancano impianti tecnologici speciali, sicurezza dei cantieri e HSE, sostenibilità e mitigazione dei rischi sismici e acustici.', en: 'His technical experience is focused on tunnels, bridges, stations, trackwork and complex underground works, with specific expertise in High-Speed train tunnel aerodynamics, operating-safety risk analysis and fire engineering. Alongside these are special technological systems, construction-site safety and HSE, sustainability, and seismic and acoustic risk mitigation.' },
  { it: 'A livello internazionale ha partecipato a gruppi di lavoro presso le principali istituzioni ferroviarie europee (UIC, AEIF, CER, EU-FIT) e ha collaborato con società partecipate da RFI impegnate nelle grandi gallerie transfrontaliere, tra cui Brenner Basis Tunnel e Torino–Lione. Le competenze manageriali, consolidate anche attraverso un Executive Master in General Management, si integrano con una conoscenza diretta dell’intero processo realizzativo — dalla progettazione alla messa in esercizio — e con il coordinamento di team multidisciplinari fino a circa 100 risorse in cinque unità.', en: 'Internationally, he has taken part in working groups at leading European railway institutions (UIC, AEIF, CER, EU-FIT) and has collaborated with RFI-affiliated companies engaged in major cross-border tunnels, including the Brenner Base Tunnel and the Turin–Lyon line. His management skills, also consolidated through an Executive Master in General Management, are combined with direct knowledge of the entire delivery process — from design to commissioning — and with the coordination of multidisciplinary teams of up to around 100 people across five units.' },
  { it: 'Docente di Tecnica dei Cantieri Infrastrutturali presso il Master di II livello in Ingegneria delle Infrastrutture e dei Sistemi Ferroviari della Sapienza Università di Roma (2020, 2021, 2022). Pilota UAV certificato EASA A1/A2/A3.', en: 'Lecturer in Infrastructure Construction Site Techniques within the Level II Master in Infrastructure and Railway Systems Engineering at Sapienza University of Rome (2020, 2021, 2022). EASA A1/A2/A3 certified UAV pilot.' },
]

const experience: ExperienceItem[] = [
  { years: 'Nov 2023 — Presente', role: { it: 'Responsabile S.O. Ingegneria Collegamenti Ferroviari', en: 'Head of Railway Connections Engineering (S.O.)' }, org: 'Stretto di Messina S.p.A. · Roma', text: [
    { it: 'Responsabile della Struttura Organizzativa Ingegneria Collegamenti Ferroviari di Stretto di Messina S.p.A., con coordinamento delle attività multidisciplinari connesse alla progettazione e all’integrazione delle opere ferroviarie del Ponte sullo Stretto di Messina nella rete nazionale.', en: 'Head of the Railway Connections Engineering Organisational Unit at Stretto di Messina S.p.A., coordinating the multidisciplinary activities related to the design and integration of the Strait of Messina Bridge’s railway works into the national network.' },
    { it: 'L’attività comprende il presidio delle principali discipline ferroviarie e civili — gallerie, stazioni sotterranee, opere civili, armamento, impianti tecnologici e sistemi ferroviari — nonché il coordinamento delle interfacce tecniche con RFI e con le altre strutture coinvolte nello sviluppo del programma.', en: 'The role covers the main railway and civil disciplines — tunnels, underground stations, civil works, trackwork, technological systems and railway systems — as well as coordinating technical interfaces with RFI and the other units involved in developing the programme.' },
    { it: 'Particolare attenzione è dedicata alla sicurezza dell’esercizio ferroviario, alla gestione del rischio e alle interazioni tra infrastruttura, sistemi e condizioni operative, nell’ambito di uno dei programmi infrastrutturali più complessi attualmente sviluppati in Italia.', en: 'Particular attention is given to railway operating safety, risk management and the interactions between infrastructure, systems and operating conditions, within one of the most complex infrastructure programmes currently underway in Italy.' },
  ] },
  { years: 'Dic 2017 — Set 2023', role: { it: 'Responsabile S.O. Ingegneria Civile, Armamento, Patrimonio e Autorizzazioni, Ponti e Verifiche', en: 'Head of Civil Engineering, Trackwork, Property & Authorisations, Bridges & Inspections (S.O.)' }, org: 'RFI S.p.A. · Direzione Operativa Infrastrutture Roma', text: [
    { it: 'Guida della Struttura di Ingegneria Civile di RFI a Roma, con responsabilità su un’organizzazione multidisciplinare di circa 100 risorse, articolata in più unità operative, e su un portafoglio di investimenti per circa 1 miliardo di euro.', en: 'Led RFI’s Civil Engineering unit in Rome, responsible for a multidisciplinary organisation of around 100 people across several operational units, and for an investment portfolio of approximately €1 billion.' },
    { it: 'Coordina attività di ingegneria civile e ferroviaria, armamento, patrimonio infrastrutturale, ponti e gallerie, verifiche tecniche e processi autorizzativi, assicurando il presidio delle fasi di pianificazione, progettazione e realizzazione degli interventi.', en: 'Coordinated civil and railway engineering activities, trackwork, infrastructure assets, bridges and tunnels, technical inspections and authorisation processes, overseeing the planning, design and delivery phases of works.' },
    { it: 'Tra i principali programmi seguiti figurano il nuovo Anello Ferroviario di Roma, l’adeguamento a categoria di carico D4 del Nodo di Roma, con la realizzazione di 38 nuovi ponti, e numerosi interventi di potenziamento e riqualificazione dell’infrastruttura ferroviaria.', en: 'Key programmes included the new Rome Railway Ring, the D4 load-category upgrade of the Rome node with 38 new bridges, and numerous upgrading and refurbishment interventions on the railway infrastructure.' },
    { it: 'Opera come Soggetto Attuatore RFI per interventi sulle linee Roma–Lido, Anello Ferroviario di Roma, opere connesse al Giubileo e Priverno–Terracina, coordinando le interfacce tra progettazione, realizzazione, esercizio ferroviario ed enti coinvolti.', en: 'Acted as RFI’s Implementing Authority for works on the Roma–Lido line, the Rome Railway Ring, Jubilee-related works and Priverno–Terracina, coordinating interfaces between design, delivery, railway operations and the bodies involved.' },
    { it: 'Presidia inoltre programmi di sicurezza in 16 gallerie ferroviarie, nonché la definizione e l’attuazione del piano territoriale di mitigazione del rischio sismico e del dissesto idrogeologico, con verifiche tecniche sull’infrastruttura e sul patrimonio immobiliare.', en: 'Also oversaw safety programmes in 16 railway tunnels, as well as the definition and implementation of the territorial seismic and hydrogeological risk mitigation plan, with technical assessments of infrastructure and real-estate assets.' },
  ] },
  { years: 'Mar 2016 — Nov 2017', role: { it: 'Responsabile S.O. Opere Civili, Fabbricati e Impianti Speciali', en: 'Head of Civil Works, Buildings and Special Systems (S.O.)' }, org: 'RFI S.p.A. · Direzione Territoriale Produzione Roma', text: [
    { it: 'Coordina la progettazione e la realizzazione di opere civili, fabbricati, stazioni e impianti speciali nell’ambito della rete ferroviaria del Lazio, assicurando l’integrazione tra esigenze infrastrutturali, tecnologie ferroviarie e continuità dell’esercizio.', en: 'Coordinated the design and delivery of civil works, buildings, stations and special systems across the Lazio railway network, ensuring integration between infrastructure requirements, railway technologies and operating continuity.' },
    { it: 'Segue la nuova linea Vigna Clara–Valle Aurelia e gli interventi di upgrading sulle direttrici TEN-T Chiarone–Roma Casilina e Roma–Napoli via Cassino, coordinando progettazione, cantieri e interfacce con le altre specialistiche ferroviarie.', en: 'Oversaw the new Vigna Clara–Valle Aurelia line and upgrading works on the Chiarone–Roma Casilina and Rome–Naples via Cassino TEN-T corridors, coordinating design, construction sites and interfaces with other railway disciplines.' },
    { it: 'Realizza e riqualifica le stazioni di Vigna Clara, Roma–Nettuno, Roccasecca–Avezzano e Civitavecchia Porto, comprendendo interventi sull’armamento e l’adeguamento delle pensiline alle sagome High Cube.', en: 'Delivered and upgraded the Vigna Clara, Roma–Nettuno, Roccasecca–Avezzano and Civitavecchia Porto stations, including trackwork and canopy adaptation to High Cube clearances.' },
    { it: 'L’attività comprende inoltre la gestione dei progettisti esterni, il coordinamento delle risorse specialistiche e la definizione degli strumenti contrattuali necessari all’affidamento e allo sviluppo degli interventi infrastrutturali.', en: 'The role also covered managing external designers, coordinating specialist resources and defining the contractual tools needed to award and develop infrastructure works.' },
  ] },
  { years: 'Mag 2014 — Feb 2016', role: { it: 'Responsabile S.O. Team Sviluppo Locale Opere Civili', en: 'Head of Local Development Civil Works Unit (S.O.)' }, org: 'RFI S.p.A. · Direzione Territoriale Produzione Roma', text: [
    { it: 'Guida attività di sviluppo e potenziamento delle opere civili e dell’armamento nell’ambito territoriale di Roma, coordinando interventi nei piani regolatori ferroviari di Roma Tiburtina, Roma Casilina, Scalo San Lorenzo e Campoleone, oltre che su diversi raccordi ferroviari.', en: 'Led the development and upgrading of civil works and trackwork across the Rome territorial area, coordinating interventions in the railway master plans of Roma Tiburtina, Roma Casilina, Scalo San Lorenzo and Campoleone, as well as on several railway sidings.' },
    { it: 'Segue, tra gli altri, gli interventi relativi agli Interporti di Orte e della Marsica, con responsabilità sull’integrazione tra opere civili, armamento e assetto funzionale delle infrastrutture.', en: 'Oversaw, among others, works related to the Orte and Marsica freight terminals, with responsibility for integrating civil works, trackwork and the functional layout of the infrastructure.' },
    { it: 'Coordina inoltre la riprogettazione aerodinamica di circa 56 km di barriere antirumore sulla linea AV Roma–Napoli, con analisi degli effetti aerodinamici connessi al transito dei treni ad Alta Velocità.', en: 'Also coordinated the aerodynamic redesign of approximately 56 km of noise barriers on the Rome–Naples high-speed line, analysing the aerodynamic effects of High-Speed train transit.' },
    { it: 'Guida il Team di Controllo delle Opere d’Arte, sviluppando analisi di rischio e valutazioni di vulnerabilità sismica su ponti, fabbricati e altre strutture ferroviarie, con particolare attenzione alla sicurezza, alla conservazione del patrimonio e alla continuità dell’esercizio.', en: 'Led the Structural Assets Control Team, developing risk analyses and seismic-vulnerability assessments for bridges, buildings and other railway structures, with particular attention to safety, asset conservation and operating continuity.' },
  ] },
  { years: 'Mag 2011 — Apr 2014', role: { it: 'Project Manager e Referente Task Force Sicurezza nelle Gallerie', en: 'Project Manager and Tunnel Safety Task Force Representative' }, org: 'RFI S.p.A. · Direzione Territoriale Produzione Roma', text: [
    { it: 'Supporta il Project Management di interventi infrastrutturali e dirige lavori civili e tecnologici in molteplici cantieri ferroviari, coordinando attività di progettazione, realizzazione e controllo dell’avanzamento.', en: 'Supported Project Management of infrastructure works and directed civil and technological works across multiple railway construction sites, coordinating design, delivery and progress-control activities.' },
    { it: 'Svolge funzioni di CSP/CSE nell’ambito di interventi per oltre 15 milioni di euro, assicurando il presidio degli aspetti di sicurezza e delle interazioni tra attività di cantiere ed esercizio ferroviario.', en: 'Performed CSP/CSE safety-coordination duties for works exceeding €15 million, overseeing safety aspects and the interactions between construction-site activities and railway operations.' },
    { it: 'Come referente della Task Force Sicurezza nelle Gallerie, contribuisce alla valutazione e alla gestione delle criticità connesse all’esercizio ferroviario in ambiente sotterraneo, integrando aspetti infrastrutturali, tecnologici e di sicurezza.', en: 'As Tunnel Safety Task Force representative, contributed to assessing and managing critical issues related to underground railway operations, integrating infrastructural, technological and safety aspects.' },
    { it: 'Sviluppa inoltre analisi di rischio e valutazioni di vulnerabilità sismica su ponti e fabbricati, consolidando competenze nella gestione della sicurezza e del rischio applicate al patrimonio infrastrutturale ferroviario.', en: 'Also developed risk analyses and seismic-vulnerability assessments for bridges and buildings, consolidating expertise in safety and risk management applied to railway infrastructure assets.' },
  ] },
  { years: 'Mag 2009 — Apr 2011', role: { it: 'Referente Pianificazione Industriale e Monitoraggio KPI – Business Immobiliare e Trasporto', en: 'Industrial Planning & KPI Monitoring – Real Estate and Transport Business' }, org: 'Ferrovie dello Stato Italiane S.p.A. · Direzione Centrale Strategie e Pianificazione', text: [
    { it: 'Opera nell’ambito della pianificazione strategica e industriale del Gruppo FS, consolidando i piani delle società attive nel Real Estate e contribuendo al monitoraggio dello sviluppo dei business immobiliari e di trasporto.', en: 'Worked on the FS Group’s strategic and industrial planning, consolidating the plans of the Group’s Real Estate companies and contributing to monitoring the development of the real-estate and transport businesses.' },
    { it: 'Supporta operazioni straordinarie e processi di sviluppo internazionale, contribuendo alle analisi relative alle acquisizioni di Arriva Deutschland e PKP Cargo e approfondendo struttura, redditività e prospettive dei principali mercati ferroviari europei.', en: 'Supported extraordinary transactions and international development processes, contributing to the analyses behind the Arriva Deutschland and PKP Cargo acquisitions and studying the structure, profitability and outlook of the main European railway markets.' },
    { it: 'Partecipa alla definizione e al monitoraggio dei KPI strategici e industriali, predisponendo analisi e reporting a supporto della Direzione Centrale Strategie e Pianificazione e contribuendo all’individuazione dei principali rischi e delle possibili azioni di mitigazione.', en: 'Took part in defining and monitoring strategic and industrial KPIs, preparing analysis and reporting in support of the Central Strategy and Planning Directorate and contributing to identifying key risks and possible mitigation actions.' },
    { it: 'Rappresenta inoltre Ferrovie dello Stato Italiane nei gruppi UIC Financial Indicators e UIC Statistics, contribuendo al confronto internazionale dei principali indicatori economici, industriali e prestazionali del settore ferroviario.', en: 'Also represented Ferrovie dello Stato Italiane in the UIC Financial Indicators and UIC Statistics working groups, contributing to the international benchmarking of key economic, industrial and performance indicators for the railway sector.' },
    { it: 'L’esperienza consente di integrare le competenze ingegneristiche con quelle di strategia industriale, analisi economica, general management, pianificazione e controllo.', en: 'This experience combined engineering expertise with industrial strategy, economic analysis, general management, planning and control.' },
  ] },
  { years: 'Nov 2006 — Apr 2009', role: { it: 'Ingegnere di Progetto – Opere Civili, Strutture in Sotterraneo e Sicurezza', en: 'Project Engineer – Civil Works, Underground Structures and Safety' }, org: 'RFI S.p.A. · Direzione Tecnica, Ingegneria Civile', text: [
    { it: 'Svolge attività specialistica nell’ambito della progettazione delle opere civili ferroviarie, delle strutture in sotterraneo e della sicurezza delle gallerie, partecipando alla definizione di standard, criteri tecnici e metodologie di analisi applicate all’infrastruttura ferroviaria.', en: 'Carried out specialist work in the design of railway civil works, underground structures and tunnel safety, contributing to the definition of standards, technical criteria and analysis methodologies applied to railway infrastructure.' },
    { it: 'Rappresenta RFI presso AEIF, CEN, UIC ed EU-FIT sui temi della sicurezza in galleria e dell’interoperabilità ferroviaria, contribuendo ai lavori per le Specifiche Tecniche di Interoperabilità (TSI).', en: 'Represented RFI at AEIF, CEN, UIC and EU-FIT on tunnel safety and railway interoperability, contributing to the Technical Specifications for Interoperability (TSI).' },
    { it: 'Partecipa ai tavoli tecnici relativi alle principali infrastrutture ferroviarie transfrontaliere ed è membro del Comitato di Coordinamento per il Brenner Basis Tunnel e per la Torino–Lione, maturando un’esperienza diretta nel confronto tecnico internazionale sui grandi sistemi ferroviari sotterranei.', en: 'Took part in technical working groups on major cross-border railway infrastructure and served on the Coordination Committee for the Brenner Base Tunnel and the Turin–Lyon line, gaining direct experience in international technical discussions on major underground railway systems.' },
    { it: 'Approfondisce in particolare i temi dell’aerodinamica dei treni ad Alta Velocità in galleria, dell’analisi del rischio per la sicurezza dell’esercizio e del fire engineering, conducendo anche attività sperimentali e valutazioni tecniche connesse all’interazione tra materiale rotabile, infrastruttura e ambiente sotterraneo.', en: 'Focused in particular on High-Speed train tunnel aerodynamics, operating-safety risk analysis and fire engineering, also conducting experimental activities and technical assessments related to the interaction between rolling stock, infrastructure and the underground environment.' },
    { it: 'Nell’ambito delle funzioni di Organismo di Ispezione di Tipo B, svolge inoltre verifiche di applicabilità e controlli tecnici su progetti di importo superiore a 20 milioni di euro.', en: 'As a Type B Inspection Body, also carried out applicability reviews and technical checks on projects exceeding €20 million.' },
  ] },
  { years: 'Apr 2002 — Ott 2006', role: { it: 'Ingegnere di Progetto – Progettazione e Pianificazione Infrastrutture', en: 'Project Engineer – Infrastructure Design and Planning' }, org: 'RFI S.p.A. · Direzione Investimenti', text: [
    { it: 'Opera nell’ambito della progettazione e pianificazione degli investimenti infrastrutturali di RFI, sviluppando metodologie e procedure tecniche per la diagnosi, il monitoraggio, la manutenzione e il calcolo strutturale delle opere ferroviarie.', en: 'Worked on the design and planning of RFI’s infrastructure investments, developing methodologies and technical procedures for the diagnosis, monitoring, maintenance and structural calculation of railway works.' },
    { it: 'Contribuisce alla predisposizione di norme, procedure e modelli aziendali per la valutazione dello stato e della sicurezza delle infrastrutture, con particolare attenzione alle opere civili e alla sicurezza dell’esercizio ferroviario in galleria.', en: 'Contributed to preparing standards, procedures and company models for assessing the condition and safety of infrastructure, with particular attention to civil works and railway tunnel operating safety.' },
    { it: 'Partecipa a progetti di innovazione tecnologica e ricerca applicata, sviluppando soluzioni e strumenti finalizzati al miglioramento dei processi di progettazione, controllo e gestione dell’infrastruttura.', en: 'Took part in technological innovation and applied research projects, developing solutions and tools aimed at improving infrastructure design, control and management processes.' },
    { it: 'Segue attività di standardizzazione progettuale, introducendo soluzioni modulari per opere civili ricorrenti e contribuendo alla razionalizzazione dei processi progettuali e realizzativi.', en: 'Worked on design standardisation, introducing modular solutions for recurring civil works and contributing to the rationalisation of design and delivery processes.' },
    { it: 'Svolge inoltre verifiche tecnico-economiche relative a interventi sulle linee AV Roma–Napoli e Torino–Novara e predispone dossier di valutazione a supporto dei processi decisionali e del Comitato Investimenti.', en: 'Also carried out technical-economic assessments for works on the Rome–Naples and Turin–Novara high-speed lines and prepared appraisal dossiers in support of decision-making processes and the Investment Committee.' },
    { it: 'Questa esperienza consolida la conoscenza dell’intero processo di sviluppo di un investimento ferroviario, dalla definizione tecnica dell’intervento alla valutazione economica e alla successiva realizzazione.', en: 'This experience consolidated knowledge of the entire development process of a railway investment, from the technical definition of the intervention to economic appraisal and subsequent delivery.' },
  ] },
  { years: 'Apr 2001 — Apr 2002', role: { it: 'Ingegnere di Progetto', en: 'Project Engineer' }, org: 'DMS Engineering S.r.l. · Progettazione Geotecnica e Strutturale', text: [
    { it: 'Svolge attività di progettazione geotecnica e strutturale di opere civili e infrastrutturali, con particolare riferimento a opere in superficie e in sotterraneo in ambito stradale, ferroviario e civile.', en: 'Carried out geotechnical and structural design of civil and infrastructure works, particularly surface and underground road, railway and civil works.' },
    { it: 'L’attività comprende modellazione e verifiche strutturali, analisi geotecniche e sviluppo delle soluzioni progettuali, contribuendo alla definizione degli aspetti tecnici e costruttivi delle opere.', en: 'The role included structural modelling and verification, geotechnical analysis and the development of design solutions, contributing to defining the technical and construction aspects of the works.' },
    { it: 'Questa esperienza rappresenta il consolidamento della formazione specialistica nelle strutture, nella geotecnica e nelle opere in sotterraneo, competenze successivamente sviluppate nell’ambito delle grandi infrastrutture ferroviarie.', en: 'This experience consolidated specialist training in structures, geotechnics and underground works, expertise later developed within major railway infrastructure.' },
  ] },
  { years: 'Lug 2000 — Apr 2001', role: { it: 'Ingegnere – Area Tecnico-Patrimoniale', en: 'Engineer – Technical Property Area' }, org: 'Azienda U.S.L. Latina · Latina', text: [
    { it: 'Opera nell’Area Tecnico-Patrimoniale dell’Azienda, occupandosi delle valutazioni di sicurezza statica e delle condizioni tecniche degli asset immobiliari.', en: 'Worked in the Technical-Property Area of the organisation, handling structural safety assessments and the technical condition of real-estate assets.' },
    { it: 'L’attività comprende l’analisi delle caratteristiche strutturali degli edifici e il supporto tecnico alla gestione e alla conservazione del patrimonio, costituendo la prima esperienza professionale nell’ambito della valutazione e gestione di opere e immobili esistenti.', en: 'The role included analysing the structural characteristics of buildings and providing technical support for asset management and conservation, marking his first professional experience in assessing and managing existing works and buildings.' },
  ] },
]

const expertise: AreaItem[] = [
  { title: { it: 'Ingegneria delle infrastrutture ferroviarie', en: 'Railway infrastructure engineering' }, detail: { it: 'Ponti e opere d’arte · Gallerie e opere in sotterraneo', en: 'Bridges and civil structures · Tunnels and underground works' } },
  { title: { it: 'Sicurezza e gestione del rischio', en: 'Safety and risk management' }, detail: { it: 'Sicurezza in galleria · Fire engineering · Rischio sismico e idrogeologico', en: 'Tunnel safety · Fire engineering · Seismic and hydrogeological risk' } },
  { title: { it: 'Sistemi ferroviari', en: 'Railway systems' }, detail: { it: 'Armamento · Stazioni · Impianti speciali · Interoperabilità', en: 'Trackwork · Stations · Special systems · Interoperability' } },
  { title: { it: 'Progettazione e realizzazione', en: 'Design and delivery' }, detail: { it: 'Project & Construction Management · Pianificazione · Tempi, costi e qualità', en: 'Project & Construction Management · Planning · Schedule, cost and quality' } },
  { title: { it: 'Verifica delle opere', en: 'Works testing and verification' }, detail: { it: 'Collaudi statici · Collaudi tecnico-amministrativi · Verifiche progettuali', en: 'Structural testing · Technical-administrative testing · Design verification' } },
  { title: { it: 'Pianificazione degli investimenti', en: 'Investment planning' }, detail: { it: 'Capital budgeting · Valutazioni tecnico-economiche · Pianificazione industriale', en: 'Capital budgeting · Technical-economic appraisal · Industrial planning' } },
  { title: { it: 'Normativa e standard ferroviari', en: 'Railway regulations and standards' }, detail: { it: 'TSI · Standard tecnici · Organismi e gruppi di lavoro europei', en: 'TSI · Technical standards · European bodies and working groups' } },
  { title: { it: 'Coordinamento', en: 'Coordination' }, detail: { it: 'Team multidisciplinari · Progettisti · Imprese · Enti e stakeholder', en: 'Multidisciplinary teams · Designers · Contractors · Public bodies and stakeholders' } },
]

const areas: AreaItem[] = [
  { title: { it: 'Ponti e opere d’arte', en: 'Bridges and civil structures' }, detail: { it: 'Progettazione · Verifica · Riqualificazione · Sicurezza strutturale', en: 'Design · Inspection · Refurbishment · Structural safety' } },
  { title: { it: 'Gallerie e opere in sotterraneo', en: 'Tunnels and underground works' }, detail: { it: 'Progettazione · Sicurezza dell’esercizio · Aerodinamica · Fire engineering', en: 'Design · Operating safety · Aerodynamics · Fire engineering' } },
  { title: { it: 'Stazioni e nodi ferroviari', en: 'Stations and railway hubs' }, detail: { it: 'Opere civili · Accessibilità · Impianti · Integrazione con l’esercizio', en: 'Civil works · Accessibility · Systems · Integration with operations' } },
  { title: { it: 'Armamento e infrastruttura ferroviaria', en: 'Trackwork and railway infrastructure' }, detail: { it: 'Piani regolatori · Raccordi · Potenziamenti · Adeguamenti', en: 'Master plans · Sidings · Upgrades · Adaptations' } },
  { title: { it: 'Grandi programmi ferroviari', en: 'Major railway programmes' }, detail: { it: 'Reti TEN-T · Interoperabilità · Collegamenti ferroviari · Opere transfrontaliere', en: 'TEN-T networks · Interoperability · Railway connections · Cross-border works' } },
  { title: { it: 'Patrimonio e resilienza', en: 'Assets and resilience' }, detail: { it: 'Rischio sismico · Dissesto idrogeologico · Manutenzione · Riqualificazione', en: 'Seismic risk · Hydrogeological instability · Maintenance · Refurbishment' } },
]

const results: Copy[] = [
  { it: '25+ anni · nel settore delle infrastrutture ferroviarie', en: '25+ years · in the railway infrastructure sector' }, { it: '≈ 100 persone · massima dimensione delle strutture coordinate', en: '≈ 100 people · largest scale of the units coordinated' }, { it: '≈ 1 miliardo € · portafoglio di investimenti seguito nel periodo 2017–2023', en: '≈ €1 billion · investment portfolio overseen in the 2017–2023 period' }, { it: '38 ponti · realizzati nell’adeguamento del Nodo di Roma alla categoria D4', en: '38 bridges · delivered in the D4 load-category upgrade of the Rome node' }, { it: '20+ gallerie · interessate da programmi e interventi specialistici', en: '20+ tunnels · covered by specialist programmes and interventions' }, { it: '56 km · di barriere antirumore riprogettate sulla linea AV Roma–Napoli', en: '56 km · of noise barriers redesigned on the Rome–Naples high-speed line' }, { it: '> 20 M€ · soglia dei progetti verificati nell’ambito dell’Organismo di Ispezione di Tipo B', en: '> €20m · threshold for projects reviewed as a Type B Inspection Body' }, { it: '3 edizioni · docenza al Master Sapienza IIS', en: '3 editions · lecturing at the Sapienza IIS Master’s programme' },
]

const diary: DiaryItem[] = [
  { image: 'varo-ponte-panoramica.webp', title: { it: 'Ultimazione delle fasi di varo di ponte in acciaio a travi estradossate', en: 'Completion of the launch phases of a steel extradosed-girder bridge' }, text: { it: 'Panoramica di cantiere durante il varo di un nuovo ponte ferroviario.', en: 'Site overview during the launch of a new railway bridge.' } },
  { image: 'varo-ponte-collage.webp', title: { it: 'Sequenza di varo di ponte in acciaio a travi estradossate di grande luce', en: 'Launch sequence of a large-span steel extradosed-girder bridge' }, text: { it: 'Fasi successive di un’operazione di varo, dal montaggio allo scorrimento in opera.', en: 'Successive phases of a launch operation, from assembly to sliding into place.' } },
  { image: 'varo-ponte-verde-aereo.webp', title: { it: 'Varo di due nuove travate metalliche realizzate mediante cassoni portaballast', en: 'Launch of two new steel girders built as ballast-trough box sections' }, text: { it: 'Inquadramento aereo dell’area di cantiere e dell’infrastruttura esistente.', en: 'Aerial framing of the construction site and the surrounding infrastructure.' } },
  { image: 'varo-ponte-notturno.webp', title: { it: 'Varo di travata reticolare in acciaio di grande luce', en: 'Launch of a large-span steel truss girder' }, text: { it: 'Operazioni condotte in interruzioni notturne per minimizzare l’impatto sull’esercizio.', en: 'Operations carried out in night possessions to minimise impact on operations.' } },
  { image: 'ponte-reticolare-collage-01.webp', title: { it: 'Realizzazione di travata reticolare di grande luce', en: 'Construction of a large-span truss girder' }, text: { it: 'Montaggio e varo di un’opera a travata reticolare in acciaio.', en: 'Assembly and launch of a steel truss bridge structure.' } },
  { image: 'ponte-reticolare-collage-02-ritratto.webp', title: { it: 'Attività di cantiere propedeutiche alla riattivazione della circolazione ferroviaria dopo la posa della travata reticolare di grande luce', en: 'Site activities ahead of reopening the line to rail traffic after placement of the large-span truss girder' }, text: { it: 'Sopralluogo tecnico in cantiere durante le fasi realizzative dell’opera.', en: 'Technical site inspection during the works.' } },
  { image: 'ponte-arco-restauro.webp', title: { it: 'Interventi di miglioramento sismico e consolidamento di ponte ad arco in muratura a più campate', en: 'Seismic upgrade and strengthening works on a multi-span masonry arch bridge' }, text: { it: 'Interventi di restauro e consolidamento su un’opera d’arte storica.', en: 'Restoration and consolidation works on a historic civil structure.' } },
  { image: 'demolizione-ponte-muratura-collage.webp', title: { it: 'Intervento di adeguamento prestazionale della linea Roma–Formia a Pomezia, per l’adeguamento alla sagoma internazionale interoperabile PC80 nell’ambito del corridoio TEN-T e il transito dei convogli High Cube, attraverso demolizione e sostituzione con nuova travata in acciaio di grande luce', en: 'Performance upgrade works on the Roma–Formia line at Pomezia, bringing it up to the interoperable international PC80 gauge within the TEN-T corridor and enabling the transit of High Cube trains, through demolition and replacement with a new long-span steel girder' }, text: { it: 'Sequenza di demolizione controllata di un’opera in muratura a fine vita utile.', en: 'Controlled demolition sequence of a masonry structure at the end of its service life.' } },
  { image: 'demolizione-arco-muratura-collage.webp', title: { it: 'Sostituzione di sottovia ad arco in muratura con nuova travata in acciaio, di luce netta adeguata a consentire una viabilità stradale a doppia corsia', en: 'Replacement of a masonry arch underpass with a new steel girder, with a clear span sufficient to accommodate two-lane road traffic' }, text: { it: 'Rimozione di un’opera ad arco in muratura in vista della sua sostituzione.', en: 'Removal of a masonry arch structure ahead of its replacement.' } },
  { image: 'sottovia-aereo-scatolare.webp', title: { it: 'Opere preliminari alla spinta, per la definitiva collocazione lungo linea', en: 'Preliminary works ahead of the pipe-jacking thrust, for the structure’s final positioning along the line' }, text: { it: 'Inquadramento aereo di un nuovo sottovia scatolare in ambito ferroviario.', en: 'Aerial framing of a new box underpass beneath the railway.' } },
  { image: 'sottovia-collage-4foto.webp', title: { it: 'Realizzazione di nuovo sottovia: fase di cantiere relativa alla costruzione dello scatolare in cemento armato e alle opere propedeutiche alla successiva spinta sotto la sede ferroviaria', en: 'Construction of a new underpass: site phase for building the reinforced-concrete box structure and the preparatory works ahead of the subsequent pipe-jacking beneath the railway line' }, text: { it: 'Fasi di scavo, varo e completamento di un sottovia scatolare in cemento armato.', en: 'Excavation, launch and completion phases of a reinforced-concrete box underpass.' } },
  { image: 'scavo-sottovia-cilindri.webp', title: { it: 'Spingitubo per sottovia', en: 'Pipe-jacking for an underpass' }, text: { it: 'Tecnica di spinta di elementi cilindrici per la realizzazione di un sottovia in esercizio.', en: 'Pipe-jacking technique for constructing an underpass beneath an operating line.' } },
  { image: 'scatolare-coprem.webp', title: { it: 'Realizzazione di sottovia idraulico mediante conci prefabbricati a giunto termosaldato e infissione a spinta', en: 'Construction of a hydraulic underpass using precast segments with heat-welded joints, installed by thrust-jacking' }, text: { it: 'Posa di elementi scatolari prefabbricati per opere di attraversamento.', en: 'Installation of precast box culvert elements for crossing works.' } },
  { image: 'galleria-scavo-fresa.webp', title: { it: 'Scavo meccanizzato in galleria', en: 'Mechanised tunnel excavation' }, text: { it: 'Avanzamento dello scavo con fresa meccanizzata.', en: 'Excavation advance using a tunnel boring machine.' } },
  { image: 'galleria-interno-01.webp', title: { it: 'Interno galleria: rivestimento e sicurezza', en: 'Tunnel interior: lining and safety' }, text: { it: 'Interventi sul rivestimento e sulle dotazioni di sicurezza dell’esercizio in sotterraneo.', en: 'Works on the lining and safety equipment of underground operations.' } },
  { image: 'galleria-interno-02.webp', title: { it: 'Interno galleria: manutenzione', en: 'Tunnel interior: maintenance' }, text: { it: 'Attività di manutenzione e controllo delle strutture in sotterraneo.', en: 'Maintenance and structural monitoring activities underground.' } },
  { image: 'galleria-interno-scavo.webp', title: { it: 'Fronte di scavo in galleria', en: 'Tunnel excavation face' }, text: { it: 'Fase di avanzamento al fronte durante lo scavo in sotterraneo.', en: 'Face-advance phase during underground excavation.' } },
  { image: 'galleria-percorrenza.webp', title: { it: 'Percorrenza in galleria', en: 'Tunnel walkthrough' }, text: { it: 'Ispezione tecnica lungo lo sviluppo della galleria.', en: 'Technical inspection along the length of the tunnel.' } },
  { image: 'galleria-prima-dopo-collage.webp', title: { it: 'Galleria: prima e dopo l’intervento', en: 'Tunnel: before and after the works' }, text: { it: 'Confronto tra lo stato ante operam e post operam di un intervento in galleria.', en: 'Comparison between the pre- and post-intervention state of a tunnel upgrade.' } },
  { image: 'consolidamento-scarpata.webp', title: { it: 'Stabilizzazione di un rilevato ferroviario di grande altezza mediante doppia paratia tirantata di micropali', en: 'Stabilisation of a high railway embankment using a double tie-back micropile wall' }, text: { it: 'Interventi geotecnici di consolidamento e mitigazione del dissesto idrogeologico.', en: 'Geotechnical consolidation works and hydrogeological risk mitigation.' } },
  { image: 'scarpata-lanuvio.webp', title: { it: 'Fasi realizzative della stabilizzazione della scarpata compresa tra le due paratie', en: 'Construction phases of the slope stabilisation between the two retaining walls' }, text: { it: 'Intervento di stabilizzazione su un versante in prossimità della linea ferroviaria.', en: 'Stabilisation works on a slope adjacent to the railway line.' } },
  { image: 'cantiere-urbano-01.webp', title: { it: 'Cantiere in ambito urbano', en: 'Urban construction site' }, text: { it: 'Gestione delle interferenze e della sicurezza in un cantiere ferroviario urbano.', en: 'Managing interfaces and safety on an urban railway construction site.' } },
  { image: 'cantiere-urbano-02.webp', title: { it: 'Opere civili in ambito urbano', en: 'Civil works in an urban setting' }, text: { it: 'Realizzazione di opere civili in un contesto urbano denso.', en: 'Delivery of civil works within a dense urban context.' } },
  { image: 'cantiere-impalcatura-verticale.webp', title: { it: 'Impalcatura verticale di cantiere', en: 'Vertical construction scaffolding' }, text: { it: 'Allestimento verticale del cantiere per interventi in quota.', en: 'Vertical site setup for works at height.' } },
  { image: 'scavo-notturno.webp', title: { it: 'Scavo in finestra notturna', en: 'Night-window excavation' }, text: { it: 'Attività di scavo condotte in interruzioni notturne programmate.', en: 'Excavation works carried out during planned night possessions.' } },
  { image: 'muro-sostegno-dettaglio.webp', title: { it: 'Realizzazione di tiranti autoperforanti per l’ancoraggio in profondità della paratia', en: 'Installation of self-drilling anchors for the deep anchoring of the retaining wall' }, text: { it: 'Dettaglio costruttivo di un muro di sostegno lungo la linea.', en: 'Construction detail of a retaining wall along the line.' } },
  { image: 'viadotto-storico-panoramica.webp', title: { it: 'Miglioramento sismico e consolidamento di viadotto storico a 12 campate', en: 'Seismic upgrade and strengthening of a 12-span historic viaduct' }, text: { it: 'Vista panoramica di un viadotto storico in esercizio.', en: 'Panoramic view of a historic viaduct in operation.' } },
]

// Tassonomia a 2 livelli richiesta dall'utente. Le foto sono state inserite dove
// il collegamento con la sottocategoria è ragionevolmente chiaro dalla loro didascalia
// reale; i posizionamenti non ovvi sono segnalati come tali nel riepilogo in chat.
// Le sottocategorie senza foto restano vuote, pronte a riceverle in seguito.
const diaryTaxonomy: DiaryCategory[] = [
  { title: { it: 'Ponti e viadotti', en: 'Bridges and viaducts' }, subcategories: [
    { title: { it: 'Consolidamento strutturale', en: 'Structural strengthening' }, images: ['ponte-arco-restauro.webp', 'viadotto-storico-panoramica.webp'] },
    { title: { it: 'Adeguamento sagoma PC80', en: 'PC80 gauge upgrade' }, images: ['demolizione-ponte-muratura-collage.webp', 'varo-ponte-collage.webp', 'varo-ponte-panoramica.webp', 'varo-ponte-verde-aereo.webp', 'ponte-reticolare-collage-01.webp', 'varo-ponte-notturno.webp', 'ponte-reticolare-collage-02-ritratto.webp'] },
    { title: { it: 'Sostituzione e nuova costruzione', en: 'Replacement and new construction' }, images: ['demolizione-arco-muratura-collage.webp'] },
    { title: { it: 'Varo e cantiere', en: 'Launch and site works' }, images: [] },
    { title: { it: 'Sottovia scatolari', en: 'Box underpasses' }, images: ['sottovia-aereo-scatolare.webp', 'scatolare-coprem.webp', 'sottovia-collage-4foto.webp'] },
  ] },
  { title: { it: 'Geotecnica e rilevati', en: 'Geotechnics and embankments' }, subcategories: [
    { title: { it: 'Rilevati ferroviari, scarpate e stabilizzazione', en: 'Railway embankments, slopes and stabilisation' }, images: ['consolidamento-scarpata.webp', 'scarpata-lanuvio.webp', 'muro-sostegno-dettaglio.webp'] },
    { title: { it: 'Opere in terra', en: 'Earthworks' }, images: [] },
  ] },
  { title: { it: 'Gallerie', en: 'Tunnels' }, subcategories: [
    { title: { it: 'Consolidamento e adeguamento', en: 'Strengthening and upgrading' }, images: ['galleria-scavo-fresa.webp', 'galleria-interno-scavo.webp'] },
    { title: { it: 'Sicurezza e tecnologie', en: 'Safety and technology' }, images: ['galleria-prima-dopo-collage.webp', 'galleria-percorrenza.webp', 'galleria-interno-02.webp', 'galleria-interno-01.webp'] },
  ] },
  { title: { it: 'Opere idrauliche', en: 'Hydraulic works' }, subcategories: [
    { title: { it: 'Compatibilità idraulica', en: 'Hydraulic compatibility' }, images: [] },
    { title: { it: 'Attraversamenti', en: 'Crossings' }, images: [] },
  ] },
  { title: { it: 'Stazioni e ambito urbano', en: 'Stations and urban areas' }, subcategories: [
    { title: { it: 'Cantieri urbani', en: 'Urban construction sites' }, images: ['cantiere-urbano-01.webp', 'cantiere-urbano-02.webp', 'cantiere-impalcatura-verticale.webp'] },
    { title: { it: 'Riqualificazione stazioni', en: 'Station upgrades' }, images: [] },
  ] },
  { title: { it: 'Nuove infrastrutture', en: 'New infrastructure' }, subcategories: [
    { title: { it: 'Nuove linee', en: 'New lines' }, images: [] },
    { title: { it: 'Opere civili', en: 'Civil works' }, images: [] },
    { title: { it: 'Armamento e tecnologie', en: 'Trackwork and technology' }, images: [] },
  ] },
]

// Foto senza una sottocategoria abbastanza chiara da assegnarle: restano in coda,
// visibili con il proprio codice (lettera+numero) in attesa di indicazioni.
const diaryQueue: string[] = ['scavo-notturno.webp', 'scavo-sottovia-cilindri.webp']

// Codice lettera+numero per ogni foto del diario (ordine dell'array `diary`, 9 per lettera),
// usato solo come riferimento univoco in conversazione: non rinomina i file reali.
const diaryCodes: Record<string, string> = Object.fromEntries(diary.map((d, i) => [d.image, `${String.fromCharCode(65 + Math.floor(i / 9))}${(i % 9) + 1}`]))

const videos: VideoItem[] = [
  { id: '5TOuHte0nSo', title: { it: 'Varo trasversale di ponte a travata reticolare in acciaio', en: 'Transversal launch of a steel truss bridge' }, caption: { it: 'Sequenza di varo trasversale di un ponte ferroviario di 30 m a travata reticolare.', en: 'Transversal launch sequence of a 30 m steel truss railway bridge.' } },
  { id: '2ERIls-N5FA', title: { it: 'Varo di un cavalcavia in acciaio a travi estradossate', en: 'Launch of a 40 m extradosed steel road bridge' }, caption: { it: 'Il varo di un cavalcavia in acciaio a travi estradossate di 40 m.', en: 'Launching of a 40 m steel road bridge with extradosed beams.' } },
  { id: '85ZxUrBjsJ4', title: { it: 'Dal ponte ad arco in muratura al sottovia scatolare', en: 'From masonry arch bridge to box underpass' }, caption: { it: 'Dal ponte ad arco in muratura al sottovia scatolare in cls.', en: 'From the masonry arched bridge to the concrete box underpass.' } },
  { id: 'mBXq7QyqAXU', title: { it: 'Varo trasversale di ponte in acciaio', en: 'Transversal launch of a steel bridge' }, caption: { it: 'Esempio di varo trasversale di ponte in acciaio.', en: 'Example of transversal launch of a steel bridge.' } },
  { id: 'v2K7CxV0buU', title: { it: 'Varo di un nuovo ponte a travi in acciaio', en: 'Launch of a new steel-beam bridge' }, caption: { it: 'Varo di un nuovo ponte a travi in acciaio incorporate.', en: 'Launch of a new bridge with incorporated steel beams.' } },
  { id: 'y5gCqsuNTRI', title: { it: 'Realizzazione e varo del ponte in acciaio Zambra', en: 'Construction and launch of the Zambra steel bridge' }, caption: { it: 'Realizzazione e varo del ponte in acciaio Zambra · 2021.', en: 'Construction and launch of the Zambra steel bridge · 2021.' } },
  { id: 'R-oy8_PSvvI', title: { it: 'Rimozione di ponte pedonale in cemento armato', en: 'Removal of a concrete footbridge' }, caption: { it: 'Rimozione di ponte pedonale in cls.', en: 'Removal of a reinforced-concrete footbridge.' } },
  { id: 'fKNXOBJ8XFk', title: { it: 'Rimozione di ponte imbarco in acciaio', en: 'Removal of a steel loading bridge' }, caption: { it: 'Esempio di rimozione di ponte imbarco in acciaio.', en: 'Example of removal of a steel loading bridge.' } },
  { id: 'PRV1iSJicgQ', title: { it: 'Rimozione di un ponte ferroviario', en: 'Removal of a railway bridge' }, caption: { it: 'La rimozione di un ponte ferroviario.', en: 'Removal of a railway bridge.' } },
  { id: '02Gk13v8u_Q', title: { it: 'Passerella pedonale provvisoria in acciaio', en: 'Temporary steel footbridge' }, caption: { it: 'Realizzazione e rimozione passerella pedonale provvisoria in acciaio · 2021.', en: 'Construction and removal of a temporary steel footbridge · 2021.' } },
  { id: 'Qyi8eGPJpsE', title: { it: 'Ponte ad arco reticolare in acciaio a tre cerniere', en: 'Three-hinged steel lattice arch bridge' }, caption: { it: 'Esempio di ponte ad arco reticolare in acciaio a tre cerniere.', en: 'Example of a three-hinged steel lattice arch bridge.' } },
]

// Codice lettera+numero per ogni video (ordine dell'array `videos`), usato solo come
// riferimento univoco in conversazione: non rinomina alcun file, la V sta per "video".
const videoCodes: Record<string, string> = Object.fromEntries(videos.map((v, i) => [v.id, `V${i + 1}`]))

const education: EducationItem[] = [
  { years: '2006 — 2007', title: { it: 'Executive Master in General Management', en: 'Executive Master in General Management' }, org: { it: 'LUISS Business School', en: 'LUISS Business School' }, detail: { it: 'Pianificazione Strategica e Organizzazione Aziendale, Amministrazione e Controllo di Gestione, Finanza, Strategie e Politiche di Marketing, Gestione delle Operations, Gestione HR.', en: 'Strategic planning and organisational design, management accounting and control, finance, marketing strategy and policy, operations management, HR management.' } },
  { years: '1999 — 2000', title: { it: 'Laurea in Ingegneria Civile (indirizzo Geotecnica) — 110/110 e Lode', en: 'Degree in Civil Engineering (Geotechnical) — 110/110 cum laude' }, org: { it: 'Università “La Sapienza” di Roma', en: 'Sapienza University of Rome' }, detail: { it: 'Premio di Laurea del Ministro delle Infrastrutture P. Lunardi.', en: 'Awarded the Degree Prize by the Minister of Infrastructure P. Lunardi.' } },
  { years: '2001', title: { it: 'Abilitazione alla professione di Ingegnere', en: 'Professional Engineering licence' }, org: { it: 'Ordine degli Ingegneri di Roma', en: 'Rome Order of Engineers' }, detail: { it: 'Iscritto all’Albo degli Ingegneri di Roma, n. 31957.', en: 'Registered with the Rome Order of Engineers, no. 31957.' } },
]

const documents: DiaryItem[] = []

const awards: AwardItem[] = [
  { year: '2001', text: { it: '1° Premio Nazionale Società Italiana Gallerie — Ministero delle Infrastrutture e dei Trasporti', en: '1st National Award, Società Italiana Gallerie — Ministry of Infrastructure and Transport' }, photos: ['diploma-societa-italiana-gallerie-2001.webp'], detail: [
    'Premio conferito al World Tunnel Congress 2001 dal Ministro delle Infrastrutture Pietro Lunardi, per l’ampio contributo culturale alla scienza della meccanica delle rocce e dei terreni.',
    'In concomitanza con il Convegno Internazionale ITA-AITES 2001, organizzato dalla Società Italiana Gallerie e dalla Swiss Tunnelling Society con la partecipazione dell’ITA (International Tunnelling Association) — Milano, Centro Congressi Milanofiori, 10–13 giugno 2001, circa 1000 partecipanti — la SIG e il Ministro Lunardi hanno conferito, tra 43 partecipanti, il Quarto Premio di Laurea 2001 “Costruzioni in sotterraneo”, aperto a tutte le discipline attinenti, alla tesi del Dott. Ing. Giorgio Micolitti “Analisi di stabilità di scavi con metodi ad elementi distinti”, discussa presso l’Università degli Studi di Roma “La Sapienza”, Facoltà di Ingegneria, relatore Prof. Renato Ribacchi, con la seguente motivazione:',
    '«L’Autore si è posto l’obbiettivo di analizzare lo stato tensionale e deformativo indotto dalla realizzazione di cavità sotterranee in ammassi rocciosi fratturati, con particolare riferimento alla stabilità di quelli di tipo stratificato, sviluppando la modellazione di sistemi a comportamento marcatamente discontinuo caratterizzato da blocchi interagenti lungo le discontinuità che vedono il continuo come un caso particolare. La tesi utilizza codici di calcolo complessi e che prevedono diverse modellazioni per cui il campo di applicazione risulta ampiamente esplorato anche con alcuni confronti significativi. Ne consegue un importante contributo culturale per la Scienza della Meccanica delle rocce e dei terreni anche per l’ampia biografia citata.»',
  ] },
  { year: '2005', text: { it: '1° Premio Nazionale CIFI — Collegio Ingegneri Ferroviari Italiani', en: '1st National Award, CIFI — Collegio Ingegneri Ferroviari Italiani' }, photos: ['lettera-premio-cifi-2011.webp'], detail: [
    'Conferito per la pubblicazione sulla sicurezza di esercizio in condizioni di emergenza — «La Tecnica Professionale», settembre 2003.',
  ] },
  { year: '2008', text: { it: '2° Premio Nazionale CIFI', en: '2nd National CIFI Award' }, detail: [
    'Conferito per la pubblicazione su «Fenomeni aerodinamici indotti dai treni AV in galleria» — «Ingegneria Ferroviaria», ottobre 2006.',
  ] },
  { year: '2011', text: { it: '2° Premio Nazionale CIFI', en: '2nd National CIFI Award' }, photos: ['collage-premiazione-cifi-2011.webp', 'premiazione-gruppo.webp', 'premiazione-e-botti.webp'], detail: [
    'Conferito per la pubblicazione su «La normativa europea per la sicurezza delle gallerie» — «La Tecnica Professionale», marzo 2009.',
  ] },
]

const publications: PublicationItem[] = [
  { group: '01', year: '2009', title: { it: 'La Normativa europea per la sicurezza delle gallerie', en: 'European Regulations for Tunnel Safety' }, source: 'Tecnica Professionale n. 3/09, CIFI · marzo 2009', cover: 'cover-tecnica-professionale-2009.webp', pdf: '2009-normativa-europea-sicurezza-gallerie.pdf' }, { group: '01', year: '2007', title: { it: 'Modernizzazione e competitività del Paese attraverso il rilancio del trasporto ferroviario', en: 'Modernising the Country and Boosting Competitiveness through the Revival of Rail Transport' }, source: 'Notizie Speciale Ferrovie – Federmanager · maggio 2007', cover: 'articolo-speciale-ferrovie-2007.webp', pdf: '2007-modernizzazione-competitivita-trasporto-ferroviario.pdf' }, { group: '01', year: '2006', title: { it: 'Fenomeni aerodinamici indotti dal transito dei treni AV', en: 'Aerodynamic Phenomena Induced by High-Speed Train Transit' }, source: 'Ingegneria Ferroviaria, CIFI · ottobre 2006', cover: 'cover-ingegneria-ferroviaria-2006.webp', pdf: '2006-fenomeni-aerodinamici-treni-av.pdf' }, { group: '02', year: '2006', title: { it: 'Fire Safe Design for Rail Tunnels', en: 'Fire Safe Design for Rail Tunnels' }, source: 'European Community 5th Framework Programme · maggio 2006', cover: 'cover-fire-in-tunnels-2006.webp', pdf: '2006-fire-safe-design-rail-tunnels.pdf' }, { group: '02', year: '2005', title: { it: 'Regulation Guidelines for Fire Safe Design in Rail Tunnels', en: 'Regulation Guidelines for Fire Safe Design in Rail Tunnels' }, source: 'European Community 5th Framework Programme · febbraio 2005', cover: 'cover-fire-in-tunnels-2006.webp', pdf: '2005-regulation-guidelines-fire-safe-design.pdf' }, { group: '03', year: '2003', title: { it: 'L’evoluzione del concetto di sicurezza nelle gallerie ferroviarie', en: 'The Evolution of the Safety Concept in Railway Tunnels' }, source: 'Tecnica Professionale n. 9/03 · settembre 2003', cover: 'cover-tecnica-professionale-2003.webp', pdf: '2003-evoluzione-sicurezza-gallerie-ferroviarie.pdf' }, { group: '03', year: '2001', title: { it: 'Analisi ad elementi distinti di cavità sotterranee in ammassi rocciosi stratificati', en: 'Distinct element analysis of underground voids in stratified rock masses' }, source: 'Gallerie e Grandi Opere in Sotterraneo n. 65, Ed. Patron · dicembre 2001', cover: 'cover-gallerie-magazine.webp', pdf: '2001-analisi-elementi-distinti-gallerie.pdf', pdfEn: '2001-distinct-element-analysis-underground-voids-en.pdf' }, { group: '03', year: '2003', title: { it: 'L’evoluzione del concetto di sicurezza nelle gallerie ferroviarie', en: 'The Evolution of the Safety Concept in Railway Tunnels' }, source: 'RFI · [Argomenti 1], con R. Mele · ottobre 2003', cover: 'cover-rfi-argomenti-2003.webp', pdf: '2003-evoluzione-sicurezza-gallerie-rfi-argomenti.pdf' }, { group: '03', year: '2002', title: { it: 'Manuale di Progettazione Gallerie', en: 'Tunnel Design Manual' }, source: 'RFI · Direzione Investimenti, Ingegneria Civile · Codifica RFI DINIC MA GA GN 00 001 B · luglio 2002', cover: 'cover-manuale-progettazione-gallerie.webp', pdf: 'manuale-progettazione-gallerie-rfi.pdf' }, { group: '03', year: '2003', title: { it: 'Standard di Sicurezza nelle Gallerie — Il panorama europeo e la situazione italiana', en: 'Safety Standards in Tunnels — The European Landscape and the Italian Situation' }, source: 'Prime considerazioni · agosto 2003', cover: 'cover-standard-sicurezza-gallerie.webp', pdf: '2003-standard-sicurezza-gallerie-ferroviarie.pdf' },
]

const itMonths: Record<string, string> = { gennaio: 'January', febbraio: 'February', marzo: 'March', aprile: 'April', maggio: 'May', giugno: 'June', luglio: 'July', agosto: 'August', settembre: 'September', ottobre: 'October', novembre: 'November', dicembre: 'December' }
function localizeSource(source: string, lang: Lang) {
  if (lang === 'it') return source
  return source
    .replace(/\b(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/i, m => itMonths[m.toLowerCase()])
    .replace(', con ', ', with ')
}

function App() {
  const [lang, setLang] = useState<Lang>('it')
  const [diaryFilter, setDiaryFilter] = useState<number | 'queue' | null>(null)
  const t = (x: Copy) => x[lang]
  return <div className="site-shell">
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">GM</span><span>Giorgio Micolitti</span></a><nav><a href="#profile">{lang === 'it' ? 'Profilo' : 'Profile'}</a><a href="#rfi">{lang === 'it' ? '25 anni RFI' : '25 years RFI'}</a><a href="#bridge">{lang === 'it' ? 'Ponte' : 'Bridge'}</a><a href="#diary">Project diary</a><a href="#teaching">{lang === 'it' ? 'Docenze' : 'Teaching'}</a><a href="#publications">{lang === 'it' ? 'Pubblicazioni' : 'Publications'}</a></nav><div className="lang"><button className={lang === 'it' ? 'active' : ''} onClick={() => setLang('it')}>IT</button><span>/</span><button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button></div></header>
    <main id="top">
      <section className="hero dark"><div className="wrap"><p className="kicker">CIVIL ENGINEERING · RAILWAY INFRASTRUCTURE</p><h1>Civil Engineering Works,<br/>Infrastructure Constructions,<br/>Tunnels &amp; Safety</h1><p className="hero-sub">Sustainability challenges in a constantly evolving framework</p><p className="hero-name">Giorgio Micolitti</p></div><div className="wrap"><HeroVisual/></div></section>
      <section id="profile" className="light"><div className="wrap profile-hero"><div className="profile-heading"><p className="kicker">01 · {lang === 'it' ? 'PROFILO PROFESSIONALE' : 'PROFESSIONAL PROFILE'}</p><h2 className="profile-story">{lang === 'it' ? 'Ogni infrastruttura racconta una storia.' : 'Every infrastructure tells a story.'}</h2></div><Portrait className="profile-portrait"/><div className="profile-lede-block">{profileIntro.map((p,i)=><p className="profile-lede" key={i}>{t(p)}</p>)}<blockquote className="profile-quote">{t(profileQuote)}</blockquote><a className="profile-cta" href="#profile-detail">{t(profileCta)}</a></div></div></section>
      <section id="rfi" className="rfi-band"><div className="wrap rfi-band-grid"><div className="video-embed"><VideoPlayer id="9LUx1LBOJzA" title={lang === 'it' ? '25 anni di RFI' : '25 years of RFI'}/></div><div><p className="kicker">02 · {lang === 'it' ? '25 ANNI DI RFI' : '25 YEARS OF RFI'}</p><h2>{lang === 'it' ? 'Una storia di persone, infrastrutture e responsabilità.' : 'A story of people, infrastructure and responsibility.'}</h2><p>{lang === 'it' ? 'Nel venticinquesimo anniversario di RFI, questo video è dedicato alle persone che, con competenza, cura e responsabilità, contribuiscono ogni giorno allo sviluppo e al funzionamento della rete ferroviaria italiana.' : 'On the occasion of RFI’s twenty-fifth anniversary, this video is dedicated to the people who, with competence, care and responsibility, contribute every day to the development and operation of the Italian railway network.'}</p></div></div></section>
      <section id="rfi-career" className="editorial dark"><div className="wrap editorial-grid"><div><p className="kicker">02 · {lang === 'it' ? 'PERCORSO IN RFI' : 'CAREER AT RFI'}</p><h2>{lang === 'it' ? 'Un’esperienza progressivamente estesa.' : 'An experience progressively broadened over time.'}</h2></div><div><p className="lead">{lang === 'it' ? 'Dalla pianificazione infrastrutturale e dagli standard tecnici e normativi, alla strategia e valutazione degli investimenti, fino alla gestione operativa, manutenzione e realizzazione delle opere.' : 'From infrastructure planning and technical standards to strategy and investment appraisal, and then to operational management, maintenance and delivery of works.'}</p><p>{lang === 'it' ? 'Dal 2002 il percorso in RFI e nel Gruppo FS ha attraversato Direzione Investimenti, Direzione Tecnica, Direzione Centrale Strategie e Pianificazione e Direzione Operativa Territoriale di Roma, fino all’attuale responsabilità in Stretto di Messina S.p.A.' : 'Since 2002, the career within RFI and the FS Group has spanned Investment, Technical, Central Strategy & Planning and Rome Territorial Operations directorates, leading to the current responsibility at Stretto di Messina S.p.A.'}</p></div></div></section>
      <section id="profile-detail" className="light"><div className="wrap profile-grid"><div className="profile-copy"><h3>{t(profileHeading)}</h3>{profile.map((p,i)=><p key={i}>{t(p)}</p>)}<a className="profile-cta" href="./documents/cv-giorgio-micolitti.pdf" download>{lang === 'it' ? 'Scarica CV ↓' : 'Download CV ↓'}</a><figure className="profile-photo"><img src="./images/varo-ponte-notturno-aereo.jpg" alt={lang === 'it' ? 'Varo notturno di ponte ferroviario, ripresa aerea' : 'Aerial view of a night-time railway bridge launch'}/></figure></div><aside className="profile-aside"><h3>{lang === 'it' ? 'Esperienza professionale' : 'Professional experience'}</h3><ExperienceAccordion items={experience} lang={lang}/><div className="mini-section"><h3>{lang === 'it' ? 'Collaudi Statici e Tecnico-Amministrativi' : 'Structural and Technical-Administrative Testing'}</h3><p>{lang === 'it' ? 'Collaudatore Statico e Tecnico-Amministrativo di numerose opere e interventi infrastrutturali RFI.' : 'Structural and Technical-Administrative Tester for numerous RFI infrastructure works and interventions.'}</p><p>{lang === 'it' ? 'Le attività hanno riguardato, tra gli altri, la sostituzione e realizzazione di travate metalliche e ponti sulle linee Roma–Grosseto e Roma–Formia; sottopassi, rampe, scale e adeguamento dei marciapiedi nella stazione di Aprilia; prolungamento delle pensiline e opere strutturali a Roma Tiburtina; opere civili per l’accessibilità del fascio Air Terminal di Roma Ostiense; rinnovamento di deviatoi sulle linee Roma–Viterbo, Roma–Grosseto e Roma–Formia; interventi di riqualificazione e adeguamento delle stazioni nell’ambito dei programmi Easy e Smart Station.' : 'Activities included, among others, the replacement and construction of steel spans and bridges on the Roma–Grosseto and Roma–Formia lines; underpasses, ramps, stairs and platform upgrades at Aprilia station; canopy extensions and structural works at Roma Tiburtina; civil works for accessibility of the Air Terminal complex at Roma Ostiense; turnout renewals on the Roma–Viterbo, Roma–Grosseto and Roma–Formia lines; and station upgrading and refurbishment works under the Easy and Smart Station programmes.'}</p></div></aside></div></section>
      <section id="expertise" className="light"><div className="wrap section-head"><p className="kicker">03 · {lang === 'it' ? 'AMBITI DI ESPERIENZA' : 'AREAS OF EXPERIENCE'}</p><h2>{lang === 'it' ? 'Ambiti di esperienza' : 'Areas of experience'}</h2></div><div className="wrap two-col-list">{expertise.map((x,i)=><div key={i}><p className="area-title">{t(x.title)}</p><p className="area-detail">{t(x.detail)}</p></div>)}</div></section>
      <section id="areas" className="slate"><div className="wrap section-head"><p className="kicker">04 · {lang === 'it' ? 'AMBITI INFRASTRUTTURALI' : 'INFRASTRUCTURE AREAS'}</p><h2>{lang === 'it' ? 'Principali ambiti infrastrutturali' : 'Main infrastructure areas'}</h2></div><div className="wrap areas-grid">{areas.map((x,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><h3>{t(x.title)}</h3><p>{t(x.detail)}</p></article>)}</div></section>
      <section id="results" className="light"><div className="wrap section-head"><p className="kicker">05 · {lang === 'it' ? 'ESPERIENZE IN NUMERI' : 'EXPERIENCE IN NUMBERS'}</p><h2>{lang === 'it' ? 'Esperienze in numeri' : 'Experience in numbers'}</h2></div><div className="wrap results-grid">{results.map((x,i)=>{const [value,label]=t(x).split(' · ');return <article key={i}><span className="stat-value">{value}</span><span className="stat-label">{label}</span></article>})}</div></section>
      <section id="bridge" className="bridge dark"><div className="wrap bridge-grid"><div><p className="kicker">06 · {lang === 'it' ? 'PONTE SULLO STRETTO' : 'STRAIT OF MESSINA BRIDGE'}</p><h2>{lang === 'it' ? 'Collegamenti ferroviari del Ponte sullo Stretto' : 'Railway connections to the Strait of Messina Bridge'}</h2></div><div><p className="lead">{lang === 'it' ? 'Dal novembre 2023 Giorgio Micolitti è Responsabile Ingegneria Collegamenti Ferroviari di Stretto di Messina S.p.A. e guida la relativa Struttura Organizzativa.' : 'Since November 2023, Giorgio Micolitti has served as Head of Railway Connections Engineering at Stretto di Messina S.p.A., leading the related organisational unit.'}</p><p>{lang === 'it' ? 'La sezione mantiene volutamente separati ruolo professionale e documentazione fotografica: vengono utilizzate soltanto immagini con attribuzione certa.' : 'The section deliberately keeps professional role and photographic documentation distinct: only imagery with certain attribution is used.'}</p></div></div><div className="wrap bridge-videos"><div className="video-embed"><VideoPlayer id="8hU4DBr4O5s" title={lang === 'it' ? 'Ponte sullo Stretto di Messina — Collegamenti Ferroviari' : 'Strait of Messina Bridge — Railway Connections'}/><p className="video-caption">{lang === 'it' ? 'Ponte sullo Stretto di Messina: Collegamenti Ferroviari a terra e effetti sulle preesistenze. Messina, 29 ottobre 2024.' : 'Strait of Messina Bridge: land-side railway connections and effects on existing assets. Messina, 29 October 2024.'}</p></div><div className="video-embed"><VideoPlayer id="iwm4JwfobGA" title={lang === 'it' ? 'Esplorando il Futuro dei Collegamenti Ferroviari al Ponte sullo Stretto' : 'Exploring the Future of Railway Connections to the Strait of Messina Bridge'}/><p className="video-caption">{lang === 'it' ? 'Esplorando il Futuro dei Collegamenti Ferroviari al Ponte sullo Stretto di Messina. Messina, 18 marzo 2024.' : 'Exploring the Future of Railway Connections to the Strait of Messina Bridge. Messina, 18 March 2024.'}</p></div></div></section>
      <section id="diary" className="light">
        <div className="wrap section-head"><p className="kicker">07 · PROJECT DIARY</p><h2>{lang === 'it' ? 'Opere e cantieri per ambito di intervento' : 'Works and construction sites by area of intervention'}</h2></div>
        <div className="wrap diary-filters">
          <button type="button" className={diaryFilter === null ? 'active' : ''} onClick={() => setDiaryFilter(null)}>{lang === 'it' ? 'Tutti' : 'All'}</button>
          {diaryTaxonomy.map((cat, ci) => <button type="button" key={ci} className={diaryFilter === ci ? 'active' : ''} onClick={() => setDiaryFilter(ci)}>{t(cat.title)}</button>)}
          <button type="button" className={diaryFilter === 'queue' ? 'active' : ''} onClick={() => setDiaryFilter('queue')}>{lang === 'it' ? 'In coda' : 'Pending'}</button>
        </div>
        <div className="wrap diary">
          {diaryTaxonomy.map((cat, ci) => (diaryFilter === null || diaryFilter === ci) && <div className="diary-category" key={ci}>
            <h3 className="diary-category-title">{t(cat.title)}</h3>
            {cat.subcategories.map((sub, si) => <div className="diary-subcategory" key={si}>
              <h4>{t(sub.title)}</h4>
              {sub.images.length > 0
                ? <DiaryPhotoGrid images={sub.images} lang={lang} tag={`${t(cat.title)} › ${t(sub.title)}`}/>
                : <p className="diary-empty">{lang === 'it' ? '— nessuna foto assegnata —' : '— no photos assigned yet —'}</p>}
            </div>)}
          </div>)}
          {(diaryFilter === null || diaryFilter === 'queue') && <div className="diary-category diary-queue">
            <h3 className="diary-category-title">{lang === 'it' ? 'In coda — foto da assegnare' : 'Pending — awaiting assignment'}</h3>
            <DiaryPhotoGrid images={diaryQueue} lang={lang}/>
          </div>}
        </div>
      </section>
      <section id="videos" className="dark"><div className="wrap section-head"><p className="kicker">08 · {lang === 'it' ? 'VIDEO & INSIGHTS' : 'VIDEO & INSIGHTS'}</p><h2>{lang === 'it' ? 'Vari, rimozioni e opere civili in sequenza' : 'Launches, removals and civil works in sequence'}</h2></div><div className="wrap video-grid">{videos.map(v=><article className="video-card" key={v.id}><VideoPlayer id={v.id} title={t(v.title)}/><div className="video-caption-head"><span className="video-code">{videoCodes[v.id]}</span><h3>{t(v.title)}</h3></div><p>{t(v.caption)}</p></article>)}</div></section>
      <section id="august-2022" className="editorial slate"><div className="wrap editorial-grid"><div><p className="kicker">09 · {lang === 'it' ? 'AGOSTO 2022' : 'AUGUST 2022'}</p><h2>{lang === 'it' ? 'Il suono di due treni su un’opera appena realizzata' : 'The sound of two trains on a newly completed civil work'}</h2></div><div><p className="lead">{lang === 'it' ? 'Uno dei lavori estivi eseguiti dalla squadra di Ingegneria Civile della DOIT Roma, in finestre operative complesse e programmate nei mesi di minore traffico.' : 'One of the summer works delivered by the DOIT Rome Civil Engineering team within complex possessions planned during lower-traffic periods.'}</p><div className="video-embed"><VideoPlayer id="B2XEBK2oEao" title={lang === 'it' ? 'Agosto 2022' : 'August 2022'}/></div></div></div></section>
      <section id="teaching" className="light"><div className="wrap teaching-grid"><div><p className="kicker">10 · {lang === 'it' ? 'DOCENZA' : 'TEACHING'}</p><h2>Sapienza<br/>{lang === 'it' ? 'Università di Roma' : 'University of Rome'}</h2></div><div><p className="lead">{lang === 'it' ? 'Docente di Tecnica dei Cantieri Infrastrutturali presso il Master Sapienza in Ingegneria delle Infrastrutture e dei Sistemi Ferroviari (IIS), edizioni 2020, 2021 e 2022.' : 'Lecturer in Infrastructure Construction Site Techniques within Sapienza University Master in Infrastructure and Railway Systems Engineering (IIS), editions 2020, 2021 and 2022.'}</p><div className="video-embed"><VideoPlayer id="VoLegEc26A8" title={lang === 'it' ? 'Lezione Master IIS' : 'Master IIS Lecture'}/><p className="video-caption">{lang === 'it' ? 'Lezione Master IIS del 10.06.2022 — Master Università Sapienza di Roma, Ingegneria delle Infrastrutture e dei Sistemi Ferroviari, ed. 2022.' : 'Master IIS lecture, 10 June 2022 — Sapienza University of Rome Master in Infrastructure and Railway Systems Engineering, 2022 edition.'}</p></div></div></div></section>
      <section id="education" className="ivory"><div className="wrap section-head"><p className="kicker">11 · {lang === 'it' ? 'FORMAZIONE' : 'EDUCATION'}</p><h2>{lang === 'it' ? 'Percorso accademico e abilitazione professionale' : 'Academic background and professional licence'}</h2></div><div className="wrap education-list">{education.map((e,i)=><article className="experience-item" key={i}><span>{e.years}</span><h4>{t(e.title)}</h4><strong>{t(e.org)}</strong><p>{t(e.detail)}</p></article>)}</div></section>
      <section id="publications" className="publications ivory"><div className="wrap section-head"><p className="kicker">12 · {lang === 'it' ? 'PUBBLICAZIONI SELEZIONATE' : 'SELECTED PUBLICATIONS'}</p><h2>{lang === 'it' ? 'Ricerca, sicurezza, normativa e geotecnica' : 'Research, safety, regulation and geotechnics'}</h2></div><div id="publications-grid" className="wrap pub-group"><div className="pub-grid">{publications.map((p,i)=><article className="pub-card" key={i}>{p.cover && <img className="pub-cover" src={`./images/${p.cover}`} alt={t(p.title)}/>}<span className="pub-year">{p.group} · {p.year}</span><h3>{t(p.title)}</h3><p className="pub-source">{localizeSource(p.source, lang)}</p>{p.pdf && <PublicationLinks pdf={p.pdf} pdfEn={p.pdfEn} title={t(p.title)} lang={lang}/>}</article>)}</div></div><div className="wrap awards"><h3>{lang === 'it' ? 'Premi e riconoscimenti' : 'Awards and recognition'}</h3>{awards.map(a=><div className="award-row" key={a.year}><div className="award-head"><strong>{a.year}</strong><span>{t(a.text)}</span>{a.photos && <AwardPhotos photos={a.photos} alt={t(a.text)} lang={lang}/>}</div>{a.detail && lang === 'it' && <div className="award-detail">{a.detail.map((p,i)=><p key={i}>{p}</p>)}</div>}</div>)}</div>{documents.length > 0 && <div className="wrap documents">{documents.map((d,i)=><figure key={i}><img src={`./images/${d.image}`} alt={t(d.title)}/><figcaption>{t(d.title)}</figcaption></figure>)}</div>}</section>
      <footer className="dark"><div className="wrap footer-grid"><div><strong>Giorgio Micolitti</strong><p>Civil &amp; Geotechnical Engineering · Railway Infrastructure</p></div><div><a href="mailto:giorgiomicol@gmail.com">giorgiomicol@gmail.com</a><a href="https://www.linkedin.com/in/giorgiomicolitti/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></footer>
    </main>
  </div>
}

export default App
