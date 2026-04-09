import React from "react";
import { ArrowRight, FileText, Calendar, Clock } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const NOTES_DATA = [
  {
    title: "Hyderabad Innovation Ecosystem: A Narrative Review",
    date: "November 2025",
    readTime: "12 min read",
    description: "A comprehensive look at the infrastructure, capital flow, and strategic advantages of the Hyderabad startup ecosystem — exploring how it competes with Bangalore and NCR.",
    link: "https://drive.google.com/file/d/1okxpWJyjW_KNcMXPUA3KV8XLeGigizgW/view?usp=sharing",
    tags: ["Ecosystem Analysis", "Infrastructure", "Market Insight"]
  },
  {
    title: "Mokobara: Deciphering the D2C Experience",
    date: "May 2025",
    readTime: "8 min read",
    description: "An in-depth teardown of Mokobara's brand positioning, product innovation, and customer experience strategy in the premium luggage market.",
    link: "https://drive.google.com/file/u/3/d/1ewATEJlMcqB8jO-aYDg7OurUbH9_UHbF/view?usp=sharing",
    tags: ["D2C", "Brand Strategy", "Case Study"]
  }
];

const Notes = () => {
  const [revealRef, isVisible] = useScrollReveal();

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="max-w-3xl mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6 fade-up">
          Notes & <span className="text-muted-foreground italic">Reports</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed fade-up-d1">
          Writing is a byproduct of research. Here are my deep-dives into ecosystem builders, 
          brand strategy, and emerging technologies.
        </p>
      </header>

      <div ref={revealRef} className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isVisible ? "is-visible" : ""}`}>
        {NOTES_DATA.map((note, idx) => (
          <a
            key={idx}
            href={note.link}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group flex flex-col justify-between p-8 border border-border hover:border-primary transition-all duration-300 bg-card hover:bg-accent/30"
            style={{ 
              transitionDelay: `${idx * 0.15}s`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {note.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {note.readTime}
                </div>
              </div>
              
              <h2 className="text-2xl font-light mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {note.title}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                {note.description}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 border border-border rounded-full text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-2 border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-background transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Placeholder for future notes */}
      <div className="mt-16 pt-16 border-t border-border flex flex-col items-center">
        <p className="text-muted-foreground text-sm italic">
          More reports on cross-border logistics and AI governance coming soon.
        </p>
      </div>
    </main>
  );
};

export default Notes;
