import { Link } from "react-router-dom";
import { Linkedin, Mail, ArrowUpRight, Twitter } from "lucide-react";

const navLinks = [
  { label: "work", href: "/work" },
  { label: "about", href: "/about" },
  { label: "notes", href: "/notes" },
  { label: "contact", href: "/contact" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-10 pt-12 pb-10">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
        {/* Brand */}
        <div className="max-w-xs">
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight hover:text-primary transition-colors duration-200"
          >
            .ayush
          </Link>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Finance operator × AI Founder.<br />
            Based in Bangalore, India.<br />
            Open to IB, VC & strategy roles.
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Pages</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Connect</p>
          <a
            href="https://www.linkedin.com/in/ayush-poojary-469364208"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
          <a
            href="https://x.com/AyushPoojary6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>Twitter</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
          <a
            href="mailto:ayushpoojary1@gmail.com"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ayushpoojary1@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Ayush Poojary. Built with React.
        </p>
        <div className="flex items-center gap-2">
          <span className="status-dot" />
          <p className="text-xs text-muted-foreground">building GradeSense</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
