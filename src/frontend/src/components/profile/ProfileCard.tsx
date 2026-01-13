// Khối thẻ chung
import { motion } from "framer-motion";

export default function Card({ title, icon, right, children, iconColor, hideHeader }: any) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-300 relative overflow-hidden group"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-500 pointer-events-none" />
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shadow-lg relative overflow-hidden"
                style={{ backgroundColor: iconColor || '#3b82f6' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">{icon}</span>
              </motion.div>
            )}
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h2>
          </div>
          {right && <div className="relative z-10">{right}</div>}
        </div>
      )}
      {right && hideHeader && (
        <div className="flex justify-end mb-4 relative z-10">
          {right}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
}
