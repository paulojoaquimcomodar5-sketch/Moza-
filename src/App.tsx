/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  GraduationCap,
  XCircle,
  Plus,
  Minus,
  RefreshCcw,
  LayoutDashboard,
  Search,
  AlertCircle,
  Ticket,
  Filter,
  Calendar,
  Clock
} from 'lucide-react';

// --- Overlay Management Context ---
type OverlayType = 'none' | 'deposit' | 'withdraw' | 'records' | 'box' | 'support' | 'market' | 'about' | 'ai_helper' | 'education' | 'loan' | 'admin' | 'deposit_manager' | 'edit_profile';

interface OverlayContextType {
  view: OverlayType;
  data: any;
  openOverlay: (view: OverlayType, data?: any) => void;
  closeOverlay: () => void;
}

const OverlayContext = React.createContext<OverlayContextType | undefined>(undefined);

const useOverlay = () => {
  const context = React.useContext(OverlayContext);
  if (!context) throw new Error('useOverlay must be used within OverlayProvider');
  return context;
};
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
  COMPANY_INFO,
  LANGUAGES,
  TRANSLATIONS
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
  runTransaction,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
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

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// --- Auth Component (Login) ---
interface AuthScreenProps {
  onLogin: (phone: string) => void;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('258');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
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
      const sanitizedPhone = phone.trim().replace(/\s+/g, '').replace(/[^\d]/g, '');
      const normalizedPhone = sanitizedPhone.length >= 12 && sanitizedPhone.startsWith('258') ? sanitizedPhone.slice(3) : sanitizedPhone;
      const isAdminPhone = normalizedPhone === '858778905';
      
      const email = `${normalizedPhone}@moza.com`;

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password.trim());
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password.trim());
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const initialBalance = 25;
        const rewardPercentage = 0.15;
        const referralReward = initialBalance * rewardPercentage;

        await setDoc(userDocRef, {
          phone: normalizedPhone,
          balance: initialBalance,
          activeVip: 0,
          loanBalance: 0,
          role: isAdminPhone ? 'admin' : 'user',
          referredBy: (inviteCodeInput.trim() || 'MOZA2026').toUpperCase(),
          inviteCode: generateInviteCode(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Referral Reward Logic: Give 15% bonus to the inviter
        const code = inviteCodeInput.trim().toUpperCase();
        if (code && code !== 'MOZA2026') {
          try {
            const invitersQuery = query(collection(db, 'users'), where('inviteCode', '==', code), limit(1));
            const inviterSnap = await getDocs(invitersQuery);
            
            if (!inviterSnap.empty) {
              const inviterDoc = inviterSnap.docs[0];
              const inviterRef = doc(db, 'users', inviterDoc.id);
              
              await updateDoc(inviterRef, {
                balance: increment(referralReward),
                updatedAt: serverTimestamp()
              });

              // Add a transaction record for the inviter
              await addDoc(collection(db, 'transactions'), {
                userId: inviterDoc.id,
                amount: referralReward,
                type: 'reward',
                status: 'completed',
                method: `Bónus de Convite (${normalizedPhone})`,
                createdAt: serverTimestamp()
              });
            }
          } catch (err) {
            console.error('[REFERRAL] Reward failed:', err);
          }
        }

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
      
      const sanitizedPhone = phone.trim().replace(/\s+/g, '').replace(/[^\d]/g, '');
      const normalizedPhone = sanitizedPhone.length >= 12 && sanitizedPhone.startsWith('258') ? sanitizedPhone.slice(3) : sanitizedPhone;
      const isAdminPhone = normalizedPhone === '858778905';

      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        if (isAdminPhone && isLogin) {
          setError('ERRO DE ACESSO: Verifique se a senha está correta. Se é o seu primeiro acesso, use a aba "CRIAR CONTA" com a senha admin12.');
        } else {
          setError('DADOS INCORRETOS: Verifique o número e senha. Se ainda não tem conta, use a aba "CRIAR CONTA".');
        }
      } else if (errorCode === 'auth/email-already-in-use') {
        if (isAdminPhone) {
          setError('CONTA JÁ EXISTE: O administrador já está registado. Por favor, clique na aba "LOGIN" acima para entrar.');
        } else {
          setError('ESTE NÚMERO JÁ TEM CONTA: Por favor, clique na aba "LOGIN" acima para entrar no sistema.');
        }
      } else if (errorCode === 'auth/invalid-email') {
        setError('Formato de número inválido. Use apenas dígitos.');
      } else {
        setError(err?.message || 'Falha na autenticação.');
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
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden"
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
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
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
          className="space-y-5 bg-card-bg border border-black/5 p-8 rounded-[40px] shadow-xl relative overflow-hidden group"
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within/input:text-gold transition-colors opacity-40">
                  <Phone className="w-5 h-5" />
                </div>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="258..."
                  disabled={isLoading}
                  className="w-full bg-black/5 border border-black/5 rounded-2xl py-4.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-gold/50 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within/input:text-gold transition-colors opacity-40">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-black/5 border border-black/5 rounded-2xl py-4.5 pl-12 pr-12 text-slate-900 focus:outline-none focus:border-gold/50 focus:bg-white transition-all"
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
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1">Confirmar Senha</label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within/input:text-gold transition-colors opacity-40">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className="w-full bg-black/5 border border-black/5 rounded-2xl py-4.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-gold/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold/60 uppercase tracking-widest ml-1">Código de Convite (Opcional)</label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within/input:text-gold transition-colors opacity-40">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      value={inviteCodeInput}
                      onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                      placeholder="MOZA2026"
                      disabled={isLoading}
                      className="w-full bg-gold/5 border border-gold/10 rounded-2xl py-4.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-gold/50 focus:bg-gold/10 transition-all font-mono placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full gold-gradient py-5 rounded-[22px] text-white font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-98 shadow-xl shadow-gold/10 flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Aceder Agora' : 'Criar Conta Premium'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        <div className="text-center pt-2 space-y-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-text-gray text-[11px] font-black hover:text-gold transition-colors uppercase tracking-[0.25em] relative group"
          >
            <span>{isLogin ? 'Não tem conta? Registe-se' : 'Já é membro? Entrar agora'}</span>
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-300" />
          </button>

          <div className="pt-4 border-t border-black/5">
            <p className="text-[9px] text-text-gray/40 font-black uppercase tracking-[0.3em]">
              Código Oficial Original: <span className="text-gold/60">MOZA2026</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Home Banner Component ---
const HomeBanner = ({ onBoxClick, title, highlight }: { onBoxClick: () => void, title?: string, highlight?: string }) => {
  const banners = [
    {
      title: title || "Investimento Seguro",
      subtitle: highlight || "Capital Protegido",
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
const ActionItem = ({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) => {
  const { openOverlay } = useOverlay();
  
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-slate-100/90 backdrop-blur-3xl aspect-[4/5] rounded-[24px] flex flex-col items-center justify-center gap-2.5 border border-black/5 hover:border-gold/30 transition-all group shadow-md overflow-hidden relative p-2"
    >
      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/5 flex items-center justify-center relative z-10 transition-all duration-500 group-hover:bg-gold/10 shadow-inner">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gold/80 transition-transform group-hover:scale-110 group-hover:text-gold" />
      </div>
      <span className="text-[9px] font-black text-text-gray/80 group-hover:text-slate-900 uppercase tracking-[0.15em] leading-tight text-center px-0.5 transition-colors relative z-10 break-words w-full">
        {label}
      </span>
    </motion.button>
  );
};

// --- Info Stat Card ---
const InfoCard = ({ icon: Icon, title, value, colorClass = "text-green-500", subtitle }: { icon: LucideIcon, title: string, value: string, colorClass?: string, subtitle?: string }) => (
  <div className="bg-card-bg border border-black/5 p-5 sm:p-7 rounded-[32px] flex-1 flex flex-col gap-2 sm:gap-3 shadow-md relative overflow-hidden group">
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
    className={`p-8 rounded-[48px] border flex flex-col gap-6 transition-all shadow-xl relative overflow-hidden group ${
      status === 'active' ? 'bg-card-active border-gold/40 border-2 shadow-gold/10' : 'bg-card-bg border-black/5'
    }`}
  >
    {/* Decorative inner glow */}
    <div className={`absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06] ${status === 'active' ? 'bg-gold' : 'bg-slate-400'}`} />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="flex gap-5 items-center">
        <div className={`w-18 h-18 rounded-[24px] flex items-center justify-center text-white font-black text-3xl shadow-lg border-4 border-black/5 ${status === 'active' ? 'gold-gradient' : 'bg-slate-100 text-slate-400'}`}>
          {level.id}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-black text-2xl uppercase tracking-tighter ${status === 'active' ? 'text-gold' : 'text-slate-900'}`}>{level.name}</h3>
            {status === 'active' && (
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
              />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${status === 'active' ? 'bg-gold/20 text-gold' : 'bg-black/5 text-slate-400'}`}>
              {level.badge}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-black font-mono leading-none ${status === 'active' ? 'text-gold' : 'text-slate-900'}`}>MZN {level.dailyReturn.toLocaleString()}</div>
        <div className="text-[10px] font-black text-text-gray uppercase tracking-[0.2em] mt-1.5 opacity-60">Retorno Diário</div>
      </div>
    </div>

    <div className="relative z-10 grid grid-cols-1 gap-3 py-4 border-y border-black/5">
      {level.benefits?.map((benefit: string, idx: number) => {
        const Icon = getBenefitIcon(benefit);
        return (
          <div key={idx} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${status === 'active' ? 'bg-gold/10 text-gold' : 'bg-black/5 text-slate-400'}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{benefit}</span>
          </div>
        );
      })}
    </div>

    <div className="relative z-10 pt-2 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-text-gray font-black uppercase tracking-widest opacity-60">Investimento</p>
        <p className="text-lg font-black text-slate-900 font-mono">MZN {level.investment.toLocaleString()}</p>
      </div>
       {status !== 'active' ? (
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onActivate(level.id)} 
            className="px-8 py-4 gold-gradient text-white text-[10px] font-black rounded-2xl shadow-xl uppercase tracking-[0.2em] transform transition-all"
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
    <div className="absolute right-[-20px] bottom-[-40px] text-slate-900 opacity-[0.02] text-[180px] font-black select-none pointer-events-none tracking-tighter">
        {level.id}
    </div>
  </motion.div>
);

// --- Financial Overlays ---
const DepositOverlay = ({ onConfirm, settings }: { onConfirm: (amt: number, method: string) => void, settings: any }) => {
  const { data: initialAmount, closeOverlay } = useOverlay();
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : '');
  const [method, setMethod] = useState('mpesa');

  const getMethodData = (methodId: string) => {
    if (methodId === 'mpesa') return { number: settings.mpesaNumber, holder: settings.mpesaHolder };
    if (methodId === 'emola') return { number: settings.emolaNumber, holder: settings.emolaHolder };
    if (methodId === 'bank') return { number: settings.bankNumber, holder: settings.bankHolder };
    return FINANCIAL_METHODS.find(m => m.id === methodId);
  };

  const currentMethodData = getMethodData(method);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Recarregar</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Escolha o Método</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {FINANCIAL_METHODS.map(m => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-2 ${method === m.id ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-black/5 bg-white shadow-sm'}`}
              >
                <div className={`w-3 h-3 rounded-full ${method === m.id ? 'bg-gold' : 'bg-slate-200'}`} />
                <span className={`text-xs font-black uppercase tracking-widest ${method === m.id ? 'text-gold' : 'text-slate-400'}`}>{m.name}</span>
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
                className="bg-gold/5 border border-gold/10 p-6 rounded-[32px] space-y-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Enviar para:</span>
                  <p className="text-xl font-black text-slate-900 font-mono tracking-widest leading-none">
                    {currentMethodData?.number}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Nome do Titular:</span>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                    {currentMethodData?.holder}
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
            className="w-full bg-white border border-black/5 rounded-[28px] p-8 text-center text-4xl font-black text-slate-900 font-mono focus:border-gold outline-none transition-all shadow-sm"
          />
        </div>

        <div className="bg-slate-100 border border-black/5 p-6 rounded-[32px] space-y-2">
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
          className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
        >
          Confirmar Depósito
        </button>
      </div>
    </motion.div>
  );
};

const WithdrawOverlay = ({ balance, onConfirm }: { balance: number, onConfirm: (amt: number, method: string) => void }) => {
  const { closeOverlay } = useOverlay();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('258');
  const [method, setMethod] = useState('mpesa');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Retirada</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[40px] border border-black/5 text-center shadow-sm">
          <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-2 font-mono">Disponível para Saque</p>
          <h3 className="text-4xl font-black text-slate-900 font-mono leading-none">MZN {balance.toLocaleString()}</h3>
        </div>

        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Número da Conta Móvel</label>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-3xl p-6 text-slate-900 font-black text-lg focus:border-gold outline-none text-center shadow-sm"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block mb-4">Valor do Saque (MZN)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Mínimo 500"
            className="w-full bg-white border border-black/5 rounded-[28px] p-8 text-center text-4xl font-black text-slate-900 font-mono focus:border-gold outline-none transition-all shadow-sm"
          />
        </div>

        <button 
          onClick={() => onConfirm(Number(amount), method)}
          disabled={!amount || Number(amount) < 500 || Number(amount) > balance}
          className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
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

const RecordsOverlay = ({ transactions }: { transactions: Transaction[] }) => {
  const { closeOverlay } = useOverlay();
  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Finanças</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

    <div className="flex-1 overflow-y-auto space-y-4">
      {transactions.map(tx => (
        <div key={tx.id} className="bg-white border border-black/5 rounded-3xl p-6 flex justify-between items-center group hover:border-gold/20 transition-all shadow-sm">
          <div className="flex gap-4 items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 
              tx.type === 'withdraw' ? 'bg-red-500/10 text-red-500' : 'bg-gold/10 text-gold'
            }`}>
              {tx.type === 'deposit' ? <ArrowUpRight className="w-6 h-6 rotate-45" /> : 
               tx.type === 'withdraw' ? <ArrowUpRight className="w-6 h-6 rotate-[135deg]" /> : 
               <TrendingUp className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{tx.type === 'deposit' ? 'Depósito' : tx.type === 'withdraw' ? 'Saque' : tx.type === 'reward' ? 'Prémio' : 'Investimento'}</h4>
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
};

const LuckyBoxOverlay = ({ onWin }: { onWin: (amt: number) => void }) => {
  const { closeOverlay } = useOverlay();
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
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col items-center justify-center p-6"
    >
      <button onClick={closeOverlay} className="absolute top-8 right-8 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400 font-black">✕</button>
      
      <div className="text-center space-y-12 max-w-xs w-full">
        <div>
          <h2 className="text-4xl font-black text-gold uppercase tracking-tighter mb-2 italic">Caixa de Sorte</h2>
          <p className="text-xs text-slate-500 font-bold tracking-widest uppercase px-4 leading-relaxed">Tente a sua sorte e ganha prémios diários em numerário</p>
        </div>

        <div className="relative aspect-square w-full flex items-center justify-center">
          <motion.div 
            animate={opening ? {
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -5, 5, 0],
            } : {}}
            transition={{ repeat: opening ? Infinity : 0, duration: 0.5 }}
            className={`w-48 h-48 rounded-[48px] gold-gradient flex items-center justify-center shadow-gold-glow relative z-10 ${wonAmount ? 'opacity-0 scale-0' : ''} transition-all duration-500`}
          >
            <Gift className="w-24 h-24 text-white" />
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
                  className="text-7xl font-black text-gold font-mono mb-4"
                >
                  +{wonAmount}
                </motion.div>
                <div className="text-xl font-black uppercase tracking-widest text-slate-900 border-b-4 border-gold/30 pb-1">MZN GANHOU!</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full" />
        </div>

        {!wonAmount ? (
          <button 
            onClick={handleOpen}
            disabled={opening}
            className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {opening ? 'ABRINDO...' : 'ABRIR CAIXA'}
          </button>
        ) : (
          <button 
            onClick={closeOverlay}
            className="w-full bg-white py-6 rounded-[32px] text-slate-900 font-black uppercase tracking-widest border border-black/10 hover:bg-slate-50 transition-all shadow-sm"
          >
            FECHAR
          </button>
        )}
      </div>
    </motion.div>
  );
};

const SupportOverlay = () => {
  const { closeOverlay, openOverlay } = useOverlay();
  return (
    <motion.div 
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Atendimento</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-card-bg border border-black/5 p-8 rounded-[40px] text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto border border-gold/20">
            <Headphones className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-slate-900">Suporte Oficial</h3>
            <p className="text-xs text-text-gray font-bold uppercase tracking-widest mt-1">Atendimento ao Cliente 24/7</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => openOverlay('ai_helper')}
            className="w-full gold-gradient border border-black/5 p-6 rounded-[32px] flex items-center gap-6 hover:brightness-110 transition-all text-left shadow-lg"
          >
          <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center text-white">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Inteligência Artificial</p>
            <p className="text-lg font-black text-white">Assistente MOZA</p>
          </div>
        </button>

        <a 
          href="https://whatsapp.com/channel/0029VbBprjsEquiVZjdESc2L" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#2563eb]/10 border border-[#2563eb]/20 p-6 rounded-[32px] flex items-center gap-6 hover:bg-[#2563eb]/20 transition-all text-left shadow-sm"
        >
          <div className="w-14 h-14 bg-[#2563eb] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest">Canal Oficial</p>
            <p className="text-lg font-black text-[#2563eb]">WhatsApp Channel</p>
          </div>
        </a>

        {[
          { icon: Phone, label: "WhatsApp VIP", value: "+258 84 877 8905", color: "bg-[#25D366]", link: "https://wa.me/258848778905" },
          { icon: Users, label: "Grupo Telegram", value: "@MOZA_OFFICIAL", color: "bg-[#0088cc]", link: "https://t.me/MOZA_OFFICIAL" },
        ].map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="w-full bg-card-bg border border-black/5 p-6 rounded-[32px] flex items-center gap-6 hover:bg-slate-50 transition-all text-left shadow-sm">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <item.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">{item.label}</p>
              <p className="text-lg font-black font-mono text-slate-900">{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </motion.div>
  );
};

const AiHelperOverlay = () => {
  const { closeOverlay } = useOverlay();
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
        model: "gemini-1.5-flash",
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
      className="fixed inset-0 z-[3000] bg-slate-50 flex flex-col"
    >
      <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Assistente IA</h3>
            <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Online Agora</p>
          </div>
        </div>
        <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-[24px] text-sm font-medium leading-relaxed ${
              m.role === 'user' ? 'gold-gradient text-white rounded-tr-none' : 'bg-white border border-black/5 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-black/5 p-4 rounded-[24px] rounded-tl-none flex gap-1">
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-black/5">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Como posso ajudar?"
            className="w-full bg-slate-50 border border-black/5 rounded-[28px] py-6 pl-8 pr-20 text-slate-900 font-medium outline-none focus:border-gold/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MarketOverlay = () => {
  const { closeOverlay } = useOverlay();
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
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Mercado em Tempo Real</h2>
        <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-white border border-black/5 p-6 rounded-[32px] h-64 shadow-xl relative overflow-hidden">
           <div className="absolute top-4 left-6 z-10">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">BTC / MZN</p>
              <h4 className="text-2xl font-black text-slate-900 font-mono leading-none">6,124,900</h4>
           </div>
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-black/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[9px] font-black text-text-gray uppercase tracking-widest">Sentimento</span>
            <span className="text-xl font-black text-green-500">ALTA (BULLISH)</span>
            <span className="text-[10px] text-green-500/50 font-bold uppercase">Compra Forte</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-black/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[9px] font-black text-text-gray uppercase tracking-widest">Volatilidade</span>
            <span className="text-xl font-black text-slate-900">4.2%</span>
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
             <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-black/5 group hover:border-gold/30 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-gold border border-black/5">#{i+1}</div>
                   <span className="font-black text-sm uppercase tracking-widest text-slate-900">{t.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm font-mono text-slate-900">{t.price}</p>
                  <p className={`text-[10px] font-black ${t.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{t.trend}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

const EducationOverlay = () => {
  const { closeOverlay, openOverlay } = useOverlay();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
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
      content: 'Diversificação é a prática de distribuir seus investimentos por diferentes ativos para reduzir o risco. Em Moçambique, isso pode significar investir em diferentes planos VIP e manter uma reserva de emergência para imprevistos. Ao não colocar todo o seu capital num único plano, você garante que uma oscilação num setor não comprometa todo o seu património...',
      date: '05 MAI'
    },
    {
      category: 'strategies',
      title: 'Planos VIP: Qual escolher?',
      excerpt: 'Guia completo para maximizar seu retorno diário na MOZA INV.',
      content: 'Cada nível VIP oferece uma taxa de retorno diferente. Para iniciantes, o VIP 1 é ideal, oferecendo uma introdução segura aos retornos passivos. Já investidores experientes em Moçambique buscam o VIP 5 para retornos de capital mais agressivos, aproveitando as taxas preferenciais de saque e bónus de rede mais elevados...',
      date: '04 MAI'
    },
    {
      category: 'market',
      title: 'Tendências do Mercado em Moçambique',
      excerpt: 'Como o cenário económico local afeta os ativos digitais.',
      content: 'O mercado de ativos digitais em Moçambique está em crescimento acelerado. A facilidade de transações instantâneas via M-Pesa e e-Mola está impulsionando a abraço de plataformas de investimento digitais. A MOZA INV posiciona-se como líder ao integrar estas soluções locais com tecnologia de ponta para garantir depósitos e levantamentos rápidos...',
      date: '03 MAI'
    }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  if (selectedArticle) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
        className="fixed inset-0 z-[2030] bg-slate-50 flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setSelectedArticle(null)} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-gold border border-black/5">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">Voltar para Biblioteca</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{selectedArticle.date}</span>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{selectedArticle.title}</h2>
          </div>
          
          <div className="w-full h-48 rounded-[40px] bg-black/5 border border-black/5 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gold/20" />
          </div>
          
          <p className="text-sm text-text-gray/90 leading-relaxed font-medium">
            {selectedArticle.content}
          </p>
          
          <div className="p-8 rounded-[40px] bg-card-bg border border-black/5 text-center space-y-4 mt-8 shadow-sm">
             <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto border border-indigo-500/20">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Leitura Concluída</p>
             <button onClick={() => setSelectedArticle(null)} className="text-xs font-bold text-gold uppercase tracking-widest underline underline-offset-4">Explorar outros tópicos</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Educação</h2>
        </div>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'gold-gradient text-white shadow-lg' : 'bg-black/5 text-text-gray'}`}
        >
          Tudo
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === cat.id ? 'gold-gradient text-white shadow-lg' : 'bg-black/5 text-text-gray'}`}
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
            onClick={() => setSelectedArticle(article)}
            className="bg-card-bg border border-black/5 p-6 rounded-[32px] space-y-4 group hover:border-gold/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{article.date}</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-text-gray group-hover:text-gold transition-colors border border-black/5">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-gold transition-colors">{article.title}</h3>
              <p className="text-xs text-text-gray/80 font-medium leading-relaxed">{article.excerpt}</p>
            </div>
            <div className="pt-4 border-t border-black/5">
              <button className="text-[10px] font-black text-gold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Ler Artigo Completo <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-[40px] bg-slate-100 border border-black/5 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto border border-gold/20">
          <Bot className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Precisa de Ajuda Pessoal?</h4>
          <p className="text-[10px] font-black text-text-gray uppercase tracking-widest leading-relaxed">
            O nosso assistente de IA está pronto para responder às suas dúvidas financeiras 24/7.
          </p>
        </div>
        <button 
           onClick={() => openOverlay('ai_helper')}
           className="w-full gold-gradient text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:brightness-110 transition-all"
        >
          Falar com IA MOZA
        </button>
      </div>
    </motion.div>
  );
};

const LoanOverlay = ({ balance, activeVip, onConfirm }: { balance: number, activeVip: number, onConfirm: (amt: number) => void }) => {
  const { closeOverlay } = useOverlay();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // Example loan limits based on VIP
  const loanLimit = (activeVip + 1) * 2000;
  const loanOptions = [500, 1000, 2000, 5000].filter(amt => amt <= loanLimit);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Crédito MOZA</h2>
        </div>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="space-y-8">
        <div className="bg-white border border-black/5 p-8 rounded-[40px] space-y-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">Limite Disponível</p>
            <p className="text-3xl font-black text-slate-900 font-mono">MZN {loanLimit.toLocaleString()}</p>
          </div>
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest leading-relaxed">
            O seu crédito é baseado no seu nível VIP. Aumente o seu VIP para desbloquear limites maiores.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest block px-2">Selecione o Valor</label>
          <div className="grid grid-cols-2 gap-4">
            {loanOptions.map(amt => (
              <button 
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-2 ${selectedAmount === amt ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-black/5 bg-white shadow-sm'}`}
              >
                <span className={`text-xl font-black font-mono ${selectedAmount === amt ? 'text-gold' : 'text-slate-900'}`}>MZN {amt}</span>
                <span className="text-[9px] font-black text-gold uppercase tracking-widest">Aprovação Instantânea</span>
              </button>
            ))}
          </div>
        </div>

        {selectedAmount && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-text-gray">Taxa de Juro (5%)</span>
              <span className="text-slate-900">MZN {(selectedAmount * 0.05).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-text-gray">Total a Pagar</span>
              <span className="text-gold">MZN {(selectedAmount * 1.05).toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-text-gray/60 uppercase font-bold leading-relaxed">
              * O valor será debitado automaticamente dos seus rendimentos diários até à liquidação total.
            </p>
          </motion.div>
        )}

        <button 
          onClick={() => selectedAmount && onConfirm(selectedAmount)}
          disabled={!selectedAmount}
          className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
        >
          Solicitar Crédito
        </button>
      </div>
    </motion.div>
  );
};

const AboutOverlay = () => {
  const { closeOverlay } = useOverlay();
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[2000] bg-slate-50 flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Empresa</h2>
        </div>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

    <div className="space-y-8 pb-10">
      <div className="bg-white border border-black/5 p-8 rounded-[40px] space-y-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gold uppercase underline decoration-gold/30 underline-offset-8 decoration-2">{COMPANY_INFO.name}</h3>
          <p className="text-xs text-text-gray font-bold uppercase tracking-widest">Fundada em {COMPANY_INFO.since} • {COMPANY_INFO.headquarters}</p>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 font-medium">
          {COMPANY_INFO.mission}
        </p>
        <div className="pt-4 border-t border-black/5 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Licença Oficial: {COMPANY_INFO.license}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em] px-2">Certificações de Confiança</h4>
        {COMPANY_INFO.certificates.map(cert => (
          <div key={cert.id} className="bg-white border border-black/5 p-6 rounded-[32px] flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-sm uppercase text-slate-900">{cert.title}</p>
              <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest mt-1">{cert.issuer}</p>
            </div>
            <div className="ml-auto">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[40px] gold-gradient text-white text-center space-y-2 shadow-xl shadow-gold/20">
        <h5 className="text-xl font-black uppercase tracking-tighter">Compromisso MOZA</h5>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Segurança Total nos seus Ativos Digitais</p>
      </div>
    </div>
  </motion.div>
  );
};

const DepositManagerOverlay = () => {
  const { closeOverlay } = useOverlay();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed' | 'failed' | 'all'>('pending');

  useEffect(() => {
    let q = query(
      collection(db, 'transactions'),
      where('type', '==', 'deposit'),
      orderBy('createdAt', 'desc')
    );

    if (filterStatus !== 'all') {
      q = query(
        collection(db, 'transactions'),
        where('type', '==', 'deposit'),
        where('status', '==', filterStatus),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snap) => {
      setDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'admin/deposits_manager');
      setLoading(false);
    });
    return unsubscribe;
  }, [filterStatus]);

  const handleProcess = async (txId: string, userId: string, amount: number, status: 'completed' | 'failed') => {
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', txId);
        const userRef = doc(db, 'users', userId);
        
        const txSnap = await transaction.get(txRef);
        if (!txSnap.exists()) throw new Error('Transação não encontrada');
        if (txSnap.data().status !== 'pending') throw new Error('Transação já processada');

        transaction.update(txRef, { status, updatedAt: serverTimestamp() });
        
        if (status === 'completed') {
          transaction.update(userRef, { balance: increment(amount), updatedAt: serverTimestamp() });
        }
      });
      alert(`Depósito ${status === 'completed' ? 'Aprovado' : 'Rejeitado'}!`);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${txId}`);
    }
  };

  const filtered = deposits.filter(d => 
    d.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.amount?.toString().includes(searchTerm) ||
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[2030] bg-slate-50 flex flex-col overflow-hidden"
    >
      <div className="p-6 bg-white border-b border-black/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <DollarSign className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Gestor de Depósitos</h2>
               <p className="text-[10px] text-text-gray font-black uppercase tracking-widest">Aprovação e Auditoria de Transações</p>
             </div>
          </div>
          <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="PROCURAR POR ID, UTILIZADOR OU MÉTODO..."
              className="w-full bg-slate-100 border border-black/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black text-slate-900 focus:outline-none focus:border-gold/30 uppercase tracking-widest"
            />
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            {['pending', 'completed', 'failed', 'all'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s as any)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-text-gray hover:bg-black/5'}`}
              >
                {s === 'pending' ? 'Pendentes' : s === 'completed' ? 'Sucesso' : s === 'failed' ? 'Falhas' : 'Todos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20"><RefreshCcw className="w-8 h-8 text-gold animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-gray font-black uppercase tracking-widest opacity-50">Nenhuma transação encontrada</div>
        ) : (
          filtered.map(tx => (
            <div key={tx.id} className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 relative overflow-hidden group shadow-sm">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      tx.status === 'pending' ? 'bg-blue-500/10 text-blue-600' :
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {tx.status}
                    </span>
                    <span className="text-[10px] text-text-gray font-mono uppercase">#{tx.id.slice(-8)}</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 font-mono leading-none">MZN {tx.amount?.toLocaleString()}</p>
                  <div className="flex items-center gap-3 text-[10px] text-text-gray font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-gold/50" /> {tx.method}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gold/50" /> {tx.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between items-end h-full">
                  <div>
                    <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-1">Utilizador</p>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-black/5">
                       <User className="w-3 h-3 text-gold" />
                       <span className="text-[11px] font-black text-slate-900 font-mono">{tx.userId?.slice(-12)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {tx.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-black/5">
                  <button 
                    onClick={() => handleProcess(tx.id, tx.userId, tx.amount, 'completed')}
                    className="flex-1 bg-green-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Aprovar Depósito
                  </button>
                  <button 
                    onClick={() => handleProcess(tx.id, tx.userId, tx.amount, 'failed')}
                    className="flex-1 border border-red-500/30 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 active:scale-95 transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const EditProfileOverlay = ({ user }: { user: any }) => {
  const { closeOverlay } = useOverlay();
  const [name, setName] = useState(user.name || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name,
        photoURL,
        updatedAt: serverTimestamp()
      });
      alert("Perfil atualizado!");
      closeOverlay();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[2030] bg-slate-50 flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">EDITAR PERFIL</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-gold p-1 shadow-gold/20 shadow-lg">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-10 h-10 text-gold" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest pl-2">NOME DE EXIBIÇÃO</label>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome..."
            className="w-full bg-white border border-black/5 rounded-2xl p-5 text-sm font-black text-slate-900 shadow-sm focus:outline-none focus:border-gold/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest pl-2">URL DA FOTO (OPCIONAL)</label>
          <input 
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
            className="w-full bg-white border border-black/5 rounded-2xl p-5 text-sm font-mono text-slate-900 shadow-sm focus:outline-none focus:border-gold/30"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full gold-gradient py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 active:scale-95 transition-all mt-6 disabled:opacity-50"
        >
          {saving ? 'A GUARDAR...' : 'GUARDAR ALTERAÇÕES'}
        </button>
      </div>
    </motion.div>
  );
};

const AdminOverlay = () => {
  const { closeOverlay, openOverlay } = useOverlay();
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'withdrawals' | 'stats' | 'promotions' | 'approvals' | 'settings' | 'financial' | 'vips'>('users');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [appSettings, setAppSettings] = useState<any>({ 
    maintenance: false, 
    bannerText: '', 
    bannerHighlight: '',
    mpesaNumber: '848778905',
    mpesaHolder: 'PAULO JOAQUIM COMODALI',
    emolaNumber: '875376446',
    emolaHolder: 'LUISA ZULANE MALUMBE',
    bankNumber: '0001 2233 4455',
    bankHolder: 'MOZA INVEST'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    setLoading(true);

    if (activeAdminTab === 'users') {
      unsubscribe = onSnapshot(collection(db, 'users'), (snap) => {
        setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'admin/users');
        setLoading(false);
      });
    } else if (activeAdminTab === 'withdrawals') {
      unsubscribe = onSnapshot(query(collection(db, 'transactions'), where('type', '==', 'withdraw'), where('status', '==', 'pending')), (snap) => {
        setPendingWithdrawals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'admin/withdrawals');
        setLoading(false);
      });
    } else if (activeAdminTab === 'approvals') {
      unsubscribe = onSnapshot(query(collection(db, 'transactions'), where('type', '==', 'deposit'), where('status', '==', 'pending')), (snap) => {
        setPendingDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'admin/approvals');
        setLoading(false);
      });
    } else if (activeAdminTab === 'settings' || activeAdminTab === 'promotions' || activeAdminTab === 'financial' || activeAdminTab === 'vips') {
      unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
        if (snap.exists()) {
          setAppSettings(prev => ({ ...prev, ...snap.data() }));
        }
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/global');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeAdminTab]);

  const handleUpdateSettings = async (newData: any) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), newData, { merge: true });
      setAppSettings(prev => ({ ...prev, ...newData }));
      alert("Configurações atualizadas!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  };

  const handleProcessDeposit = async (txId: string, userId: string, amount: number, status: 'completed' | 'failed') => {
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', txId);
        const userRef = doc(db, 'users', userId);
        
        transaction.update(txRef, { status, updatedAt: serverTimestamp() });
        
        if (status === 'completed') {
          transaction.update(userRef, { balance: increment(amount), updatedAt: serverTimestamp() });
        }
      });
      alert(`Depósito ${status === 'completed' ? 'Aprovado' : 'Rejeitado'}!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${txId}`);
    }
  };

  const handleUpdateBalance = async (userId: string, amount: number) => {
    if (isNaN(amount) || amount === 0) return;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp()
      });
      await addDoc(collection(db, 'transactions'), {
        userId,
        type: amount > 0 ? 'reward' : 'investment',
        amount: Math.abs(amount),
        status: 'completed',
        date: 'ADMIN',
        method: amount > 0 ? 'Ajuste Admin (+)' : 'Ajuste Admin (-)',
        createdAt: serverTimestamp()
      });
      alert("Saldo atualizado com sucesso!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const handleProcessWithdrawal = async (txId: string, userId: string, amount: number, status: 'completed' | 'failed') => {
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', txId);
        const userRef = doc(db, 'users', userId);
        
        transaction.update(txRef, { status, updatedAt: serverTimestamp() });
        
        if (status === 'failed') {
          transaction.update(userRef, { balance: increment(amount), updatedAt: serverTimestamp() });
        }
      });
      alert(`Levantamento ${status === 'completed' ? 'Aprovado' : 'Rejeitado'}!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${txId}`);
    }
  };

  const filteredUsers = allUsers.filter(u => u.phone?.includes(searchTerm) || u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[2030] bg-slate-50 flex flex-col overflow-hidden"
    >
      <div className="p-6 pb-2 bg-white border-b border-black/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Painel Admin</h2>
          </div>
          <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-slate-400">✕</button>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-4 overflow-x-auto no-scrollbar">
           {[
             { id: 'users', label: 'Utilizadores', icon: Users },
             { id: 'withdrawals', label: 'Levantamentos', icon: Wallet },
             { id: 'approvals', label: 'Aprovações', icon: CheckCircle2 },
             { id: 'financial', label: 'Finanças', icon: DollarSign },
             { id: 'vips', label: 'VIPs', icon: ShieldCheck },
             { id: 'promotions', label: 'Banner', icon: MessageSquare },
             { id: 'settings', label: 'Painel', icon: Settings },
             { id: 'stats', label: 'Estatísticas', icon: TrendingUp }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveAdminTab(tab.id as any)}
               className={`flex-none px-4 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAdminTab === tab.id ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-text-gray hover:bg-black/5'}`}
             >
               <tab.icon className="w-3 h-3" />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeAdminTab === 'users' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="PROCURAR POR TELEFONE OU NOME..."
                className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black text-slate-900 focus:outline-none focus:border-gold/30 uppercase tracking-widest shadow-sm"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                 <RefreshCcw className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20 text-text-gray font-black uppercase tracking-widest opacity-50">Nenhum utilizador encontrado</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map(u => (
                  <div key={u.id} className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-black text-slate-900 uppercase tracking-tight">{u.name || 'SEM NOME'}</h3>
                           {u.activeVip > 0 && (
                             <span className="bg-gold/10 border border-gold/20 text-gold text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                               VIP {u.activeVip}
                             </span>
                           )}
                         </div>
                         <p className="text-[10px] text-text-gray font-mono">+{u.phone}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black text-gold uppercase tracking-widest leading-none">Saldo Atual</p>
                         <p className="text-xl font-black text-slate-900 font-mono">MZN {u.balance?.toLocaleString()}</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t border-black/5">
                       <div className="flex-1 bg-gold/10 hover:bg-gold/20 text-gold py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest border border-gold/10 transition-all relative group">
                         <Shield className="w-3 h-3" /> 
                         <select 
                           value={u.activeVip || 0}
                           onChange={(e) => {
                             const newLevel = Number(e.target.value);
                             const userRef = doc(db, 'users', u.id);
                             updateDoc(userRef, { activeVip: newLevel, updatedAt: serverTimestamp() });
                           }}
                           className="bg-transparent border-none outline-none cursor-pointer font-black"
                         >
                           <option value={0} className="bg-white text-slate-900">VIP 0 (START)</option>
                           <option value={1} className="bg-white text-slate-900">VIP 1 (PREMIUM)</option>
                           <option value={2} className="bg-white text-slate-900">VIP 2 (LUXURY)</option>
                           <option value={3} className="bg-white text-slate-900">VIP 3 (ELITE)</option>
                           <option value={4} className="bg-white text-slate-900">VIP 4 (ATIVO)</option>
                           <option value={5} className="bg-white text-slate-900">VIP 5 (GOLDEN)</option>
                         </select>
                       </div>
                       <button 
                        onClick={() => {
                          const amt = prompt("Valor a ADICIONAR ao saldo:");
                          if (amt) handleUpdateBalance(u.id, Number(amt));
                        }}
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest"
                       >
                         <Plus className="w-3 h-3" /> Adicionar
                       </button>
                       <button 
                        onClick={() => {
                          const amt = prompt("Valor a REMOVER do saldo:");
                          if (amt) handleUpdateBalance(u.id, -Number(amt));
                        }}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest"
                       >
                         <Minus className="w-3 h-3" /> Remover
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeAdminTab === 'withdrawals' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                 <RefreshCcw className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : pendingWithdrawals.length === 0 ? (
              <div className="text-center py-20 text-text-gray font-black uppercase tracking-widest opacity-50">Nenhum levantamento pendente</div>
            ) : (
              pendingWithdrawals.map(tx => (
                <div key={tx.id} className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full mb-1 inline-block">PENDENTE</span>
                      <p className="text-lg font-black text-slate-900 font-mono">MZN {tx.amount?.toLocaleString()}</p>
                      <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest">{tx.method || 'M-Pesa'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">Utilizador</p>
                       <p className="text-[11px] font-black text-slate-900">ID: {tx.userId?.slice(-6)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-black/5">
                    <button 
                      onClick={() => handleProcessWithdrawal(tx.id, tx.userId, tx.amount, 'completed')}
                      className="flex-1 bg-green-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Aprovar
                    </button>
                    <button 
                      onClick={() => handleProcessWithdrawal(tx.id, tx.userId, tx.amount, 'failed')}
                      className="flex-1 border border-red-500/30 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/5 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Rejeitar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeAdminTab === 'stats' && (
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-1 shadow-sm">
                    <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">Total Utilizadores</p>
                    <p className="text-2xl font-black text-slate-900 font-mono">{allUsers.length}</p>
                 </div>
                 <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-1 shadow-sm">
                    <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">Saldo em Custódia</p>
                    <p className="text-2xl font-black text-gold font-mono">MZN {allUsers.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}</p>
                 </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[40px] text-center space-y-2 shadow-sm">
                 <LayoutDashboard className="w-8 h-8 text-indigo-500 mx-auto" />
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Administração MOZA</h4>
                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
                   Gerencie a plataforma com responsabilidade. Todas as ações do administrador são registadas no sistema.
                 </p>
              </div>
           </div>
        )}

        {activeAdminTab === 'approvals' && (
          <div className="space-y-6">
            <div className="bg-gold/5 border border-gold/10 p-8 rounded-[40px] text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-gold/20">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Gestor de Depósitos</h3>
                <p className="text-[10px] text-text-gray font-black uppercase tracking-widest leading-relaxed">
                   Sistema avançado de auditoria com filtros, busca e histórico detalhado de transações M-Pesa e e-Mola.
                </p>
              </div>
              <button 
                onClick={() => openOverlay('deposit_manager')}
                className="w-full bg-gold text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:brightness-110 active:scale-95 transition-all shadow-gold/20"
              >
                ABRIR GESTOR AVANÇADO
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <p className="text-[10px] font-black text-text-gray uppercase tracking-widest text-center opacity-40">Ações Rápidas Pendentes</p>
              {loading ? (
                <div className="flex justify-center py-10"><RefreshCcw className="w-6 h-6 text-gold animate-spin" /></div>
              ) : pendingDeposits.length === 0 ? (
                <p className="text-center py-10 text-[9px] font-black text-text-gray/50 uppercase tracking-widest">Tudo em dia!</p>
              ) : (
                pendingDeposits.slice(0, 3).map(tx => (
                  <div key={tx.id} className="bg-white border border-black/5 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-xs font-black text-slate-900 font-mono">MZN {tx.amount?.toLocaleString()}</p>
                      <p className="text-[8px] text-text-gray font-black uppercase tracking-widest">ID: {tx.userId?.slice(-6)}</p>
                    </div>
                    <button 
                      onClick={() => openOverlay('deposit_manager')}
                      className="bg-slate-50 text-gold px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border border-gold/20 hover:bg-gold/5 transition-all"
                    >
                      GERIR
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeAdminTab === 'financial' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#e61c2b]/10 flex items-center justify-center text-[#e61c2b]">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">M-Pesa</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Número</label>
                  <input 
                    value={appSettings.mpesaNumber || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, mpesaNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.mpesaHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, mpesaHolder: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs text-slate-900 uppercase font-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#ff6600]/10 flex items-center justify-center text-[#ff6600]">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">e-Mola</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Número</label>
                  <input 
                    value={appSettings.emolaNumber || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, emolaNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.emolaHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, emolaHolder: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs text-slate-900 uppercase font-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight">Banco</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Número/NIB</label>
                  <input 
                    value={appSettings.bankNumber || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, bankNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.bankHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, bankHolder: e.target.value })}
                    className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs text-slate-900 uppercase font-black"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleUpdateSettings({ 
                mpesaNumber: appSettings.mpesaNumber, 
                mpesaHolder: appSettings.mpesaHolder,
                emolaNumber: appSettings.emolaNumber,
                emolaHolder: appSettings.emolaHolder,
                bankNumber: appSettings.bankNumber,
                bankHolder: appSettings.bankHolder
              })}
              className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold/20"
            >
              SALVAR NÚMEROS DE DEPÓSITO
            </button>
          </div>
        )}

        {activeAdminTab === 'vips' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Gerir Níveis VIP</h3>
              <p className="text-[10px] text-text-gray font-black uppercase tracking-widest leading-relaxed">
                Ajuste os valores de investimento e retornos diários.
              </p>
            </div>
            
            <div className="space-y-4">
              {VIP_LEVELS.map((level) => (
                <div key={level.id} className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-black/5">
                    <span className="text-sm font-black text-slate-900">{level.name} - {level.badge}</span>
                    <ShieldCheck className="w-5 h-5 text-gold" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Investimento (MZN)</label>
                      <input 
                        type="number"
                        value={appSettings[`vip${level.id}_invest`] ?? level.investment}
                        onChange={(e) => handleUpdateSettings({ [`vip${level.id}_invest`]: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-black/5 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-gold/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-text-gray uppercase tracking-widest">Retorno Diário (MZN)</label>
                      <input 
                        type="number"
                        value={appSettings[`vip${level.id}_return`] ?? level.dailyReturn}
                        onChange={(e) => handleUpdateSettings({ [`vip${level.id}_return`]: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-black/5 rounded-xl p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-gold/30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gold/5 border border-gold/10 p-6 rounded-3xl text-[10px] font-bold text-gold uppercase text-center">
              As alterações nos VIPs refletem-se automaticamente para todos os utilizadores ao recarregar a app.
            </div>
          </div>
        )}

        {activeAdminTab === 'promotions' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm">
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Customizar Banner Home</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-gray uppercase">Título Principal</label>
                <input 
                  value={appSettings.bannerText || ''} 
                  onChange={(e) => setAppSettings({ ...appSettings, bannerText: e.target.value })}
                  placeholder="EX: INVISTA AGORA..."
                  className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-gold/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-gray uppercase">Texto Destaque (Dourado)</label>
                <input 
                  value={appSettings.bannerHighlight || ''} 
                  onChange={(e) => setAppSettings({ ...appSettings, bannerHighlight: e.target.value })}
                  placeholder="EX: 100% SEGURO..."
                  className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-gold/30"
                />
              </div>
              <button 
                onClick={() => handleUpdateSettings({ bannerText: appSettings.bannerText, bannerHighlight: appSettings.bannerHighlight })}
                className="w-full bg-gold text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 transition-all active:scale-95"
              >
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </div>
        )}

        {activeAdminTab === 'settings' && (
          <div className="space-y-6">
             <div className="bg-white border border-black/5 p-6 rounded-[32px] space-y-4 shadow-sm">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="font-black text-slate-900 uppercase tracking-tight">Modo Manutenção</h3>
                   <p className="text-[9px] text-text-gray font-bold uppercase tracking-widest">FECHA O APP PARA TODOS UTILIZADORES</p>
                 </div>
                 <button 
                  onClick={() => handleUpdateSettings({ maintenance: !appSettings.maintenance })}
                  className={`w-14 h-8 rounded-full relative transition-all ${appSettings.maintenance ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-slate-200'}`}
                 >
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${appSettings.maintenance ? 'right-1' : 'left-1'}`} />
                 </button>
               </div>
             </div>

             <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-[32px] flex gap-4 shadow-sm">
                <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-widest leading-relaxed">
                   Ao ativar a manutenção, os utilizadores não poderão acessar as suas contas. Use apenas para atualizações críticas.
                </p>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  // Overlay state is now part of context
  const [overlayState, setOverlayState] = useState<{ view: OverlayType; data: any }>({ view: 'none', data: null });
  const [balance, setBalance] = useState(0);
  const [activeVip, setActiveVip] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('app_lang') || 'pt');

  const t = (key: string) => {
    const langSet = TRANSLATIONS[language] || TRANSLATIONS['pt'];
    return langSet[key] || key;
  };

  const [photoURL, setPhotoURL] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const userData = useMemo(() => ({
    id: firebaseUser?.uid,
    name: userName,
    phone: userPhone,
    photoURL: photoURL,
    balance: balance,
    activeVip: activeVip,
    inviteCode: inviteCode || '',
    loanBalance: loanBalance
  }), [firebaseUser, userName, userPhone, photoURL, balance, activeVip, inviteCode, loanBalance]);

  // Global Settings and Dynamic VIPs
  const [appSettings, setAppSettings] = useState<any>({ 
    maintenance: false, 
    bannerText: 'O FUTURO DO INVESTIMENTO', 
    bannerHighlight: 'MOZA DIGITAL ASSETS',
    mpesaNumber: '848778905',
    mpesaHolder: 'PAULO JOAQUIM COMODALI',
    emolaNumber: '875376446',
    emolaHolder: 'LUISA ZULANE MALUMBE',
    bankNumber: '0001 2233 4455',
    bankHolder: 'MOZA INVEST'
  });

  const effectiveVipLevels = useMemo(() => {
    return VIP_LEVELS.map(level => ({
      ...level,
      investment: appSettings[`vip${level.id}_invest`] ?? level.investment,
      dailyReturn: appSettings[`vip${level.id}_return`] ?? level.dailyReturn,
    }));
  }, [appSettings]);

  // Global Settings Listener
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setAppSettings(prev => ({ ...prev, ...doc.data() }));
      }
    });
    return () => unsub();
  }, []);

  const openOverlay = (view: OverlayType, data: any = null) => setOverlayState({ view, data });
  const closeOverlay = () => setOverlayState({ view: 'none', data: null });

  // Auth Listener
  useEffect(() => {
    console.log('[AUTH] Set up listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[AUTH] State changed:', user?.uid || 'NONE');
      setFirebaseUser(user);
      setIsLoggedIn(!!user);
      
      if (!user) {
        // Reset user data only on logout
        setBalance(0);
        setActiveVip(0);
        setLoanBalance(0);
        setIsAdmin(false);
        setTransactions([]);
        setUserPhone('');
        setUserName('');
        setInviteCode('');
        setLoading(false);
      } else {
        // Optimistic Admin Check via Auth Email
        const email = user.email || '';
        const emailPrefix = email.split('@')[0];
        // Normalize prefix to last 9 digits to handle optional 258 prefix
        const normalizedPrefix = emailPrefix.slice(-9);
        if (normalizedPrefix === '858778905' || email === 'paulojoaquimcomodar5@gmail.com') {
          console.log('[AUTH] Admin detected by email:', email);
          setIsAdmin(true);
        }
        setLoading(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // User Profile Listener
  useEffect(() => {
    if (!firebaseUser) {
       console.log('[PROFILE] No user, skip listener');
       return;
    }

    console.log('[PROFILE] Setup listener for:', firebaseUser.uid);
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('[PROFILE] Snapshot received:', data.phone);
        setBalance(data.balance || 0);
        setActiveVip(data.activeVip || 0);
        setLoanBalance(data.loanBalance || 0);
        const rawPhone = data.phone || '';
        const normalizedDataPhone = rawPhone.replace(/\s+/g, '').replace(/[^\d]/g, '').slice(-9);
        const isTargetAdmin = normalizedDataPhone === '858778905';
        const isExplicitAdmin = data.role === 'admin';
        
        const finalIsAdmin = isExplicitAdmin || isTargetAdmin;
        setIsAdmin(finalIsAdmin);
        
        if (finalIsAdmin) {
          console.log('[ADMIN] Session is ADMIN');
        }

        // Auto-fix role
        if (isTargetAdmin && !isExplicitAdmin) {
          updateDoc(userDocRef, { role: 'admin' }).catch(err => console.error('[ADMIN] Promote Fail:', err));
        }

        setUserPhone(rawPhone);
        setUserName(data.name || '');
        setPhotoURL(data.photoURL || '');
        setInviteCode(data.inviteCode || '');
        if (data.language) setLanguage(data.language);

        // Auto-generate invite code if missing
        if (!data.inviteCode) {
          const newCode = generateInviteCode();
          updateDoc(userDocRef, { inviteCode: newCode }).catch(err => console.error('[INVITE] Auto-fix Fail:', err));
        }

        setLoading(false);
      } else {
        console.warn('[PROFILE] Doc not found');
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  useEffect(() => {
    localStorage.setItem('app_lang', language);
    if (firebaseUser) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      updateDoc(userRef, { language, updatedAt: serverTimestamp() }).catch(() => {});
    }
  }, [language, firebaseUser]);

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
    
    const level = effectiveVipLevels.find(v => v.id === id);
    if (!level) return;

    if (balance < level.investment) {
      openOverlay('deposit', level.investment);
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
      const currentVip = effectiveVipLevels.find(v => v.id === activeVip);
      const limit = currentVip?.dailyReturn || 0;
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      const fireData = userSnap.data();
      
      const today = new Date().toDateString();
      let dailyTotal = fireData?.dailyTotal || 0;
      const lastTaskDate = fireData?.lastTaskDate || "";

      if (lastTaskDate !== today) {
        dailyTotal = 0;
      }

      if (limit > 0 && dailyTotal >= limit) {
        alert(t('limit_reached'));
        return;
      }

      if (limit > 0 && (dailyTotal + effectiveReward) > limit) {
        alert(t('limit_reached'));
        return;
      }

      const effectiveReward = reward || (currentVip?.dailyReturn || 0);
      
      await updateDoc(userRef, {
        balance: increment(effectiveReward),
        dailyTotal: (lastTaskDate === today ? dailyTotal : 0) + effectiveReward,
        lastTaskDate: today,
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('reward', effectiveReward, 'completed');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const handleDeposit = async (amount: number, method: string) => {
    if (!firebaseUser) return;
    
    try {
      await addTransactionAndNotify('deposit', amount, 'pending', method);
      alert("Depósito solicitado! Por favor, aguarde a aprovação do administrador.");
      closeOverlay();
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
      closeOverlay();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'withdraw');
    }
  };

  const handleLoan = async (amount: number) => {
    if (!firebaseUser) return;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        balance: increment(amount),
        loanBalance: increment(amount * 1.05),
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('reward', amount, 'completed', 'Empréstimo MOZA');
      closeOverlay();
      alert("Crédito aprovado e creditado no seu saldo!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'loan');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Explicitly reset states
      setBalance(0);
      setActiveVip(0);
      setLoanBalance(0);
      setIsAdmin(false);
      setTransactions([]);
      setUserPhone('');
      setUserName('');
      setInviteCode('');
      setActiveTab('home');
      setOverlayState({ view: 'none', data: null });
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

  if (appSettings.maintenance && !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl shadow-red-500/20">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Sistema em Manutenção</h1>
          <p className="text-xs text-text-gray font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
            Estamos atualizando os nossos servidores para lhe oferecer uma melhor experiência. Por favor, volte mais tarde.
          </p>
        </div>
        <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <p className="text-[10px] font-black text-gold uppercase tracking-widest text-center">Previsão: 2 horas</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-6 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-gold/10 border-t-gold rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 bg-gold/20 rounded-full blur-xl animate-pulse" />
          </div>
        </motion.div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em] animate-pulse">
            {isLoggedIn ? 'Sincronizando Conta' : 'Iniciando Sistema'}
          </p>
          <p className="text-[8px] text-text-gray font-black uppercase tracking-widest opacity-40">MOZA PREMIUM SEGURO</p>
        </div>
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
    <OverlayContext.Provider value={{ view: overlayState.view, data: overlayState.data, openOverlay, closeOverlay }}>
      <div className="min-h-screen bg-bg-deep flex flex-col pb-32 text-white font-sans selection:bg-gold selection:text-black">
        {/* Overlays */}
        <AnimatePresence>
          {overlayState.view === 'deposit' && <DepositOverlay onConfirm={handleDeposit} settings={appSettings} />}
          {overlayState.view === 'withdraw' && <WithdrawOverlay balance={balance} onConfirm={handleWithdraw} />}
          {overlayState.view === 'loan' && <LoanOverlay balance={balance} activeVip={activeVip} onConfirm={handleLoan} />}
          {overlayState.view === 'records' && <RecordsOverlay transactions={transactions} />}
          {overlayState.view === 'support' && <SupportOverlay />}
          {overlayState.view === 'ai_helper' && <AiHelperOverlay />}
          {overlayState.view === 'market' && <MarketOverlay />}
          {overlayState.view === 'about' && <AboutOverlay />}
          {overlayState.view === 'education' && <EducationOverlay />}
          {overlayState.view === 'admin' && <AdminOverlay />}
          {overlayState.view === 'deposit_manager' && <DepositManagerOverlay />}
          {overlayState.view === 'edit_profile' && userData && <EditProfileOverlay user={userData} />}
          {overlayState.view === 'box' && <LuckyBoxOverlay onWin={(amt) => { handleCompleteTask(0, amt); }} />}
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
          {isAdmin && (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => openOverlay('admin')}
              className="bg-red-500/20 border border-red-500/30 px-3 py-2 rounded-xl flex items-center gap-2 text-red-500 shadow-lg shadow-red-500/10"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
            </motion.button>
          )}
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
                 <div className="flex items-center gap-2">
                    <p className="text-gold text-[10px] font-black tracking-widest font-mono">+{userPhone || 'Registando...'}</p>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <p className="text-text-gray text-[9px] font-black uppercase tracking-[0.5em] opacity-50">Investidor VIP MOZA</p>
                 </div>
              </div>

              {/* Promotional Banner */}
              <HomeBanner 
                title={appSettings.bannerText}
                highlight={appSettings.bannerHighlight}
                onBoxClick={() => openOverlay('box')} 
              />

              {isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openOverlay('admin')}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-[32px] flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition-all mx-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/10">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xs uppercase tracking-tighter">Painel de Controlo</p>
                      <p className="text-[9px] text-red-500/60 font-black uppercase tracking-widest">Painel Administrativo Moza</p>
                    </div>
                  </div>
                  <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                    ACESSAR
                  </div>
                </motion.div>
              )}

              {/* Refined Premium Asset Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full opacity-30 animate-pulse" />
                <div className="bg-card-bg rounded-[48px] p-9 border border-black/5 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.08] translate-x-12 translate-y-[-16px] transform -rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <Logo showText={false} className="scale-[4]" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-black/5 border border-black/5 rounded-full w-fit backdrop-blur-xl">
                          <span className="text-[9.5px] font-black text-text-gray uppercase tracking-[0.3em]">Capital Disponível</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none font-mono flex items-baseline gap-2">
                             {balance.toLocaleString()}
                             <span className="text-lg text-gold font-sans font-black">MZN</span>
                          </div>
                        </div>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gold/10 p-5 rounded-[32px] border border-gold/20 flex flex-col items-center gap-1 shadow-lg shadow-gold/5"
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
                        onClick={() => openOverlay('deposit')}
                        className="gold-gradient p-4 rounded-[26px] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="relative z-10">RECARREGAR</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openOverlay('withdraw')}
                        className="bg-slate-100 backdrop-blur-xl border border-black/5 p-4 rounded-[26px] text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] shadow-md flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
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
              {loanBalance > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] flex items-center justify-between shadow-lg">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                         <Landmark className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Crédito Pendente</p>
                         <p className="text-lg font-black text-slate-900 font-mono">MZN {loanBalance.toLocaleString()}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => openOverlay('deposit')}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                   >
                     Pagar
                   </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em]">Serviços & Gestão</h3>
                  <div className="w-16 h-[1px] bg-black/5" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                   <ActionItem icon={DollarSign} label="Recarga" onClick={() => openOverlay('deposit')} />
                   <ActionItem icon={ArrowUpRight} label="Saque" onClick={() => openOverlay('withdraw')} />
                   <ActionItem icon={Landmark} label="Crédito" onClick={() => openOverlay('loan')} />
                   <ActionItem icon={Users} label="Equipe" onClick={() => setActiveTab('team')} />
                   <ActionItem icon={HelpCircle} label="Educação" onClick={() => openOverlay('education')} />
                   <ActionItem icon={TrendingUp} label="Fundo" onClick={() => openOverlay('market')} />
                   <ActionItem icon={FileText} label="Tarefas" onClick={() => setActiveTab('tasks')} />
                   <ActionItem icon={Building2} label="Empresa" onClick={() => openOverlay('about')} />
                </div>
              </div>

              {/* Quick News Ticker */}
              <div className="bg-card-bg border border-black/5 p-4 rounded-3xl flex items-center gap-4 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 flex-shrink-0 border-r border-black/10 pr-4">
                  <Bell className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest leading-none">News</span>
                </div>
                <div className="flex-1 text-[10px] font-bold text-text-gray uppercase tracking-widest truncate">
                   Lançamento do fundo MOZA GOLD 2026 com rendimento anual garantido.
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-4">
               <div className="flex flex-col gap-2 px-4">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Missões <br /><span className="text-gold">Diárias</span></h2>
                 <p className="text-text-gray text-[9px] font-black uppercase tracking-[0.4em] opacity-50">Geração de Capital em Tempo Real</p>
               </div>
               
               <div className="grid gap-4">
                 {DAILY_TASKS.map(task => (
                   <motion.div 
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card-bg border border-black/5 p-6 rounded-[40px] flex items-center justify-between shadow-lg group relative overflow-hidden"
                   >
                     {/* Inner glow */}
                     <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                     
                     <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-[20px] bg-gold/5 flex items-center justify-center text-gold border border-gold/10 group-hover:bg-gold group-hover:text-white transition-all shadow-md">
                           <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="font-black uppercase text-sm tracking-tight leading-none text-slate-700">{task.title}</h4>
                           <div className="flex items-center gap-2">
                                <p className="text-gold font-black text-xs font-mono uppercase tracking-widest">+ MZN {task.reward.toLocaleString()}</p>
                           </div>
                        </div>
                     </div>
                     <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteTask(task.id, task.reward)} 
                      className="gold-gradient text-white font-black px-6 py-3.5 rounded-[18px] text-[10px] uppercase tracking-widest shadow-lg relative z-10"
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
                 {effectiveVipLevels.map(level => (
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
               <div className="bg-gradient-to-br from-gold/20 via-white to-slate-50 p-10 rounded-[48px] border border-black/5 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users className="w-32 h-32 text-gold" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                     <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-lg">
                        <Users className="w-10 h-10" />
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Minha Rede</h2>
                        <p className="text-text-gray text-[10px] font-black uppercase tracking-widest max-w-[240px] leading-relaxed opacity-60">Expanda a sua influência e maximize os seus lucros.</p>
                     </div>
                     
                     <div className="w-full space-y-4 pt-2">
                        <div className="bg-white/80 px-6 py-5 rounded-2xl border border-black/5 font-mono font-black text-lg text-gold text-center tracking-[0.2em] shadow-inner">
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
                    <div className="w-16 h-[1px] bg-black/5" />
                 </div>
                 <div className="grid gap-4">
                   {TEAM_LEVELS.map((level, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card-bg border border-black/5 rounded-[32px] p-6 flex justify-between items-center group transition-all hover:bg-black/5"
                      >
                          <div className="flex gap-5 items-center">
                              <div className="w-10 h-10 rounded-2xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                                <span className="text-xs font-black">{i + 1}</span>
                              </div>
                              <div>
                                  <h4 className="font-black text-sm uppercase tracking-tight text-slate-700">{level.level}</h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <TrendingUp className="w-3 h-3 text-gold" />
                                    <p className="text-[9px] text-gold font-black uppercase tracking-widest">Ganhos: {level.commission}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="space-y-0.5 text-right">
                               <div className="text-2xl font-black text-slate-900 font-mono leading-none tracking-tighter">{level.count}</div>
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
                            {userData?.photoURL ? (
                              <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <User className="w-16 h-16 text-gold group-hover:scale-110 transition-transform duration-500" />
                            )}
                            <div 
                              onClick={() => openOverlay('edit_profile')}
                              className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex flex-col items-center gap-1 group">
                      <div className="flex items-center justify-center gap-2">
                        <h2 className="text-2xl font-black tracking-widest text-slate-900 uppercase italic tracking-tighter">
                          {userName || (userPhone.slice(-4) ? `INVESTIDOR_${userPhone.slice(-4)}` : 'UTILIZADOR')}
                        </h2>
                        <button 
                          onClick={() => openOverlay('edit_profile')}
                          className="text-gold hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-text-gray/50 uppercase tracking-[0.3em]">Clique para editar perfil</p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-[10px] font-black text-gold border border-gold/30 px-3 py-1 rounded-full uppercase tracking-widest bg-gold/5">
                        {effectiveVipLevels.find(v => v.id === activeVip)?.badge || 'START'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                     <p className="text-text-gray font-black text-xs font-mono tracking-widest">+{userPhone}</p>
                   </div>

                   <div className="flex flex-col items-center gap-1 mt-2 p-4 bg-white/5 rounded-[24px] border border-white/5 w-full max-w-[200px]">
                      <span className="text-[8px] font-black text-text-gray uppercase tracking-widest opacity-50">CÓDIGO DE CONVITE</span>
                      <div className="flex items-center gap-3">
                        <span className="text-md font-black text-gold font-mono tracking-[0.2em]">{inviteCode || '...'}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(inviteCode);
                            alert('Código copiado!');
                          }}
                          className={`${!inviteCode ? 'opacity-30 pointer-events-none' : ''} text-white/50 hover:text-gold transition-colors`}
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                   </div>
                 </div>
               </div>

               {/* Asset Overview Card */}
               <div className="bg-gradient-to-br from-gold/10 via-white to-slate-50 rounded-[48px] p-8 border border-black/5 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-24 h-24 text-gold" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-text-gray uppercase tracking-[0.4em]">{t('balance')}</span>
                      <div className="bg-black/5 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-900/50 uppercase tracking-widest">Ativo</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-black text-slate-900 font-mono tracking-tighter">
                        MZN {balance.toLocaleString()}
                      </div>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">+ {((balance * 0.125) / 30).toFixed(2)} MZN HOJE</p>
                    </div>
                  </div>
               </div>

               {/* Language Selector */}
               <div className="bg-card-bg border border-black/5 rounded-[40px] p-6 space-y-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gold" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t('settings')}</span>
                  </div>
                  <div className="h-24 overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-2 pb-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setLanguage(lang.id)}
                          className={`min-w-[80px] p-3 rounded-2xl flex flex-col items-center gap-1 transition-all flex-shrink-0 ${language === lang.id ? 'bg-gold text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-[8px] font-black uppercase tracking-tight">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               {/* Operations Grid */}
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t('withdraw'), icon: Wallet, action: () => openOverlay('withdraw'), color: "bg-blue-500/10 text-blue-500" },
                    { label: t('records'), icon: ClipboardList, action: () => openOverlay('records'), color: "bg-purple-500/10 text-purple-500" },
                    { label: "Suporte", icon: Headphones, action: () => openOverlay('support'), color: "bg-cyan-500/10 text-cyan-500" },
                    { label: "Empresa", icon: Building2, action: () => openOverlay('about'), color: "bg-gold/10 text-gold" },
                    { label: "Painel Admin", icon: ShieldCheck, action: () => openOverlay('admin'), color: "bg-red-500/10 text-red-500", hide: !isAdmin }
                  ].filter(item => !item.hide).map((item, i) => (
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
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-gold transition-colors text-center">{item.label}</span>
                    </motion.button>
                  ))}
               </div>

               {/* Account Stats List */}
               {loanBalance > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] flex items-center justify-between mb-4 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                          <Landmark className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Dívida de Crédito</p>
                          <h4 className="text-2xl font-black text-slate-900 font-mono">MZN {loanBalance.toLocaleString()}</h4>
                        </div>
                    </div>
                  </div>
               )}
               <div className="bg-card-bg rounded-[40px] border border-black/5 overflow-hidden divide-y divide-black/5 shadow-md">
                  {[
                    { l: "Nível VIP Atual", v: `VIP ${activeVip}`, icon: Star },
                    { l: "Membros Diretos", v: TEAM_LEVELS[0].count.toString(), icon: Users },
                    { l: "Data de Adesão", v: "Maio 2026", icon: CheckCircle2 },
                    { l: "Status Conta", v: "Verificada", icon: ShieldCheck, color: "text-green-500" }
                  ].map((s, i) => (
                    <div key={i} className="px-8 py-5 flex justify-between items-center group hover:bg-black/5 transition-colors">
                       <div className="flex items-center gap-4">
                          <s.icon className="w-4 h-4 text-gold opacity-50" />
                          <span className="text-[10px] text-text-gray font-black uppercase tracking-widest">{s.l}</span>
                       </div>
                       <span className={`text-xs font-black uppercase tracking-widest ${s.color || 'text-slate-900'}`}>{s.v}</span>
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
        <nav className="fixed bottom-0 left-0 right-0 z-[1000] pb-8 pt-4 px-6 bg-gradient-to-t from-bg-deep via-bg-deep/80 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto bg-white/70 backdrop-blur-3xl border border-black/5 p-2.5 rounded-[40px] shadow-xl flex justify-between items-center relative overflow-hidden group pointer-events-auto">
            {/* Nav inner glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />
            
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-[28px] transition-all relative group/nav min-w-[64px] ${isActive ? 'text-gold' : 'text-slate-400 hover:text-slate-900'}`}
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
                    {t(item.id)}
                 </span>
               </button>
             );
           })}
         </div>
       </nav>
    </div>
    </OverlayContext.Provider>
  );
}

