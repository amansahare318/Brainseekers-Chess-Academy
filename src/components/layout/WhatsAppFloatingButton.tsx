"use client";

import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WhatsAppFloatingButton() {
  const { whatsapp } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const FALLBACK_NUMBER = "918485079048";
  const numericWhatsapp = whatsapp ? whatsapp.replace(/\D/g, '') : FALLBACK_NUMBER;
  const message = encodeURIComponent("Hello BrainSeekers Chess Academy, I have an inquiry about chess classes.");
  const href = `https://wa.me/${numericWhatsapp}?text=${message}`;

  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      {/* Official WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="white"
      >
        <path d="M16.004 2C8.28 2 2 8.28 2 16.004c0 2.478.65 4.896 1.885 7.02L2 30l7.19-1.856A13.93 13.93 0 0016.004 30C23.72 30 30 23.72 30 16.004 30 8.28 23.72 2 16.004 2zm0 25.56a11.56 11.56 0 01-5.9-1.613l-.423-.25-4.268 1.1 1.13-4.152-.278-.44A11.56 11.56 0 014.44 16.004c0-6.38 5.184-11.564 11.564-11.564 6.38 0 11.56 5.183 11.56 11.564S22.384 27.56 16.004 27.56zm6.338-8.67c-.347-.174-2.055-1.014-2.374-1.13-.32-.116-.553-.174-.785.174-.232.347-.9 1.13-1.103 1.36-.203.232-.405.26-.752.087-.347-.174-1.467-.54-2.794-1.723-1.033-.92-1.73-2.055-1.932-2.402-.203-.347-.022-.535.152-.708.156-.155.347-.405.52-.608.174-.203.232-.347.347-.578.116-.232.058-.435-.03-.608-.087-.174-.785-1.89-1.075-2.587-.284-.68-.572-.588-.786-.598l-.67-.012c-.232 0-.608.087-.926.434-.32.347-1.218 1.19-1.218 2.9 0 1.71 1.247 3.362 1.42 3.594.174.232 2.452 3.745 5.943 5.25.83.358 1.478.572 1.984.733.833.266 1.593.228 2.192.138.67-.1 2.055-.84 2.345-1.65.29-.812.29-1.508.203-1.652-.087-.145-.32-.232-.667-.406z"/>
      </svg>
    </motion.a>
  );
}
