import { motion } from "framer-motion";
import { CheckCircle2, Mail, ArrowRight, Gift, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  onReset: () => void;
  orderType?: "taster" | "consultation";
}

export function SuccessScreen({ onReset, orderType = "consultation" }: SuccessScreenProps) {
  const isTaster = orderType === "taster";

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
          className="heading-display mb-4 text-3xl md:text-5xl"
        >
          {isTaster ? "Taste Box Requested!" : "Consultation Booked!"}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          {isTaster
            ? "We've received your Taste Wedding Box request. Check your inbox — we'll reach out within 24 hours to arrange your tasting experience."
            : "Your consultation request has been received. Check your inbox — our advisor will contact you within 24 hours to schedule your meeting."}
        </motion.p>

        {/* Email Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8 inline-flex items-center gap-3 border border-border bg-card px-6 py-4 rounded-lg"
        >
          <Mail className="h-5 w-5 text-secondary" />
          <span className="text-sm">Check your email for your design summary</span>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8 text-left bg-card border border-border rounded-lg p-5 sm:p-6"
        >
          <h3 className="text-sketch text-sm font-semibold mb-3 text-secondary">What Happens Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {isTaster ? (
              <>
                <li className="flex items-start gap-2">
                  <Gift className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span>We'll confirm your Taste Wedding Box and arrange delivery or pickup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CalendarHeart className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span>Your $80 will be applied as credit toward your wedding cake</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <CalendarHeart className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span>An advisor will reach out to schedule your personalized consultation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span>We'll review your design together and refine every detail</span>
                </li>
              </>
            )}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-4"
        >
          <a
            href="https://cateringabeusaleh.ca/catering/weddings"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="btn-gold gap-2 w-full">
              Explore Our Full Catering Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>

          <button
            onClick={onReset}
            className="text-sketch text-muted-foreground transition-colors hover:text-secondary text-sm underline underline-offset-4"
          >
            Design Another Cake
          </button>
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
