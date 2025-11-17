import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, Facebook, Instagram, Linkedin, ArrowRight, CheckCircle, Box, Truck, Clock, Users, Navigation, FileText, Home, Send, Shield, TrendingUp, Heart } from 'lucide-react';

// --- COMPONENTES UTILITARIOS ---

// Lista de Nacionalidades para el campo de selección
const nationalities = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador", 
    "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", 
    "República Dominicana", "Uruguay", "Venezuela", "España", "EE. UU.", "Canadá", "Otro"
];

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

// Tarjeta de Servicio (NUEVO ESTILO, Fondo Claro)
const ServiceCard = ({ icon: Icon, title, description, delay }) => (
  <FadeInSection delay={delay} className="h-full">
    {/* Estilo limpio, fondo blanco, borde azul al pasar el mouse */}
    <div className="relative h-full group bg-white rounded-xl p-6 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-blue-500">
        <div className="flex flex-col">
            <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center rounded-xl mb-4 border border-blue-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <Icon className="w-8 h-8 text-blue-600 transition-colors duration-300 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 leading-relaxed flex-grow">{description}</p>
        </div>
    </div>
  </FadeInSection>
);

// NUEVO COMPONENTE: Tarjeta de Foto de Personal (Anonimizada - Fondo Blanco)
const StaffPhotoCard = ({ imgSrc, description, delay }) => (
  <FadeInSection delay={delay} className="text-center">
    {/* Fondo Blanco aplicado a la tarjeta, con shadow y lift */}
    <div className="bg-white p-2 rounded-2xl shadow-lg h-full transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl">
        <div className="relative group overflow-hidden rounded-xl aspect-[3/4]">
          {/* Borde sutil amarillo Amazon al pasar el mouse */}
          <div className="absolute inset-0 border-4 border-transparent group-hover:border-amber-500 transition-all duration-300 z-10 rounded-xl" />
          <img 
            src={imgSrc} 
            alt="Miembro del equipo de SPF Logistics" 
            className="w-full h-full object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-300"
          />
          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0 rounded-xl" />
        </div>
        {/* Solo la descripción genérica */}
        <p className="text-slate-600 text-sm mt-3 font-semibold">{description}</p>
    </div>
  </FadeInSection>
);


// Tarjeta "Quiénes Somos" (InfoCard reutilizada)
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
  const [birthDate, setBirthDate] = useState(''); // Estado para la fecha de nacimiento

  // ESTRUCTURA ACTUALIZADA: Objeto con URL para escritorio y URL para móvil (conservando tus rutas)
  const heroImages = [
    { 
      desktop: "/banner1.jpg", 
      mobile: "/7banner.jpg" // CAMBIA ESTA RUTA POR TU IMAGEN MÓVIL OPTIMIZADA
    },
    { 
      desktop: "https://www.electrive.com/media/2024/05/volvo-trucks-vnr-electric-e-lkw-electric-truck-amazon-kalifornien-california-usa-2024-01-min-1400x933.jpg.webp", 
      mobile: "/4.jpg" // CAMBIA ESTA RUTA POR TU IMAGEN MÓVIL OPTIMIZADA
    },
    { 
      desktop: "/11especial.jpg", 
      mobile: "/11mobile.jpg" // CAMBIA ESTA RUTA POR TU IMAGEN MÓVIL OPTIMIZADA
    }
  ];

  // Función para formatear la fecha a MM/DD/AAAA
  const formatDate = (value) => {
    const numbers = value.replace(/[^\d]/g, ''); // Solo números
    let formatted = '';

    if (numbers.length > 0) {
      formatted += numbers.substring(0, 2);
    }
    if (numbers.length > 2) {
      formatted += '/' + numbers.substring(2, 4);
    }
    if (numbers.length > 4) {
      formatted += '/' + numbers.substring(4, 8);
    }
    return formatted;
  };

  const handleDateChange = (e) => {
    setBirthDate(formatDate(e.target.value));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const slideInterval = setInterval(() => setCurrentHeroSlide(prev => (prev + 1) % heroImages.length), 5000);
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(slideInterval); };
  }, [heroImages.length]);

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
      
      /* Media Query CSS para cambiar el fondo dinámicamente */
      .hero-slide {
          background-size: cover;
          background-position: center;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Hook para detectar si la pantalla es móvil (menos de 1024px)
  // Utilizamos window.matchMedia dentro de useEffect para asegurar que se ejecute en el cliente.
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false;
  const [isMobileView, setIsMobileView] = useState(isMobile);
  
  useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 1023px)');
      const handleResize = (e) => setIsMobileView(e.matches);
      
      mediaQuery.addEventListener('change', handleResize);
      setIsMobileView(mediaQuery.matches); // Establecer el estado inicial

      return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);
  
  const getBackgroundImageUrl = (imageObject) => {
    // Si la vista es móvil y se ha definido una URL móvil, úsala. De lo contrario, usa la de escritorio.
    // Esto es lo que permite el responsive loading de las imágenes.
    return isMobileView && imageObject.mobile ? imageObject.mobile : imageObject.desktop;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 overflow-x-hidden selection:bg-blue-500/30">

      {/* HEADER */}
      {/* CAMBIO: Se ajusta el fondo y el blur para el efecto de transparencia al hacer scroll en escritorio. */}
      <header className={`absolute md:fixed w-full top-0 z-40 transition-all duration-300 bg-transparent py-6 ${scrolled ? 'md:bg-slate-950/90 md:backdrop-blur-sm md:py-3 md:shadow-lg' : ''}`}>
        <div className="container mx-auto px-4 flex justify-center md:justify-between items-center relative">
          {/* TAMAÑO MÓVIL AUMENTADO */}
          {/* Uso de logo local /spfblanco.png */}
          <img src="/spfblanco.png" alt="SPF Logistics" className="h-12 md:h-14 w-auto transition-all duration-300 cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
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
          // USO DE getBackgroundImageUrl para la URL dinámica
          <div key={index} className={`absolute inset-0 hero-slide transition-opacity duration-[2000ms] ease-in-out ${index === currentHeroSlide ? 'opacity-100' : 'opacity-0'}`}
               style={{ backgroundImage: `url('${getBackgroundImageUrl(img)}')` }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 mt-10 md:mt-20">
          <div className="max-w-4xl" data-aos="fade-right">
            {/* CAMBIO: "Píldora" con acento amarillo de Amazon */}
            <div className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-amber-400/10 backdrop-blur-md border border-amber-400/20 text-amber-300 text-sm font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span></span>
              Socio Oficial DSP
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

      {/* WHO WE ARE (NUEVO LAYOUT: Estilo Carreras con Imagen de Fondo sutil) */}
      <section id="about" className="py-28 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative">
              
              {/* Contenedor principal con fondo oscuro y borde redondeado para dar presencia */}
              <div className="grid lg:grid-cols-5 gap-10 lg:gap-0 items-center bg-slate-900 shadow-2xl rounded-3xl overflow-hidden">
                  
                  {/* Columna Izquierda: Texto (3/5 del ancho) */}
                  <div className="lg:col-span-3 p-8 md:p-12 text-white order-2 lg:order-1"> {/* order-2 en móvil */}
                      <FadeInSection delay="0" className="flex flex-col">
                          <span className="text-blue-400 font-bold tracking-widest uppercase mb-4 block">Quiénes Somos</span>
                          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">LLEVAMOS TUS PAQUETES, IMPULSAMOS TU CARRERA.</h2>
                          <p className="text-lg text-slate-300 leading-relaxed mb-4">
                              <strong>SPF Logistics</strong> es un Socio de Servicios de Entrega (DSP) de Amazon. Operamos con los más altos estándares en Wichita, KS.
                          </p>
                          <p className="text-lg text-slate-400 leading-relaxed">
                              Nuestra misión es la seguridad y la entrega a tiempo. Proveemos rutas estables, flotas nuevas y un equipo de apoyo que te pone primero.
                          </p>
                      </FadeInSection>
                      {/* Detalles de Valor */}
                      <div className="grid grid-cols-2 mt-10 gap-x-8 gap-y-6">
                            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-blue-400" /><span className="font-semibold text-sm text-slate-300">Seguridad Prioritaria</span></div>
                            <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-blue-400" /><span className="font-semibold text-sm text-slate-300">Oportunidad de Crecimiento</span></div>
                            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-blue-400" /><span className="font-semibold text-sm text-slate-300">Rutas Consistentes</span></div>
                      </div>
                  </div>

                  {/* Columna Derecha: Imagen de Fondo sutil y Corte Diagonal */}
                  <div className="lg:col-span-2 relative w-full h-[300px] lg:h-full lg:min-h-full order-1 lg:order-2"> {/* order-1 en móvil */}
                      {/* Imagen de Fondo (textura geométrica) */}
                      {/* Uso de logo local /logo-facebook.jpg */}
                      <div className="absolute inset-0 bg-cover bg-center opacity-[0.15]" style={{ backgroundImage: `url('/logo-facebook.jpg')` }} />
                      {/* Overlay azul oscuro para mantener el estilo de la caja */}
                      <div className="absolute inset-0 bg-slate-900/95" /> 

                      {/* IMPLEMENTACIÓN DE DOBLE IMAGEN CON OCULTACIÓN RESPONSIVE */}
                      
                      {/* Imagen para DESKTOP (Amplia - Se ve bien con el corte diagonal) */}
                      <img 
                          src="/111.jpg" // URL de imagen panorámica para escritorio
                          alt="Camión de logística de SPF Logistics" 
                          className="w-full h-full object-cover transform scale-[1.05] filter brightness-[0.8] relative z-10 hidden lg:block" // Oculta en móvil
                          style={{
                              // Aplica el corte diagonal a la imagen en desktop. 
                              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                          }}
                      />
                       {/* Imagen para MÓVIL (Más cuadrada/Vertical - Se ajusta mejor a h-300px) */}
                      <img 
                          src="/111.jpg" // URL de imagen más vertical para móvil
                          alt="Conductor de Amazon entregando un paquete" 
                          className="w-full h-full object-cover transform scale-[1.05] filter brightness-[0.8] relative z-10 lg:hidden" // Muestra en móvil
                          style={{
                              // Aplica el corte diagonal a la imagen en desktop. 
                              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                          }}
                      />
                      
                      {/* Estilos específicos para el corte diagonal en desktop */}
                      <style jsx="true">{`
                        @media (min-width: 1024px) {
                            #about .lg\\:col-span-2 img {
                                clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
                            }
                        }
                      `}</style>
                  </div>

              </div>
          </div>
      </section>

      {/* SERVICES (NUEVA ESTÉTICA Y SIMPLIFICACIÓN) */}
      <section id="services" className="py-28 bg-gray-50 relative overflow-hidden">
        
        {/* Marcador de Estilo Geométrico/Grid */}
        {/* Uso de logo local /logo-facebook.jpg */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <img src="/logo-facebook.jpg" alt="" className="w-full h-full object-cover opacity-50 filter grayscale contrast-150" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
            {/* Título de Servicios */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <span className="text-blue-600 font-bold tracking-widest uppercase mb-4 block">Lo Que Hacemos Mejor</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">LOGÍSTICA DE PRECISIÓN</h2>
                <p className="text-slate-600 text-lg">Soluciones de entrega a medida ejecutadas con precisión militar y cuidado humano.</p>
            </div>
            
            {/* Grid de Tarjetas de Servicio - Estilo Limpio/Claro */}
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
                <ServiceCard icon={Box} delay="0" title="Paquetería Estándar" description="Entrega eficiente de última milla de paquetes esenciales de Amazon a puertas residenciales con seguimiento en tiempo real." />
                <ServiceCard icon={Clock} delay="150" title="Prime Mismo Día" description="Logística de alta velocidad ejecutando rutas críticas para cumplir con las rigurosas promesas de envío Prime." />
                <ServiceCard icon={Truck} delay="300" title="Carga y Comercial" description="Manejo especializado para carga más grande, entregas comerciales y rutas de alto volumen con nuestra flota extendida." />
            </div>

            {/* --- GALERÍA DE EQUIPO ELIMINADA PARA SIMPLIFICACIÓN --- */}

        </div>
      </section>

      {/* ACHIEVEMENTS - CORREGIDO EL PARALLAX */}
      <section className="py-32 relative overflow-hidden flex items-center">
        {/* CORRECCIÓN: Quitamos la limitación de altura del contenedor principal y el background lo dejamos en el div absoluto. */}
        <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1920')" }} />
        <div className="absolute inset-0 bg-slate-950/75 mix-blend-multiply" /> 
        
        {/* Añadimos un min-h para forzar la altura mínima del contenido y evitar el "corte gris" en scroll. */}
        <div className="container mx-auto px-4 relative z-10 text-center min-h-[400px] flex flex-col justify-center">
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

      {/* JOIN TEAM (CARRERAS EN SPF) - IMAGEN MÓVIL AJUSTADA A h-64 */}
      <section id="team" className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
                 <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        {/* 1. Título y Subtítulo */}
                        <FadeInSection delay="0">
                            <span className="text-blue-600 font-bold tracking-widest uppercase mb-6 block">Carreras en SPF</span>
                        </FadeInSection>
                        <FadeInSection delay="100">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">ÚNETE A NUESTRO EQUIPO ÉLITE</h2>
                        </FadeInSection>
                        
                        {/* 2. Párrafo Descriptivo */}
                        <FadeInSection delay="200">
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Nosotros proporcionamos la furgoneta, el combustible, el uniforme y la tecnología. Tú pones la conducción. No se necesita licencia comercial para comenzar tu viaje con nosotros.
                            </p>
                        </FadeInSection>
                        
                        {/* 3. Lista de Beneficios (escalonada) */}
                        <ul className="space-y-4 mb-10">
                            <FadeInSection delay="300">
                                {/* CAMBIO: Iconos de Check en amarillo Amazon */}
                                <li className="flex items-center gap-3 text-slate-800 font-bold"><CheckCircle className="text-amber-500" /> Pago Semanal y Bonos de Rendimiento</li>
                            </FadeInSection>
                            <FadeInSection delay="400">
                                <li className="flex items-center gap-3 text-slate-800 font-bold"><CheckCircle className="text-amber-500" /> Semanas Laborales Consistentes de 4 Días</li>
                            </FadeInSection>
                            <FadeInSection delay="500">
                                <li className="flex items-center gap-3 text-slate-800 font-bold"><CheckCircle className="text-amber-500" /> Paquete Completo de Beneficios de Salud</li>
                            </FadeInSection>
                        </ul>
                         
                         {/* 4. Botón CTA */}
                         <FadeInSection delay="600">
                             <LedButton onClick={() => setIsApplyModalOpen(true)} primary={false} className="w-full md:w-auto">
                                INICIAR APLICACIÓN AHORA <ArrowRight size={20} className="ml-2" />
                            </LedButton>
                         </FadeInSection>
                    </div>
                    
                    {/* Imagen de Carreras (Columna Derecha) */}
                    <div className="lg:w-1/2">
                        <FadeInSection delay="700">
                            {/* IMAGEN MÓVIL (h-full ajustado para el aspecto horizontal que quieres) */}
                            <img 
                                src="/6.jpg" 
                                alt="Conductor SPF" 
                                className="rounded-3xl shadow-2xl lg:hidden h-full w-full object-cover" 
                            />
                        </FadeInSection>
                        <FadeInSection delay="700">
                            <img 
                                src="/chofer.jpg" 
                                alt="Conductor SPF" 
                                className="hidden lg:block rounded-3xl shadow-2xl object-cover h-[500px] w-full" 
                            />
                        </FadeInSection>
                    </div>
                 </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-16 border-t border-slate-900 text-center md:text-left">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12 items-center justify-items-center md:justify-items-start mb-12">
                <div className="flex flex-col items-center md:items-start">
                     {/* Uso de logo local /spfblanco.png */}
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
                        <MapPin size={18} /> Ver Estación de Entrega
                    </button>
                     <div className="flex gap-6">
                        <a href="https://www.facebook.com/SPFLogistics" className="text-slate-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-blue-600"><Facebook size={20} /></a>
                        <a href="https://www.instagram.com/spflogistics.llc/" className="text-slate-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-pink-600"><Instagram size={20} /></a>
                        <a href="https://www.indeed.com/cmp/Spf-Logistics-LLC?campaignid=mobvjcmp&from=mobviewjob&tk=1j9qpaqiogc7280b&fromjk=2cfa46cd012f84c2" className="text-slate-400 hover:text-white transition-colors p-3 bg-white/5 rounded-full hover:bg-blue-500"><Linkedin size={20} /></a>
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
                                     <div>
                                        <label className="text-sm font-bold text-slate-900">Fecha Nac. (MM/DD/AAAA) *</label>
                                        <input 
                                            type="text" 
                                            placeholder="MM/DD/AAAA" 
                                            required 
                                            maxLength="10" 
                                            value={birthDate}
                                            onChange={handleDateChange} // Función de formato automático
                                            className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500" 
                                        />
                                     </div>
                                     <div>
                                        <label className="text-sm font-bold text-slate-900">Nacionalidad *</label>
                                        {/* Campo de selección para garantizar datos limpios */}
                                        <select required className="w-full p-3 mt-1 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none">
                                            <option value="">Selecciona tu Nacionalidad</option>
                                            {nationalities.map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                     </div>
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
                        <h3 className="3xl font-black text-slate-900 mb-4">{isSubmitting ? 'ENVIANDO...' : '¡SOLICITUD ENVIADA!'}</h3>
                        <p className="text-slate-600">{isSubmitting ? 'Procesando tu información de forma segura.' : 'Nuestro equipo te contactará pronto.'}</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* MODAL MAPA SIMPLIFICADO: Ahora solo muestra la imagen como vista previa y un botón grande para ir a Google Maps. */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIsMapModalOpen(false)}>
             <div className="bg-slate-900 p-2 rounded-[2.5rem] w-full max-w-4xl relative animate-[scaleIn_0.3s_ease-out] border border-white/10 shadow-2xl">
                <button onClick={() => setIsMapModalOpen(false)} className="absolute top-6 right-6 bg-white text-black w-12 h-12 rounded-full z-20 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><X size={24}/></button>
                
                {/* Contenedor de la imagen y el título */}
                <div className="p-4">
                    <h3 className="text-2xl font-black text-white mb-4 text-center">Estación de Entrega</h3>
                    <p className="text-slate-400 text-center mb-6">4044 N Toben St, Wichita, KS 67226</p>
                    
                    {/* Contenedor de Imagen (Vista Previa) */}
                    <div className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-blue-500/50">
                        {/* IMAGEN DE ESCRITORIO (Mayor altura) */}
                        <img 
                             src="/map.png" // Ruta de imagen cambiada a /map.png
                             alt="Vista exterior de la Estación de Entrega" 
                             className="hidden lg:block w-full h-[400px] object-cover" // h-[400px] para escritorio
                        />
                        {/* IMAGEN DE MÓVIL (Menor altura, para evitar que sea exagerada) */}
                        <img 
                             src="/map.png" // Ruta de imagen cambiada a /map.png
                             alt="Vista exterior de la Estación de Entrega" 
                             className="lg:hidden w-full h-[220px] object-cover" // h-[220px] para móvil (más compacto)
                        />

                        {/* Botón en la parte inferior de la imagen */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                            <LedButton 
                                primary={false} 
                                className="scale-100 shadow-2xl shadow-black/50"
                                onClick={() => window.open("https://www.google.com/maps/dir//4044+N+Toben+St,+Wichita,+KS+67226/", "_blank")}>
                                <Navigation size={20} /> VER EN GOOGLE MAPS
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