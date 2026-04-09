import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useCountUp } from "../hooks/useCountUp";

const PHOTO_URL =
  "https://customer-assets.emergentagent.com/job_grade-systems/artifacts/3bcgq97i_Photo.jpg";
const FS_LOGO_URL =
  "https://customer-assets.emergentagent.com/job_grade-systems/artifacts/jsdu3l5l_logo.png";

const featuredProjects = [
  {
    id: "gradesense",
    year: "2025",
    category: "Founder  ·  AI Education",
    title: "GradeSense",
    description:
      "AI grading infrastructure that automates evaluation and structured feedback for schools — powered by LLM APIs with end-to-end rubric mapping and result dashboards.",
    metrics: [
      { label: "Pre-seed", value: "₹75k from Scaler" },
      { label: "Cloud credits", value: "$3k — Microsoft & Google" },
      { label: "Pipeline", value: "1,000-student pilot in discussion" },
    ],
    bgColor: "hsl(155, 50%, 7%)",
    accentColor: "hsl(152, 50%, 58%)",
    link: "https://www.gradesense.in/",
    logo: "/gradesense_logo.png",
  },
  {
    id: "founder-systems",
    year: "2026",
    category: "Founder  ·  AI Product Factory",
    title: "Founder Systems",
    description:
      "An AI-powered product factory that automatically discovers startup ideas from the internet, ranks them with AI, generates product plans, and builds working MVPs with minimal human effort.",
    metrics: [
      { label: "Sources", value: "PH · HN · Reddit · GitHub" },
      { label: "Pipeline", value: "Autonomous AI scraping + ranking" },
      { label: "Website", value: "foundersystems.in" },
    ],
    bgColor: "hsl(228, 40%, 10%)",
    accentColor: "hsl(228, 65%, 72%)",
    link: "https://foundersystems.in",
    logo: FS_LOGO_URL,
  },
];

const otherWork = [
  {
    year: "Aug – Oct 2025",
    type: "Investment Banking",
    company: "Loestro Advisors",
    description:
      "Co-authored 60-page Hyderabad Innovation Report with TiE Hyderabad. Built 600+ VC/PE fund CRM with AI chatbot integration. Featured by The Hindu Business Line.",
  },
  {
    year: "Oct – Dec 2024",
    type: "Private Equity",
    company: "Vincere Partners",
    description:
      "Analysed 1,000+ companies; built TAM/SAM/SOM models for high-growth verticals alongside a Managing Partner with 20+ years in Tech & PE.",
  },
  {
    year: "2021 – 2023",
    type: "Audit & Finance",
    company: "Muthu & Co. / Grant Thornton",
    description:
      "Led statutory audits for 5+ SMEs, identified INR 1Cr+ in misstatements, filed 100+ tax returns, and conducted financial DD on INR 100+ Cr revenue streams.",
  },
];

/* ─── Small reusable reveal wrapper ─── */
function Reveal({ children, className = "", delay = "" }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${delay} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Count-up stat block (used in About preview) ─── */
function StatBlock({ numericValue, prefix = "", suffix = "", label, visible }) {
  const count = useCountUp(numericValue, 1600, visible);
  return (
    <div>
      <p className="text-3xl font-semibold">
        {prefix}{count}{suffix}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  const [statsRef, statsVisible] = useScrollReveal(0.3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-[57px]">
        {/* ── Status bar ── */}
        <div className="flex items-center justify-between px-6 md:px-10 py-3 border-b border-border">
          <span className="text-xs text-muted-foreground">Hey, I'm Ayush</span>
          <div className="flex items-center gap-2">
            <span className="status-dot" />
            <span className="text-xs text-muted-foreground">building GradeSense</span>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="grid-cols-bg px-6 md:px-10 pt-20 md:pt-28 pb-32 min-h-[88vh] flex flex-col justify-center">
          <h1 className="hero-text fade-up">
            a finance-first<br />
            operator building<br />
            AI ventures
          </h1>
          <div className="fade-up-d2 mt-10 flex flex-wrap items-center gap-8">
            <Link
              to="/work"
              className="text-sm flex items-center gap-2 group text-foreground hover:text-primary transition-colors duration-200"
            >
              <span>see my work</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="text-sm text-muted-foreground nav-link"
            >
              about me
            </Link>
          </div>

          {/* ── Project Preview Strip (Asymmetric Chips) ── */}
          <div className="fade-up-d3 mt-24 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-2">Featured</span>
              {featuredProjects.map((p, i) => (
                <div 
                  key={p.id}
                  className="px-4 py-2 border border-border bg-accent/20 flex items-center gap-3 hover:border-primary transition-colors cursor-pointer group"
                  onClick={() => p.link && window.open(p.link, "_blank")}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
                  <span className="text-xs font-medium tracking-tight whitespace-nowrap">{p.title}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Projects ── */}
        <section className="border-t border-border">
          <Reveal className="px-6 md:px-10 py-4">
            <p className="section-label">featured work</p>
          </Reveal>

          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card-wrap border-t border-border"
              onClick={() =>
                project.link && window.open(project.link, "_blank")
              }
              role={project.link ? "link" : undefined}
            >
              <div
                className="project-card-inner px-6 md:px-10 pt-8 pb-14"
                style={{ backgroundColor: project.bgColor, minHeight: "58vh" }}
              >
                {/* Card top meta */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.year}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {project.category}
                    </span>
                    {project.link && (
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div className="pt-16 md:pt-24">
                  {project.logo && (
                    <img
                      src={project.logo}
                      alt={`${project.title} logo`}
                      className={`w-14 h-14 mb-6 object-contain ${
                        project.id === "founder-systems" ? "invert opacity-55" : ""
                      }`}
                    />
                  )}
                  <h2
                    className="font-bold tracking-tight mb-6"
                    style={{
                      fontSize: "clamp(2.8rem, 7vw, 7rem)",
                      lineHeight: 1.02,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {project.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-x-10 gap-y-5 border-t border-white/5 pt-8">
                    {project.metrics.map((metric, i) => (
                      <div key={i}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {metric.label}
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: project.accentColor }}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── Other Experience ── */}
        <section className="px-6 md:px-10 py-16 border-t border-border">
          <Reveal>
            <p className="section-label mb-10">experience</p>
          </Reveal>
          <div>
            {otherWork.map((item, i) => (
              <Reveal key={i} delay={`reveal-d${Math.min(i + 1, 4)}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between py-7 border-b border-border hover:bg-card/40 transition-colors duration-200 -mx-6 md:-mx-10 px-6 md:px-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold">{item.company}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0 md:ml-10 md:text-right shrink-0">
                    <p className="text-xs text-muted-foreground">{item.year}</p>
                    <p className="text-xs text-primary mt-1">{item.type}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link
              to="/work"
              className="text-sm flex items-center gap-2 group text-primary"
            >
              <span>view all work</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>

        {/* ── About Preview ── */}
        <section className="px-6 md:px-10 py-20 border-t border-border grid-cols-bg">
          <Reveal>
            <p className="section-label mb-10">about</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <Reveal>
                <p className="text-2xl md:text-3xl font-medium leading-snug mb-10 max-w-lg">
                  my craft is combining rigorous financial analysis with AI-driven workflows to build and back high-growth ventures.
                </p>
              </Reveal>

              {/* Credential stats — count-up on scroll */}
              <div
                ref={statsRef}
                className="flex items-center gap-8 mb-10"
              >
                <StatBlock numericValue={90} suffix="th" label="CFA Level 1 %ile" visible={statsVisible} />
                <div className="w-px h-10 bg-border" />
                <StatBlock prefix="#" numericValue={1} label="MBA cohort rank" visible={statsVisible} />
                <div className="w-px h-10 bg-border" />
                <StatBlock numericValue={5} suffix="+" label="companies worked at" visible={statsVisible} />
              </div>

              <Reveal>
                <Link
                  to="/about"
                  className="text-sm flex items-center gap-2 group text-foreground hover:text-primary transition-colors duration-200"
                >
                  <span>about me</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>

            <Reveal className="relative overflow-hidden">
              <img
                src={PHOTO_URL}
                alt="Ayush Poojary"
                className="w-full max-w-xs mx-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                style={{ aspectRatio: "3/4", objectFit: "cover", objectPosition: "top center" }}
              />
            </Reveal>
          </div>
        </section>

        {/* ── Contact CTA ── */}
        <section className="px-6 md:px-10 py-24 border-t border-border">
          <Reveal>
            <p className="section-label mb-6">say hello</p>
          </Reveal>
          <Reveal delay="reveal-d1">
            <h2
              className="font-semibold max-w-2xl leading-tight mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              open for roles in IB, VC &amp; strategy — feel free to reach out.
            </h2>
          </Reveal>
          <Reveal delay="reveal-d2">
            <Link
              to="/contact"
              className="text-sm flex items-center gap-2 group text-primary"
            >
              <span>contact me</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
