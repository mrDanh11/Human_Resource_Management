// Khối thẻ chung
import { motion } from "framer-motion";

export default function Card({ title, icon, right, children, iconColor, hideHeader }: any) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
    >
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: iconColor || '#3b82f6' }}
              >
                {icon}
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          {right && <div>{right}</div>}
        </div>
      )}
      {right && hideHeader && (
        <div className="flex justify-end mb-4">
          {right}
        </div>
      )}
      {children}
    </motion.section>
  );
}
