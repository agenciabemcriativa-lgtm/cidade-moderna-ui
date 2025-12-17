import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBannerSlides } from "@/hooks/useBannerSlides";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const { data: slides = [] } = useBannerSlides();

  const getTransitionAnimation = (effect: string = "fade") => {
    const animations: Record<string, string> = {
      "fade": "animate-banner-fade",
      "slide-left": "animate-banner-slide-left",
      "slide-right": "animate-banner-slide-right",
      "zoom-in": "animate-banner-zoom-in",
      "zoom-out": "animate-banner-zoom-out",
      "flip": "animate-banner-flip",
    };
    return animations[effect] || animations["fade"];
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const currentDisplayDuration = slides[currentSlide]?.displayDuration || 6;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setAnimationKey((prev) => prev + 1);
    }, currentDisplayDuration * 1000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide, slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAnimationKey((prev) => prev + 1);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAnimationKey((prev) => prev + 1);
  };

  if (slides.length === 0) {
    return (
      <section className="hero-gradient py-16 md:py-24 lg:py-32">
        <div className="container text-center">
          <div className="animate-pulse h-8 bg-primary-foreground/20 rounded w-1/3 mx-auto mb-4" />
          <div className="animate-pulse h-12 bg-primary-foreground/20 rounded w-2/3 mx-auto mb-4" />
          <div className="animate-pulse h-6 bg-primary-foreground/20 rounded w-1/2 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden" style={{ perspective: "1000px" }}>
      {slides.map((slide, index) => (
        <div
          key={`${index}-${index === currentSlide ? animationKey : 'inactive'}`}
          className={`${slide.bgClass || ""} ${
            index === 0 ? "relative" : "absolute inset-0"
          } ${index === currentSlide ? `opacity-100 z-10 ${getTransitionAnimation(slide.transitionEffect)}` : "opacity-0 z-0"}`}
          style={{
            ...(!slide.bgClass && slide.bgColor ? { backgroundColor: slide.bgColor } : {}),
            ...(index === currentSlide ? { animationDuration: `${slide.transitionDuration || 700}ms` } : {}),
          }}
        >
          {/* Background Image Layer */}
          {slide.bgImageUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.bgImageUrl})`,
                backgroundPosition: slide.bgImagePosition || "center",
                opacity: slide.bgImageOpacity ?? 1,
              }}
            />
          )}
          
          <div className="container py-16 md:py-24 lg:py-32 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full blur-2xl" />
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1 bg-highlight text-highlight-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4 animate-fade-in">
                {slide.subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground leading-tight mb-4 animate-slide-in">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
                {slide.description}
              </p>
              {slide.ctaLink && slide.ctaLink !== "#" ? (
                <a href={slide.ctaLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" className="animate-scale-in" style={{ animationDelay: "400ms" }}>
                    {slide.cta}
                  </Button>
                </a>
              ) : (
                <Button variant="hero" className="animate-scale-in" style={{ animationDelay: "400ms" }}>
                  {slide.cta}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 hover:bg-highlight text-primary-foreground hover:text-highlight-foreground flex items-center justify-center transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setAnimationKey((prev) => prev + 1);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-highlight w-8" : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-primary-foreground/20 hover:bg-highlight text-primary-foreground hover:text-highlight-foreground flex items-center justify-center transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
