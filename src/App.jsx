import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, Facebook, Instagram, Linkedin, ArrowRight, CheckCircle, Box, Truck, Clock, Users, Navigation, FileText, Home, Send, Shield, TrendingUp, Heart } from 'lucide-react';

// --- COMPONENTES UTILITARIOS ---

// Botón LED Mejorado
const LedButton = ({ children, onClick, className = "", primary = true, type = "button", disabled = false }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`relative group overflow-hidden p-[1.5px] rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      <div className={`absolute inset-[-1000%] animate-[spin_3s_linear_infinite] ${primary ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#2563EB_50%,#000000_100%)]' : 'bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#ffffff_50%,#000000_100%)]'}`} />
      <span className={`flex items-center justify-center gap-2 h-full w-full cursor-pointer rounded-full px-6 py-3 text-sm font-bold backdrop-blur-3xl transition-colors ${primary ? 'bg-slate-950 text-white group-hover:bg-slate-900' : 'bg-blue-600 text-white group-hover:bg-blue-700'}`}>
        {children}
      </span>
    </button>
  );
};

// Contador Animado
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let startTime;
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Tarjeta de Servicio (Con efecto de brillo único)
const ServiceCard = ({ icon: Icon, title, description, delay }) => (
  <FadeInSection delay={delay} className="h-full">
    <div className="relative h-full group rounded-[24px] p-[1px] overflow-hidden">
        {/* Efecto de brillo que pasa una sola vez */}
        <div className="absolute top-0 left-0 w-full h-full bg-transparent overflow-hidden rounded-[23px] z-10">
             <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent to-white/30 opacity-80 -skew-x-12 transform -translate-x-full animate-[shine-once_2.5s_ease-out] " style={{ animationDelay: `${delay + 200}ms` }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-transparent opacity-70 animate-pulse-slow group-hover:opacity-100 transition-opacity" />
        <div className="relative h-full bg-slate-950/90 backdrop-blur-xl rounded-[23px] p-8 flex flex-col">
            <div className="w-14 h-14 bg-blue-500/20 flex items-center justify-center rounded-2xl mb-6 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Icon className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed flex-grow">{description}</p>
        </div>
    </div>
  </FadeInSection>
);

// Tarjeta "Quiénes Somos" con efecto LED pulsante MÁS NOTABLE
const InfoCard = ({ icon: Icon, title, description }) => (
    <div className="relative group rounded-3xl p-[2px] overflow-hidden h-full transform hover:-translate-y-2 transition-all duration-300">
        {/* Borde LED más visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-400 to-transparent opacity-80 animate-pulse-slow" />
        <div className="relative h-full flex flex-col items-center text-center p-8 bg-white rounded-[22px] shadow-xl">
            <div className="p-4 rounded-full bg-blue-50 mb-6 shadow-inner">
                <Icon className="text-blue-600 w-10 h-10" />
            </div>
            <h4 className="font-bold text-slate-900 mb-4 text-xl">{title}</h4>
            <p className="text-base text-slate-600 flex-grow leading-relaxed">{description}</p>
        </div>
    </div>
);

// Sección con fade-in
const FadeInSection = ({ children, className = "", delay = "0" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => setIsVisible(entry.isIntersecting)), { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if (current) observer.unobserve(current); };
  }, []);
  return (
    <div ref={domRef} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const heroImages = [
    "https://assets.aboutamazon.com/9c/7b/5e02715f4a97b4c27100614cafc2/hero3.jpg",
    "https://zivotdivny.com/wp-content/uploads/2021/09/Amazon_Delivery_Service_Partner-5b842489c9e77c0050f22ab3.jpg",
    "https://www.electrive.com/media/2024/05/volvo-trucks-vnr-electric-e-lkw-electric-truck-amazon-kalifornien-california-usa-2024-01-min-1400x933.jpg.webp"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const slideInterval = setInterval(() => setCurrentHeroSlide(prev => (prev + 1) % heroImages.length), 5000);
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(slideInterval); };
  }, []);

  const handleSubmit = (e) => {
      e.preventDefault(); setIsSubmitting(true);
      setTimeout(() => {
          setIsSubmitting(false); setSubmitSuccess(true);
          setTimeout(() => { setSubmitSuccess(false); setIsApplyModalOpen(false); }, 3500);
      }, 3000);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradient-move { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      .animate-gradient-slow { background-size: 400% 400%; animation: gradient-move 15s ease infinite; }
      @keyframes pulse-slow { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.4; } }
      .animate-pulse-slow { animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      @keyframes slideInBottom { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
      .animate-slide-in-bottom { animation: slideInBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      @keyframes slideInBottomRight { from { opacity: 0; transform: translate(20px, 20px) scale(0.95); } to { opacity: 1; transform: translate(0, 0) scale(1); } }
      .animate-slide-in-br { animation: slideInBottomRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      /* Animación de brillo */
      @keyframes shine-once {
        0% { transform: translateX(-150%); }
        100% { transform: translateX(350%); } /* Asegura que cruce toda la tarjeta */
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-slate-50 overflow-x-hidden selection:bg-blue-500/30">

      {/* HEADER */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex justify-center md:justify-between items-center relative">
          {/* LOGO NUEVO: URL actualizada y efecto de "glow" al pasar el mouse */}
          <img src="/spfblanco.png" alt="SPF Logistics" className="h-10 md:h-12 w-auto transition-all duration-300 cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-white tracking-wider">
            <a href="#home" className="hover:text-blue-400 transition-colors">INICIO</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">NOSOTROS</a>
            <a href="#services" className="hover:text-blue-400 transition-colors">SERVICIOS</a>
            <LedButton onClick={() => setIsApplyModalOpen(true)} primary={false} className="scale-90">POSTULARSE</LedButton>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative h-[100svh] min-h-[600px] flex items-center bg-slate-900">
        {heroImages.map((img, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentHeroSlide ? 'opacity-100' : 'opacity-0'}`}
               style={{ backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 mt-10 md:mt-20">
          <div className="max-w-4xl" data-aos="fade-right">
            <div className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-blue-300 text-sm font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span></span>
              Socio Oficial DSP de Amazon • Wichita, KS
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-8 tracking-tight drop-shadow-2xl">
              ENTREGA EL <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">FUTURO</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-2xl drop-shadow-lg">
              Únete al equipo de logística de élite que impulsa la última milla de Amazon. Flota nueva, tecnología de punta y una cultura que te pone primero.
            </p>
            <div className="flex gap-6">
              <LedButton onClick={() => setIsApplyModalOpen(true)} primary={false}>
                EMPIEZA TU CARRERA <ArrowRight className="ml-2 w-5 h-5" />
              </LedButton>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE (Con Marca de Agua Metatron) */}
      <section id="about" className="py-28 bg-white relative overflow-hidden">
           {/* Marca de Agua Metatron */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
              <img src="https://i.postimg.cc/Y9yW3bQ5/logo1.jpg" alt="" className="w-[600px] h-auto" />
          </div>
          <div className="container mx-auto px-4 relative">
              <FadeInSection className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-blue-600 font-bold tracking-widest uppercase mb-4 block">Quiénes Somos</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">MÁS QUE UN TRABAJO, ES UNA MISIÓN.</h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                      <strong>SPF Logistics</strong> es un socio de servicios de entrega líder que opera desde Wichita, KS. Conectamos a las personas con lo que necesitan, cuando lo necesitan. Nuestra filosofía es simple: cuidamos a nuestros conductores y ellos cuidan a los clientes.
                  </p>
              </FadeInSection>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch z-10 relative">
                  <FadeInSection delay="0">
                      <InfoCard icon={Shield} title="Seguridad Primero" description="Nuestra prioridad absoluta. Vehículos mantenidos y protocolos rigurosos para que llegues a casa seguro cada día." />
                  </FadeInSection>
                   <FadeInSection delay="150">
                      <InfoCard icon={TrendingUp} title="Crecimiento Real" description="Oportunidades claras de ascenso a roles de liderazgo y despacho. Tu carrera avanza con nosotros." />
                  </FadeInSection>
                   <FadeInSection delay="300">
                      <InfoCard icon={Heart} title="Cultura de Respeto" description="Valoramos cada voz. Un ambiente de trabajo positivo donde te sentirás parte de una verdadera familia." />
                  </FadeInSection>
              </div>
          </div>
      </section>

      {/* SERVICES (Sin Marca de Agua, con efecto brillo) */}
      <section id="services" className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#050a1f] to-slate-900 animate-gradient-slow" />
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
                <span className="text-blue-400 font-bold tracking-widest uppercase mb-4 block">Lo Que Hacemos Mejor</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">LOGÍSTICA DE PRECISIÓN</h2>
                <p className="text-slate-400 text-lg">Soluciones de entrega a medida ejecutadas con precisión militar y cuidado humano.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
                <ServiceCard icon={Box} delay="0" title="Paquetería Estándar" description="Entrega eficiente de última milla de paquetes esenciales de Amazon a puertas residenciales con seguimiento en tiempo real." />
                <ServiceCard icon={Clock} delay="150" title="Prime Mismo Día" description="Logística de alta velocidad ejecutando rutas críticas para cumplir con las rigurosas promesas de envío Prime." />
                <ServiceCard icon={Truck} delay="300" title="Carga y Comercial" description="Manejo especializado para carga más grande, entregas comerciales y rutas de alto volumen con nuestra flota extendida." />
            </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-32 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1920')" }} />
        <div className="absolute inset-0 bg-slate-950/75 mix-blend-multiply" /> 
        <div className="container mx-auto px-4 relative z-10 text-center">
            <FadeInSection>
                <h2 className="text-white/80 text-2xl font-bold mb-16 tracking-[0.2em] uppercase">Hitos de Rendimiento</h2>
            </FadeInSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                <FadeInSection delay="0">
                    <div className="text-7xl md:text-8xl font-black text-white mb-4 tabular-nums"><AnimatedCounter end={3} suffix="M+" /></div>
                    <div className="text-blue-400 font-bold uppercase tracking-widest">Paquetes Entregados</div>
                </FadeInSection>
                <FadeInSection delay="150">
                    <div className="text-7xl md:text-8xl font-black text-white mb-4 tabular-nums"><AnimatedCounter end={120} suffix="+" /></div>
                    <div className="text-blue-400 font-bold uppercase tracking-widest">Rutas Diarias</div>
                </FadeInSection>
                 <FadeInSection delay="300">
                    <div className="text-7xl md:text-8xl font-black text-white mb-4 tabular-nums"><AnimatedCounter end={50} suffix="+" /></div>
                    <div className="text-blue-400 font-bold uppercase tracking-widest">Furgonetas Prime</div>
                </FadeInSection>
            </div>
        </div>
      </section>

      {/* JOIN TEAM */}
      <section id="team" className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
             <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 overflow-hidden relative border border-slate-100 shadow-xl">
                 <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <span className="text-blue-600 font-bold tracking-widest uppercase mb-6 block">Carreras en SPF</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">ÚNETE A NUESTRO EQUIPO ÉLITE</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Nosotros proporcionamos la furgoneta, el combustible, el uniforme y la tecnología. Tú pones la conducción. No se necesita licencia comercial para comenzar tu viaje con nosotros.
                        </p>
                        <ul className="space-y-4 mb-10">
                            <li className="flex items-center gap-3 text-slate-800 font-bold"><CheckCircle className="text-blue-500" /> Pago Semanal y Bonos de Rendimiento</li>
                            <li className="flex items-center gap-3 text-slate-800 font-bold"><CheckCircle className="text-blue-500" /> Semanas Laborales Consistentes de 4 Días</li>
                            <li className="flex items-center gap-3 text-slate-800 font-bold"><CheckCircle className="text-blue-500" /> Paquete Completo de Beneficios de Salud</li>
                        </ul>
                         {/* BOTÓN AZUL ACTUALIZADO */}
                         <LedButton onClick={() => setIsApplyModalOpen(true)} primary={false} className="w-full md:w-auto">
                            INICIAR APLICACIÓN AHORA <ArrowRight size={20} className="ml-2" />
                        </LedButton>
                    </div>
                    <div className="lg:w-1/2">
                        <img src="https://zivotdivny.com/wp-content/uploads/2021/09/Amazon_Delivery_Service_Partner-5b842489c9e77c0050f22ab3.jpg" alt="Conductor SPF" className="rounded-3xl shadow-2xl" />
                    </div>
                 </div>
             </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-16 border-t border-slate-900 text-center md:text-left">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 items-center justify-items-center md:justify-items-start mb-12">
                <div className="flex flex-col items-center md:items-start">
                     {/* LOGO NUEVO: URL actualizada y efecto de "glow" al pasar el mouse */}
                     <img src="/spfblanco.png" alt="SPF Logistics" className="h-12 mb-6 opacity-90 transition-all duration-300 cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                     <p className="max-w-xs mx-auto md:mx-0">Entregando excelencia, un paquete a la vez. Orgulloso Socio de Servicios de Entrega de Amazon en Wichita, KS.</p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Enlaces Rápidos</h4>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                        <a href="#home" className="hover:text-blue-400 transition-colors">Inicio</a>
                        <a href="#about" className="hover:text-blue-400 transition-colors">Nosotros</a>
                        <a href="#services" className="hover:text-blue-400 transition-colors">Servicios</a>
                        <a href="#team" className="hover:text-blue-400 transition-colors">Carreras</a>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end w-full">
                    <button onClick={() => setIsMapModalOpen(true)} className="flex items-center gap-2 text-blue-400 font-bold hover:text-white transition-colors mb-6">
                        <MapPin size={18} /> Ver Mapa de Estación de Entrega
                    </button>
                     <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-blue-600"><Facebook size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-pink-600"><Instagram size={20} /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-blue-500"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm border-t border-white/5 pt-8">
                © 2025 SPF Logistics LLC. Todos los derechos reservados. Empleador con Igualdad de Oportunidades.
            </div>
        </div>
      </footer>

      {/* MOBILE APP BAR & MENU */}
      <>
          {isMobileMenuOpen && (
              <div className="fixed inset-0 z-[60] flex items-end justify-end md:hidden">
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]" onClick={() => setIsMobileMenuOpen(false)} />
                  <div className="relative mr-4 mb-24 w-64 bg-slate-900/95 border border-blue-500/30 rounded-3xl p-6 animate-slide-in-br origin-bottom-right backdrop-blur-xl shadow-2xl">
                       <div className="flex flex-col gap-4 text-lg font-bold text-white">
                           <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 hover:text-blue-400 animate-[fadeIn_0.5s_ease-out_75ms_both]"><Home size={20}/> Inicio</a>
                           <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 hover:text-blue-400 animate-[fadeIn_0.5s_ease-out_150ms_both]"><Shield size={20}/> Nosotros</a>
                           <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 hover:text-blue-400 animate-[fadeIn_0.5s_ease-out_225ms_both]"><Truck size={20}/> Servicios</a>
                           <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 hover:text-blue-400 animate-[fadeIn_0.5s_ease-out_300ms_both]"><Users size={20}/> Carreras</a>
                       </div>
                  </div>
              </div>
          )}
          <div className="md:hidden fixed bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-xl p-2 rounded-full flex justify-between items-center border border-white/10 shadow-2xl z-[70] px-6">
            <a href="#home" className="flex flex-col items-center text-slate-400 hover:text-blue-500 transition-colors"><Home size={24} /></a>
            <LedButton onClick={() => setIsApplyModalOpen(true)} primary={false} className="scale-95 mx-2 shadow-lg shadow-blue-900/30">POSTULARSE</LedButton>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`flex flex-col items-center transition-colors ${isMobileMenuOpen ? 'text-blue-500' : 'text-slate-400'}`}>{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
      </>

      {/* MODALS */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            {/* Animación slide-in-bottom y centrado vertical */}
            <div className={`bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden relative shadow-2xl transition-all duration-500 animate-[scaleIn_0.3s_ease-out] ${submitSuccess ? 'scale-95' : 'scale-100'}`}>
                {!isSubmitting && !submitSuccess ? (
                    <div className="flex flex-col h-full max-h-[90vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3"><Truck className="text-blue-600"/> Postulación de Conductor</h3>
                            <button onClick={() => setIsApplyModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"><X size={20}/></button>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm font-bold text-slate-900">Nombre *</label><input type="text" required className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                                    <div><label className="text-sm font-bold text-slate-900">Apellido *</label><input type="text" required className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div><label className="text-sm font-bold text-slate-900">Fecha Nac. *</label><input type="text" placeholder="MM/DD/AAAA" required className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                                     <div><label className="text-sm font-bold text-slate-900">Nacionalidad *</label><input type="text" required placeholder="Escribe aquí..." className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                                </div>
                                <div><label className="text-sm font-bold text-slate-900">Número de Licencia *</label><input type="text" required className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                                <div><label className="text-sm font-bold text-slate-900">SSN (Seguro Social) *</label><input type="password" required className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="XXX-XX-XXXX"/></div>
                                <div className="bg-blue-50/50 p-4 rounded-xl space-y-3 border border-blue-100">
                                    <label className="flex gap-3 cursor-pointer font-medium text-sm text-slate-700"><input type="checkbox" required className="mt-0.5 accent-blue-600" /> Tengo más de 21 años.</label>
                                    <label className="flex gap-3 cursor-pointer font-medium text-sm text-slate-700"><input type="checkbox" required className="mt-0.5 accent-blue-600" /> Acepto verificación de antecedentes.</label>
                                </div>
                                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">ENVIAR <Send size={18}/></button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="h-[500px] flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
                         <div className="relative w-32 h-24 mb-8">
                             {isSubmitting ? (
                                 <div className="absolute inset-0 flex items-center animate-[driveOff_2s_ease-in-out_forwards]">
                                     <Truck className="w-24 h-24 text-blue-600" /><div className="absolute bottom-2 -left-4 flex gap-2"><div className="w-4 h-1 bg-slate-300 rounded-full animate-[wind_1s_linear_infinite]" /><div className="w-6 h-1 bg-slate-300 rounded-full animate-[wind_1s_linear_infinite_0.2s]" /></div>
                                 </div>
                             ) : (
                                 <div className="animate-[scaleIn_0.5s_ease-out]"><CheckCircle className="w-24 h-24 text-green-500" /></div>
                             )}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">{isSubmitting ? 'ENVIANDO...' : '¡SOLICITUD ENVIADA!'}</h3>
                        <p className="text-slate-600">{isSubmitting ? 'Procesando tu información de forma segura.' : 'Nuestro equipo te contactará pronto.'}</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* MODAL DEL MAPA ACTUALIZADO */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIsMapModalOpen(false)}>
             <div className="bg-slate-900 p-2 rounded-[2.5rem] w-full max-w-4xl relative animate-[scaleIn_0.3s_ease-out] border border-white/10 shadow-2xl">
                <button onClick={() => setIsMapModalOpen(false)} className="absolute top-6 right-6 bg-white text-black w-12 h-12 rounded-full z-20 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><X size={24}/></button>
                <div className="relative h-[600px] rounded-[2rem] overflow-hidden">
                     {/* NUEVO SRC DEL MAPA */}
                     <iframe 
                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3154.4284647024!2d-97.23364828857149!3d37.75655051309275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bafde4d851c1ab%3A0xa23849e674b940ba!2s4044%20N%20Toben%20St%2C%20Wichita%2C%20KS%2067226%2C%20EE.%20UU.!5e0!3m2!1ses!2sar!4v1762884031627!5m2!1ses!2sar" 
                         width="100%" 
                         height="100%" 
                         style={{border:0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2) saturate(0.5)'}} 
                         allowFullScreen="" 
                         loading="lazy" 
                         referrerPolicy="no-referrer-when-downgrade">
                     </iframe>
                     <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
                         <div className="pointer-events-auto">
                            {/* NUEVO LINK DE DIRECCIONES */}
                            <LedButton 
                                onClick={() => window.open("https://www.google.com/maps/dir//4044+N+Toben+St,+Wichita,+KS+67226/", "_blank")} 
                                primary={false} 
                                className="scale-110 shadow-2xl shadow-black/50">
                                <Navigation size={20} /> CÓMO LLEGAR
                            </LedButton>
                         </div>
                     </div>
                </div>
             </div>
        </div>
      )}
    </div>
  );
}