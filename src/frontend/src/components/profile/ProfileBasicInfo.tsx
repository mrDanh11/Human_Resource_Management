import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import UpdateProfileButton from "./UpdateProfileButton";
import { motion } from "framer-motion";

interface ProfileBasicInfoProps {
  data: {
    id?: number;
    fullname?: string;
    //employeeCode?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  onUpdateClick?: () => void;
}

export default function ProfileBasicInfo({
  data,
  onUpdateClick,
}: ProfileBasicInfoProps) {
  return (
    <div className="flex flex-col gap-0">
      {/* HEADER với Avatar, Tên, Mã NV, Email, Nút Cập nhật */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <User className="w-10 h-10 relative z-10" />
              <motion.div 
                className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
          <div className="flex flex-col gap-2">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {data.fullname || "Không có tên"}
            </motion.div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <motion.div 
                className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-blue-700">{data.id ? `EMP${data.id.toString().padStart(4, '0')}` : "-"}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>{data.email || "-"}</span>
              </motion.div>
            </div>
          </div>
        </div>
        {onUpdateClick && <UpdateProfileButton onClick={onUpdateClick} />}
      </div>

      {/* Thông tin liên hệ */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
            <div className="p-1.5 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium">Số điện thoại</span>
          </div>
          <div className="text-base font-bold text-gray-900 ml-1">
            {data.phone || "-"}
          </div>
        </motion.div>
        
        <motion.div 
          className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300 group cursor-pointer"
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-sm text-purple-700 mb-2">
            <div className="p-1.5 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium">Địa chỉ</span>
          </div>
          <div className="text-base font-bold text-gray-900 ml-1 line-clamp-1" title={data.address || "-"}>
            {data.address || "-"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
