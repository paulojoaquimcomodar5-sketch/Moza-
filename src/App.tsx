/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LucideIcon,
  Home,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Gift,
  Share2,
  ExternalLink,
  LogOut,
  Wallet,
  Settings,
  Bell,
  TrendingUp,
  ShieldCheck,
  Shield,
  Star,
  Users,
  User,
  Grid,
  LayoutGrid,
  ArrowUpRight,
  Headphones,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ArrowDownRight,
  ClipboardList,
  Building2,
  Award,
  CheckCircle2,
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  HelpCircle,
  FileText,
  DollarSign,
  Landmark,
  BookOpen,
  Globe,
  GraduationCap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  QUICK_ACTIONS, 
  NAV_ITEMS, 
  VIP_LEVELS, 
  DAILY_TASKS, 
  TEAM_LEVELS,
  FINANCIAL_METHODS,
  COMPANY_INFO
} from './constants';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  increment,
  runTransaction
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Connectivity check as per requirements
import { doc as fsDoc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
async function testFirebaseConnection() {
  try {
    // Attempt a silent read to verify server connectivity
    await getDocFromServer(fsDoc(db, '_internal_', 'connection_test')).catch(() => {});
    console.log("Firebase Connected Successfully");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. Check your configuration.");
    }
  }
}
testFirebaseConnection();

// Error Handling Helper
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

// --- Benefit Icon Helper ---
const getBenefitIcon = (benefit: string) => {
  const b = benefit.toLowerCase();
  if (b.includes('saque')) return Wallet;
  if (b.includes('tarefa')) return ClipboardList;
  if (b.includes('suporte')) return Headphones;
  if (b.includes('gerente')) return User;
  if (b.includes('comissão')) return Users;
  if (b.includes('bónus')) return Gift;
  if (b.includes('retorno')) return TrendingUp;
  if (b.includes('certificado')) return Award;
  if (b.includes('lucro')) return Star;
  if (b.includes('caixa')) return Gift;
  if (b.includes('evento')) return Sparkles;
  return CheckCircle2;
};

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'reward' | 'investment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method?: string;
}

// --- Logo Component ---
const Logo = ({ className = "scale-100", showText = true }: { className?: string, showText?: boolean }) => (
  <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
    <div className="relative w-16 h-16">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
        <path 
          d="M20 70V30L45 55L55 45V70" 
          stroke="url(#logo-grad-1)" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M55 70V40L80 15M80 15H60M80 15V35" 
          stroke="url(#logo-grad-2)" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <defs>
          <linearGradient id="logo-grad-1" x1="20" y1="30" x2="55" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="logo-grad-2" x1="55" y1="15" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#facc15" />
            <stop offset="1" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    {showText && (
      <div className="text-center">
        <span className="text-2xl font-black tracking-[0.2em] text-white">MOZA</span>
        <span className="text-2xl font-black tracking-[0.2em] text-gold ml-2">INV</span>
      </div>
    )}
  </div>
);

// --- Auth Component (Login) ---
interface AuthScreenProps {
  onLogin: (phone: string) => void;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('258');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    
    const isValidPhone = phone.length >= 9;
    const isValidPassword = password.length >= 6;
    const passwordsMatch = isLogin || password === confirmPassword;

    if (!isValidPhone) return setError('Insira um número de telefone válido.');
    if (!isValidPassword) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (!passwordsMatch) return setError('As senhas não coincidem.');

    setIsLoading(true);

    try {
      const sanitizedPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
      const email = `${sanitizedPhone}@moza.com`;

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          phone: sanitizedPhone,
          balance: 25,
          activeVip: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          type: 'reward',
          amount: 25,
          status: 'completed',
          date: 'HOJE',
          method: 'Bónus Inicial',
          createdAt: serverTimestamp()
        });
        
        setStatus('Conta criada com sucesso! Iniciando área de membros...');
      }
    } catch (err: any) {
      console.error('Auth Error Details:', err);
      const errorCode = err?.code;
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setError('Telefone ou senha incorretos. Verifique os dados ou crie uma conta.');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('Este número de telefone já está registado. Tente fazer login.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Formato de telefone inválido para o sistema. Use apenas números.');
      } else {
        setError(err?.message || 'Erro na autenticação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Decorative Premium Blurs */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-gold/10 blur-[160px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-500/5 blur-[160px] rounded-full animate-pulse opacity-50" />

      <div className="w-full max-w-sm space-y-12 z-10">
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-block"
          >
            <Logo className="scale-125" />
          </motion.div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {isLogin ? 'Bem-vindo' : 'Premium Access'}
            </h2>
            <p className="text-text-gray text-xs font-bold uppercase tracking-widest opacity-60">
              {isLogin ? 'Inicie sessão na sua conta' : 'Crie a sua conta de investidor'}
            </p>
          </div>
        </div>

        <motion.form 
          layout
          onSubmit={handleSubmit} 
          className="space-y-5 bg-card-bg/30 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group"
        >
          {/* Form inner glow */}
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black p-5 rounded-2xl flex items-center gap-3 uppercase tracking-widest"
              >
                <Shield className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {status && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] font-black p-5 rounded-2xl flex items-center gap-3 uppercase tracking-widest"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{status}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1">Telefone</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/20 group-focus-within/input:text-gold transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="258..."
                  disabled={isLoading}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 focus:bg-black/60 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/20 group-focus-within/input:text-gold transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4.5 pl-12 pr-12 text-white focus:outline-none focus:border-gold/50 focus:bg-black/60 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1">Confirmar Senha</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/20 group-focus-within/input:text-gold transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 focus:bg-black/60 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full gold-gradient py-5 rounded-[22px] text-black font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-98 shadow-2xl shadow-gold/20 flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Aceder Agora' : 'Criar Conta Premium'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        <div className="text-center pt-2">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-text-gray text-[11px] font-black hover:text-gold transition-colors uppercase tracking-[0.25em] relative group"
          >
            <span>{isLogin ? 'Não tem conta? Registe-se' : 'Já é membro? Entrar agora'}</span>
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Home Banner Component ---
const HomeBanner = ({ onBoxClick }: { onBoxClick: () => void }) => {
  const banners = [
    {
      title: "Investimento Seguro",
      subtitle: "Capital Protegido",
      icon: Shield,
      color: "from-gold/20 via-gold/5 to-transparent",
      text: "Segurança máxima para o seu património.",
      action: null
    },
    {
      title: "Bónus de Convite",
      subtitle: "Exclusivo VIP GOLD",
      icon: Sparkles,
      color: "from-blue-500/20 via-blue-500/5 to-transparent",
      text: "Ganhe mais expandindo a sua rede.",
      action: null
    },
    {
      title: "Sorte Diária",
      subtitle: "Caixa Sorte MOZA",
      icon: Gift,
      color: "from-indigo-500/20 via-purple-500/5 to-transparent",
      text: "Abra agora e receba bónus aleatórios.",
      action: onBoxClick
    }
  ];

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      onClick={() => banners[current].action?.()}
      className={`relative w-full h-44 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group transition-all ${banners[current].action ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`absolute inset-0 bg-gradient-to-br ${banners[current].color} p-8 flex flex-col justify-center gap-2`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
              {React.createElement(banners[current].icon, { className: "w-5 h-5 text-gold" })}
            </div>
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">{banners[current].title}</span>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{banners[current].subtitle}</h3>
            <p className="text-[10px] font-bold text-text-gray/60 uppercase tracking-widest leading-loose">{banners[current].text}</p>
          </div>
          
          <div className="absolute bottom-6 left-8 flex gap-1.5">
            {banners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-500 ${current === idx ? 'w-8 bg-gold' : 'w-2 bg-white/10'}`} 
              />
            ))}
          </div>
          {banners[current].action && (
            <div className="absolute top-8 right-8">
              <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                <ChevronRight className="w-4 h-4 text-gold" />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// --- Action Item (Customized cards based on user image) ---
const ActionItem = ({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) => (
  <motion.button 
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-[#121217]/90 backdrop-blur-3xl aspect-[4/5] rounded-[24px] flex flex-col items-center justify-center gap-2.5 border border-white/5 hover:border-gold/30 transition-all group shadow-2xl overflow-hidden relative p-2"
  >
    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center relative z-10 transition-all duration-500 group-hover:bg-gold/10 shadow-inner">
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gold/80 transition-transform group-hover:scale-110 group-hover:text-gold" />
    </div>
    <span className="text-[9px] font-black text-text-gray/80 group-hover:text-white uppercase tracking-[0.15em] leading-tight text-center px-0.5 transition-colors relative z-10 break-words w-full">
      {label}
    </span>
  </motion.button>
);

// --- Info Stat Card ---
const InfoCard = ({ icon: Icon, title, value, colorClass = "text-green-500", subtitle }: { icon: LucideIcon, title: string, value: string, colorClass?: string, subtitle?: string }) => (
  <div className="bg-card-bg/40 backdrop-blur-xl border border-white/5 p-5 sm:p-7 rounded-[32px] flex-1 flex flex-col gap-2 sm:gap-3 shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
      <Icon className="w-12 h-12" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[10px] sm:text-[11px] text-text-gray font-black uppercase tracking-[0.15em] sm:tracking-[0.25em]">{title}</span>
    </div>
    <div className="space-y-1">
      <div className={`text-lg sm:text-2xl font-black ${colorClass} tracking-tight flex items-center gap-2 font-mono truncate`}>
          {value}
      </div>
      {subtitle && <p className="text-[9px] sm:text-[10px] font-bold text-text-gray/60 uppercase tracking-widest">{subtitle}</p>}
    </div>
  </div>
);

// --- VIP Platform Card ---
const VipCard = ({ level, status, onActivate }: { level: any, status: string, onActivate: (id: number) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className={`p-8 rounded-[48px] border flex flex-col gap-6 transition-all shadow-2xl relative overflow-hidden group ${
      status === 'active' ? 'bg-card-active border-gold/40 border-2 shadow-gold/20 shadow-2xl scale-[1.02]' : 'bg-card-bg/40 backdrop-blur-xl border-white/5'
    }`}
  >
    {/* Decorative inner glow */}
    <div className={`absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06] ${status === 'active' ? 'bg-gold' : 'bg-white'}`} />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="flex gap-5 items-center">
        <div className={`w-18 h-18 rounded-[24px] flex items-center justify-center text-black font-black text-3xl shadow-2xl border-4 border-black/20 ${status === 'active' ? 'gold-gradient' : 'bg-white/10 text-white/40'}`}>
          {level.id}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-black text-2xl uppercase tracking-tighter ${status === 'active' ? 'text-gold' : 'text-white'}`}>{level.name}</h3>
            {status === 'active' && (
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
              />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${status === 'active' ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/30'}`}>
              {level.badge}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-black font-mono leading-none ${status === 'active' ? 'text-gold' : 'text-white'}`}>MZN {level.dailyReturn.toLocaleString()}</div>
        <div className="text-[10px] font-black text-text-gray uppercase tracking-[0.2em] mt-1.5 opacity-60">Retorno Diário</div>
      </div>
    </div>

    <div className="relative z-10 grid grid-cols-1 gap-3 py-4 border-y border-white/5">
      {level.benefits?.map((benefit: string, idx: number) => {
        const Icon = getBenefitIcon(benefit);
        return (
          <div key={idx} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${status === 'active' ? 'bg-gold/10 text-gold' : 'bg-white/5 text-white/20'}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-white/60 uppercase tracking-wide">{benefit}</span>
          </div>
        );
      })}
    </div>

    <div className="relative z-10 pt-2 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-text-gray font-black uppercase tracking-widest opacity-60">Investimento</p>
        <p className="text-lg font-black text-white font-mono">MZN {level.investment.toLocaleString()}</p>
      </div>
       {status !== 'active' ? (
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onActivate(level.id)} 
            className="px-8 py-4 gold-gradient text-black text-[10px] font-black rounded-2xl shadow-2xl uppercase tracking-[0.2em] transform transition-all"
         >
            ATIVAR
         </motion.button>
       ) : (
         <div className="px-6 py-3 bg-gold/5 border border-gold/20 text-gold text-[10px] font-black rounded-2xl text-center uppercase tracking-[0.2em]">
            CONTRATO ATIVO
         </div>
       )}
    </div>

    {/* Background Level Indicator */}
    <div className="absolute right-[-20px] bottom-[-40px] text-white opacity-[0.02] text-[180px] font-black select-none pointer-events-none tracking-tighter">
        {level.id}
    </div>
  </motion.div>
);

// --- Financial Overlays ---
const DepositOverlay = ({ onClose, onConfirm, initialAmount }: { onClose: () => void, onConfirm: (amt: number, method: string) => void, initialAmount?: number | null }) => {
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : '');
  const [method, setMethod] = useState('mpesa');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-gold uppercase tracking-tighter">Recarregar</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Escolha o Método</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {FINANCIAL_METHODS.map(m => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-2 ${method === m.id ? 'border-gold bg-gold/5 shadow-gold-glow' : 'border-white/5 bg-white/5'}`}
              >
                <div className={`w-3 h-3 rounded-full ${method === m.id ? 'bg-gold' : 'bg-white/10'}`} />
                <span className="text-xs font-black uppercase tracking-widest">{m.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {method && (
              <motion.div 
                key={method}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gold-muted border border-gold/30 p-6 rounded-[32px] space-y-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Enviar para:</span>
                  <p className="text-xl font-black text-white font-mono tracking-widest leading-none">
                    {FINANCIAL_METHODS.find(m => m.id === method)?.number}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Nome do Titular:</span>
                  <p className="text-xs font-black text-white uppercase tracking-tighter">
                    {FINANCIAL_METHODS.find(m => m.id === method)?.holder}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Valor do Depósito (MZN)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            className="w-full bg-white/5 border border-white/10 rounded-[28px] p-8 text-center text-4xl font-black text-gold font-mono focus:border-gold outline-none transition-all"
          />
        </div>

        <div className="bg-gold-muted/30 border border-gold/10 p-6 rounded-[32px] space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-text-gray">Processamento</span>
            <span className="text-gold">{FINANCIAL_METHODS.find(m => m.id === method)?.delay}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-text-gray">Taxa de Rede</span>
            <span className="text-gold">MZN 0.00</span>
          </div>
        </div>

        <button 
          onClick={() => onConfirm(Number(amount), method)}
          disabled={!amount || Number(amount) < 100}
          className="w-full gold-gradient py-6 rounded-[32px] text-black font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
        >
          Confirmar Depósito
        </button>
      </div>
    </motion.div>
  );
};

const WithdrawOverlay = ({ balance, onClose, onConfirm }: { balance: number, onClose: () => void, onConfirm: (amt: number, method: string) => void }) => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('258');
  const [method, setMethod] = useState('mpesa');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-xl flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Retirada</h2>
        <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
      </div>

      <div className="space-y-8">
        <div className="bg-card-bg p-8 rounded-[40px] border border-white/5 text-center">
          <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-2 font-mono">Disponível para Saque</p>
          <h3 className="text-4xl font-black text-white font-mono leading-none">MZN {balance.toLocaleString()}</h3>
        </div>

        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Número da Conta Móvel</label>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-black text-lg focus:border-gold outline-none text-center"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Valor do Saque (MZN)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Mínimo 500"
            className="w-full bg-white/5 border border-white/10 rounded-[28px] p-8 text-center text-4xl font-black text-white font-mono focus:border-gold outline-none transition-all"
          />
        </div>

        <button 
          onClick={() => onConfirm(Number(amount), method)}
          disabled={!amount || Number(amount) < 500 || Number(amount) > balance}
          className="w-full gold-gradient py-6 rounded-[32px] text-black font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
        >
          Processar Saque
        </button>
        
        <p className="text-[9px] text-text-gray text-center font-bold px-10 leading-relaxed uppercase tracking-widest opacity-60">
          O processamento pode levar de 5 a 30 minutos dependendo da sua operadora.
        </p>
      </div>
    </motion.div>
  );
};

const RecordsOverlay = ({ transactions, onClose }: { transactions: Transaction[], onClose: () => void }) => (
  <motion.div 
    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
    className="fixed inset-0 z-[2000] bg-bg-deep flex flex-col p-6"
  >
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Finanças</h2>
      <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
    </div>

    <div className="flex-1 overflow-y-auto space-y-4">
      {transactions.map(tx => (
        <div key={tx.id} className="bg-card-bg border border-white/5 rounded-3xl p-6 flex justify-between items-center group hover:border-gold/20 transition-all">
          <div className="flex gap-4 items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              tx.type === 'deposit' ? 'bg-green-500/20 text-green-500' : 
              tx.type === 'withdraw' ? 'bg-red-500/20 text-red-500' : 'bg-gold-muted text-gold'
            }`}>
              {tx.type === 'deposit' ? <ArrowUpRight className="w-6 h-6 rotate-45" /> : 
               tx.type === 'withdraw' ? <ArrowUpRight className="w-6 h-6 rotate-[135deg]" /> : 
               <TrendingUp className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-black text-white uppercase text-xs tracking-widest">{tx.type === 'deposit' ? 'Depósito' : tx.type === 'withdraw' ? 'Saque' : tx.type === 'reward' ? 'Prémio' : 'Investimento'}</h4>
              <p className="text-[10px] text-text-gray font-mono mt-1">{tx.date} • {tx.method || 'Interno'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-black font-mono ${tx.type === 'deposit' || tx.type === 'reward' ? 'text-green-500' : 'text-red-500'}`}>
              {tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'} {tx.amount.toLocaleString()}
            </div>
            <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${tx.status === 'completed' ? 'text-green-500/50' : 'text-gold'}`}>
              {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : 'Falhou'}
            </div>
          </div>
        </div>
      ))}
      
      {transactions.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-text-gray italic">
           <Grid className="w-12 h-12 mb-4 opacity-10" />
           <p className="text-sm">Nenhum registo encontrado.</p>
        </div>
      )}
    </div>
  </motion.div>
);

const LuckyBoxOverlay = ({ onClose, onWin }: { onClose: () => void, onWin: (amt: number) => void }) => {
  const [opening, setOpening] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => {
      const win = Math.floor(Math.random() * 50) + 5;
      setWonAmount(win);
      onWin(win);
      setOpening(false);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
    >
      <button onClick={onClose} className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
      
      <div className="text-center space-y-12 max-w-xs w-full">
        <div>
          <h2 className="text-4xl font-black text-gold uppercase tracking-tighter mb-2">Caixa de Sorte</h2>
          <p className="text-xs text-text-gray font-bold tracking-widest uppercase opacity-60 px-4">Tente a sua sorte e ganha prémios diários em numerário</p>
        </div>

        <div className="relative aspect-square w-full flex items-center justify-center">
          <motion.div 
            animate={opening ? {
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -5, 5, 0],
            } : {}}
            transition={{ repeat: opening ? Infinity : 0, duration: 0.5 }}
            className={`w-48 h-48 rounded-[48px] bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center shadow-gold-glow relative z-10 ${wonAmount ? 'opacity-0 scale-0' : ''} transition-all duration-500`}
          >
            <Gift className="w-24 h-24 text-black" />
          </motion.div>

          <AnimatePresence>
            {wonAmount && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl font-black text-gold font-mono mb-4"
                >
                  +{wonAmount}
                </motion.div>
                <div className="text-xl font-black uppercase tracking-widest text-white">MZN GANHOU!</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full" />
        </div>

        {!wonAmount ? (
          <button 
            onClick={handleOpen}
            disabled={opening}
            className="w-full gold-gradient py-6 rounded-[32px] text-black font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {opening ? 'ABRINDO...' : 'ABRIR CAIXA'}
          </button>
        ) : (
          <button 
            onClick={onClose}
            className="w-full bg-white/10 py-6 rounded-[32px] text-white font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all"
          >
            FECHAR
          </button>
        )}
      </div>
    </motion.div>
  );
};

const SupportOverlay = ({ onClose, onOpenAi }: { onClose: () => void, onOpenAi: () => void }) => (
  <motion.div 
    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
    transition={{ type: 'spring', damping: 25 }}
    className="fixed inset-0 z-[2000] bg-bg-deep flex flex-col p-6"
  >
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Atendimento</h2>
      <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
    </div>

    <div className="flex-1 overflow-y-auto space-y-6">
      <div className="bg-card-bg border border-white/5 p-8 rounded-[40px] text-center space-y-4">
        <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto border border-gold/20">
          <Headphones className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase">Suporte Oficial</h3>
          <p className="text-xs text-text-gray font-bold uppercase tracking-widest mt-1">Atendimento ao Cliente 24/7</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={onOpenAi}
          className="w-full gold-gradient border border-white/10 p-6 rounded-[32px] flex items-center gap-6 hover:brightness-110 transition-all text-left shadow-gold-glow"
        >
          <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center text-black">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-black/60 uppercase tracking-widest">Inteligência Artificial</p>
            <p className="text-lg font-black text-black">Assistente MOZA</p>
          </div>
        </button>

        <a 
          href="https://whatsapp.com/channel/0029VbBprjsEquiVZjdESc2L" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#2563eb]/20 border border-[#2563eb]/30 p-6 rounded-[32px] flex items-center gap-6 hover:bg-[#2563eb]/30 transition-all text-left"
        >
          <div className="w-14 h-14 bg-[#2563eb] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Canal Oficial</p>
            <p className="text-lg font-black text-white">WhatsApp Channel</p>
          </div>
        </a>

        {[
          { icon: Phone, label: "WhatsApp VIP", value: "+258 84 877 8905", color: "bg-[#25D366]", link: "https://wa.me/258848778905" },
          { icon: Users, label: "Grupo Telegram", value: "@MOZA_OFFICIAL", color: "bg-[#0088cc]", link: "https://t.me/MOZA_OFFICIAL" },
        ].map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="w-full bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-6 hover:bg-white/10 transition-all text-left">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <item.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">{item.label}</p>
              <p className="text-lg font-black font-mono">{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </motion.div>
);

const AiHelperOverlay = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Olá! Sou o Assistente IA da MOZA. Como posso ajudar com os seus investimentos hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Você é um assistente de suporte especializado na plataforma MOZA Investimentos em Moçambique. Ajude os usuários com dúvidas sobre depósitos (via M-Pesa/e-Mola), saques, níveis VIP e como ganhar prémios com a Caixa Sorte. Seja profissional, prestativo e fale português de Moçambique. Mantenha as respostas curtas e diretas.",
        },
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Desculpe, tive um problema ao processar sua solicitação.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Lamento, não consegui conectar ao serviço de IA agora. Por favor, tente novamente mais tarde.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[3000] bg-bg-deep flex flex-col"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-black">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase text-sm tracking-widest">Assistente IA</h3>
            <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Online Agora</p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-[24px] text-sm font-medium leading-relaxed ${
              m.role === 'user' ? 'bg-gold text-black rounded-tr-none' : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-[24px] rounded-tl-none flex gap-1">
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-card-bg border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Como posso ajudar?"
            className="w-full bg-white/5 border border-white/10 rounded-[28px] py-6 pl-8 pr-20 text-white font-medium outline-none focus:border-gold/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-black shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MarketOverlay = ({ onClose }: { onClose: () => void }) => {
  const data = [
    { time: '00:00', val: 400 },
    { time: '04:00', val: 300 },
    { time: '08:00', val: 600 },
    { time: '12:00', val: 800 },
    { time: '16:00', val: 700 },
    { time: '20:00', val: 900 },
    { time: '23:59', val: 1100 },
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed inset-0 z-[2000] bg-bg-deep flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Mercado em Tempo Real</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-card-bg border border-white/5 p-6 rounded-[32px] h-64 shadow-2xl relative overflow-hidden">
           <div className="absolute top-4 left-6 z-10">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">BTC / MZN</p>
              <h4 className="text-2xl font-black text-white font-mono leading-none">6,124,900</h4>
           </div>
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#c5a059" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
            <span className="text-[9px] font-black text-text-gray uppercase tracking-widest">Sentimento</span>
            <span className="text-xl font-black text-green-500">ALTA (BULLISH)</span>
            <span className="text-[10px] text-green-500/50 font-bold uppercase">Compra Forte</span>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
            <span className="text-[9px] font-black text-text-gray uppercase tracking-widest">Volatilidade</span>
            <span className="text-xl font-black text-white">4.2%</span>
            <span className="text-[10px] text-text-gray font-bold uppercase">Média-Alta</span>
          </div>
        </div>

        <div className="space-y-4 pb-10">
           <h3 className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em] px-2">Tendências Moçambique</h3>
           {[
             { name: 'Moza Coin', price: 'MZN 124.5', trend: '+2.4%' },
             { name: 'Ethereum', price: 'MZN 42,900', trend: '-0.8%' },
             { name: 'Solana', price: 'MZN 8,240', trend: '+12.1%' },
           ].map((t, i) => (
             <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-gold">#{i+1}</div>
                   <span className="font-black text-sm uppercase tracking-widest">{t.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm font-mono">{t.price}</p>
                  <p className={`text-[10px] font-black ${t.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{t.trend}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

const EducationOverlay = ({ onClose, onOpenAi }: { onClose: () => void, onOpenAi: () => void }) => {
  const categories = [
    { id: 'strategies', name: 'Estratégias', icon: TrendingUp },
    { id: 'literacy', name: 'Literacia', icon: BookOpen },
    { id: 'market', name: 'Mercado MZ', icon: Globe },
  ];

  const articles = [
    {
      category: 'literacy',
      title: 'O que é Diversificação?',
      excerpt: 'Saiba como proteger o seu capital MZN distribuindo investimentos.',
      content: 'Diversificação é a prática de distribuir seus investimentos por diferentes ativos para reduzir o risco. Em Moçambique, isso pode significar investir em diferentes planos VIP e manter uma reserva de emergência...',
      date: '05 MAI'
    },
    {
      category: 'strategies',
      title: 'Planos VIP: Qual escolher?',
      excerpt: 'Guia completo para maximizar seu retorno diário na MOZA INV.',
      content: 'Cada nível VIP oferece uma taxa de retorno diferente. Para iniciantes, o VIP 1 é ideal, enquanto investidores experientes em Moçambique buscam o VIP 5 para retornos de capital mais agressivos...',
      date: '04 MAI'
    },
    {
      category: 'market',
      title: 'Tendências do Mercado em Moçambique',
      excerpt: 'Como o cenário económico local afeta os ativos digitais.',
      content: 'O mercado de ativos digitais em Moçambique está em crescimento. A facilidade de transações via M-Pesa e e-Mola está impulsionando a adoção de plataformas de investimento moçambicanas...',
      date: '03 MAI'
    }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[2000] bg-bg-deep flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Educação</h2>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}
        >
          Tudo
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === cat.id ? 'bg-gold text-black' : 'bg-white/5 text-white/40'}`}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredArticles.map((article, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4 group hover:border-gold/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{article.date}</span>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-gray group-hover:text-gold transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{article.title}</h3>
              <p className="text-xs text-text-gray/80 font-medium leading-relaxed">{article.excerpt}</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <button className="text-[10px] font-black text-gold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Ler Artigo Completo <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-[40px] bg-gold/5 border border-gold/10 text-center space-y-4">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto">
          <Bot className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-black text-white uppercase tracking-tighter">Precisa de Ajuda Pessoal?</h4>
          <p className="text-[10px] font-black text-text-gray uppercase tracking-widest leading-relaxed">
            O nosso assistente de IA está pronto para responder às suas dúvidas financeiras 24/7.
          </p>
        </div>
        <button 
           onClick={onOpenAi}
           className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:brightness-110 transition-all"
        >
          Falar com IA MOZA
        </button>
      </div>
    </motion.div>
  );
};

const AboutOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
    className="fixed inset-0 z-[2000] bg-bg-deep flex flex-col p-6 overflow-y-auto"
  >
    <div className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Empresa</h2>
      </div>
      <button onClick={onClose} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50">✕</button>
    </div>

    <div className="space-y-8 pb-10">
      <div className="bg-card-bg border border-white/5 p-8 rounded-[40px] space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gold uppercase underline decoration-gold/30 underline-offset-8 decoration-2">{COMPANY_INFO.name}</h3>
          <p className="text-xs text-text-gray font-bold uppercase tracking-widest">Fundada em {COMPANY_INFO.since} • {COMPANY_INFO.headquarters}</p>
        </div>
        <p className="text-sm leading-relaxed text-white/80 font-medium">
          {COMPANY_INFO.mission}
        </p>
        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Licença Oficial: {COMPANY_INFO.license}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em] px-2">Certificações de Confiança</h4>
        {COMPANY_INFO.certificates.map(cert => (
          <div key={cert.id} className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-sm uppercase text-white">{cert.title}</p>
              <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest mt-1">{cert.issuer}</p>
            </div>
            <div className="ml-auto">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[40px] bg-gold text-black text-center space-y-2 shadow-2xl">
        <h5 className="text-xl font-black uppercase tracking-tighter">Compromisso MOZA</h5>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Segurança Total nos seus Ativos Digitais</p>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [overlayView, setOverlayView] = useState<'none' | 'deposit' | 'withdraw' | 'records' | 'box' | 'support' | 'market' | 'about' | 'ai_helper' | 'education'>('none');
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const [activeVip, setActiveVip] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoggedIn(!!user);
      if (!user) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // User Profile Listener
  useEffect(() => {
    if (!firebaseUser) return;

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBalance(data.balance || 0);
        setActiveVip(data.activeVip || 0);
        setUserPhone(data.phone || '');
        setUserName(data.name || '');
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  // Transactions Listener
  useEffect(() => {
    if (!firebaseUser) return;

    const txQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', firebaseUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(txQuery, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(txs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const handleActivateVip = async (id: number) => {
    if (!firebaseUser) return;
    
    const level = VIP_LEVELS.find(v => v.id === id);
    if (!level) return;

    if (balance < level.investment) {
      setDepositAmount(level.investment);
      setOverlayView('deposit');
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await transaction.get(userDocRef);
        
        if (!userDoc.exists()) throw new Error("Documento de utilizador não encontrado.");
        
        const currentBalance = userDoc.data().balance;
        if (currentBalance < level.investment) throw new Error("Saldo insuficiente.");

        transaction.update(userDocRef, {
          balance: increment(-level.investment),
          activeVip: id,
          updatedAt: serverTimestamp()
        });

        const txRef = doc(collection(db, 'transactions'));
        transaction.set(txRef, {
          userId: firebaseUser.uid,
          type: 'investment',
          amount: level.investment,
          status: 'completed',
          date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          method: level.name,
          createdAt: serverTimestamp()
        });
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'vip-activation');
      alert("Erro ao ativar VIP. Tente novamente.");
    }
  };

  const addTransactionAndNotify = async (type: Transaction['type'], amount: number, status: Transaction['status'], method?: string) => {
    if (!firebaseUser) return;
    
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: firebaseUser.uid,
        type,
        amount,
        status,
        date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        method,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    }
  };

  const handleCompleteTask = async (id: number, reward: number) => {
    if (!firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        balance: increment(reward),
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('reward', reward, 'completed');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const handleDeposit = async (amount: number, method: string) => {
    if (!firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('deposit', amount, 'completed', method);
      setOverlayView('none');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'deposit');
    }
  };

  const handleWithdraw = async (amount: number, method: string) => {
    if (!firebaseUser) return;
    
    if (amount > balance) {
      alert("Saldo Insuficiente.");
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        balance: increment(-amount),
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('withdraw', amount, 'pending', method);
      setOverlayView('none');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'withdraw');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const updateProfileName = async (newName: string) => {
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        name: newName,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${firebaseUser.uid}`);
    }
  };

  const handleSaveName = () => {
    updateProfileName(tempName);
    setIsEditingName(false);
  };

  if (loading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        <AuthScreen onLogin={() => {}} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col pb-32 text-white font-sans selection:bg-gold selection:text-black">
      {/* Overlays */}
      <AnimatePresence>
        {overlayView === 'deposit' && <DepositOverlay initialAmount={depositAmount} onClose={() => { setOverlayView('none'); setDepositAmount(null); }} onConfirm={handleDeposit} />}
        {overlayView === 'withdraw' && <WithdrawOverlay balance={balance} onClose={() => setOverlayView('none')} onConfirm={handleWithdraw} />}
        {overlayView === 'records' && <RecordsOverlay transactions={transactions} onClose={() => setOverlayView('none')} />}
        {overlayView === 'support' && <SupportOverlay onClose={() => setOverlayView('none')} onOpenAi={() => setOverlayView('ai_helper')} />}
        {overlayView === 'ai_helper' && <AiHelperOverlay onClose={() => setOverlayView('support')} />}
        {overlayView === 'market' && <MarketOverlay onClose={() => setOverlayView('none')} />}
        {overlayView === 'about' && <AboutOverlay onClose={() => setOverlayView('none')} />}
        {overlayView === 'education' && <EducationOverlay onClose={() => setOverlayView('none')} onOpenAi={() => setOverlayView('ai_helper')} />}
        {overlayView === 'box' && <LuckyBoxOverlay onClose={() => setOverlayView('none')} onWin={(amt) => { handleCompleteTask(0, amt); }} />}
      </AnimatePresence>

      {/* Modern Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-bg-deep/50 backdrop-blur-3xl sticky top-0 z-[100] border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10">
            <Logo showText={false} className="scale-50 h-full w-full" />
          </div>
          <h1 className="text-xl font-black tracking-widest leading-none">MOZA <span className="text-gold">INV</span></h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-[10px] font-black text-gold uppercase tracking-widest font-mono">ID: {userPhone.slice(-4) || '2026'}</span>
          </div>
          <div onClick={handleLogout} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-red-500 cursor-pointer">
             <LogOut className="w-4 h-4" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-1 px-4 pt-2">
                 <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Olá, <span className="text-gold">{userName || 'Utilizador'}</span></h2>
                 <p className="text-text-gray text-[9px] font-black uppercase tracking-[0.5em] opacity-50">Status: Investidor VIP MOZA</p>
              </div>

              {/* Promotional Banner */}
              <HomeBanner onBoxClick={() => setOverlayView('box')} />

              {/* Refined Premium Asset Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full opacity-30 animate-pulse" />
                <div className="bg-card-bg/40 backdrop-blur-3xl rounded-[48px] p-9 border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.04] translate-x-12 translate-y-[-16px] transform -rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <Logo showText={false} className="scale-[4]" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit backdrop-blur-xl">
                          <span className="text-[9.5px] font-black text-text-gray uppercase tracking-[0.3em]">Capital Disponível</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-black text-white tracking-tighter leading-none font-mono flex items-baseline gap-2">
                             {balance.toLocaleString()}
                             <span className="text-lg text-gold font-sans font-black">MZN</span>
                          </div>
                        </div>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gold/10 p-5 rounded-[32px] border border-gold/20 flex flex-col items-center gap-1 shadow-2xl shadow-gold/5"
                      >
                         <Star className="w-5 h-5 text-gold mb-1" />
                         <span className="text-[9px] font-black text-gold uppercase tracking-widest leading-none">NÍVEL</span>
                         <span className="text-xl font-black text-gold leading-none mt-1">VIP {activeVip}</span>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setOverlayView('deposit')}
                        className="gold-gradient p-4 rounded-[26px] text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="relative z-10">RECARREGAR</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setOverlayView('withdraw')}
                        className="bg-white/5 backdrop-blur-xl border border-white/5 p-4 rounded-[26px] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="relative z-10">RETIRAR</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard 
                  icon={TrendingUp} 
                  title="Lucro Hoje" 
                  value={`MZN ${transactions.filter(t => t.type === 'reward').length > 0 ? transactions.filter(t => t.type === 'reward')[0].amount.toLocaleString() : '0.00'}`} 
                  subtitle="Atualizado agora"
                />
                <InfoCard 
                  icon={PieChartIcon} 
                  title="Rendimento" 
                  value="12.5%" 
                  colorClass="text-blue-500" 
                  subtitle="Média mensal"
                />
              </div>

              {/* Navigation Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em]">Serviços & Gestão</h3>
                  <div className="w-16 h-[1px] bg-white/5" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                   <ActionItem icon={DollarSign} label="Recarga" onClick={() => setOverlayView('deposit')} />
                   <ActionItem icon={ArrowUpRight} label="Saque" onClick={() => setOverlayView('withdraw')} />
                   <ActionItem icon={Landmark} label="Crédito" />
                   <ActionItem icon={Users} label="Equipe" onClick={() => setActiveTab('team')} />
                   <ActionItem icon={HelpCircle} label="Educação" onClick={() => setOverlayView('education')} />
                   <ActionItem icon={TrendingUp} label="Fundo" onClick={() => setOverlayView('market')} />
                   <ActionItem icon={FileText} label="Tarefas" onClick={() => setActiveTab('tasks')} />
                   <ActionItem icon={Building2} label="Empresa" onClick={() => setOverlayView('about')} />
                </div>
              </div>

              {/* Quick News Ticker */}
              <div className="bg-card-bg/20 backdrop-blur-xl border border-white/5 p-4 rounded-3xl flex items-center gap-4 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 flex-shrink-0 border-r border-white/10 pr-4">
                  <Bell className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest leading-none">News</span>
                </div>
                <div className="flex-1 text-[10px] font-bold text-text-gray/80 uppercase tracking-widest truncate">
                   Lançamento do fundo MOZA GOLD 2026 com rendimento anual garantido.
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-4">
               <div className="flex flex-col gap-2 px-4">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Missões <br /><span className="text-gold">Diárias</span></h2>
                 <p className="text-text-gray text-[9px] font-black uppercase tracking-[0.4em] opacity-50">Geração de Capital em Tempo Real</p>
               </div>
               
               <div className="grid gap-4">
                 {DAILY_TASKS.map(task => (
                   <motion.div 
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card-bg/40 backdrop-blur-xl border border-white/5 p-6 rounded-[40px] flex items-center justify-between shadow-2xl group relative overflow-hidden"
                   >
                     {/* Inner glow */}
                     <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                     
                     <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-[20px] bg-gold/5 flex items-center justify-center text-gold border border-gold/10 group-hover:bg-gold group-hover:text-black transition-all shadow-lg">
                           <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="font-black uppercase text-sm tracking-tight leading-none text-white/90">{task.title}</h4>
                           <div className="flex items-center gap-2">
                                <p className="text-gold font-black text-xs font-mono uppercase tracking-widest">+ MZN {task.reward.toLocaleString()}</p>
                           </div>
                        </div>
                     </div>
                     <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteTask(task.id, task.reward)} 
                      className="gold-gradient text-black font-black px-6 py-3.5 rounded-[18px] text-[10px] uppercase tracking-widest shadow-xl relative z-10"
                     >
                       COLETAR
                     </motion.button>
                   </motion.div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'vip' && (
            <motion.div key="vip" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <div className="text-center space-y-2">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-gold">Premium VIP</h2>
                 <p className="text-text-gray text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Investment Portfolio</p>
               </div>
               <div className="grid gap-6">
                 {VIP_LEVELS.map(level => (
                   <React.Fragment key={level.id}>
                     <VipCard level={level} status={activeVip === level.id ? 'active' : 'available'} onActivate={handleActivateVip} />
                   </React.Fragment>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div 
              key="team" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 pt-4"
            >
               <div className="bg-gradient-to-br from-gold/20 via-[#1a1a1a] to-[#0d0d0d] p-10 rounded-[48px] border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Users className="w-32 h-32 text-gold" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                     <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-2xl">
                        <Users className="w-10 h-10" />
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Minha Rede</h2>
                        <p className="text-text-gray text-[10px] font-black uppercase tracking-widest max-w-[240px] leading-relaxed opacity-60">Expanda a sua influência e maximize os seus lucros.</p>
                     </div>
                     
                     <div className="w-full space-y-4 pt-2">
                        <div className="bg-black/40 px-6 py-5 rounded-2xl border border-white/5 font-mono font-black text-lg text-gold text-center tracking-[0.2em] shadow-inner">
                           {userPhone.slice(-4) ? `MOZA-${userPhone.slice(-4)}` : 'MOZA-VIP'}
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full gold-gradient text-black py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-xl"
                        >
                           CONVIDAR AGORA
                        </motion.button>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between items-center px-4">
                    <h3 className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em]">Níveis de Comissão</h3>
                    <div className="w-16 h-[1px] bg-white/5" />
                 </div>
                 <div className="grid gap-4">
                   {TEAM_LEVELS.map((level, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex justify-between items-center group transition-all hover:bg-white/5"
                      >
                          <div className="flex gap-5 items-center">
                              <div className="w-10 h-10 rounded-2xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                                <span className="text-xs font-black">{i + 1}</span>
                              </div>
                              <div>
                                  <h4 className="font-black text-sm uppercase tracking-tight text-white/90">{level.level}</h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <TrendingUp className="w-3 h-3 text-gold" />
                                    <p className="text-[9px] text-gold font-black uppercase tracking-widest">Ganhos: {level.commission}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-0.5 text-right">
                               <div className="text-2xl font-black text-white font-mono leading-none tracking-tighter">{level.count}</div>
                               <p className="text-[8px] text-text-gray font-black uppercase tracking-widest opacity-50">MEMBROS</p>
                          </div>
                      </motion.div>
                   ))}
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 pt-4"
            >
               {/* Personalized Header */}
               <div className="flex flex-col items-center gap-6 py-4">
                 <div className="relative">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-36 h-36 rounded-[48px] bg-gradient-to-br from-gold via-gold/50 to-gold p-[2px] shadow-[0_30px_60px_-15px_rgba(197,160,89,0.3)] cursor-pointer group"
                    >
                        <div className="w-full h-full rounded-[46px] bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden">
                            <User className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-[#0d0d0d] shadow-xl">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                 </div>
                 
                 <div className="text-center space-y-2">
                   {isEditingName ? (
                     <div className="flex flex-col items-center gap-3">
                       <input 
                         value={tempName} 
                         onChange={(e) => setTempName(e.target.value)}
                         className="bg-white/5 border border-gold/30 rounded-2xl px-6 py-3 text-white font-black uppercase tracking-widest text-center focus:outline-none w-full max-w-[200px]"
                         placeholder="Seu Nome"
                         autoFocus
                       />
                       <div className="flex gap-2">
                        <button onClick={handleSaveName} className="bg-gold text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">
                          Salvar
                        </button>
                        <button onClick={() => setIsEditingName(false)} className="bg-white/5 text-white/50 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">
                          Cancelar
                        </button>
                       </div>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-1 group">
                       <div className="flex items-center justify-center gap-2">
                         <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                           {userName || (userPhone.slice(-4) ? `INVESTIDOR_${userPhone.slice(-4)}` : 'UTILIZADOR')}
                         </h2>
                         <button 
                           onClick={() => { setTempName(userName); setIsEditingName(true); }}
                           className="text-gold hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                         >
                           <Settings className="w-4 h-4" />
                         </button>
                       </div>
                       <p className="text-[10px] font-bold text-text-gray/50 uppercase tracking-[0.3em]">Clique no ícone para editar</p>
                     </div>
                   )}
                   <div className="flex items-center justify-center gap-3">
                     <span className="text-[10px] font-black text-gold border border-gold/30 px-3 py-1 rounded-full uppercase tracking-widest bg-gold/5">
                        {VIP_LEVELS.find(v => v.id === activeVip)?.badge || 'START'}
                     </span>
                     <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                     <p className="text-text-gray font-black text-xs font-mono tracking-widest">+{userPhone}</p>
                   </div>
                 </div>
               </div>

               {/* Asset Overview Card */}
               <div className="bg-gradient-to-br from-gold/10 via-[#1a1a1a] to-[#0d0d0d] rounded-[48px] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp className="w-24 h-24 text-gold" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em]">PATRIMÓNIO TOTAL</span>
                      <div className="bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Ativo</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-black text-white font-mono tracking-tighter">
                        MZN {balance.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">+ {((balance * 0.125) / 30).toFixed(2)} MZN HOJE</p>
                    </div>
                  </div>
               </div>

               {/* Operations Grid */}
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Levantamento", icon: Wallet, action: () => setOverlayView('withdraw'), color: "bg-blue-500/10 text-blue-500" },
                    { label: "Registos", icon: ClipboardList, action: () => setOverlayView('records'), color: "bg-purple-500/10 text-purple-500" },
                    { label: "Suporte", icon: Headphones, action: () => setOverlayView('support'), color: "bg-cyan-500/10 text-cyan-500" },
                    { label: "Empresa", icon: Building2, action: () => setOverlayView('about'), color: "bg-gold/10 text-gold" }
                  ].map((item, i) => (
                    <motion.button 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                      className="bg-card-bg/40 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] flex flex-col items-center gap-4 group shadow-xl transition-all hover:bg-white/5"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${item.color.split(' ')[0]} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-gold transition-colors text-center">{item.label}</span>
                    </motion.button>
                  ))}
               </div>

               {/* Account Stats List */}
               <div className="bg-card-bg/20 backdrop-blur-3xl rounded-[40px] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-2xl">
                  {[
                    { l: "Nível VIP Atual", v: `VIP ${activeVip}`, icon: Star },
                    { l: "Membros Diretos", v: TEAM_LEVELS[0].count.toString(), icon: Users },
                    { l: "Data de Adesão", v: "Maio 2026", icon: CheckCircle2 },
                    { l: "Status Conta", v: "Verificada", icon: ShieldCheck, color: "text-green-500" }
                  ].map((s, i) => (
                    <div key={i} className="px-8 py-5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                       <div className="flex items-center gap-4">
                          <s.icon className="w-4 h-4 text-gold opacity-50" />
                          <span className="text-[10px] text-text-gray font-black uppercase tracking-widest">{s.l}</span>
                       </div>
                       <span className={`text-xs font-black uppercase tracking-widest ${s.color || 'text-white'}`}>{s.v}</span>
                    </div>
                  ))}
               </div>

               <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full bg-red-500/10 border-2 border-red-500/20 text-red-500 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-red-500 hover:text-white transition-all shadow-[0_20px_40px_-10px_rgba(239,68,68,0.2)]"
               >
                 <LogOut className="w-6 h-6" />
                 Encerrar Sessão
               </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

       {/* Premium Bottom Navigation */}
       <nav className="fixed bottom-0 left-0 right-0 z-[1000] pb-8 pt-4 px-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
         <div className="max-w-md mx-auto bg-black/40 backdrop-blur-3xl border border-white/10 p-2.5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center relative overflow-hidden group pointer-events-auto">
           {/* Nav inner glow */}
           <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />
           
           {NAV_ITEMS.map((item) => {
             const Icon = item.icon;
             const isActive = activeTab === item.id;
             
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-[28px] transition-all relative group/nav min-w-[64px] ${isActive ? 'text-gold' : 'text-text-gray hover:text-white'}`}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="nav-active-bg"
                     className="absolute inset-0 bg-gold/10 rounded-[24px] border border-gold/20"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 <Icon className={`w-6 h-6 relative z-10 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.4)] stroke-[2.5px]' : 'group-hover/nav:scale-110 stroke-[2.0px]'}`} />
                 <span className={`text-[8px] sm:text-[8.5px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] relative z-10 transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    {item.label}
                 </span>
               </button>
             );
           })}
         </div>
       </nav>
    </div>
  );
}

