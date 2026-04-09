import { Link } from "react-router-dom";
import { ArrowRight, Linkedin, Mail, Phone, ExternalLink, Download } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useCountUp } from "../hooks/useCountUp";

const PHOTO_URL =
  "https://customer-assets.emergentagent.com/job_grade-systems/artifacts/3bcgq97i_Photo.jpg";

const skills = [
  "Financial Modelling",
  "DCF & Valuation",
  "Monte Carlo Simulations",
  "Investment Banking",
  "Venture Analysis",
  "Market Research",
  "TAM / SAM / SOM",
  "LLM API Integration",
  "AI Product Development",
  "VC / PE CRM",
  "Startup Strategy",
  "Statutory Audit",
  "Tax Compliance",
  "Financial Due Diligence",
  "Investor Relations",
  "Ind AS Compliance",
  "GST Litigation",
  "Equity Research",
];

const education = [
  {
    institution: "Scaler School of Business",
    degree: "PGP-MT (MBA)",
    period: "Sep 2024 – Mar 2026",
    highlight: "Rank 1/55 · Finance & Overall",
    detail:
      "Top 1% of cohort. Ranked 4/3,231 in SRCC Delhi portfolio optimization challenge. Generated ₹6,350 revenue at 55% margin in The Valentine's Sales Quest.",
  },
  {
    institution: "CFA Institute",
    degree: "CFA Level 1",
    period: "May – Aug 2024",
    highlight: "90th Percentile",
    detail:
      "Scored in the 90th percentile out of 50,000 global candidates. Completed the financial modelling module.",
  },
  {
    institution: "ICAI",
    degree: "CA Intermediate",
    period: "Aug 2019 – Jul 2023",
    highlight: "Cleared both groups on 1st attempt",
    detail:
      "17% national pass rate. Secured 7 exemptions, placing in the top 10% of 30,000 candidates.",
  },
  {
    institution: "Bengaluru City University",
    degree: "B.Com — Accounting & Finance",
    period: "Jul 2019 – Sep 2022",
    highlight: "GPA 8.54 · Top 10% in state",
    detail: "Consistent academic performer across all semesters.",
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

/* ─── Individual count-up stat ─── */
function StatBlock({ rawValue, numericValue, prefix = "", suffix = "", label, sub, visible }) {
  const count = useCountUp(numericValue, 1600, visible);
  return (
    <div className="border-t border-border pt-6">
      <p className="text-3xl md:text-4xl font-semibold mb-2">
        {rawValue ?? `${prefix}${count}${suffix}`}
      </p>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{sub}</p>
    </div>
  );
}

export default function About() {
  const [statsRef, statsVisible] = useScrollReveal(0.2);

  return (
    <div className="min-h-screen bg-background text-foreground pt-[57px]">
      {/* ── Page header ── */}
      <div className="px-6 md:px-10 pt-12 pb-10 border-b border-border grid-cols-bg">
        <p className="text-xs text-muted-foreground mb-3">
          <span className="text-primary">.</span>about
        </p>
        <h1
          className="font-bold fade-up"
          style={{
            fontSize: "clamp(4rem, 10vw, 10rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          about
        </h1>
      </div>

      {/* ── Bio ── */}
      <section className="px-6 md:px-10 py-20 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">
          <div>
            <Reveal>
              <p className="text-2xl md:text-3xl font-medium leading-snug mb-8">
                i'm a finance-first operator with 3 years of experience across audit,
                investment research, and early-stage finance — now building AI ventures.
              </p>
            </Reveal>
            <Reveal delay="reveal-d1">
              <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Ranked in the top 10% globally in CFA Level 1 and 1st in my MBA cohort at
                Scaler School of Business, I've built valuation models, investor CRMs, and
                market landscapes for 1,000+ B2B startups. As a former IB intern at Loestro
                Advisors, I combine rigorous financial analysis with AI-driven workflows to
                identify and support high-growth companies across India's emerging sectors.
              </p>
            </Reveal>

            <Reveal delay="reveal-d2">
              <div className="space-y-4">
                <a
                  href="mailto:ayushpoojary1@gmail.com"
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    ayushpoojary1@gmail.com
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ayush-poojary-469364208"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <Linkedin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    linkedin.com/in/ayush-poojary-469364208
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
                <a
                  href="tel:+919535586725"
                  className="flex items-center gap-3 group"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    +91 95355 86725
                  </span>
                </a>
              </div>
            </Reveal>

            {/* Resume download */}
            <Reveal delay="reveal-d3">
              <a
                href="https://drive.google.com/file/d/1QTcZfymQFd_7T8Ymzv-vy7oHRhMZkLru/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 mt-8 border border-border px-5 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200 group"
              >
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                view resume
              </a>
            </Reveal>
          </div>

          <Reveal className="relative">
            <img
              src={PHOTO_URL}
              alt="Ayush Poojary"
              className="w-full max-w-sm object-cover grayscale hover:grayscale-0 transition-all duration-700"
              style={{
                aspectRatio: "4/5",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Credentials — Count-up stats ── */}
      <section className="px-6 md:px-10 py-16 border-b border-border">
        <Reveal>
          <p className="section-label mb-12">credentials</p>
        </Reveal>
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {/* Use rawValue for string stats, numericValue for count-up */}
          <StatBlock numericValue={90} suffix="th %ile" label="CFA Level 1" sub="out of 50,000 candidates" visible={statsVisible} />
          <StatBlock prefix="Rank #" numericValue={1} label="MBA Cohort" sub="out of 55 — Scaler School of Business" visible={statsVisible} />
          <StatBlock rawValue="Top 10%" numericValue={10} label="CA Intermediate" sub="out of 30,000 candidates" visible={statsVisible} />
          <StatBlock rawValue="₹75k + $3k" numericValue={75} label="Pre-seed raised" sub="GradeSense — Scaler, Microsoft, Google" visible={statsVisible} />
        </div>
      </section>

      {/* ── Education ── */}
      <section className="px-6 md:px-10 py-16 border-b border-border">
        <Reveal>
          <p className="section-label mb-12">education</p>
        </Reveal>
        <div>
          {education.map((edu, i) => (
            <Reveal key={i} delay={`reveal-d${Math.min(i + 1, 4)}`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between py-8 border-b border-border hover:bg-card/30 transition-colors duration-200 -mx-6 md:-mx-10 px-6 md:px-10">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{edu.institution}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground mt-2 max-w-md leading-relaxed">
                    {edu.detail}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-10 md:text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{edu.period}</p>
                  <p className="text-xs text-primary mt-1 font-medium">{edu.highlight}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Skills — Marquee ticker ── */}
      <section className="py-16 border-b border-border overflow-hidden">
        <Reveal className="px-6 md:px-10 mb-8">
          <p className="section-label">skills</p>
        </Reveal>

        {/* Marquee — duplicated for seamless loop */}
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...skills, ...skills].map((skill, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors duration-200 cursor-default shrink-0"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-10 py-16">
        <Reveal>
          <p className="section-label mb-5">contact</p>
        </Reveal>
        <Reveal delay="reveal-d1">
          <p className="text-2xl font-medium mb-6">interested in working together?</p>
        </Reveal>
        <Reveal delay="reveal-d2">
          <Link
            to="/contact"
            className="text-sm flex items-center gap-2 group text-primary"
          >
            <span>say hello</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
