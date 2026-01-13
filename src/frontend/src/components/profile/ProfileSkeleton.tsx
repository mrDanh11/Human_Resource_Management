import { motion } from "framer-motion";

// Skeleton loading with shimmer effect
export default function ProfileSkeleton() {
  return (
    <div className="w-full p-6 space-y-6">
      {/* Main Card */}
      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded-lg w-48" />
            <div className="h-4 bg-gray-200 rounded-lg w-64" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-gray-100 rounded-lg" />
          <div className="h-20 bg-gray-100 rounded-lg" />
        </div>
      </motion.div>

      {/* Two Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
            />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded-lg w-32" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-100 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
