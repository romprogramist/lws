import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ArrowRight, Play, CheckCircle, Globe, Users, Star, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTypewriter } from '@/hooks/useTypewriter';
import { CaseCard, DesktopCaseCard } from "@/components/CaseCard";
import InputMask from "react-input-mask";
import aaabez from "@/assets/aaabez.png";
import avtoshkolaFresh from "@/assets/avtoshkola-fresh.png";
import prioritetOnline from "@/assets/prioritet-online.png";
import headstonestore from "@/assets/headstonestore.png";
import udvorik from "@/assets/udvorik.png";
import logo from "@/assets/logo.svg";
import { CalculatorWizard } from "@/components/calculator/CalculatorWizard";
import { HeroContactModal } from "@/components/HeroContactModal";
import { useContactModal } from "@/hooks/useContactModal";
import { useCalculatorModal } from "@/hooks/useCalculatorModal";
import { CalculatorContactForm } from "@/components/calculator/CalculatorContactForm";
import { Toaster } from "@/components/ui/toaster";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { openModal } = useContactModal();
  const { isOpen: isCalculatorOpen, closeModal: closeCalculatorModal } = useCalculatorModal();
  const [language, setLanguage] = useState<'en' | 'ru'>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as 'en' | 'ru') || 'ru';
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counts, setCounts] = useState({ years: 0, projects: 0, nps: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    brief: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');

  const heroRef = useRef<HTMLElement>(null);
  const highlightsRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  // Typewriter effect for h1
  useTypewriter({
    ref: h1Ref,
    speed: 100,
    startDelay: 500,
    showCaret: false
  });

  const texts = {
    en: {
      hero: {
        title: "Launch your project in days, not months.",
        subtitle: "Expert development team delivering web apps, mobile solutions, and digital experiences for enterprise clients worldwide.",
        cta: "Start your project"
      },
      services: {
        title: "Our Services",
        items: [
          { title: "Web Development", desc: "Modern web applications with cutting-edge technologies" },
          { title: "Mobile Apps", desc: "Native and cross-platform mobile solutions" },
          { title: "Chatbots", desc: "AI-powered conversational interfaces" },
          { title: "Performance Marketing", desc: "Data-driven marketing strategies that convert" },
          { title: "UX/UI Design", desc: "User-centered design for digital products" },
          { title: "Custom Solutions", desc: "Tailored software for unique business needs" }
        ]
      },
      highlights: {
        years: "10+ years experience",
        projects: "120+ projects",
        nps: "96 NPS"
      },
      caseStudies: {
        title: "Case Studies",
        cases: [
          "AAABEZ Driving School - online learning platform with booking system and progress tracking", 
          "Fresh Driving School - modern website with CRM integration and online enrollment",
          "Prioritet Online - video surveillance system with web management panel",
          "HeadstoneStore - memorial stone e-commerce with 3D configurator", 
          "Yuzhny Dvorik Restaurant - website with online table reservation system"
        ]
      },
      process: {
        title: "Our Process",
        steps: [
          { title: "Discovery", desc: "Understanding your business goals and requirements" },
          { title: "Strategy", desc: "Creating a roadmap for success" },
          { title: "Development", desc: "Building with best practices and quality" },
          { title: "Launch", desc: "Seamless deployment and go-live" },
          { title: "Support", desc: "Ongoing maintenance and optimization" }
        ]
      },
      form: {
        title: "Get a quote",
        subtitle: "Tell us about your project and get a detailed proposal within 24 hours.",
        name: "Full Name",
        phone: "Phone Number",
        company: "Company",
        brief: "Project Brief",
        cta: "Get a quote"
      },
      calculator: {
        title: "Cost Calculator",
        subtitle: "Get an estimated cost for your project",
        projectType: "Project Type",
        complexity: "Complexity",
        timeline: "Timeline",
        features: "Additional Features",
        calculate: "Calculate Cost",
        result: "Estimated project cost:",
        rubles: "₽",
        projectTypes: {
          website: "Website",
          webapp: "Web Application",
          mobileapp: "Mobile App",
          chatbot: "Chatbot",
          ecommerce: "E-commerce"
        },
        complexities: {
          simple: "Simple",
          medium: "Medium",
          complex: "Complex"
        },
        timelines: {
          urgent: "Urgent (up to 1 month)",
          normal: "Normal (1-3 months)",
          flexible: "Flexible (3+ months)"
        },
        featuresList: [
          "Admin Panel",
          "CRM Integration",
          "Payment System",
          "Push Notifications",
          "Analytics & Reports",
          "Multi-language"
        ]
      },
      footer: {
        navigation: "Navigation",
        contact: "Contact",
        privacy: "Privacy Policy"
      }
    },
    ru: {
      hero: {
        title: "Запускаем проект за дни, а не месяцы.",
        subtitle: "Команда экспертов создает веб-приложения, мобильные решения и цифровые продукты для корпоративных клиентов по всему миру.",
        cta: "Начать проект"
      },
      services: {
        title: "Наши услуги",
        items: [
          { title: "Веб-разработка", desc: "Современные веб-приложения с передовыми технологиями" },
          { title: "Мобильные приложения", desc: "Нативные и кроссплатформенные решения" },
          { title: "Чат-боты", desc: "ИИ-интерфейсы для автоматизации общения" },
          { title: "Эффективный маркетинг", desc: "Стратегии на основе данных с высокой конверсией" },
          { title: "UX/UI дизайн", desc: "Пользовательский дизайн для цифровых продуктов" },
          { title: "Индивидуальные решения", desc: "Программное обеспечение под уникальные бизнес-задачи" }
        ]
      },
      highlights: {
        years: "10+ лет опыта",
        projects: "120+ проектов",
        nps: "96 NPS"
      },
      caseStudies: {
        title: "Кейсы",
        cases: [
          "ААА-Безопасность — инженерно-производственная компания: проектирование и монтаж видеонаблюдения, СКУД и взрывозащищённого оборудования для промышленных объектов.",
          "Fresh — автошкола: очная и онлайн-теория, практика на современных авто.",
          "Приоритет — сеть автошкол: онлайн-теория, тренажёры и полное сопровождение сдачи экзаменов.",
          "Headstone Store — производство и продажа памятников: индивидуальный дизайн, гранит/мрамор, гравировка, доставка и установка.",
          "Южный Дворик — загородный комплекс: отель, ресторан, сауны и банкетные залы для отдыха и мероприятий."
        ]
      },
      process: {
        title: "Наш процесс",
        steps: [
          { title: "Исследование", desc: "Изучаем бизнес-цели и требования" },
          { title: "Стратегия", desc: "Создаем план достижения успеха" },
          { title: "Разработка", desc: "Строим с соблюдением лучших практик" },
          { title: "Запуск", desc: "Бесшовное развертывание и запуск" },
          { title: "Поддержка", desc: "Постоянное обслуживание и оптимизация" }
        ]
      },
      form: {
        title: "Получить расчёт",
        subtitle: "Расскажите о вашем проекте и получите детальное предложение в течение 24 часов.",
        name: "Полное имя",
        phone: "Номер телефона",
        company: "Компания",
        brief: "Описание проекта",
        cta: "Получить расчёт"
      },
      calculator: {
        title: "Калькулятор стоимости",
        subtitle: "Получите примерную стоимость вашего проекта",
        projectType: "Тип проекта",
        complexity: "Сложность",
        timeline: "Сроки",
        features: "Дополнительные функции",
        calculate: "Рассчитать стоимость",
        result: "Примерная стоимость проекта:",
        rubles: "₽",
        projectTypes: {
          website: "Веб-сайт",
          webapp: "Веб-приложение", 
          mobileapp: "Мобильное приложение",
          chatbot: "Чат-бот",
          ecommerce: "Интернет-магазин"
        },
        complexities: {
          simple: "Простой",
          medium: "Средний",
          complex: "Сложный"
        },
        timelines: {
          urgent: "Срочно (до 1 месяца)",
          normal: "Обычно (1-3 месяца)",
          flexible: "Гибко (3+ месяца)"
        },
        featuresList: [
          "Админ-панель",
          "Интеграция с CRM",
          "Платежная система",
          "Push-уведомления",
          "Аналитика и отчеты",
          "Многоязычность"
        ]
      },
      footer: {
        navigation: "Навигация",
        contact: "Контакты",
        privacy: "Политика конфиденциальности"
      }
    }
  };

  const t = texts[language];


  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Count-up animation for highlights
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            
            // Animate years count
            let yearsCount = 0;
            const yearsTimer = setInterval(() => {
              if (yearsCount < 10) {
                yearsCount++;
                setCounts(prev => ({ ...prev, years: yearsCount }));
              } else {
                clearInterval(yearsTimer);
              }
            }, 100);

            // Animate projects count
            let projectsCount = 0;
            const projectsTimer = setInterval(() => {
              if (projectsCount < 120) {
                projectsCount += 5;
                setCounts(prev => ({ ...prev, projects: Math.min(projectsCount, 120) }));
              } else {
                clearInterval(projectsTimer);
              }
            }, 50);

            // Animate NPS count
            let npsCount = 0;
            const npsTimer = setInterval(() => {
              if (npsCount < 96) {
                npsCount += 3;
                setCounts(prev => ({ ...prev, nps: Math.min(npsCount, 96) }));
              } else {
                clearInterval(npsTimer);
              }
            }, 80);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (highlightsRef.current) {
      observer.observe(highlightsRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const scrollToNext = () => {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save language preference
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Handle scroll for logo size animation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consentChecked) {
      setConsentError('consent');
      return;
    }
    
    setConsentError('');
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'contact',
          name: formData.name,
          phone: formData.phone,
          company: formData.company,
          description: formData.brief,
          consent: true
        }
      });

      if (error) throw error;
      
      // Отправляем цель в Яндекс.Метрику
      if (typeof window !== 'undefined' && window.ym) {
        window.ym(103775554, 'reachGoal', 'message_sent_successfully');
      }
      
      toast.success(
        language === 'en' 
          ? 'Thank you! We\'ll get back to you within 24 hours.' 
          : 'Спасибо! Мы свяжемся с вами в течение 24 часов.'
      );
      
      setFormData({ name: '', phone: '', company: '', brief: '' });
      setConsentChecked(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(
        language === 'en' 
          ? 'Error sending message. Please try again.' 
          : 'Ошибка отправки сообщения. Попробуйте снова.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-16' : 'h-24'
          }`}>
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Lean Web Studio" 
                className={`w-auto transition-all duration-300 ease-in-out ${
                  isScrolled ? 'h-8' : 'h-16'
                }`}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm hover:text-primary transition-colors">{t.services.title}</a>
              <a href="#case-studies" className="text-sm hover:text-primary transition-colors">{t.caseStudies.title}</a>
              <a href="#process" className="text-sm hover:text-primary transition-colors">{t.process.title}</a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors">{language === 'en' ? 'Contact' : 'Контакты'}</a>
            </div>

            {/* Language Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex bg-card rounded-full p-1 shadow-card">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    language === 'en' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    language === 'ru' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  RU
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background">
              <div className="py-4 space-y-4">
                <a href="#services" className="block px-4 py-2 text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.services.title}</a>
                <a href="#case-studies" className="block px-4 py-2 text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.caseStudies.title}</a>
                <a href="#process" className="block px-4 py-2 text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{t.process.title}</a>
                <a href="#contact" className="block px-4 py-2 text-sm hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>{language === 'en' ? 'Contact' : 'Контакты'}</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-subtle"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center flex-1 flex flex-col justify-center">
          <h1 ref={h1Ref} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div>
            <Button 
              variant="brand" 
              size="xl" 
              className="mb-12"
              onClick={openModal}
            >
              {t.hero.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="flex justify-center pb-8">
          <button
            onClick={scrollToNext}
            className="animate-bounce"
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal">
            {t.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.services.items.map((service, index) => (
              <Card key={index} className="service-card p-6 reveal" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Calculator Section */}
      <CalculatorWizard language={language} />

      {/* Highlights Section */}
      <section ref={highlightsRef} className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="reveal">
              <div className="text-4xl md:text-5xl font-bold count-up">{counts.years}+</div>
              <p className="text-muted-foreground mt-2">{language === 'en' ? 'years experience' : 'лет опыта'}</p>
            </div>
            <div className="reveal">
              <div className="text-4xl md:text-5xl font-bold count-up">{counts.projects}+</div>
              <p className="text-muted-foreground mt-2">{language === 'en' ? 'projects' : 'проектов'}</p>
            </div>
            <div className="reveal">
              <div className="text-4xl md:text-5xl font-bold count-up">{counts.nps}</div>
              <p className="text-muted-foreground mt-2">NPS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 px-4">
        <div className="max-w-6xl mx-auto w-full min-w-0">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal">
            {t.caseStudies.title}
          </h2>
          <div className="relative">
            {/* Mobile: Stack cards vertically */}
            <div className="md:hidden space-y-6">
              {[aaabez, avtoshkolaFresh, prioritetOnline, headstonestore, udvorik].map((image, index) => (
                <CaseCard
                  key={index}
                  image={image}
                  alt={`Case study ${index + 1}`}
                  description={t.caseStudies.cases[index]}
                />
              ))}
            </div>

            {/* Desktop: Horizontal carousel */}
            <div className="hidden md:block">
              <div className="relative w-full overflow-hidden min-w-0">
                <div 
                  className="flex transition-transform duration-500 ease-in-out min-w-0"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {[aaabez, avtoshkolaFresh, prioritetOnline, headstonestore, udvorik].map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4 min-w-0">
                      <DesktopCaseCard
                        image={image}
                        alt={`Case study ${index + 1}`}
                        description={t.caseStudies.cases[index]}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slide controls */}
              <div className="flex justify-center mt-8 gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentSlide(Math.min(4, currentSlide + 1))}
                  disabled={currentSlide === 4}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section id="process" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal">
            {t.process.title}
          </h2>
          
          {/* Mobile: Simple stacked cards */}
          <div className="md:hidden space-y-6">
            {t.process.steps.map((step, index) => (
              <Card key={index} className="p-6 shadow-card reveal">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </Card>
            ))}
          </div>

          {/* Desktop: Timeline */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
            <div className="space-y-12">
              {t.process.steps.map((step, index) => (
                <div key={index} className={`flex items-center reveal ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="p-6 shadow-card">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Lead Form Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.form.title}</h2>
            <p className="text-lg text-muted-foreground">{t.form.subtitle}</p>
          </div>
          
          <Card className="p-8 shadow-card reveal">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.name}</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t.form.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.phone}</label>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    maskChar="_"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    children={(inputProps: any) => (
                      <Input
                        {...inputProps}
                        type="tel"
                        required
                        placeholder={t.form.phone}
                      />
                    )}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.form.company}</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder={t.form.company}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t.form.brief}</label>
                <Textarea
                  rows={4}
                  value={formData.brief}
                  onChange={(e) => setFormData(prev => ({ ...prev, brief: e.target.value }))}
                  placeholder={t.form.brief}
                />
              </div>
              
              <ConsentCheckbox
                isChecked={consentChecked}
                onChange={(checked) => {
                  setConsentChecked(checked);
                  if (checked) setConsentError('');
                }}
                language={language}
                error={consentError}
              />
              
              <Button 
                type="submit" 
                variant="brand" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting || !consentChecked}
              >
                {isSubmitting ? (language === 'en' ? 'Sending...' : 'Отправка...') : t.form.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-4">{t.footer.navigation}</h3>
              <div className="space-y-2">
                <a href="#services" className="block hover:text-primary transition-colors">
                  {t.services.title}
                </a>
                <a href="#process" className="block hover:text-primary transition-colors">
                  {t.process.title}
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t.footer.contact}</h3>
              <div className="space-y-2">
                <p>leanwebstudio@yandex.ru</p>
                <p>+7 (936) 500-13-33</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t.footer.privacy}</h3>
              <div className="space-y-2">
                <a href="/privacy-policy" className="block hover:text-primary transition-colors">
                  {t.footer.privacy}
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center">
            <p className="text-background/60">
              {/*© 2024 Corporate Development Agency. All rights reserved.*/}
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <HeroContactModal language={language} />
      
      {/* Calculator Contact Modal */}
      <CalculatorContactForm 
        isOpen={isCalculatorOpen} 
        onClose={closeCalculatorModal} 
        calculatorData={{
          projectType: '',
          complexity: '',
          timeline: '',
          features: []
        }}
        estimatedPrice={{ min: 0, max: 0 }}
        language={language}
      />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Index;