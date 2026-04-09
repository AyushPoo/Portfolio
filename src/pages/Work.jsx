import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useDragScroll } from "../hooks/useDragScroll";

const FS_LOGO_URL =
  "https://customer-assets.emergentagent.com/job_grade-systems/artifacts/jsdu3l5l_logo.png";

const featuredProjects = [
  {
    id: "gradesense",
    year: "2025",
    type: "Founder",
    category: "AI Education",
    title: "GradeSense",
    description:
      "Building an AI grading infrastructure that automates subjective evaluation and structured feedback for schools — reducing manual effort and improving accuracy at scale.",
    details: [
      "Built AI evaluation engine using LLM APIs to automatically grade subjective answers and generate structured feedback",
      "Designed end-to-end workflow: answer ingestion, rubric mapping, evaluation prompts, and result dashboards",
      "In late-stage discussions with a 1,000-student institute for a grading pilot",
      "Exploring API integration with an EdTech startup for seamless platform embedding",
    ],
    metrics: [
      { label: "Pre-seed Funding", value: "₹75,000 from Scaler School of Business" },
      { label: "Cloud Credits", value: "$3k — Microsoft for Startups + Google Cloud" },
      { label: "Pipeline", value: "1,000-student grading pilot in discussion" },
    ],
    bgColor: "hsl(155, 50%, 7%)",
    accentColor: "hsl(152, 50%, 58%)",
    link: "https://www.gradesense.in/",
    logo: "/gradesense_logo.png",
  },
  {
    id: "founder-systems",
    year: "2026",
    type: "Founder",
    category: "AI Product Factory",
    title: "Founder Systems",
    description:
      "An AI-powered product factory automating the complete journey from internet trend discovery to working MVP — with minimal human effort.",
    details: [
      "Scrapes startup ideas from Product Hunt, Hacker News, Reddit, and GitHub trending repositories",
      "Built autonomous idea scraping + AI-powered ranking pipeline using GPT models",
      "Automated AI product planning: feature scoping, tech stack selection, and MVP spec generation",
      "Generated multiple MVP tools automatically; building toward a fully autonomous AI product factory",
    ],
    metrics: [
      { label: "Website", value: "foundersystems.in" },
      { label: "Idea Sources", value: "PH · HN · Reddit · GitHub" },
      { label: "Goal", value: "Zero-human-effort startup factory" },
    ],
    bgColor: "hsl(228, 40%, 10%)",
    accentColor: "hsl(228, 65%, 72%)",
    link: "https://foundersystems.in",
    logo: FS_LOGO_URL,
  },
];

const experience = [
  {
    company: "Loestro Advisors",
    role: "Investment Banking Intern",
    period: "Aug 2025 – Oct 2025",
    location: "Hyderabad, India",
    type: "Investment Banking",
    highlights: [
      "Co-authored the 60-page Hyderabad Innovation Report in collaboration with TiE Hyderabad — featured by Silverneedle Ventures and The Hindu Business Line",
      "Presented at HES Summit 2025 alongside senior ecosystem stakeholders",
      "Profiled 200+ startups and 30+ investors across Tech and Health using Tracxn, Startup Genome, and primary research",
      "Built a 600+ VC/PE fund CRM using Tracxn and Crunchbase to support investor outreach, diligence tracking, and fundraising workflows",
      "Created a centralized BD tracker with AI chatbot integration to streamline investor engagement and automate insight retrieval",
    ],
  },
  {
    company: "Vincere Partners",
    role: "Private Equity Intern",
    period: "Oct 2024 – Dec 2024",
    location: "Remote",
    type: "Private Equity",
    highlights: [
      "Analysed 1,000+ companies across various sectors alongside Managing Partner (20+ years in Tech & PE)",
      "Developed TAM/SAM/SOM analysis on Excel for high-growth verticals",
      "Created a vertical market map pipeline for investment opportunities aligned with fund capital allocation strategy",
    ],
  },
  {
    company: "Muthu & Co.",
    role: "Article Assistant",
    period: "Jan 2022 – Jul 2023",
    location: "Bangalore, India",
    type: "Audit & Tax",
    highlights: [
      "Managed statutory audits, tax filings, and financial compliance for SMEs; filed 100+ direct & indirect tax returns",
      "Maintained ~100% compliance with statutory deadlines, reducing client tax penalties by ~30%",
      "Handled 2+ GST litigations and led audits for 5+ SMEs, identifying INR 1Cr+ in financial misstatements",
      "Developed 5+ financial models for client decision-making, improving cost structures and profitability by ~15%",
      "Recognized as top performer in the audit team of 20; received client accolades for strategic financial insights",
    ],
  },
  {
    company: "Grant Thornton Bharat",
    role: "Article Assistant",
    period: "Apr 2021 – Dec 2021",
    location: "Bangalore, India",
    type: "Audit & Due Diligence",
    highlights: [
      "Conducted statutory audits for listed entities; verified financial data and ensured full Ind AS compliance",
      "Conducted financial due diligence on revenue streams of INR 100+ Cr, ensuring P&L and Balance Sheet accuracy",
      "Managed external confirmation of trade receivables/payables worth INR 50+ Crore, mitigating misstatements",
    ],
  },
];

const otherProjects = [
  {
    title: "Infosys Equity Valuation",
    period: "Apr 2025",
    type: "Financial Modelling",
    description:
      "Built a full-stack valuation model using DCF & Monte Carlo simulations (10,000 trials) to assess downside scenarios. Forecasted 10Y revenues using vertical-wise and regional growth drivers. Estimated 27% upside.",
  },
  {
    title: "Mokobara APAC Market Research",
    period: "May 2025",
    type: "Market Research",
    description:
      "Conducted research to shape a ₹100 Cr APAC expansion roadmap. Evaluated market-size reports, competitive landscapes, and country-level growth drivers across six APAC markets.",
  },
];

/* ─── Reusable scroll-reveal wrapper ─── */
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

export default function Work() {
  const dragRef = useDragScroll();

  return (
    <div className="min-h-screen bg-background text-foreground pt-[57px]">
      {/* ── Page header ── */}
      <div className="px-6 md:px-10 pt-12 pb-10 border-b border-border grid-cols-bg">
        <p className="text-xs text-muted-foreground mb-3">
          <span className="text-primary">.</span>work
        </p>
        <h1
          className="font-bold fade-up"
          style={{
            fontSize: "clamp(4rem, 10vw, 10rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          work
        </h1>
      </div>

      {/* ── Featured Projects ── */}
      <section>
        {featuredProjects.map((project) => (
          <div key={project.id} className="project-card-wrap border-t border-border">
            <div
              className="project-card-inner px-6 md:px-10 pt-10 pb-16"
              style={{ backgroundColor: project.bgColor, minHeight: "52vh" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">
                  {project.year}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {project.type} · {project.category}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                    </a>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="pt-12 md:pt-20">
                {project.logo && (
                  <img
                    src={project.logo}
                    alt=""
                    className="w-12 h-12 mb-5 object-contain invert opacity-50"
                  />
                )}
                <h2
                  className="font-bold tracking-tight mb-5"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 6rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {project.title}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <p className="section-label mb-5">what i built</p>
                    <ul className="space-y-3">
                      {project.details.map((d, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <span className="text-primary mt-0.5 shrink-0">—</span>
                          <span className="leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="section-label mb-5">metrics</p>
                    <div className="space-y-5">
                      {project.metrics.map((m, i) => (
                        <div key={i} className="border-b border-white/5 pb-4">
                          <p className="text-xs text-muted-foreground mb-1.5">{m.label}</p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: project.accentColor }}
                          >
                            {m.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Experience ── */}
      <section className="px-6 md:px-10 py-16 border-t border-border">
        <Reveal>
          <p className="section-label mb-12">experience</p>
        </Reveal>
        <div>
          {experience.map((exp, i) => (
            <Reveal key={i} delay={i % 2 === 0 ? "" : "reveal-d1"}>
              <div className="py-10 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.company}</h3>
                    <p className="text-sm text-primary mt-1">{exp.role}</p>
                  </div>
                  <div className="mt-3 md:mt-0 md:text-right">
                    <p className="text-xs text-muted-foreground">{exp.period}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exp.location}</p>
                    <span className="inline-block mt-2 text-xs border border-border px-2 py-0.5 text-muted-foreground">
                      {exp.type}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-primary shrink-0 mt-0.5">—</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Other Projects — horizontal drag-scroll ── */}
      <section className="py-16 border-t border-border">
        <Reveal className="px-6 md:px-10">
          <div className="flex items-end justify-between mb-10">
            <p className="section-label">other projects</p>
            <p className="text-xs text-muted-foreground hidden md:block">← drag to explore →</p>
          </div>
        </Reveal>

        {/* Drag-scroll container */}
        <div
          ref={dragRef}
          className="flex gap-5 overflow-x-auto px-6 md:px-10 pb-4 select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {otherProjects.map((proj, i) => (
            <div
              key={i}
              className="border border-border p-8 hover:bg-card/50 transition-colors duration-200 flex-shrink-0"
              style={{ width: "clamp(280px, 38vw, 480px)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-primary mb-1.5">{proj.type}</p>
                  <h3 className="text-lg font-semibold">{proj.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">
                  {proj.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {proj.description}
              </p>
            </div>
          ))}

          {/* Spacer so last card doesn't hug the edge */}
          <div className="w-6 md:w-10 flex-shrink-0" />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-10 py-16 border-t border-border">
        <Reveal>
          <Link
            to="/contact"
            className="text-sm flex items-center gap-2 group text-primary"
          >
            <span>get in touch</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
