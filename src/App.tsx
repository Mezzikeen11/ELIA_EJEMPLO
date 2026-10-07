import { useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, ArrowRight, ArrowUpRight, Building2, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, Cross, LayoutDashboard, Menu, Package, Search, ShieldCheck, SlidersHorizontal, Truck, UsersRound, X, TriangleAlert, type LucideIcon } from 'lucide-react';
import { operations, operatorStats, toneFor, exceptionToneFor, type Operation } from './data';

const navigation: { path: string; label: string; icon: LucideIcon }[] = [
  { path: '/', label: 'Torre de control', icon: LayoutDashboard },
  { path: '/operaciones', label: 'Operaciones', icon: Truck },
  { path: '/incidencias', label: 'Incidencias', icon: TriangleAlert },
  { path: '/operadores', label: 'Operadores', icon: UsersRound },
];

function Badge({ operation }: { operation: Operation }) {
  return <span className={`badge ${toneFor(operation.status)}`}><span className="status-dot" />{operation.status}</span>;
}

function OperationDrawer({ operation, onClose }: { operation: Operation | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (operation) { ref.current?.showModal(); document.body.style.overflow = 'hidden'; }
    else { ref.current?.close(); document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [operation]);
  return <dialog ref={ref} className="drawer" onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }} aria-labelledby="drawer-title">
    {operation && <div className="drawer-content">
      <div className="drawer-top"><span className="eyebrow">RESUMEN DE OPERACIÓN</span><button className="icon-button" onClick={onClose} aria-label="Cerrar resumen" autoFocus><X size={20} /></button></div>
      <h2 id="drawer-title">{operation.folio}</h2><div className="drawer-sub"><span>{operation.operator}</span><Badge operation={operation} /></div>
      <div className={`exception-box ${exceptionToneFor(operation.exceptionType)}`}><TriangleAlert size={20} /><div><strong>{operation.exception}</strong><p>Esta operación requiere seguimiento del equipo de supervisión.</p></div></div>
      <section className="drawer-section"><h3>Ruta de distribución</h3><div className="route-point"><span className="route-dot" /><div><small>Origen</small><strong>{operation.origin}</strong><p>Zona metropolitana · Centro de distribución</p></div></div><div className="route-point destination"><span className="route-dot" /><div><small>Destino</small><strong>{operation.destination}</strong><p>{operation.location}</p></div></div></section>
      <section className="drawer-section"><h3>Información del envío</h3><dl className="detail-grid"><div><dt>Entrega programada</dt><dd>07 oct 2026 · {operation.time}</dd></div><div><dt>Unidades programadas</dt><dd>{operation.units.toLocaleString('es-MX')}</dd></div><div><dt>Medicamento</dt><dd>{operation.medicine}</dd></div><div><dt>Responsable del operador</dt><dd>{operation.contact}</dd></div></dl></section>
      <section className="drawer-section"><h3>Seguimiento</h3><ol className="tracking">{['Preparación en almacén', 'Salida confirmada', 'En tránsito', 'Recepción en destino'].map((step, i) => <li key={step} className={i <= operation.progress ? 'done' : ''}><span>{i < operation.progress ? <Check size={13} /> : <span className="tiny-dot" />}</span><div><strong>{step}</strong><small>{i < operation.progress ? 'Confirmado' : i === operation.progress ? 'Último estado registrado' : 'Pendiente'}</small></div></li>)}</ol></section>
      <div className="drawer-footer"><Clock3 size={14} /> Última actualización: {operation.updated} h</div>
    </div>}
  </dialog>;
}

function LogisticsActivity() {
  const [period, setPeriod] = useState('today');
  const weekly = period === 'week';
  return <section className="panel activity-panel"><div className="panel-heading"><div><h2>Actividad logística</h2><p>Movimiento de operaciones durante la jornada</p></div><select className="small-select" aria-label="Periodo de actividad" value={period} onChange={e => setPeriod(e.target.value)}><option value="today">Hoy</option><option value="week">Esta semana</option></select></div>
    <div className="chart-legend"><span><i className="legend-dot green" />Entregadas <strong>{weekly ? 186 : 28}</strong></span><span><i className="legend-dot pale" />Programadas <strong>{weekly ? 204 : 36}</strong></span></div>
    <div className="chart" role="img" aria-label={weekly ? 'Actividad semanal: 186 entregas de 204 programadas.' : 'Actividad de hoy: 28 entregas de 36 programadas. Mayor movimiento a las 10:00.'}>
      <div className="chart-y"><span>{weekly ? 40 : 12}</span><span>{weekly ? 30 : 9}</span><span>{weekly ? 20 : 6}</span><span>{weekly ? 10 : 3}</span><span>0</span></div>
      <div className="plot"><div className="grid-lines"><i/><i/><i/><i/><i/></div><div className="bar-groups">{(weekly ? [[70,75],[80,85],[85,92.5],[60,67.5],[75,82.5],[45,52.5],[50,55]] : [[8.33,8.33],[16.67,25],[33.33,41.67],[41.67,50],[66.67,75],[41.67,58.33],[25,41.67]]).map(([delivered, scheduled], i) => <div className="bar-column" key={i}><div className="bar-pair"><div className="bar delivered" style={{ height: `${delivered}%` }} /><div className="bar scheduled" style={{ height: `${scheduled}%` }} /></div><span>{(weekly ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['06:00','07:00','08:00','09:00','10:00','11:00','12:00'])[i]}</span></div>)}</div></div>
    </div><div className="panel-note"><span className="status-dot" />{weekly ? '91.2 % de entregas completadas esta semana' : 'La mayor actividad se concentra entre las 10:00 y las 12:00'}</div>
  </section>;
}

function OperatorCompliance() {
  return <section className="panel compliance-panel"><div className="panel-heading"><div><h2>Cumplimiento por operador</h2><p>Entregas a tiempo · últimos 30 días</p></div><ShieldCheck size={20} className="muted" /></div><div className="operator-list">{operatorStats.map((op, i) => <div className="operator-row" key={op.name}><div className="operator-meta"><div className="operator-name"><span className="operator-avatar">{op.name.slice(0,2).toUpperCase()}</span><div><strong>{op.name}</strong><small>{op.deliveries} operaciones</small></div></div><strong className={i === 3 ? 'warning-text' : ''}>{op.percent.toFixed(1)}<span> %</span></strong></div><div className="progress-track"><div style={{ width: `${op.percent}%` }} className={i === 3 ? 'lower' : ''} /></div></div>)}</div><div className="panel-note"><span className="target-line" />Objetivo de cumplimiento <strong>≥ 95 %</strong></div></section>;
}

function ControlTower() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Operation | null>(null);
  const filtered = operations.filter(op => (filter === 'all' || op.status === filter) && `${op.folio} ${op.operator} ${op.origin} ${op.destination} ${op.exception}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  const stats: { value: string; label: string; icon: LucideIcon; hint: string; tone: string; to?: string; linkLabel?: string }[] = [
    { value: '342', label: 'Operaciones activas', icon: Package, hint: 'En la red de distribución', tone: 'neutral' },
    { value: '28', label: 'Entregas hoy', icon: CheckCheck, hint: '+8 respecto a ayer', tone: 'success', to: '/operaciones', linkLabel: 'Ver entregas de hoy' },
    { value: '12', label: 'Retrasadas', icon: Clock3, hint: '3 requieren seguimiento', tone: 'warning', to: '/operaciones', linkLabel: 'Ver operaciones retrasadas' },
    { value: '7', label: 'Con incidencia', icon: TriangleAlert, hint: '2 de prioridad alta', tone: 'danger', to: '/incidencias', linkLabel: 'Ver operaciones con incidencia' },
    { value: '96.4', label: 'A tiempo', icon: ShieldCheck, hint: '+1.2 % este mes', tone: 'success' },
  ];
  return <><div className="page-heading control-heading"><div><h1>Torre de control</h1><p>Supervisión general de la distribución</p></div><div className="heading-date"><span>Miércoles, 7 de octubre de 2026</span><span className="live-label"><span className="status-dot" />Última actualización · 12:00 h</span></div></div>
    <section className="stats-strip" aria-label="Indicadores generales">{stats.map((stat, i) => {
      const content = <><div className="stat-top"><span>{stat.label}</span><stat.icon size={18} strokeWidth={1.7} /></div><div className="stat-value">{stat.value}{i === 4 && <span> %</span>}</div><div className="stat-hint">{stat.tone === 'success' && <ArrowUpRight size={14} />}{stat.hint}</div></>;
      return stat.to
        ? <NavLink to={stat.to} aria-label={stat.linkLabel} className={`stat ${stat.tone} stat-link`} key={stat.label}>{content}</NavLink>
        : <div className={`stat ${stat.tone}`} key={stat.label}>{content}</div>;
    })}</section>
    <section className="panel attention-panel"><div className="attention-heading"><div><div className="section-title"><span className="attention-icon"><Activity size={18} /></span><h2>Operaciones que requieren atención</h2><span className="count-tag">{operations.length}</span></div><p>{operations.length} operaciones presentan excepciones abiertas</p></div><NavLink to="/operaciones" className="table-instruction">Ver todas <ArrowRight size={15}/></NavLink></div>
      <div className="table-toolbar"><label className="search-field"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar folio, operador o destino..." aria-label="Buscar operaciones" />{search && <button aria-label="Limpiar búsqueda" onClick={() => setSearch('')}><X size={15}/></button>}</label><div className="filter-field"><SlidersHorizontal size={16}/><select aria-label="Filtrar por estado" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Todos los estados</option>{['En tránsito','Llegada','Entregado'].map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={14}/></div></div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabla de operaciones que requieren atención"><table><thead><tr>{['Folio', 'Operador', 'Origen', 'Destino', 'Entrega programada', 'Estado', 'Excepción'].map(h => <th key={h}>{h}</th>)}<th className="arrow-cell"><span className="sr-only">Resumen</span></th></tr></thead><tbody>{filtered.map(op => <tr key={op.folio} onClick={() => setSelected(op)}><td><button className="folio-button" onClick={e => { e.stopPropagation(); setSelected(op); }} aria-label={`Ver resumen de ${op.folio}`}>{op.folio}</button><small>Distribución pública</small></td><td><span className="operator-cell"><span className="small-avatar">{op.operator.slice(0,1)}</span>{op.operator}</span></td><td>{op.origin}</td><td><strong className="destination-name">{op.destination}</strong><small>{op.location}</small></td><td><span className="time-cell"><Clock3 size={13}/>{op.time} h</span><small>Hoy, 07 oct</small></td><td><Badge operation={op}/></td><td><span className={`exception-text ${exceptionToneFor(op.exceptionType)}-text`}>{op.exception}</span></td><td className="arrow-cell"><ChevronRight size={16}/></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-results"><Search size={24}/><strong>No encontramos operaciones</strong><p>Prueba con otro término o estado.</p><button className="text-button" onClick={() => { setSearch(''); setFilter('all'); }}>Restablecer filtros</button></div>}</div>
      <div className="table-footer"><span>Mostrando {filtered.length} de {operations.length} operaciones que requieren atención</span></div>
    </section><div className="bottom-grid"><LogisticsActivity/><OperatorCompliance/></div><div className="page-footer"><span><ShieldCheck size={14}/>ELIA · Distribución con trazabilidad</span></div><OperationDrawer operation={selected} onClose={() => setSelected(null)}/></>;
}

function Placeholder({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return <><div className="page-heading"><div><div className="eyebrow">RED DE DISTRIBUCIÓN</div><h1>{title}</h1><p>Un espacio para supervisar cada parte de la operación.</p></div></div><section className="placeholder panel"><span className="placeholder-icon"><Icon size={32}/></span><span className="eyebrow">PRÓXIMAMENTE</span><h2>{title}, en un solo lugar</h2><p>Este módulo forma parte de la siguiente etapa de ELIA. La supervisión general ya está disponible en la Torre de control.</p><NavLink className="primary-button" to="/">Ir a Torre de control <ArrowRight size={16}/></NavLink></section></>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => { setCompact(media.matches); setMenuOpen(false); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);
  const location = useLocation();
  const current = navigation.find(n => n.path === location.pathname);
  useEffect(() => { setMenuOpen(false); document.title = `ELIA · ${current?.label ?? 'Torre de control'}`; }, [location.pathname, current?.label]);
  return <div className="app-shell"><a className="skip-link" href="#main">Saltar al contenido</a>{menuOpen && <button className="sidebar-scrim" aria-label="Cerrar navegación" onClick={() => setMenuOpen(false)}/>}
    <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal" inert={compact && !menuOpen}><NavLink to="/" className="brand" aria-label="ELIA, inicio"><span className="brand-symbol"><Cross size={23} strokeWidth={2.5}/></span><span>elia<span className="brand-period">.</span></span></NavLink><div className="brand-caption">Cada entrega cuenta.</div><div className="workspace"><span className="workspace-icon"><Building2 size={18}/></span><div><strong>Supervisión logística</strong><small>Operación nacional</small></div><ShieldCheck size={15}/></div><span className="nav-heading">SUPERVISIÓN</span><nav>{navigation.map(n => <NavLink key={n.path} to={n.path} end={n.path === '/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><n.icon size={19} strokeWidth={1.7}/><span>{n.label}</span>{n.path === '/incidencias' && <span className="nav-count">7</span>}</NavLink>)}</nav><div className="sidebar-bottom"><button className="help-button" onClick={() => setHelpOpen(!helpOpen)} aria-expanded={helpOpen}><CircleHelp size={18}/><span>Acerca de ELIA</span><ArrowUpRight size={15}/></button>{helpOpen && <p className="help-copy">Torre de control para supervisar la distribución pública de medicamentos y dar seguimiento a operaciones, entregas y excepciones logísticas.</p>}<div className="profile"><span className="profile-avatar">MS</span><div><strong>María Sánchez</strong><small>Supervisora de operaciones</small></div></div></div></aside>
    <div className="main-shell"><header className="topbar"><div className="breadcrumbs"><button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir navegación" aria-expanded={menuOpen}><Menu size={20}/></button><span>Supervisión</span><ChevronRight size={14}/><strong>{current?.label ?? 'Torre de control'}</strong></div><div className="topbar-right"><span className="system-label"><ShieldCheck size={15}/>Red de salud pública</span></div></header><main id="main" tabIndex={-1}><Routes><Route path="/" element={<ControlTower/>}/><Route path="/operaciones" element={<Placeholder title="Operaciones" icon={Truck}/>}/><Route path="/incidencias" element={<Placeholder title="Incidencias" icon={TriangleAlert}/>}/><Route path="/operadores" element={<Placeholder title="Operadores" icon={UsersRound}/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main></div>
  </div>;
}
