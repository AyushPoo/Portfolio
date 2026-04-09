import { useState } from "react";
import { Mail, Linkedin, Phone, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setSending(true);
    try {
      // Formspree Integration
      const response = await fetch("https://formspree.io/f/xvgozvzo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success("Message sent! I'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending message. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "ayushpoojary1@gmail.com",
      href: "mailto:ayushpoojary1@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "ayush-poojary-469364208",
      href: "https://www.linkedin.com/in/ayush-poojary-469364208",
      external: true,
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 95355 86725",
      href: "tel:+919535586725",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-[57px]">
      {/* ── Page header ── */}
      <div className="px-6 md:px-10 pt-12 pb-10 border-b border-border grid-cols-bg">
        <p className="text-xs text-muted-foreground mb-3">
          <span className="text-primary">.</span>contact
        </p>
        <h1
          className="font-bold"
          style={{
            fontSize: "clamp(3rem, 8vw, 8rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          say hello
        </h1>
      </div>

      {/* ── Main content ── */}
      <section className="px-6 md:px-10 py-20 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left — intro + links */}
          <div>
            <p
              className="font-medium leading-snug mb-12"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              open to discuss my ventures, roles in IB / VC & strategy — feel free to reach out.
            </p>

            <div className="space-y-6">
              {contactLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-primary transition-colors duration-200 shrink-0">
                    <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{link.label}</p>
                    <p className="text-sm font-medium text-foreground">{link.value}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Name <span className="text-primary">*</span>
                </Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="bg-transparent border-border focus-visible:ring-primary rounded-none text-sm h-11"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="bg-transparent border-border focus-visible:ring-primary rounded-none text-sm h-11"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Subject</Label>
              <Input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className="bg-transparent border-border focus-visible:ring-primary rounded-none text-sm h-11"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Message <span className="text-primary">*</span>
              </Label>
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project or opportunity..."
                required
                rows={6}
                className="bg-transparent border-border focus-visible:ring-primary rounded-none text-sm resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium"
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send message
                </span>
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* ── Availability note ── */}
      <section className="px-6 md:px-10 py-12">
        <div className="flex items-center gap-3">
          <span className="status-dot" />
          <p className="text-sm text-muted-foreground">
            Open to IB, VC &amp; strategy roles in Bangalore or remote.
          </p>
        </div>
      </section>
    </div>
  );
}
