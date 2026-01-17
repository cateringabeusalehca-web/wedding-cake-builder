import { motion } from "framer-motion";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  onReset: () => void;
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="max-w-xl text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="mb-8 inline-flex"
        >
          <div className="relative">
            <CheckCircle2 className="h-20 w-20 text-secondary" strokeWidth={1} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute inset-0 rounded-full bg-secondary/20"
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="heading-display mb-4 text-4xl md:text-5xl"
        >
          Blueprint Received
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 text-lg text-muted-foreground"
        >
          Your design specifications have been sent to our atelier.
        </motion.p>

        {/* Email Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8 inline-flex items-center gap-3 border border-border bg-card px-6 py-4"
        >
          <Mail className="h-5 w-5 text-secondary" />
          <span className="text-sm">orders@cateringabeusaleh.ca</span>
        </motion.div>

        {/* Response Time */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-10 text-sm text-muted-foreground"
        >
          Our team will review your architectural specifications and respond
          within <strong className="text-foreground">24 hours</strong>.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-4"
        >
          <Button onClick={onReset} className="btn-gold gap-2">
            Design Another Cake
            <ArrowRight className="h-4 w-4" />
          </Button>

          <a
            href="https://cateringabeusaleh.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sketch text-muted-foreground transition-colors hover:text-secondary"
          >
            Visit Our Main Site
          </a>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1 }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full border border-foreground" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full border border-foreground" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
