// Khối thẻ chung
import { motion } from "framer-motion";
import { THEME_COLORS } from "../common/THEME_COLORS";

export default function Card({ title, icon, right, children }: any) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border bg-white p-6 shadow-sm"
      style={{ borderColor: THEME_COLORS.primary[500] }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span style={{ color: THEME_COLORS.primary[700] }}>{icon}</span>
          <h2 className="text-lg font-semibold" style={{ color: THEME_COLORS.primary[700] }}>{title}</h2>
        </div>
        {right && <div>{right}</div>}
      </div>
      {children}
    </motion.section>
  );
}
