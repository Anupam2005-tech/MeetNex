import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import  Button  from "../ui/Button";

export default function InternalServerError() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl p-8 overflow-hidden"
      >
        {/* Animated blue accent */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"
        />

        <div className="flex flex-col items-center text-center gap-5">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100"
          >
            <AlertTriangle className="h-8 w-8 text-blue-600" />
          </motion.div>

          <h1 className="text-3xl font-semibold text-gray-900">
            Internal Server Error
          </h1>

          <p className="text-gray-600 max-w-md">
            Something went wrong on our side. Our servers are having a brief
            moment — please try again in a few seconds.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button text="Try Again" icon={RefreshCcw}>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
