"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, Copy, Check, MessageSquare, Mail } from "lucide-react";
import { Icon } from "@iconify/react";

const formSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim().min(10, { message: "Message must be at least 10 characters" }).max(1000, { message: "Message must be less than 1000 characters" }),
});

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const contactEmail = "ranahammadismail@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2500);
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_42m4lca";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_5rfqb7d";
  const userId = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "jKYS-Zm28fRW5zF8Q";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await emailjs.send(
        serviceId, 
        templateId, 
        {
          from_name: values.name,
          from_email: values.email,
          to_name: "Hammad",
          message: values.message,
          reply_to: values.email,
        }, 
        userId
      );
      console.log('Email sent successfully!', result.text);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error: any) {
      console.error('Failed to send email:', error?.text || error);
      toast({
        title: "Failed to send",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div
          ref={ref}
          className={`pop-card-lg p-5 sm:p-12 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Top Badge: 💬 Let's Connect */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-2 border-[var(--pop-border)] font-extrabold text-xs mb-4 shadow-[2.5px_2.5px_0px_#1e1b2e]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Let's Connect</span>
          </div>

          {/* Large Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight mb-4">
            LET'S BUILD <br />
            <span className="text-purple-600 dark:text-purple-400">SOMETHING FUN!</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed mb-8">
            Got an exciting project, a role to fill, or just want to chat about creative code? Drop me a line!
          </p>

          {/* Big Orange Email Pill Button (Copyable & Mobile Responsive) */}
          <div className="flex justify-center mb-8 px-1">
            <button
              onClick={handleCopyEmail}
              className="w-full max-w-full sm:w-auto px-3.5 sm:px-8 py-3.5 sm:py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-black text-[11px] sm:text-base border-2.5 border-[var(--pop-border)] shadow-[3.5px_3.5px_0px_#1e1b2e] dark:shadow-[3.5px_3.5px_0px_#ffffff] hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 overflow-hidden"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate max-w-[170px] sm:max-w-none">{contactEmail}</span>
              <span className="text-[10px] sm:text-xs opacity-90 underline whitespace-nowrap flex-shrink-0">
                {copied ? "(Copied!)" : "(Click to copy)"}
              </span>
              {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
            </button>
          </div>

          {/* Social Link Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <a
              href="https://github.com/HammadIsmail"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground font-extrabold text-xs sm:text-sm border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff] hover:translate-y-[-2px] transition-all flex items-center gap-2"
            >
              <Icon icon="lucide:github" className="w-4 h-4 text-purple-600" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/muhammad-hammad-uet/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground font-extrabold text-xs sm:text-sm border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] dark:shadow-[2.5px_2.5px_0px_#ffffff] hover:translate-y-[-2px] transition-all flex items-center gap-2"
            >
              <Icon icon="lucide:linkedin" className="w-4 h-4 text-blue-600" />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* Direct Form */}
          <div className="pt-8 border-t-2 border-dashed border-[var(--pop-border)] max-w-lg mx-auto">
            <h3 className="text-xl font-black text-foreground mb-6">Or Send a Direct Message</h3>
            <Form {...form}>
              <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          {...field}
                          disabled={form.formState.isSubmitting}
                          className="h-12 rounded-2xl px-4 font-bold text-sm bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] focus-visible:ring-2 focus-visible:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your Email"
                          {...field}
                          disabled={form.formState.isSubmitting}
                          className="h-12 rounded-2xl px-4 font-bold text-sm bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] focus-visible:ring-2 focus-visible:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Your Message..."
                          {...field}
                          disabled={form.formState.isSubmitting}
                          className="min-h-[140px] rounded-2xl p-4 resize-none font-bold text-sm bg-card border-2 border-[var(--pop-border)] shadow-[2.5px_2.5px_0px_#1e1b2e] focus-visible:ring-2 focus-visible:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm border-2.5 border-[var(--pop-border)] shadow-[4px_4px_0px_#1e1b2e] dark:shadow-[4px_4px_0px_#ffffff] hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      "Send Message ✦"
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
