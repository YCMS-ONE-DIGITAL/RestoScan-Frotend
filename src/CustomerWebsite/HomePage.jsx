import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-900">
      
      {/* ===== Fast Parallax Background ===== */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 8, // ← Faster
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555992336-03a23c7b20c9?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
      </motion.div>

      {/* ===== Faster Floating Spices ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-70 shadow-lg"
            initial={{ y: -30, x: Math.random() * window.innerWidth }}
            animate={{
              y: window.innerHeight + 30,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 6 + Math.random() * 4, // ← 6-10 sec (faster)
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* ===== Navbar (Faster Entry) ===== */}
      <header className="relative z-20 flex justify-center items-center px-6 py-5">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }} // ← Faster
          className="flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl"
        >
          <ChefHat className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white tracking-wider">RestoScan</h1>
        </motion.div>
      </header>

      {/* ===== Hero Section (Faster Text) ===== */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }} // ← Faster
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              RestoScan
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-300 mt-4 max-w-xl mx-auto font-light">
            Where every bite tells a story of passion, tradition, and flavor.
          </p>
        </motion.div>

        {/* ===== Mobile-Friendly Button with Tap Animation ===== */}
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileTap={{ scale: 0.93 }} // ← Mobile tap effect
          onClick={() => {
              const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
    navigate(`/customerwebsite/menu?token=${token}`);

          }}
          className="mt-10 group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold text-lg px-8 py-4 rounded-full shadow-xl flex items-center gap-3 transition-all active:scale-95"
        >
          <span>Explore Menu</span>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 4, 0] }} // ← Auto pulse animation
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>

          {/* Auto Shine Effect (No Hover Needed) */}
          <motion.span
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-white/40"
          />
        </motion.button>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-gray-400"
        >
          <span>100% Fresh</span>
          <span>•</span>
          <span>Handcrafted Daily</span>
          <span>•</span>
          <span>4.8 ★ (10k+ Reviews)</span>
        </motion.div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="relative z-20 text-center text-gray-400 text-xs py-4 bg-black/60 backdrop-blur-md border-t border-white/10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © {new Date().getFullYear()} RestoScan • Crafted with ❤️ in India
        </motion.p>
      </footer>
    </div>
  );
}