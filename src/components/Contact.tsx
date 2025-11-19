import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import emailjs from "emailjs-com";

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // EmailJS credentials
  const serviceId = "service_42m4lca";
  const templateId = "template_5rfqb7d";
  const userId = "jKYS-Zm28fRW5zF8Q";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;

    setIsSubmitting(true);

    emailjs
      .sendForm(serviceId, templateId, formRef.current, userId)
      .then(
        (result) => {
          console.log('Email sent successfully!', result.text);
          toast({
            title: "Message sent!",
            description: "Thank you for reaching out. I'll get back to you soon.",
          });
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error('Failed to send email:', error.text);
          toast({
            title: "Failed to send",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">Contact</h2>
        <div ref={ref} className={`max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
                className="h-12 sm:h-14 bg-card border-border text-base"
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                className="h-12 sm:h-14 bg-card border-border text-base"
              />
            </div>
            <div>
              <Textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                disabled={isSubmitting}
                className="min-h-[150px] sm:min-h-[180px] bg-card border-border resize-none text-base"
              />
            </div>
            <div className="text-center pt-2">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full sm:w-auto sm:px-12 min-h-[48px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
