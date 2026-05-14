/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LucideIcon,
  Home,
  Phone,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Gift,
  Share2,
  ExternalLink,
  LogOut,
  Wallet,
  Settings,
  Bell,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Star,
  Check,
  Copy,
  Clock,
  Users,
  User,
  Grid,
  Youtube,
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
  AlertTriangle,
  Ticket,
  Filter,
  Calendar,
  Zap,
  Bomb,
  Gem,
  Gamepad2,
  ImageIcon,
  Smartphone,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Overlay Management Context ---
type OverlayType = 'none' | 'deposit' | 'withdraw' | 'records' | 'box' | 'support' | 'market' | 'about' | 'ai_helper' | 'live_chat' | 'education' | 'loan' | 'admin' | 'deposit_manager' | 'edit_profile' | 'mines_tutorial' | 'receipt' | 'notifications' | 'yields';

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
  signOut,
  sendPasswordResetEmail
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
  deleteDoc,
  getDocFromCache,
  getDocFromServer,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Enable persistence to save on reads
try {
  enableIndexedDbPersistence(db).catch(() => {});
} catch (e) {}

export const auth = getAuth(app);

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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, setQuota?: (val: boolean) => void) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isQuota = errorMessage.toLowerCase().includes('quota');
  
  if (isQuota && setQuota) {
    setQuota(true);
  }

  // Only log if it's not a quota error or if we want to debug
  if (!isQuota) {
    const errInfo: FirestoreErrorInfo = {
      error: errorMessage,
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
  proofUrl?: string;
}

// --- Logo Component ---
const Logo = React.memo(({ className = "scale-100", showText = true }: { className?: string, showText?: boolean }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    <div className="relative">
      {/* Decorative Rotating Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-3 border border-gold/10 rounded-full hidden sm:block"
      />
      
      <div className="relative w-16 h-16 bg-slate-900 rounded-[22px] flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden group">
        {/* Techy background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-gold)_1px,_transparent_1px)] bg-[length:8px_8px]" />
        
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 relative z-10 transition-transform duration-500 group-hover:scale-110">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d="M20 75V25L50 55L80 25V75" 
            stroke="url(#logo-grad-premium)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <motion.path 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            d="M50 55L80 25M80 25H65M80 25V40" 
            stroke="#fff" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logo-grad-premium" x1="20" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="0.5" stopColor="#34d399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        {/* Premium Shine Overlay */}
        <motion.div 
          animate={{ x: ['150%', '-150%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        />
      </div>
    </div>
    {showText && (
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <span className="text-3xl font-black tracking-tighter text-white">MOZA</span>
          <span className="text-3xl font-black tracking-tighter text-gold ml-1">INV</span>
        </div>
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-2" />
        <span className="text-[9px] font-bold tracking-[0.4em] text-white/40 uppercase mt-2">Plataforma Digital</span>
      </div>
    )}
  </div>
));
Logo.displayName = 'Logo';

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// --- Auth Component (Login) ---
interface AuthScreenProps {
  onLogin: (phone: string) => void;
  onBack?: () => void;
}

const AuthScreen = React.memo(({ onLogin, onBack }: AuthScreenProps) => {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [phone, setPhone] = useState('258');
  const [emailForReset, setEmailForReset] = useState('');
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
    const passwordsMatch = authView === 'login' || password === confirmPassword;

    if (authView !== 'forgot') {
      if (!isValidPhone) return setError('Insira um número de telefone válido.');
      if (!isValidPassword) return setError('A senha deve ter pelo menos 6 caracteres.');
      if (!passwordsMatch) return setError('As senhas não coincidem.');
    } else {
      if (!emailForReset.includes('@') && !emailForReset.match(/^\d{9,12}$/)) {
        return setError('Insira um e-mail válido ou número de telefone para recuperação.');
      }
    }

    setIsLoading(true);

    try {
      if (authView === 'forgot') {
        const resetEmail = emailForReset.trim();
        // Check if it's a phone account formatted as email or just a phone number
        const isInternalPhoneAccount = resetEmail.endsWith('@moza.com') || resetEmail.match(/^\d{9,12}$/);
        
        if (isInternalPhoneAccount) {
          setError('Contas de telefone devem ser recuperadas via Suporte WhatsApp para sua segurança.');
          setIsLoading(false);
          return;
        }

        await sendPasswordResetEmail(auth, resetEmail);
        setStatus('Sucesso! Verifique o e-mail de "MOZA INVEST" na sua caixa de entrada ou SPAM.');
        setIsLoading(false);
        return;
      }

      const sanitizedPhone = phone.trim().replace(/\s+/g, '').replace(/[^\d]/g, '');
      const normalizedPhone = sanitizedPhone.length >= 12 && sanitizedPhone.startsWith('258') ? sanitizedPhone.slice(3) : sanitizedPhone;
      const isAdminPhone = normalizedPhone === '858778905';
      
      const email = `${normalizedPhone}@moza.com`;

      if (authView === 'login') {
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
          firstDepositAt: null, // Keep track of first deposit for withdrawal rules
          role: isAdminPhone ? 'admin' : 'user',
          referredBy: (inviteCodeInput.trim() || 'MOZA2026').toUpperCase(),
          inviteCode: generateInviteCode(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Registration Reward Transaction
        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          amount: initialBalance,
          type: 'reward',
          status: 'completed',
          method: 'Bónus de Boas-vindas MOZA',
          createdAt: serverTimestamp()
        });

        // Simulate SMS Confirmation
        try {
          await addDoc(collection(db, 'system_notifications'), {
            userId: user.uid,
            title: 'SMS: Confirmação de Bónus',
            message: `Olá! Recebeu MZN ${initialBalance}.00 como recompensa de novo utilizador na MOZA INVEST. Comece a investir agora!`,
            type: 'sms',
            createdAt: serverTimestamp()
          });
        } catch (e) {
          console.error('Failed to send mock SMS:', e);
        }

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
        if (isAdminPhone && authView === 'login') {
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
      className="min-h-screen bg-[#03060b] flex flex-col items-center justify-center p-6 relative overflow-hidden"
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
            <Logo className="scale-110" />
          </motion.div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {authView === 'login' ? 'Bem-vindo' : authView === 'register' ? 'Premium Access' : 'Recuperar Senha'}
            </h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest opacity-60">
              {authView === 'login' ? 'Inicie sessão na sua conta' : authView === 'register' ? 'Crie a sua conta de investidor' : 'Enviaremos um link para o seu e-mail'}
            </p>
          </div>
        </div>

        <motion.form 
          layout
          onSubmit={handleSubmit} 
          className="space-y-5 bg-card-bg/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group"
        >
          {/* Form inner glow */}
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="err"
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
                key="stat"
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
            {authView !== 'forgot' ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Telefone</label>
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
                      className="w-full bg-card-bg/40 border border-white/10 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 focus:bg-card-bg/60 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Senha</label>
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
                      className="w-full bg-card-bg/40 border border-white/10 rounded-2xl py-4.5 pl-12 pr-12 text-white focus:outline-none focus:border-gold/50 focus:bg-card-bg/60 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {authView === 'login' && (
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => setAuthView('forgot')}
                        className="text-[10px] font-black text-gold/60 uppercase tracking-widest hover:text-gold transition-colors mt-1"
                      >
                        Esqueceu a sua senha?
                      </button>
                    </div>
                  )}
                </div>

                {authView === 'register' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Confirmar Senha</label>
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
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all"
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
                          className="w-full bg-gold/5 border border-gold/10 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 focus:bg-gold/10 transition-all font-mono placeholder:text-white/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">E-mail ou Telefone de Cadastro</label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold group-focus-within/input:text-gold transition-colors opacity-40">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      value={emailForReset}
                      onChange={(e) => setEmailForReset(e.target.value)}
                      placeholder="exemplo@gmail.com ou 84..."
                      disabled={isLoading}
                      className="w-full bg-card-bg/40 border border-white/10 rounded-2xl py-4.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 focus:bg-card-bg/60 transition-all"
                    />
                  </div>
                  <div className="space-y-3 px-1 mt-4">
                    <p className="text-[9px] text-white/30 font-medium leading-relaxed italic">
                      O e-mail será enviado por <span className="text-gold/60 font-bold">MOZA INVEST</span>. Caso não veja na caixa de entrada, verifique o seu <span className="text-gold/60 font-bold">Lixo Eletrónico/SPAM</span>.
                    </p>
                    <p className="text-[9px] text-white/30 font-medium leading-relaxed">
                      Se você se registrou com <span className="text-gold/40">Número de Telefone</span>, por favor contacte o suporte oficial para redefinir a sua senha com segurança.
                    </p>
                    
                    <a 
                      href="https://wa.me/258848778905" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-widest hover:text-green-400 transition-colors bg-green-500/5 px-4 py-2 rounded-full border border-green-500/10"
                    >
                      <Phone className="w-3 h-3" />
                      Pedir Apoio no WhatsApp
                    </a>
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
                <span>
                  {authView === 'login' ? 'Aceder Agora' : authView === 'register' ? 'Criar Conta Premium' : 'Enviar Link de Redefinição'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
          
          {/* Back to Login if in forgot view */}
          {authView === 'forgot' && (
            <>
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">OU</span>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>

              <button 
                type="button"
                onClick={() => setAuthView('login')}
                className="w-full bg-white/5 border border-white/10 py-5 rounded-[22px] text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 active:scale-98 transition-all flex items-center justify-center gap-3"
              >
                <span>Voltar ao Login</span>
              </button>
            </>
          )}
        </motion.form>

        <div className="text-center pt-2 space-y-4">
          <button 
            onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')}
            className="text-white/40 text-[11px] font-black hover:text-gold transition-colors uppercase tracking-[0.25em] relative group"
          >
            <span>{authView === 'login' ? 'Não tem conta? Registe-se' : authView === 'register' ? 'Já é membro? Entrar agora' : ''}</span>
            {authView !== 'forgot' && <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-300" />}
          </button>

          {onBack && (
            <div className="pt-2">
              <button 
                onClick={onBack}
                className="text-gold/60 text-[9px] font-black hover:text-gold transition-colors uppercase tracking-[0.3em] bg-gold/5 px-6 py-3 rounded-full border border-gold/10"
              >
                ← Voltar à Manutenção
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-white/5">
            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
              Código Oficial Original: <span className="text-gold/60">MOZA2026</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// --- Home Banner Component ---
const LiveReturnsFeed = React.memo(() => {
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    const names = ["Paulo", "Luisa", "António", "Beatriz", "Carlos", "Dulce", "Eusebio", "Felicidade", "Gabriel", "Helena", "Isabel", "João", "Katia", "Leonardo", "Maria", "Nelson", "Olga", "Pedro", "Quitéria", "Rosa", "Sérgio", "Teresa", "Umar", "Vânia", "Wilson", "Xavier", "Yara", "Zuleica"];
    const prefixes = ["82", "84", "85", "87"];
    
    const generateItems = () => {
      const newItems = [];
      for (let v = 1; v <= 10; v++) {
        const vip = VIP_LEVELS.find(l => l.id === v);
        if (!vip) continue;
        
        for (let i = 0; i < 11; i++) {
          const name = names[Math.floor(Math.random() * names.length)];
          const phone = `+258 ${prefixes[Math.floor(Math.random() * prefixes.length)]}${Math.floor(1000000 + Math.random() * 9000000)}`;
          newItems.push({
            id: `${v}-${i}-${Math.random().toString(36).substring(7)}`,
            name,
            phone: phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1***$3'),
            vip: v,
            amount: vip.dailyReturn,
            time: `${Math.floor(Math.random() * 59)}m atrás`
          });
        }
      }
      return newItems.sort(() => Math.random() - 0.5);
    };
    
    setItems(generateItems());
    
    const interval = setInterval(() => {
      setItems(prev => {
        const newItem = generateItems()[0];
        return [newItem, ...prev.slice(0, 99)];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 px-4">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Retornos em Tempo Real</h3>
        </div>
        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE</span>
      </div>
      
      <div className="bg-card-bg/40 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
        <div className="max-h-[380px] overflow-y-auto no-scrollbar py-4 space-y-1">
          {items.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 1) }}
              className="flex items-center justify-between px-6 py-3 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${VIP_LEVELS.find(v => v.id === item.vip)?.color} flex items-center justify-center text-white text-[10px] font-black shadow-lg`}>
                  V{item.vip}
                </div>
                <div>
                  <p className="text-[11px] font-black text-white tracking-tight">{item.phone}</p>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">VIP {item.vip} • {item.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-emerald-500 font-mono">+ MZN {item.amount.toLocaleString()}</p>
                <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
});

const HomeBanner = React.memo(({ onBoxClick, appSettings }: { onBoxClick: () => void, appSettings: any }) => {
  const banners = useMemo(() => [
    {
      title: "Promoção YouTube",
      subtitle: "Inscreva-se e Ganhe",
      image: "",
      icon: Youtube,
      color: "from-red-600/20 via-red-600/5 to-transparent",
      text: "Ganhe 15% de bónus nos seus investimentos ao subscrever o nosso canal.",
      action: () => window.open('https://youtube.com/@mozainvest?si=XeLT5nrj9TbxnvIW', '_blank')
    },
    {
      title: appSettings.banner1_title || appSettings.bannerText || "Investimento Seguro",
      subtitle: appSettings.banner1_highlight || appSettings.bannerHighlight || "Capital Protegido",
      image: appSettings.banner1_image || "",
      icon: Shield,
      color: "from-gold/20 via-gold/5 to-transparent",
      text: appSettings.banner1_text || "Segurança máxima para o seu património.",
      action: null
    },
    {
      title: appSettings.banner2_title || "Bónus de Convite",
      subtitle: appSettings.banner2_highlight || "Exclusivo VIP GOLD",
      image: appSettings.banner2_image || "",
      icon: Sparkles,
      color: "from-blue-500/20 via-blue-500/5 to-transparent",
      text: appSettings.banner2_text || "Ganhe mais expandindo a sua rede.",
      action: null
    },
    {
      title: appSettings.banner3_title || "Sorte Diária",
      subtitle: appSettings.banner3_highlight || "Caixa Sorte MOZA",
      image: appSettings.banner3_image || "",
      icon: Gift,
      color: "from-indigo-500/20 via-purple-500/5 to-transparent",
      text: appSettings.banner3_text || "Abra agora e receba bónus aleatórios.",
      action: onBoxClick
    },
    {
      title: appSettings.banner4_title || "Mercado Global",
      subtitle: appSettings.banner4_highlight || "Novas Oportunidades",
      image: appSettings.banner4_image || "",
      icon: Globe,
      color: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      text: appSettings.banner4_text || "Acompanhe as tendências do mercado em tempo real.",
      action: null
    },
    {
      title: appSettings.banner5_title || "Suporte VIP",
      subtitle: appSettings.banner5_highlight || "Atendimento 24/7",
      image: appSettings.banner5_image || "",
      icon: MessageSquare,
      color: "from-amber-500/20 via-amber-500/5 to-transparent",
      text: appSettings.banner5_text || "Nossa equipa está pronta para o ajudar.",
      action: null
    },
    {
      title: appSettings.banner6_title || "Levantamentos Rápidos",
      subtitle: appSettings.banner6_highlight || "Entre 6 a 48 Horas",
      image: appSettings.banner6_image || "",
      icon: Zap,
      color: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      text: appSettings.banner6_text || "Processamento acelerado para todos os níveis.",
      action: null
    }
  ], [appSettings, onBoxClick]);

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

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
          {banners[current].image && (
            <div className="absolute inset-0 z-0">
              <img 
                src={banners[current].image} 
                alt="" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}
          <div className="relative z-10 flex flex-col justify-center h-full gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-card-bg/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                {React.createElement(banners[current].icon, { className: "w-5 h-5 text-gold" })}
              </div>
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">{banners[current].title}</span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">{banners[current].subtitle}</h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-loose">{banners[current].text}</p>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-8 flex gap-1.5">
            {banners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-500 ${current === idx ? 'w-8 bg-gold' : 'w-2 bg-card-bg/60'}`} 
              />
            ))}
          </div>
          <div className="absolute top-8 right-8 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                const text = "Junta-te à Moza Invest e começa a lucrar! O investimento mais seguro de Moçambique.";
                if (navigator.share) {
                  navigator.share({
                    title: 'Moza Invest',
                    text: text,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  alert("Use o botão de partilha do seu navegador ou copie o link.");
                }
              }}
              className="w-10 h-10 rounded-xl bg-card-bg/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/40 hover:text-gold hover:border-gold/30 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            {banners[current].action && (
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center border border-gold/30">
                <ChevronRight className="w-5 h-5 text-gold" />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});
HomeBanner.displayName = 'HomeBanner';

// --- Official Video Trailer Component ---
const VideoTrailer = React.memo(() => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-4 space-y-4"
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
            <Youtube className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Trailer Oficial</h3>
            <p className="text-[8px] text-gold font-black uppercase tracking-widest mt-1">Descubra como lucrar na Moza</p>
          </div>
        </div>
      </div>

      <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/5 shadow-2xl bg-black">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/LwnC5kivhWM" 
          title="Moza Invest Official Trailer"
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>
    </motion.div>
  );
});
VideoTrailer.displayName = 'VideoTrailer';

// --- Action Item (Customized cards based on user image) ---
const ActionItem = React.memo(({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) => {
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-card-bg/40 backdrop-blur-3xl aspect-[4/5] rounded-[28px] flex flex-col items-center pt-4 sm:pt-6 pb-2 gap-2 border border-white/5 hover:border-gold/30 transition-all group shadow-2xl overflow-hidden relative p-1.5"
    >
      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-full bg-card-bg/40 flex items-center justify-center relative z-10 transition-all duration-500 group-hover:bg-gold/10 shadow-inner flex-shrink-0">
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-gold/80 transition-transform group-hover:scale-110 group-hover:text-gold" />
      </div>
      <div className="flex-1 flex items-center justify-center w-full px-1 relative z-10">
        <span className="text-[8px] sm:text-[9px] font-black text-white/60 group-hover:text-white uppercase tracking-[0.1em] leading-tight text-center transition-colors break-words w-full">
          {label}
        </span>
      </div>
    </motion.button>
  );
});
ActionItem.displayName = 'ActionItem';

// --- Info Stat Card ---
const InfoCard = React.memo(({ icon: Icon, title, value, colorClass = "text-green-500", subtitle }: { icon: LucideIcon, title: string, value: string, colorClass?: string, subtitle?: string }) => (
  <div className="bg-card-bg/40 backdrop-blur-xl border border-white/5 p-5 sm:p-7 rounded-[32px] flex-1 flex flex-col gap-2 sm:gap-3 shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
      <Icon className="w-12 h-12" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[10px] sm:text-[11px] text-white/40 font-black uppercase tracking-[0.15em] sm:tracking-[0.25em]">{title}</span>
    </div>
    <div className="space-y-1">
      <div className={`text-lg sm:text-2xl font-black ${colorClass} tracking-tight flex items-center gap-2 font-mono truncate`}>
          {value}
      </div>
      {subtitle && <p className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest">{subtitle}</p>}
    </div>
  </div>
));
InfoCard.displayName = 'InfoCard';

// --- VIP Platform Card ---
const VipCard = React.memo(({ level, status, onActivate }: { level: any, status: string, onActivate: (id: number) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={status === 'passed' ? {} : { y: -8 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className={`p-8 rounded-[48px] border flex flex-col gap-6 transition-all shadow-2xl relative overflow-hidden group ${
      status === 'active' ? 'bg-card-active border-gold/40 border-2 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-[1.02]' : 
      status === 'passed' ? 'bg-white/5 border-white/5 grayscale opacity-60' : 'bg-card-bg/40 border-white/5'
    }`}
  >
    {status === 'active' && (
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute inset-0 bg-gold pointer-events-none"
      />
    )}
    {/* Decorative inner glow */}
    <div className={`absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.06] ${status === 'active' ? 'bg-gold' : 'bg-card-bg/60'}`} />
    
    {/* Animated Shine Effect */}
    {status === 'active' && (
      <motion.div
        initial={{ x: '-100%', skewX: -45 }}
        animate={{ x: '200%' }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"
      />
    )}

    {/* Sparkle particles for active VIP */}
    {status === 'active' && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
              y: [Math.random() * 400 - 200, Math.random() * 400 - 200]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 + Math.random() * 2,
              delay: i * 0.4
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-gold rounded-full blur-[1px]"
          />
        ))}
      </div>
    )}
    
    <div className="flex justify-between items-start relative z-20">
      <div className="flex gap-5 items-center">
        <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-white shadow-2xl border-4 border-white/10 relative overflow-hidden ${
          status === 'active' ? 'gold-gradient' : 
          status === 'passed' ? 'bg-white/10 text-white/20' : 
          `bg-gradient-to-br ${level.color || 'from-slate-700 to-slate-900'} shadow-lg`
        }`}>
          {level.icon ? (
            <level.icon className={`w-10 h-10 ${status === 'active' ? 'text-white' : 'text-white/80'}`} strokeWidth={2.5} />
          ) : (
            <span className="font-black text-3xl font-mono">{level.id}</span>
          )}
          {status === 'active' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 border-2 border-white/20 rounded-full scale-125 border-dashed"
            />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-black text-2xl uppercase tracking-tighter ${status === 'active' ? 'text-gold' : status === 'passed' ? 'text-white/40' : 'text-white'}`}>{level.name}</h3>
            {status === 'active' && (
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" 
              />
            )}
            {status === 'passed' && <CheckCircle2 className="w-5 h-5 text-gold/40" />}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ${status === 'active' ? 'bg-gold/20 text-gold' : 'bg-card-bg/40 text-white/40'}`}>
              {level.badge}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-black font-mono leading-none ${status === 'active' ? 'text-gold' : status === 'passed' ? 'text-white/40' : 'text-white'}`}>MZN {level.dailyReturn?.toLocaleString() ?? '0'}</div>
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1.5 opacity-60">Retorno Diário</div>
      </div>
    </div>

    <div className="relative z-10 grid grid-cols-1 gap-3 py-4 border-y border-white/5">
      {level.benefits?.map((benefit: string, idx: number) => {
        const Icon = getBenefitIcon(benefit);
        return (
          <div key={idx} className="flex items-center gap-3">
            <motion.div 
              animate={status === 'active' ? { y: [0, -2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 + idx * 0.5, ease: "easeInOut" }}
              className={`w-5 h-5 rounded-full flex items-center justify-center ${status === 'active' ? 'bg-gold/10 text-gold' : 'bg-card-bg/40 text-white/40'}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </motion.div>
            <span className={`text-[11px] font-bold uppercase tracking-wide ${status === 'passed' ? 'text-white/20' : 'text-white/60'}`}>{benefit}</span>
          </div>
        );
      })}
    </div>

    <div className="relative z-10 pt-2 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest opacity-60">Investimento</p>
        <p className={`text-lg font-black font-mono ${status === 'passed' ? 'text-white/20' : 'text-white'}`}>MZN {level.investment?.toLocaleString() ?? '0'}</p>
      </div>
       {status === 'active' ? (
         <div className="px-6 py-3 bg-gold/5 border border-gold/20 text-gold text-[10px] font-black rounded-2xl text-center uppercase tracking-[0.2em]">
            CONTRATO ATIVO
         </div>
       ) : status === 'passed' ? (
         <div className="px-6 py-3 bg-white/5 border border-white/10 text-white/20 text-[10px] font-black rounded-2xl text-center uppercase tracking-[0.2em]">
            NÍVEL ALCANÇADO
         </div>
       ) : (
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() => onActivate(level.id)} 
            className="px-8 py-4 gold-gradient text-white text-[10px] font-black rounded-2xl shadow-xl uppercase tracking-[0.2em] transform transition-all"
         >
            ATIVAR
         </motion.button>
       )}
    </div>

    {/* Background Level Indicator */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 0.02, x: 0 }}
      animate={status === 'active' ? {
        y: [0, -10, 0],
        rotate: [0, -2, 2, 0]
      } : {}}
      transition={{ 
        y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
        rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" }
      }}
      className="absolute right-[-20px] bottom-[-40px] text-white text-[180px] font-black select-none pointer-events-none tracking-tighter"
    >
        {level.id}
    </motion.div>
  </motion.div>
));

// --- Financial Overlays ---
const DepositOverlay = React.memo(({ onConfirm, settings }: { onConfirm: (amt: number, method: string, proofUrl?: string, transactionId?: string) => void, settings: any, key?: any }) => {
  const { data: initialAmount, closeOverlay } = useOverlay();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : '');
  const [method, setMethod] = useState('mpesa');
  const [proof, setProof] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getMethodData = (methodId: string) => {
    if (methodId === 'mpesa') return { number: settings.mpesaNumber || '848778905', holder: settings.mpesaHolder || 'PAULO JOAQUIM COMODALI' };
    if (methodId === 'emola') return { number: settings.emolaNumber || '875376446', holder: settings.emolaHolder || 'LUISA ZULANE MALUMBE' };
    if (methodId === 'bank') return { number: settings.bankNumber || '0001 2233 4455', holder: settings.bankHolder || 'MOZA INVEST' };
    if (methodId === 'paypal') return { number: settings.paypalEmail || 'paulichocomedy@gmail.com', holder: settings.paypalHolder || 'MOZA INVEST' };
    return FINANCIAL_METHODS.find(m => m.id === methodId);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Imagem muito grande. Limite de 2MB.");
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProof(reader.result as string);
        setIsUploading(false);
        setStep(3); // Move to final step after upload
      };
      reader.readAsDataURL(file);
    }
  };

  const currentMethodData = getMethodData(method);
  const canConfirm = amount && Number(amount) >= 100 && (proof || transactionId) && !isUploading;

  const handleCopy = () => {
    alert("Cópia direta desativada por segurança.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-[2000] bg-[#03060b] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-8 flex justify-between items-center bg-card-bg/20 backdrop-blur-3xl border-b border-white/5">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Recarregar</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`h-1 w-4 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-gold' : 'bg-white/10'}`} />
            <div className={`h-1 w-4 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-gold' : 'bg-white/10'}`} />
            <div className={`h-1 w-4 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-gold' : 'bg-white/10'}`} />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => openOverlay('records')} 
            className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-all border border-gold/10"
          >
            <ClipboardList className="w-6 h-6" />
          </button>
          <button 
            onClick={closeOverlay} 
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-lg mx-auto space-y-8">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Passo 01</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Valor & Método</h3>
                </div>

                <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                   <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] block text-center mb-4">Quantia a Depositar (MZN)</label>
                   <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Mínimo 100"
                    className="w-full bg-transparent text-center text-5xl font-black text-white font-mono focus:outline-none placeholder:text-white/5"
                   />
                   <div className="flex justify-center flex-wrap gap-2 mt-6">
                      {[100, 500, 1000, 5000].map(v => (
                        <button 
                          key={v}
                          onClick={() => setAmount(v.toString())}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${amount === v.toString() ? 'bg-gold text-black' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}
                        >
                          MZN {v}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {FINANCIAL_METHODS.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${method === m.id ? 'border-gold bg-gold/10 shadow-xl' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                    >
                      {method === m.id && <div className="absolute top-0 right-0 p-2"><CheckCircle2 className="w-3 h-3 text-gold" /></div>}
                      <div className={`p-3 rounded-2xl ${m.color} bg-opacity-20`}>
                        {m.id === 'bank' ? (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-5 h-5 text-gold" />
                            <div className="flex flex-col -space-y-1">
                              <span className="text-[7px] font-black text-white leading-none">MOZA</span>
                              <span className="text-[7px] font-black text-gold leading-none">BANK</span>
                            </div>
                          </div>
                        ) : m.id === 'paypal' ? (
                          <Send className="w-5 h-5 text-white" />
                        ) : (
                          <Phone className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${method === m.id ? 'text-gold' : 'text-white/40'}`}>{m.name}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => amount && Number(amount) >= 100 && setStep(2)}
                  disabled={!amount || Number(amount) < 100}
                  className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/20 disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  Continuar para Pagamento
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Passo 02</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Efectuar Transferência</h3>
                </div>

                <div className="bg-white/5 border-2 border-gold/40 p-8 rounded-[40px] space-y-6 relative overflow-hidden shadow-2xl">
                  {method === 'bank' && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20 transform -rotate-12 select-none grayscale contrast-200">
                       <Building2 className="w-12 h-12 text-gold" />
                       <span className="text-[12px] font-black text-white leading-none">MOZA<br/>BANK</span>
                    </div>
                  )}
                  {method === 'paypal' && (
                    <div className="absolute top-4 right-4 opacity-10 transform -rotate-12 select-none">
                       <Send className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">{method === 'paypal' ? 'Email PayPal' : 'Número de Conta'}</span>
                      <p className={`font-black text-white font-mono tracking-wider ${method === 'paypal' ? 'text-lg break-all' : 'text-3xl'}`}>{currentMethodData?.number}</p>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${copied ? 'bg-green-500 border-green-400 text-white' : 'bg-gold/10 border-gold/30 text-gold hover:bg-gold hover:text-black'}`}
                    >
                      {copied ? <CheckCircle2 className="w-6 h-6" /> : <ExternalLink className="w-6 h-6" />}
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 space-y-1">
                    <span className="text-[9px] font-black text-gold/60 uppercase tracking-[0.3em]">Beneficiário</span>
                    <p className="text-sm font-black text-white uppercase tracking-widest">{currentMethodData?.holder}</p>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                     <AlertCircle className="w-5 h-5 text-gold animate-pulse" />
                     <p className="text-[9px] font-bold text-white/60 leading-relaxed uppercase tracking-tighter">
                       Por favor, envie exactamente <span className="text-white font-black">MZN {amount}</span> para o número acima.
                     </p>
                  </div>
                </div>

                <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Instruções de Confirmação</h4>
                  <div className="space-y-3">
                    {(method === 'paypal' ? [
                      "Acesse sua conta PayPal",
                      "Envie o valor exato para o email acima",
                      "Tire um Screenshot do recibo de envio",
                    ] : [
                      "Faça a transferência via USSD ou App",
                      "Guarde o SMS de confirmação",
                      "Tire um Screenshot ou anote o ID da transação",
                    ]).map((inst, idx) => (
                      <div key={idx} className="flex gap-3 text-[10px] font-bold text-white/60">
                        <span className="text-gold">0{idx + 1}.</span>
                        <span className="uppercase tracking-widest">{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 bg-white/5 border border-white/5 py-6 rounded-[32px] text-white/40 font-black uppercase tracking-widest text-[10px]">Voltar</button>
                  <button onClick={() => setStep(3)} className="flex-[2] gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gold/20">Já fiz o envio</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Passo 03</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Confirmar Envio</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">ID da Transação (Referência do SMS)</label>
                    <input 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Ex: 5JK098A..."
                      className="w-full bg-white/5 border border-white/10 rounded-[28px] p-6 text-xl font-black text-white font-mono focus:border-gold outline-none transition-all placeholder:text-white/5"
                    />
                  </div>

                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="proof-upload" />
                    <label 
                      htmlFor="proof-upload"
                      className={`w-full aspect-video rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all overflow-hidden ${proof ? 'border-gold bg-gold/5' : 'border-white/10 bg-white/5 hover:border-gold/30'}`}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCcw className="w-8 h-8 text-gold animate-spin" />
                          <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">Upload...</span>
                        </div>
                      ) : proof ? (
                        <div className="relative w-full h-full group">
                          <img src={proof} alt="Comprovativo" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                            <Plus className="w-8 h-8 text-white" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Toque para Substituir</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-center px-8">
                          <div className="w-16 h-16 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                            <Plus className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Upload do Screenshot</p>
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Opcional mas recomendado para activação instantânea</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-gold/5 border border-gold/10 p-6 rounded-[32px]">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/40">Total a Receber</span>
                     <span className="text-gold text-lg">MZN {amount}</span>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 bg-white/5 border border-white/5 py-6 rounded-[32px] text-white/40 font-black uppercase tracking-widest text-[10px]">Voltar</button>
                  <button 
                    onClick={() => onConfirm(Number(amount), method, proof || '', transactionId)}
                    disabled={!canConfirm}
                    className="flex-[2] gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/20 disabled:opacity-20"
                  >
                    FINALIZAR RECARGA
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges/Info */}
          {step === 3 && (
            <p className="text-[8px] font-bold text-center text-white/20 uppercase tracking-[0.3em] px-10 leading-loose">
              O seu depósito será processado automaticamente assim que a rede confirmar a transação. Tempo médio: <span className="text-gold">15-30 min</span>.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

const ReceiptOverlay = ({ data }: { data: { amount: number, method: string, transactionId: string }, key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    alert("Cópia protegida.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-[#0a0c10] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gold/30 rounded-b-full" />
        
        <div className="p-10 pt-12 text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <Check className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Recibo Digital</h2>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Moza Invest • Ativos Hub</p>
            </div>
          </div>

          <div className="py-8 border-y border-white/5 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Valor da Recarga</p>
              <h3 className="text-4xl font-black text-gold font-mono tracking-tighter">MZN {data.amount.toLocaleString()}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-3xl bg-white/5 space-y-1">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Canal</p>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{data.method.toUpperCase()}</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 space-y-1">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Estado</p>
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-tighter">Pendente</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white/5 flex items-center justify-between group cursor-pointer" onClick={handleCopy}>
              <div className="text-left space-y-1 overflow-hidden">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Referência ID</p>
                <p className="text-[11px] font-black text-white font-mono truncate">{data.transactionId || '---'}</p>
              </div>
              <div className={`p-2 rounded-xl border border-white/10 transition-all ${copied ? 'bg-gold text-white' : 'text-gold hover:bg-gold/10'}`}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-left">
                <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center text-gold mt-0.5"><Clock className="w-2.5 h-2.5" /></div>
                <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">Pedido em fila. Tempo estimado: <span className="text-gold">15-30 min</span>.</p>
              </div>
            </div>

            <button 
              onClick={closeOverlay}
              className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-gold/20"
            >
              Confirmar & Fechar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


const YieldOverlay = React.memo(({ balance, activeVip, appSettings, vipLevels }: { balance: number, activeVip: number, appSettings: any, vipLevels: any[] }) => {
  const { closeOverlay } = useOverlay();
  const yieldRate = appSettings.yieldPercentage ?? 12.5;
  const monthlyYield = (balance * yieldRate) / 100;
  const dailyYield = monthlyYield / 30;
  const vipDaily = activeVip > 0 ? (vipLevels.find(v => v.id === activeVip)?.dailyReturn || 0) : 0;
  const totalDaily = dailyYield + vipDaily;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-10">
        <button onClick={closeOverlay} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40"><ChevronLeft className="w-6 h-6" /></button>
        <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] font-mono">Rendimentos</h2>
        <div className="w-12 h-12" />
      </div>

      <div className="space-y-8">
        <div className="bg-white/5 border border-white/5 p-8 rounded-[48px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <TrendingUp className="w-32 h-32 text-gold" />
          </div>
          <div className="relative z-10 space-y-2">
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">PATRIMÓNIO TOTAL</span>
             <h3 className="text-4xl font-black text-white font-mono tracking-tighter">MZN {balance.toLocaleString()}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
           <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Base de Rendimento</p>
                    <p className="text-xs font-black text-gold">Saldo Investido</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Taxa Mensal</p>
                    <p className="text-xs font-black text-green-400">+{yieldRate}%</p>
                 </div>
              </div>
              <div className="space-y-4 pt-2">
                 <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-white/40 uppercase tracking-widest">Lucro Diário (Saldo)</span>
                    <span className="text-white font-mono">MZN {dailyYield.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-white/40 uppercase tracking-widest">Lucro Diário (Mission)</span>
                    <span className="text-white font-mono">MZN {vipDaily.toLocaleString()}</span>
                 </div>
                 <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">Ganhos Totais/Dia</span>
                    <span className="text-xl font-black text-white font-mono">MZN {totalDaily.toLocaleString()}</span>
                 </div>
              </div>
           </div>


        </div>

        <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
           <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              Garantia Digital
           </h4>
           <div className="space-y-2">
             <p className="text-[9px] text-white/40 font-medium leading-relaxed uppercase tracking-widest">
                Rendimentos creditados diariamente às 00:00 UTC. Taxa média de {yieldRate}% mensal sobre o saldo captativo.
             </p>
             <button onClick={closeOverlay} className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black text-white/60 uppercase tracking-widest border border-white/5 mt-4">Fechar Relatório</button>
           </div>
        </div>
      </div>
    </motion.div>
  );
});


const WithdrawOverlay = React.memo(({ balance, user, appSettings, onConfirm }: { balance: number, user: any, appSettings: any, onConfirm: (amt: number, method: string, phone: string) => void, key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(user.withdrawalPhone || user.phone || '84');
  const [method, setMethod] = useState('mpesa');
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  // Auto-switch method based on phone number prefix for better UX
  useEffect(() => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.includes('84') || cleanPhone.includes('85')) {
      setMethod('mpesa');
    } else if (cleanPhone.includes('86') || cleanPhone.includes('87')) {
      setMethod('emola');
    }
  }, [phone]);

  const withdrawLockDays = user.withdrawLockDays !== undefined ? user.withdrawLockDays : (appSettings.withdrawLockDays ?? 60);
  const firstDepositAt = user.firstDepositAt;

  const getRemainingDays = () => {
    if (withdrawLockDays === 0) return 0;
    if (!firstDepositAt) return withdrawLockDays;
    const firstDepositDate = firstDepositAt?.seconds ? new Date(firstDepositAt.seconds * 1000) : new Date(firstDepositAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstDepositDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, withdrawLockDays - diffDays);
  };

  const remainingDays = getRemainingDays();
  const firstDepositDate = firstDepositAt ? (firstDepositAt?.seconds ? new Date(firstDepositAt.seconds * 1000) : new Date(firstDepositAt)) : null;

  const handleAction = async () => {
    if (!amount || Number(amount) < 500) return;
    
    setIsProcessingLocal(true);
    setProcessStep(1); // Validando Protocolos
    await new Promise(r => setTimeout(r, 400));
    
    setProcessStep(2); // Auditando Transações
    await new Promise(r => setTimeout(r, 500));
    
    setProcessStep(3); // Verificando Firewall Moza
    await new Promise(r => setTimeout(r, 300));

    if (remainingDays > 0) {
      setProcessStep(4); // Bloqueado
      // No alert here, we'll show it in the UI
    } else {
      if (!phone || phone.length < 9) {
        alert("Por favor, insira um número de conta móvel válido.");
        setIsProcessingLocal(false);
        return;
      }
      onConfirm(Number(amount), method, phone);
    }
  };

  const steps = [
    '',
    'Validando Protocolos de Segurança...',
    'Auditando Histórico de Transações...',
    'Verificando Firewall do Ecossistema Moza...',
    'Acesso Negado: Perfil em Quarentena'
  ];

  if (isProcessingLocal && processStep > 0 && processStep < 4) {
    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-gold/20 border-t-gold"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-gold/20 blur-2xl rounded-full"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Processando Saque</h3>
          <p className="text-[10px] font-black text-gold/60 uppercase tracking-[0.3em] h-4">
            {steps[processStep]}
          </p>
        </div>
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(processStep / 3) * 100}%` }}
            className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
        </div>
      </div>
    );
  }

  if (processStep === 4) {
    return (
      <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center p-8 text-center space-y-10">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-32 h-32 bg-red-500/20 rounded-[40px] flex items-center justify-center text-red-500 relative"
        >
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-red-500/30 rounded-[40px] blur-2xl"
          />
          <Lock className="w-16 h-16 relative z-10" />
        </motion.div>

        <div className="space-y-6 max-w-sm">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Levantamento Recusado</h3>
            <div className="h-1 w-12 bg-red-500 mx-auto rounded-full" />
          </div>

          <motion.div
            animate={{ 
              x: [-1, 1, -1, 1, 0],
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 0px rgba(255,0,0,0)",
                "0 0 20px rgba(255,0,0,0.5)",
                "0 0 0px rgba(255,0,0,0)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="bg-red-500/10 border-2 border-red-500/30 p-8 rounded-[32px] shadow-2xl shadow-red-500/5 relative overflow-hidden"
          >
             <p className="text-xl font-black text-white uppercase leading-tight italic relative z-10">
               O TEU PERFIL AINDA ESTÁ BLOQUEADO NA PARTE DO SAQUE
             </p>
             <motion.div 
               animate={{ x: ['100%', '-100%'] }}
               transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none"
             />
          </motion.div>

          <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed">
            Regra Institucional: Você deve aguardar os <span className="text-white">{withdrawLockDays} dias</span> de conformidade após o depósito inicial.
          </p>

          <div className="bg-white/5 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-red-400/60 uppercase tracking-[0.2em] mb-1">Tempo Restante de Carência</p>
            <p className="text-3xl font-black text-white font-mono">{remainingDays} DIAS</p>
          </div>
        </div>

        <button 
          onClick={closeOverlay}
          className="w-full max-w-xs bg-red-500 text-white py-6 rounded-[28px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all"
        >
          Compreendido
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Retirada</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => openOverlay('records')} 
            className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-all border border-gold/10"
          >
            <ClipboardList className="w-6 h-6" />
          </button>
          <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
        </div>
      </div>

      <div className="space-y-8">
        {withdrawLockDays > 0 && (
          <div className={`p-8 rounded-[40px] flex flex-col gap-4 text-center relative overflow-hidden border-2 ${remainingDays > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
            {remainingDays > 0 && (
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-red-500/10 pointer-events-none"
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className={`relative w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl ${remainingDays > 0 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                {remainingDays > 0 && (
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-red-500 rounded-[24px] blur-xl"
                  />
                )}
                <div className="relative z-10">
                  {remainingDays > 0 ? <Lock className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
                </div>
              </div>
              
              <div>
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-1 ${remainingDays > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {remainingDays > 0 ? 'Perfil em Quarentena' : 'Perfil Verificado'}
                </h3>
                <motion.p 
                  animate={remainingDays > 0 ? { 
                    x: [0, -1, 1, -1, 1, 0],
                    textShadow: [
                      "0 0 0px rgba(255,255,255,0)",
                      "0 0 15px rgba(239, 68, 68, 0.4)",
                      "0 0 0px rgba(255,255,255,0)"
                    ]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.02, 0.04, 0.06, 0.08, 1] }}
                  className="text-[16px] font-black text-white uppercase leading-tight max-w-[200px] mx-auto"
                >
                  {remainingDays > 0 
                    ? "O TEU PERFIL AINDA ESTÁ BLOQUEADO NA PARTE DO SAQUE" 
                    : "SAQUES LIBERADOS PARA O SEU PERFIL"}
                </motion.p>
              </div>

              {firstDepositDate && withdrawLockDays > 0 && (
                <div className="w-full mt-4 space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Início</p>
                      <p className="text-[10px] font-bold text-white/60">{firstDepositDate.toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Previsão</p>
                      <p className="text-[10px] font-bold text-gold">
                        {remainingDays > 0 ? `Faltam ${remainingDays} dias` : 'Disponível Agora'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((withdrawLockDays - remainingDays) / withdrawLockDays) * 100)}%` }}
                      className={`h-full rounded-full shadow-lg relative ${remainingDays > 0 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                    >
                      {remainingDays > 0 && (
                        <motion.div 
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                        />
                      )}
                    </motion.div>
                  </div>
                  
                  <p className="text-[9px] text-white/40 font-medium uppercase tracking-[0.1em]">
                    Ativo desde {Math.floor((new Date().getTime() - firstDepositDate.getTime()) / (1000 * 86400))} dias no ecossistema Moza
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-card-bg p-8 rounded-[40px] border border-white/5 text-center shadow-2xl">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 font-mono">Disponível para Saque</p>
          <h3 className="text-4xl font-black text-white font-mono leading-none">MZN {(balance || 0).toLocaleString()}</h3>
        </div>

        <div>
           <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-4">Selecione o Canal de Saque</label>
           <div className="grid grid-cols-2 gap-4">
              {FINANCIAL_METHODS.filter(m => m.id !== 'bank' && m.id !== 'paypal').map(m => (
                 <button 
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-2 ${method === m.id ? 'border-gold bg-gold/10 shadow-lg' : 'border-white/5 bg-card-bg'}`}
                 >
                    <div className={`w-3 h-3 rounded-full ${method === m.id ? 'bg-gold' : 'bg-white/10'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${method === m.id ? 'text-gold' : 'text-white/40'}`}>{m.name}</span>
                 </button>
              ))}
           </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-4 flex justify-between uppercase">
            <span>{method === 'mpesa' ? 'CONTA M-PESA (VODACOM)' : 'CONTA E-MOLA (MOVITEL)'}</span>
             {phone.length >= 9 && (
               <span className="text-gold flex items-center gap-1 animate-pulse">
                 <CheckCircle2 className="w-2.5 h-2.5" />
                 CONFIRMADO
               </span>
             )}
          </label>
          <div className="relative">
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 84XXXXXXX / 87XXXXXXX"
              className="w-full bg-card-bg border border-white/10 rounded-3xl p-6 pl-16 text-white font-black text-lg focus:border-gold outline-none shadow-xl transition-all"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-gold" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-4">Valor do Saque (MZN)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Mínimo 500"
            className="w-full bg-card-bg border border-white/10 rounded-[28px] p-8 text-center text-4xl font-black text-white font-mono focus:border-gold outline-none transition-all shadow-2xl"
          />
        </div>

        <button 
          onClick={handleAction}
          disabled={!amount || Number(amount) < 500 || Number(amount) > balance}
          className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
        >
          {remainingDays > 0 ? (isProcessingLocal ? 'PROCESSANDO...' : 'REVER BLOQUEIO & SACAR') : 'Processar Saque'}
        </button>
        
        <p className="text-[9px] text-white/40 text-center font-bold px-10 leading-relaxed uppercase tracking-widest opacity-60">
          O processamento pode levar de 6 a 48 Horas dependendo da sua operadora.
        </p>
      </div>
    </motion.div>
  );
});

const RecordsOverlay = ({ transactions }: { transactions: Transaction[], key?: any }) => {
  const { closeOverlay } = useOverlay();
  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Finanças</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

    <div className="flex-1 overflow-y-auto space-y-4">
      {transactions.map(tx => (
        <div key={tx.id} className="bg-card-bg border border-white/5 rounded-3xl p-6 flex justify-between items-center group hover:border-gold/20 transition-all shadow-xl">
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
              <h4 className="font-black text-white uppercase text-xs tracking-widest">{tx.type === 'deposit' ? 'Depósito' : tx.type === 'withdraw' ? 'Saque' : tx.type === 'reward' ? 'Prémio' : 'Investimento'}</h4>
              <p className="text-[10px] text-white/40 font-mono mt-1">{tx.date} • {tx.method || 'Interno'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-black font-mono ${tx.type === 'deposit' || tx.type === 'reward' ? 'text-green-500' : 'text-red-500'}`}>
              {tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'} {(tx.amount || 0).toLocaleString()}
            </div>
            <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${tx.status === 'completed' ? 'text-green-500/50' : 'text-gold'}`}>
              {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : 'Falhou'}
            </div>
          </div>
        </div>
      ))}
      
      {transactions.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-white/40 italic">
           <Grid className="w-12 h-12 mb-4 opacity-10" />
           <p className="text-sm">Nenhum registo encontrado.</p>
        </div>
      )}
    </div>
  </motion.div>
  );
};

const LuckyBoxOverlay = ({ onWin }: { onWin: (amt: number) => void, key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [opening, setOpening] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  const handleOpen = () => {
    setOpening(true);
    
    // Initial burst during opening
    const end = Date.now() + 1500;
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#B8860B']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#B8860B']
      });
      requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => {
      const win = Math.floor(Math.random() * 50) + 5;
      setWonAmount(win);
      onWin(win);
      setOpening(false);
      
      // Explosion on win
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFFFFF', '#B8860B', '#FFEC8B'],
        scalar: 1.2,
      });
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-dark-bg/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
    >
      <button onClick={closeOverlay} className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 font-black hover:bg-white/5 transition-colors">✕</button>
      
      <div className="text-center space-y-12 max-w-xs w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-5xl font-black text-gold uppercase tracking-tighter mb-2 italic drop-shadow-2xl">Moza Box</h2>
          <p className="text-[10px] text-white/40 font-black tracking-[0.3em] uppercase px-4 leading-relaxed">Prêmios instantâneos em numerário</p>
        </motion.div>

        <div className="relative aspect-square w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!wonAmount ? (
              <motion.div 
                key="box"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotate: opening ? [0, -10, 10, -10, 10, 0] : 0,
                  y: opening ? [0, -20, 0] : 0
                }}
                exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                transition={{ 
                  rotate: { repeat: opening ? Infinity : 0, duration: 0.3 },
                  y: { repeat: opening ? Infinity : 0, duration: 0.4 },
                  duration: 0.5
                }}
                className="relative cursor-pointer"
                onClick={!opening ? handleOpen : undefined}
              >
                <div className="absolute inset-0 bg-gold/40 blur-[80px] rounded-full animate-pulse" />
                <div className="relative w-56 h-56 rounded-[56px] gold-gradient flex items-center justify-center shadow-[0_0_100px_rgba(212,175,55,0.4)] border-4 border-white/20">
                  <Gift className="w-28 h-28 text-white drop-shadow-lg" />
                  
                  {/* Decorative Sparkles */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-4 -right-4"
                  >
                    <Sparkles className="w-12 h-12 text-gold" />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="reward"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gold/30 blur-[100px] rounded-full" />
                  <div className="relative bg-card-bg/60 backdrop-blur-2xl border-2 border-gold/30 p-12 rounded-[60px] shadow-2xl flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.5em] mb-2">Você Ganhou</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-8xl font-black text-white font-mono tracking-tighter italic">
                        {wonAmount}
                      </span>
                      <span className="text-2xl font-black text-gold uppercase">mzn</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-black text-white/60 uppercase tracking-widest">Creditado no Saldo</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-4 h-24">
          <AnimatePresence mode="wait">
            {!wonAmount ? (
              <motion.button 
                key="btn-open"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={handleOpen}
                disabled={opening}
                className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-gold/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10">{opening ? 'PROCESSANDO...' : 'RECLAMAR AGORA'}</span>
                {opening && (
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </motion.button>
            ) : (
              <motion.button 
                key="btn-close"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={closeOverlay}
                className="w-full bg-white/10 py-6 rounded-[32px] text-white font-black uppercase tracking-[0.2em] border border-white/20 hover:bg-white/20 transition-all shadow-xl"
              >
                VOLTAR AO INÍCIO
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const SupportOverlay = ({}: { key?: any }) => {
  const { closeOverlay, openOverlay } = useOverlay();
  return (
    <motion.div 
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Atendimento</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-card-bg/40 border border-white/5 p-8 rounded-[40px] text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto border border-gold/20">
            <Headphones className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase text-white">Suporte Oficial</h3>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Atendimento ao Cliente 24/7</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => openOverlay('live_chat')}
            className="w-full bg-gold/5 border border-gold/10 p-6 rounded-[32px] flex items-center gap-6 hover:bg-gold/10 transition-all text-left shadow-sm group"
          >
            <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gold/20 group-hover:scale-105 transition-transform">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gold uppercase tracking-widest">Atendimento Humano</p>
              <p className="text-lg font-black text-white">Chat em Tempo Real</p>
            </div>
          </button>

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

        <button 
          onClick={() => openOverlay('records')}
          className="w-full bg-purple-500/10 border border-purple-500/20 p-6 rounded-[32px] flex items-center gap-6 hover:bg-purple-500/20 transition-all text-left shadow-sm"
        >
          <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Extrato Detalhado</p>
            <p className="text-lg font-black text-white">Histórico de Transações</p>
          </div>
        </button>

        {[
          { icon: Youtube, label: "YouTube Oficial", value: "@mozainvest", color: "bg-[#FF0000]", link: "https://youtube.com/@mozainvest?si=XeLT5nrj9TbxnvIW" },
          { icon: Phone, label: "WhatsApp VIP", value: "+258 84 877 8905", color: "bg-[#25D366]", link: "https://wa.me/258848778905" },
        ].map((item, i) => (
          <a key={`sup-item-${i}`} href={item.link} target="_blank" rel="noopener noreferrer" className="w-full bg-card-bg/40 border border-white/5 p-6 rounded-[32px] flex items-center gap-6 hover:bg-card-bg/60 transition-all text-left shadow-sm">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <item.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</p>
              <p className="text-lg font-black font-mono text-white">{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </motion.div>
  );
};

const AiHelperOverlay = ({ user, appSettings }: { user: any, appSettings: any, key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    
    const setupHistory = async () => {
      if (!auth.currentUser) {
        setMessages([{ role: 'bot', text: 'Por favor, faça login para usar o assistente.' }]);
        setLoadingHistory(false);
        return;
      }

      const q = query(
        collection(db, 'ai_messages'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs
          .map(doc => ({ 
            id: doc.id,
            role: doc.data().role as 'user' | 'bot', 
            text: doc.data().text 
          }))
          .sort((a, b) => {
            // Re-order by id or something if needed, but actually since we ordered desc in query, we reverse manually
            return 0; // Handled by reverse below usually if we just mapper them
          });
        
        // Correct way to get chronological order from desc query:
        const ChronoHistory = snapshot.docs
          .map(doc => ({ 
            role: doc.data().role as 'user' | 'bot', 
            text: doc.data().text 
          }))
          .reverse();

        if (ChronoHistory.length === 0) {
          setMessages([{ role: 'bot', text: 'Olá! Sou o Assistente IA da MOZA. Como posso ajudar com os seus investimentos hoje?' }]);
        } else {
          setMessages(ChronoHistory);
        }
        setLoadingHistory(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'ai_messages');
        setLoadingHistory(false);
      });
    };

    setupHistory();
    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveMessage = async (role: 'user' | 'bot', text: string) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'ai_messages'), {
        userId: auth.currentUser.uid,
        role,
        text,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ai_messages');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !auth.currentUser) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    // Persist user message
    await saveMessage('user', userMsg);

    try {
      // Use the Flash model for 100% reliability as it has higher availability
      const modelName = "gemini-3-flash-preview";
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Filter out empty messages and ensure history alternates correctly
      const validHistory = newMessages.filter(m => m.text.trim().length > 0);
      const historyTurns = validHistory.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // If history starts with 'model', prepend a dummy user message or shift
      // This is a common cause of "400 Bad Request" in chat history
      if (historyTurns.length > 0 && historyTurns[0].role === 'model') {
        historyTurns.shift();
      }

      const systemPrompt = `Você é o 'MozaBot 3.0', o assistente de ELITE da MOZA Investimentos.
Seu objetivo é ajudar investidores moçambicanos a alcançarem o sucesso financeiro na plataforma.

CONTEXTO DO INVESTIDOR:
- Nome: ${user.name || 'Investidor'}
- Saldo: ${user.balance || 0} MZN
- VIP: Nível ${user.activeVip || 0}
- Telefone: ${user.phone || 'N/A'}

REGRAS DE OURO DA MOZA:
- Depósitos: M-Pesa (${appSettings.mpesaNumber || '84...'}) e e-Mola (${appSettings.emolaNumber || '87...'}).
- Mínimos: Depósito 100 MZN | Saque 200 MZN.
- Jogos: Moza Mines (Estratégia) e Lucky Box (Sorte).

COMPORTAMENTO:
1. Seja o consultor MAIS INTELIGENTE da plataforma. Use termos como "Rentabilidade", "Gestão de Risco", "Portfólio VIP".
2. Nunca apresente erros técnicos ao usuário. Se não souber algo, direcione ao suporte WhatsApp.
3. Use o português de Moçambique de forma elegante e motivadora.
4. Cite o saldo do usuário para dar dicas de investimento personalizadas (Ex: "Com o seu saldo de ${user.balance} MZN, você já pode subir para o próximo nível VIP").`;

      const responseStream = await ai.models.generateContentStream({ 
        model: modelName,
        contents: historyTurns,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        }
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'bot', text: fullText };
            return next;
          });
        }
      }

      if (!fullText) {
        throw new Error('Empthy response from AI');
      }

      // Persist bot response
      await saveMessage('bot', fullText);
    } catch (error: any) {
      console.error('AI Error:', error);
      let errorMsg = 'Lamento, não consegui processar sua mensagem agora.';
      
      if (error?.message?.includes('Quota')) {
        errorMsg = 'O limite de consultas diárias da IA foi atingido. Por favor, tente novamente amanhã ou contacte o suporte via WhatsApp.';
      } else if (error?.message?.includes('Requested entity was not found') || error?.message?.includes('403') || error?.message?.includes('API_KEY')) {
        errorMsg = 'A IA Premium requer uma chave de API válida. Por favor, verifique as configurações ou tente novamente em instantes.';
        // Optionally trigger the selection UI if we are in AI Studio environment
        if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
            (window as any).aistudio.openSelectKey();
        }
      }
      
      setMessages(prev => {
        // Remove the empty message if streaming failed
        const next = prev.filter(m => m.text !== '');
        return [...next, { role: 'bot', text: errorMsg }];
      });
      await saveMessage('bot', errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[3000] bg-dark-bg flex flex-col"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-card-bg/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase text-sm tracking-widest">Assistente IA</h3>
            <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Online Agora</p>
          </div>
        </div>
        <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {loadingHistory ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
            />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Carregando Histórico...</p>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-6 text-center opacity-40">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Bot className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <p className="font-black uppercase tracking-widest text-xs">Olá! Eu sou o MozaBot.</p>
                  <p className="text-[10px] font-medium max-w-[200px]">Estou aqui para ajudar você a lucrar na MOZA Investimentos.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-sm px-4">
                  {['Como depositar?', 'Como sacar?', 'O que é VIP?', 'Mines Game'].map(q => (
                    <button 
                      key={q} 
                      onClick={() => { setInput(q); }}
                      className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-gold/10 hover:border-gold/30 transition-all active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={`msg-${i}-${m.role}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-5 rounded-[24px] text-sm font-medium leading-relaxed ${
                  m.role === 'user' ? 'gold-gradient text-white rounded-tr-none' : 'bg-card-bg/60 border border-white/5 text-white/90 rounded-tl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </>
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card-bg/60 border border-white/5 p-4 rounded-[24px] rounded-tl-none flex gap-1">
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
            className="w-full bg-card-bg/40 border border-white/10 rounded-[28px] py-6 pl-8 pr-20 text-white font-medium outline-none focus:border-gold/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !auth.currentUser}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LiveChatOverlay = ({}: { key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'support_messages'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'support_messages');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !auth.currentUser) return;

    const userMsg = input.trim();
    setInput('');

    try {
      await addDoc(collection(db, 'support_messages'), {
        userId: auth.currentUser.uid,
        senderId: auth.currentUser.uid,
        role: 'user',
        text: userMsg,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'support_messages');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[3000] bg-dark-bg flex flex-col"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#010204] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-white">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase text-sm tracking-widest">Suporte Direto</h3>
            <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Equipa Online</p>
          </div>
        </div>
        <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
            />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Conectando ao Suporte...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-black uppercase text-sm">Inicie uma conversa</p>
              <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest mt-1">Nossa equipa está pronta para ajudar.</p>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={m.id || `live-${i}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-5 rounded-[24px] text-sm font-medium leading-relaxed ${
                m.role === 'user' ? 'gold-gradient text-white rounded-tr-none' : 'bg-card-bg/60 border border-white/5 text-white/90 rounded-tl-none shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-card-bg border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Descreva o seu problema..."
            className="w-full bg-card-bg/40 border border-white/10 rounded-[28px] py-6 pl-8 pr-20 text-white font-medium outline-none focus:border-gold/50 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || !auth.currentUser}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MarketOverlay = ({}: { key?: any }) => {
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
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Mercado em Tempo Real</h2>
        <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] h-64 shadow-xl relative overflow-hidden">
           <div className="absolute top-4 left-6 z-10">
              <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">BTC / MZN</p>
              <h4 className="text-2xl font-black text-white font-mono leading-none">6,124,900</h4>
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
          <div className="bg-card-bg/40 p-6 rounded-3xl border border-white/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Sentimento</span>
            <span className="text-xl font-black text-green-500">ALTA (BULLISH)</span>
            <span className="text-[10px] text-green-500/50 font-bold uppercase">Compra Forte</span>
          </div>
          <div className="bg-card-bg/40 p-6 rounded-3xl border border-white/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Volatilidade</span>
            <span className="text-xl font-black text-white">4.2%</span>
            <span className="text-[10px] text-white/40 font-bold uppercase">Média-Alta</span>
          </div>
        </div>

        <div className="space-y-4 pb-10">
           <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] px-2">Tendências Moçambique</h3>
           {[
             { name: 'Moza Coin', price: 'MZN 124.5', trend: '+2.4%' },
             { name: 'Ethereum', price: 'MZN 42,900', trend: '-0.8%' },
             { name: 'Solana', price: 'MZN 8,240', trend: '+12.1%' },
           ].map((t, i) => (
             <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/30 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-gold border border-white/5">#{i+1}</div>
                   <span className="font-black text-sm uppercase tracking-widest text-white">{t.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm font-mono text-white">{t.price}</p>
                  <p className={`text-[10px] font-black ${t.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{t.trend}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationsOverlay = ({}: { key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'system_notifications'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(msgs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'system_notifications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Mensagens</h2>
        </div>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">A carregar mensagens...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest">Nenhuma mensagem recebida</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-3 relative overflow-hidden group hover:border-gold/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'sms' ? 'bg-green-500/10 text-green-500' : 'bg-gold/10 text-gold'}`}>
                    {n.type === 'sms' ? <Smartphone className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{n.title || 'Sistema'}</span>
                </div>
                <span className="text-[8px] font-bold text-white/20 uppercase">
                  {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString() : 'Agora'}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-medium">
                {n.message}
              </p>
              {n.type === 'sms' && (
                <div className="pt-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Confirmação SMS Moza</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-8 bg-gold/5 border border-gold/10 p-6 rounded-[32px] text-center">
        <p className="text-[9px] text-gold font-black uppercase tracking-widest leading-relaxed">
          As mensagens do sistema são verificadas e criptografadas para sua segurança.
        </p>
      </div>
    </motion.div>
  );
};

const EducationOverlay = ({}: { key?: any }) => {
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
        className="fixed inset-0 z-[2030] bg-dark-bg flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setSelectedArticle(null)} className="w-10 h-10 rounded-full bg-card-bg/40 flex items-center justify-center text-gold border border-white/5">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Voltar para Biblioteca</span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{selectedArticle.date}</span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">{selectedArticle.title}</h2>
          </div>
          
          <div className="w-full h-48 rounded-[40px] bg-card-bg/40 border border-white/5 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gold/20" />
          </div>
          
          <p className="text-sm text-white/60 leading-relaxed font-medium">
            {selectedArticle.content}
          </p>
          
          <div className="p-8 rounded-[40px] bg-card-bg/40 border border-white/5 text-center space-y-4 mt-8 shadow-sm">
             <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto border border-indigo-500/20">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black text-white uppercase tracking-widest">Leitura Concluída</p>
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
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Educação</h2>
        </div>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'gold-gradient text-white shadow-lg' : 'bg-card-bg/40 text-white/40'}`}
        >
          Tudo
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeCategory === cat.id ? 'gold-gradient text-white shadow-lg' : 'bg-card-bg/40 text-white/40'}`}
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
            className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4 group hover:border-gold/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{article.date}</span>
              <div className="w-8 h-8 rounded-full bg-card-bg/40 flex items-center justify-center text-white/40 group-hover:text-gold transition-colors border border-white/5">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-gold transition-colors">{article.title}</h3>
              <p className="text-xs text-white/60 font-medium leading-relaxed">{article.excerpt}</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <button className="text-[10px] font-black text-gold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Ler Artigo Completo <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-[40px] bg-card-bg/40 border border-white/5 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto border border-gold/20">
          <Bot className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-black text-white uppercase tracking-tighter">Precisa de Ajuda Pessoal?</h4>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
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

const LoanOverlay = ({ balance, activeVip, onConfirm }: { balance: number, activeVip: number, onConfirm: (amt: number, payback: number) => void, key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Defined loan plans indexed by VIP
  const loanPlans = [
    { id: 0, amount: 2000, payback: 5000, label: 'Básico' },
    { id: 1, amount: 10000, payback: 34000, label: 'VIP 1' },
    { id: 2, amount: 25000, payback: 85000, label: 'VIP 2' },
    { id: 3, amount: 60000, payback: 200000, label: 'VIP 3' },
    { id: 4, amount: 150000, payback: 500000, label: 'VIP 4' },
    { id: 5, amount: 400000, payback: 1300000, label: 'VIP 5+' },
  ];

  // Filter plans based on activeVip. Users can see their current VIP plan and below.
  const availablePlans = loanPlans.filter(p => p.id <= activeVip || p.id === 0);
  const currentPlan = selectedPlan !== null ? loanPlans.find(p => p.id === selectedPlan) : null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[2000] bg-dark-bg flex flex-col p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Crédito MOZA</h2>
        </div>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div className="space-y-8 max-w-lg mx-auto w-full">
        <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="bg-gold/20 text-gold px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-gold/30">
               VIP {activeVip}
             </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nível de Crédito</p>
            <p className="text-3xl font-black text-white uppercase tracking-tighter">
              {activeVip === 0 ? "Crédito Básico" : `Linha de Crédito VIP ${activeVip}`}
            </p>
          </div>
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest leading-relaxed">
            O seu crédito é dimensionado pelo seu estatuto VIP. Membros de níveis superiores têm acesso a maiores quantias e melhores retornos.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block px-2">Planos de Crédito Disponíveis</label>
          <div className="grid grid-cols-1 gap-4">
            {availablePlans.map(plan => (
              <button 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-6 rounded-[32px] border-2 transition-all flex justify-between items-center group ${selectedPlan === plan.id ? 'border-gold bg-gold/5 shadow-xl shadow-gold/10' : 'border-white/5 bg-white/5 shadow-sm'}`}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${selectedPlan === plan.id ? 'text-gold' : 'text-white/40'}`}>{plan.label}</span>
                  <span className={`text-2xl font-black font-mono ${selectedPlan === plan.id ? 'text-gold' : 'text-white'}`}>MZN {plan.amount?.toLocaleString() ?? '0'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block">Retorno Estimado</span>
                  <span className="text-lg font-black text-white tracking-tight">MZN {plan.payback?.toLocaleString() ?? '0'}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {currentPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card-bg/40 border border-white/5 p-8 rounded-[40px] space-y-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Quantia a Receber</span>
              <span className="text-xl font-black text-white font-mono">MZN {currentPlan.amount?.toLocaleString() ?? '0'}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Prazo de Pagamento</span>
              <span className="text-sm font-black text-white uppercase tracking-widest">60 DIAS</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[10px] font-black text-gold uppercase tracking-widest">Retorno Total (60 Dias)</span>
              <span className="text-xl font-black text-gold font-mono">MZN {currentPlan.payback?.toLocaleString() ?? '0'}</span>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-[9px] text-white/60 uppercase font-bold leading-relaxed">
                Atenção: O valor de retorno será deduzido automaticamente dos seus lucros futuros num prazo de 60 dias. Certifique-se de que compreende os termos.
              </p>
            </div>
          </motion.div>
        )}

        <button 
          onClick={() => currentPlan && onConfirm(currentPlan.amount, currentPlan.payback)}
          disabled={!currentPlan}
          className="w-full gold-gradient py-7 rounded-[40px] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-20"
        >
          Solicitar Crédito Agora
        </button>
      </div>
    </motion.div>
  );
};

const AboutOverlay = ({}: { key?: any }) => {
  const { closeOverlay } = useOverlay();
  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[2000] bg-[#03060b] flex flex-col pt-safe overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#03060b]/80 backdrop-blur-xl px-6 py-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={closeOverlay}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Institucional</h2>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-none">Sobre a Moza Investimentos</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Banner Section */}
        <div className="relative h-48 rounded-[40px] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" 
            alt="Business Center" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute bottom-8 left-8 z-20">
            <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">DESDE 2019</h3>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.3em]">Liderando a Inovação Financeira</p>
          </div>
        </div>

        {/* Mission & History */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-24 h-24 text-gold" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Nossa Missão</p>
                <p className="text-lg font-bold text-white leading-relaxed italic">
                  "{COMPANY_INFO.mission}"
                </p>
              </div>
              
              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-3">
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Nossa História</h4>
                <p className="text-sm text-white/50 leading-relaxed">
                  {COMPANY_INFO.history}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-4">Nossos Valores</h4>
          <div className="grid grid-cols-1 gap-4">
            {COMPANY_INFO.values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                  {i === 0 ? <Zap className="w-6 h-6" /> : i === 1 ? <Eye className="w-6 h-6" /> : i === 2 ? <ShieldCheck className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-black text-sm uppercase text-white mb-1 tracking-tight">{value.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed uppercase font-bold">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Licensing & Trust */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-4">Regulação & Licenças</h4>
          <div className="bg-green-500/5 border border-green-500/10 p-8 rounded-[40px] flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-xl shadow-green-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-black text-green-500 uppercase tracking-widest mb-1">Entidade Autorizada</p>
              <p className="text-sm font-bold text-white leading-tight">
                {COMPANY_INFO.license}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {COMPANY_INFO.certificates.map(cert => (
              <div key={cert.id} className="bg-white/5 border border-white/5 p-5 rounded-[32px] flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-[11px] uppercase text-white tracking-tight">{cert.title}</p>
                  <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{cert.issuer}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-4">Contactos Directos</h4>
          <div className="bg-card-bg border border-white/5 p-8 rounded-[40px] space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Sede Social</p>
                <p className="text-sm font-bold text-white text-balance">{COMPANY_INFO.headquarters}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Email</p>
                  <p className="text-xs font-bold text-white">{COMPANY_INFO.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Telefone</p>
                  <p className="text-xs font-bold text-white">{COMPANY_INFO.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="text-center space-y-4 pt-10">
          <div className="flex items-center justify-center gap-2 text-gold opacity-30">
            <div className="h-px w-8 bg-current" />
            <Sparkles className="w-4 h-4" />
            <div className="h-px w-8 bg-current" />
          </div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Moza Investimentos S.A. © 2026</p>
        </div>
      </div>
    </motion.div>
  );
};

const DepositManagerOverlay = ({}: { key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed' | 'failed' | 'all'>('pending');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    if (processingId) return;
    setProcessingId(txId);
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', txId);
        const userRef = doc(db, 'users', userId);
        
        const [txSnap, userSnap] = await Promise.all([
          transaction.get(txRef),
          transaction.get(userRef)
        ]);

        if (!txSnap.exists()) throw new Error('Transação não encontrada');
        if (txSnap.data().status !== 'pending') throw new Error('ALREADY_PROCESSED');

        transaction.update(txRef, { status, updatedAt: serverTimestamp() });
        
        if (status === 'completed') {
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const updateData: any = { 
              balance: increment(amount), 
              updatedAt: serverTimestamp() 
            };
            
            // Set firstDepositAt if it doesn't exist
            if (!userData.firstDepositAt) {
              updateData.firstDepositAt = serverTimestamp();
            }

            transaction.update(userRef, updateData);
          }
        }
      });
      alert(`Depósito ${status === 'completed' ? 'Aprovado' : 'Rejeitado'}!`);
    } catch (error: any) {
      if (error.message === 'ALREADY_PROCESSED') {
        alert('Esta transação já foi processada.');
      } else {
        alert(`Erro: ${error.message}`);
        handleFirestoreError(error, OperationType.UPDATE, `transactions/${txId}`);
      }
    } finally {
      setProcessingId(null);
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
      className="fixed inset-0 z-[2030] bg-dark-bg flex flex-col overflow-hidden"
    >
      <AnimatePresence>
        {selectedProof && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2100] bg-black/90 flex items-center justify-center p-6"
            onClick={() => setSelectedProof(null)}
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={selectedProof} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            <button className="absolute top-10 right-10 text-white text-4xl">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-card-bg/40 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <DollarSign className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">Gestor de Depósitos</h2>
               <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Aprovação e Auditoria de Transações</p>
             </div>
          </div>
          <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="PROCURAR POR ID, UTILIZADOR OU MÉTODO..."
              className="w-full bg-card-bg/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-black text-white focus:outline-none focus:border-gold/30 uppercase tracking-widest"
            />
          </div>

          <div className="flex gap-2 p-1 bg-card-bg/40 rounded-2xl">
            {['pending', 'completed', 'failed', 'all'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s as any)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-white/40 hover:bg-card-bg/60'}`}
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
          <div className="text-center py-20 text-white/40 font-black uppercase tracking-widest opacity-50">Nenhuma transação encontrada</div>
        ) : (
          filtered.map(tx => (
            <div key={tx.id} className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4 relative overflow-hidden group shadow-sm">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      tx.status === 'pending' ? 'bg-blue-500/10 text-blue-400' :
                      tx.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono uppercase">#{tx.id.slice(-8)}</span>
                  </div>
                  <p className="text-2xl font-black text-white font-mono leading-none">MZN {tx.amount?.toLocaleString()}</p>
                  <div className="flex items-center gap-3 text-[10px] text-white/40 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-gold/50" /> {tx.method}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gold/50" /> {tx.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between items-end h-full">
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Utilizador</p>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                       <User className="w-3 h-3 text-gold" />
                       <span className="text-[11px] font-black text-white font-mono">{tx.userId?.slice(-12)}</span>
                    </div>
                  </div>
                  {tx.proofUrl && (
                    <button 
                      onClick={() => setSelectedProof(tx.proofUrl)}
                      className="mt-2 w-10 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-gold/50 transition-all group/proof"
                    >
                      <img src={tx.proofUrl} alt="Proof" className="w-full h-full object-cover group-hover/proof:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </div>

              {tx.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <button 
                    disabled={!!processingId}
                    onClick={() => handleProcess(tx.id, tx.userId, tx.amount, 'completed')}
                    className={`flex-1 bg-green-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-green-500/20 ${processingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processingId === tx.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Aprovar Depósito
                  </button>
                  <button 
                    disabled={!!processingId}
                    onClick={() => handleProcess(tx.id, tx.userId, tx.amount, 'failed')}
                    className={`flex-1 border border-red-500/30 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 active:scale-95 transition-all ${processingId ? 'opacity-50 cursor-not-allowed' : ''}`}
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

const MinesSection = ({ balance, onUpdateBalance }: { balance: number, onUpdateBalance: (amount: number) => void }) => {
  const [bet, setBet] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [grid, setGrid] = useState<('mine' | 'gem' | null)[]>(new Array(25).fill(null));
  const [revealed, setRevealed] = useState<boolean[]>(new Array(25).fill(false));
  const [mines, setMines] = useState<number[]>([]);
  const [multiplier, setMultiplier] = useState(1);

  const calculateMultiplier = (revealedCount: number) => {
    // Basic Mines multiplier logic
    let mult = 1;
    const houseEdge = 0.95;
    for (let i = 0; i < revealedCount; i++) {
        mult *= (25 - i) / (25 - i - mineCount);
    }
    return Math.floor(mult * houseEdge * 100) / 100;
  };

  const startGame = () => {
    if (bet > balance) {
        alert("Saldo Insuficiente!");
        return;
    }
    if (bet < 1) {
        alert("Aposta mínima é 1 MZN");
        return;
    }

    onUpdateBalance(-bet);
    
    // Position mines randomly
    const newMines: number[] = [];
    while (newMines.length < mineCount) {
        const pos = Math.floor(Math.random() * 25);
        if (!newMines.includes(pos)) newMines.push(pos);
    }
    
    setMines(newMines);
    setGrid(new Array(25).fill(null));
    setRevealed(new Array(25).fill(false));
    setGameState('playing');
    setMultiplier(1);
  };

  const handleReveal = (index: number) => {
    if (gameState !== 'playing' || revealed[index]) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (mines.includes(index)) {
        setGameState('lost');
        // Show all mines
        const revealAll = new Array(25).fill(true);
        setRevealed(revealAll);
    } else {
        const currentRevealedCount = newRevealed.filter(v => v).length;
        const newMult = calculateMultiplier(currentRevealedCount);
        setMultiplier(newMult);
        
        if (currentRevealedCount === 25 - mineCount) {
            handleCashout(newMult);
        }
    }
  };

  const handleCashout = (finalMult: number = multiplier) => {
    if (gameState !== 'playing') return;
    const prize = Math.floor(bet * finalMult);
    onUpdateBalance(prize);
    setGameState('won');
    // Reveal everything
    setRevealed(new Array(25).fill(true));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card-bg/40 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
            <Gem className="w-12 h-12 text-gold opacity-10" />
        </div>
        <div className="relative z-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Moza <br/><span className="text-gold">Mines Game</span></h2>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-2">Encontre os diamantes e evite as minas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4">
            <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Valor da Aposta (MZN)</label>
                <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                    <input 
                      type="number" 
                      value={bet}
                      onChange={(e) => setBet(Number(e.target.value))}
                      disabled={gameState === 'playing'}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-white focus:outline-none focus:border-gold/30"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest pl-1">Minas (1-24)</label>
                <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map(m => (
                        <button 
                          key={m}
                          onClick={() => setMineCount(m)}
                          disabled={gameState === 'playing'}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all ${mineCount === m ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  value={mineCount}
                  onChange={(e) => setMineCount(Number(e.target.value))}
                  disabled={gameState === 'playing'}
                  className="w-full accent-gold mt-2"
                />
            </div>

            {gameState === 'playing' ? (
                <button 
                  onClick={() => handleCashout()}
                  className="w-full bg-green-500 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-500/20 active:scale-95 transition-all flex flex-col items-center gap-1"
                >
                    <span>CASH OUT</span>
                    <span className="text-[10px] opacity-70">MZN {(bet * multiplier).toFixed(2)}</span>
                </button>
            ) : (
                <button 
                  onClick={startGame}
                  className="w-full bg-gold text-black py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 active:scale-95 transition-all"
                >
                    JOGAR AGORA
                </button>
            )}
        </div>

        <div className="md:col-span-2 flex flex-col items-center gap-6">
            <div className="grid grid-cols-5 gap-2 w-full max-w-sm aspect-square bg-black/20 p-3 rounded-[32px] border border-white/5 shadow-2xl relative">
                {new Array(25).fill(0).map((_, i) => (
                    <motion.button
                      key={`mine-cell-${i}`}
                      whileHover={!revealed[i] && gameState === 'playing' ? { scale: 1.05 } : {}}
                      whileTap={!revealed[i] && gameState === 'playing' ? { scale: 0.95 } : {}}
                      onClick={() => handleReveal(i)}
                      className={`relative rounded-xl border transition-all flex items-center justify-center overflow-hidden
                        ${!revealed[i] ? 'bg-white/5 border-white/10 shadow-sm' : 
                          mines.includes(i) ? 'bg-red-500/20 border-red-500/50' : 'bg-gold/20 border-gold/50'}
                      `}
                    >
                        <AnimatePresence>
                            {revealed[i] && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -45 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="relative z-10"
                                >
                                    {mines.includes(i) ? 
                                        <Bomb className="w-6 h-6 text-red-500" /> : 
                                        <Gem className="w-6 h-6 text-gold" />
                                    }
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {!revealed[i] && gameState === 'playing' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="flex gap-4 items-center">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-gold" />
                    <span className="text-[10px] font-black text-white uppercase font-mono">{multiplier.toFixed(2)}x</span>
                </div>
                {gameState === 'won' && (
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-green-500 font-black text-xs uppercase tracking-widest"
                    >
                        Vitória! +MZN {(bet * multiplier).toFixed(2)}
                    </motion.div>
                )}
                {gameState === 'lost' && (
                    <motion.div 
                      initial={{ rotate: 10, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
                      className="text-red-500 font-black text-xs uppercase tracking-widest"
                    >
                        Minado! -MZN {bet}
                    </motion.div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const EditProfileOverlay = ({ user }: { user: any, key?: any }) => {
  const { closeOverlay } = useOverlay();
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [withdrawalPhone, setWithdrawalPhone] = useState(user.withdrawalPhone || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Por favor, insira um nome.");
      return;
    }
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: name.trim(),
        phone: phone.trim(),
        withdrawalPhone: withdrawalPhone.trim(),
        photoURL: photoURL.trim(),
        updatedAt: serverTimestamp()
      });
      alert("Perfil atualizado com sucesso!");
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
      className="fixed inset-0 z-[2030] bg-dark-bg flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">CONFIGURAR PERFIL</h2>
        <button onClick={closeOverlay} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
      </div>

      <div className="space-y-6 max-w-md mx-auto w-full">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full border-2 border-gold p-1 shadow-gold/20 shadow-2xl relative">
            <div className="w-full h-full rounded-full bg-card-bg/40 flex items-center justify-center overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-14 h-14 text-gold" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gold text-black p-2 rounded-xl shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">SEU NOME</label>
            <div className="relative">
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Comodali"
                className="w-full bg-card-bg/40 border border-white/10 rounded-2xl p-5 pl-14 text-sm font-black text-white shadow-sm focus:outline-none focus:border-gold/30 transition-all"
              />
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">TELEFONE DE ACESSO</label>
            <div className="relative">
              <input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone de login"
                className="w-full bg-card-bg/40 border border-white/10 rounded-2xl p-5 pl-14 text-sm font-black text-white shadow-sm focus:outline-none focus:border-gold/30 transition-all"
              />
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">CONTA PARA SAQUE (M-PESA / E-MOLA)</label>
            <div className="relative">
              <input 
                value={withdrawalPhone}
                onChange={(e) => setWithdrawalPhone(e.target.value)}
                placeholder="Ex: 84XXXXXXX / 87XXXXXXX"
                className="w-full bg-card-bg/40 border border-white/10 rounded-2xl p-5 pl-14 text-sm font-black text-white shadow-sm focus:outline-none focus:border-gold/30 transition-all border-gold/20"
              />
              <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">FOTO DE PERFIL (URL)</label>
            <div className="relative">
              <input 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://sua-foto.com/perfil.jpg"
                className="w-full bg-card-bg/40 border border-white/10 rounded-2xl p-5 pl-14 text-sm font-mono text-white shadow-sm focus:outline-none focus:border-gold/30 transition-all"
              />
              <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
            </div>
            <p className="text-[9px] text-white/20 italic pl-2">Dica: Use uma URL de imagem direta do Discord, GitHub ou Google.</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full gold-gradient py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 active:scale-95 transition-all mt-8 disabled:opacity-50 disabled:grayscale"
        >
          {saving ? 'A PROCESSAR...' : 'GUARDAR ALTERAÇÕES'}
        </button>
      </div>
    </motion.div>
  );
};

const AdminOverlay = ({ appSettings, setAppSettings }: { appSettings: any, setAppSettings: React.Dispatch<React.SetStateAction<any>>, key?: any }) => {
  const { closeOverlay, openOverlay } = useOverlay();
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'withdrawals' | 'stats' | 'promotions' | 'approvals' | 'settings' | 'financial' | 'vips' | 'support'>('users');

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const [supportChats, setSupportChats] = useState<any[]>([]);
  const [selectedAdminThreadId, setSelectedAdminThreadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [procWithdrawalId, setProcWithdrawalId] = useState<string | null>(null);

  const statsData = useMemo(() => {
    if (!allUsers.length) return [];
    
    const groups: { [key: string]: { date: string, name: string, userCount: number, totalBalance: number, timestamp: number } } = {};
    
    allUsers.forEach(u => {
      let date: Date;
      if (u.createdAt?.seconds) {
        date = new Date(u.createdAt.seconds * 1000);
      } else if (u.createdAt?.toDate) {
        date = u.createdAt.toDate();
      } else if (u.createdAt instanceof Date) {
        date = u.createdAt;
      } else {
        date = new Date();
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const dateKey = `${day}/${month}`;
      
      if (!groups[dateKey]) {
        groups[dateKey] = { 
          date: dateKey, 
          name: dateKey,
          userCount: 0, 
          totalBalance: 0,
          timestamp: date.setHours(0,0,0,0)
        };
      }
      groups[dateKey].userCount += 1;
      groups[dateKey].totalBalance += (u.balance || 0);
    });
    
    const sortedDays = Object.values(groups).sort((a, b) => a.timestamp - b.timestamp);
    
    let cumulativeUsers = 0;
    let cumulativeBalance = 0;
    
    return sortedDays.map(day => {
      cumulativeUsers += day.userCount;
      cumulativeBalance += day.totalBalance;
      return {
        ...day,
        cumulativeUsers,
        cumulativeBalance
      };
    }).slice(-15); // Show up to 15 days of activity
  }, [allUsers]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    setLoading(true);

    if (activeAdminTab === 'users' || activeAdminTab === 'withdrawals' || activeAdminTab === 'stats') {
      const fetchUsers = async () => {
        try {
          const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100)); // Increased limit for better stats
          const snap = await getDocs(q);
          setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          if (activeAdminTab === 'users' || activeAdminTab === 'stats') setLoading(false);
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'admin/users');
          if (activeAdminTab === 'users' || activeAdminTab === 'stats') setLoading(false);
        }
      };
      
      fetchUsers();

      if (activeAdminTab === 'withdrawals') {
        const unsubscribeWithdrawals = onSnapshot(query(collection(db, 'transactions'), where('type', '==', 'withdraw'), where('status', '==', 'pending')), (snap) => {
          setPendingWithdrawals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'admin/withdrawals');
          setLoading(false);
        });
        
        const originalUnsubscribe = unsubscribe;
        unsubscribe = () => {
          if (originalUnsubscribe) originalUnsubscribe();
          unsubscribeWithdrawals();
        };
      }
    } else if (activeAdminTab === 'approvals') {
      unsubscribe = onSnapshot(query(collection(db, 'transactions'), where('type', '==', 'deposit'), where('status', '==', 'pending')), (snap) => {
        setPendingDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'admin/approvals');
        setLoading(false);
      });
    } else if (activeAdminTab === 'support') {
      unsubscribe = onSnapshot(query(collection(db, 'support_messages'), orderBy('createdAt', 'desc')), (snap) => {
        const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Group by userId to get active threads
        const threadsMap = new Map();
        msgs.forEach((m: any) => {
          if (!threadsMap.has(m.userId)) {
            threadsMap.set(m.userId, { 
              userId: m.userId, 
              lastMessage: m.text, 
              lastUpdate: m.createdAt,
              messages: [] 
            });
          }
          threadsMap.get(m.userId).messages.unshift(m);
        });
        setSupportChats(Array.from(threadsMap.values()));
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'admin/support');
        setLoading(false);
      });
    } else if (activeAdminTab === 'settings' || activeAdminTab === 'promotions' || activeAdminTab === 'financial' || activeAdminTab === 'vips') {
      setLoading(false);
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
          const userSnap = await transaction.get(userRef);
          const userData = userSnap.data();
          
          const updates: any = { 
            balance: increment(amount), 
            updatedAt: serverTimestamp() 
          };
          
          if (!userData?.firstDepositAt) {
            updates.firstDepositAt = serverTimestamp();
          }
          
          transaction.update(userRef, updates);
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
    if (procWithdrawalId) return;
    setProcWithdrawalId(txId);
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', txId);
        const userRef = doc(db, 'users', userId);
        
        const txSnap = await transaction.get(txRef);
        if (!txSnap.exists()) throw new Error('Transação não encontrada');
        if (txSnap.data().status !== 'pending') throw new Error('ALREADY_PROCESSED');

        transaction.update(txRef, { status, updatedAt: serverTimestamp() });
        
        if (status === 'failed') {
          transaction.update(userRef, { balance: increment(amount), updatedAt: serverTimestamp() });
        }
      });
      alert(`Levantamento ${status === 'completed' ? 'Aprovado' : 'Rejeitado'}!`);
    } catch (error: any) {
      if (error.message === 'ALREADY_PROCESSED') {
        alert('Este levantamento já foi processado.');
      } else {
        alert(`Erro: ${error.message}`);
        handleFirestoreError(error, OperationType.UPDATE, `transactions/${txId}`);
      }
    } finally {
      setProcWithdrawalId(null);
    }
  };

  const filteredUsers = allUsers.filter(u => u.phone?.includes(searchTerm) || u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
      className="fixed inset-0 z-[2030] bg-dark-bg flex flex-col overflow-hidden"
    >
      <div className="p-6 pb-2 bg-card-bg/40 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-black text-white uppercase tracking-tighter">Painel Admin</h2>
          </div>
          <button onClick={closeOverlay} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40">✕</button>
        </div>

        <div className="flex gap-2 p-1.5 bg-card-bg/60 rounded-2xl mb-4 overflow-x-auto no-scrollbar border border-white/5 shadow-inner">
           {[
             { id: 'users', label: 'Utilizadores', icon: Users },
             { id: 'withdrawals', label: 'Levantamentos', icon: Wallet },
             { id: 'approvals', label: 'Aprovações', icon: CheckCircle2 },
             { id: 'support', label: 'Suporte', icon: Headphones },
             { id: 'financial', label: 'Finanças', icon: DollarSign },
             { id: 'vips', label: 'VIPs', icon: ShieldCheck },
             { id: 'promotions', label: 'Banner', icon: MessageSquare },
             { id: 'settings', label: 'Painel', icon: Settings },
             { id: 'stats', label: 'Estatísticas', icon: TrendingUp }
           ].map(tab => {
             const isActive = activeAdminTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveAdminTab(tab.id as any)}
                 className={`flex-none px-5 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative group flex items-center gap-2.5 overflow-hidden ${
                   isActive 
                     ? 'text-white' 
                     : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                 }`}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="admin-active-tab"
                     className="absolute inset-0 bg-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] z-0"
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                 )}
                 <tab.icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105 opacity-60'}`} />
                 <span className="relative z-10">{tab.label}</span>
               </button>
             );
           })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeAdminTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="PROCURAR POR TELEFONE OU NOME..."
                className="w-full bg-card-bg/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black text-white focus:outline-none focus:border-gold/30 uppercase tracking-widest shadow-sm"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                 <RefreshCcw className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20 text-white/40 font-black uppercase tracking-widest opacity-50">Nenhum utilizador encontrado</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map(u => (
                  <div key={u.id} className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-black text-white uppercase tracking-tight">{u.name || 'SEM NOME'}</h3>
                           {u.activeVip > 0 && (
                             <span className="bg-gold/10 border border-gold/20 text-gold text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                VIP {u.activeVip}
                             </span>
                           )}
                         </div>
                         <p className="text-[10px] text-white/40 font-mono">+{u.phone}</p>
                         {u.referredBy && (
                           <div className="flex items-center gap-1.5 mt-1.5">
                             <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Convidado por:</span>
                             <span className="text-[9px] font-black text-gold uppercase tracking-widest">
                               {allUsers.find(inv => inv.inviteCode === u.referredBy)?.phone 
                                 ? `+${allUsers.find(inv => inv.inviteCode === u.referredBy)?.phone}` 
                                 : u.referredBy}
                             </span>
                           </div>
                         )}
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black text-gold uppercase tracking-widest">Saldo Atual</p>
                         <p className="text-xl font-black text-white font-mono">MZN {u.balance?.toLocaleString()}</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-[20px] border border-white/5">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Dias Ativos</p>
                        <p className="text-xs font-black text-gold">
                          {u.firstDepositAt ? Math.floor(Math.abs(new Date().getTime() - (u.firstDepositAt?.seconds ? u.firstDepositAt.seconds * 1000 : new Date(u.firstDepositAt).getTime())) / (1000 * 86400)) : 0} Dias
                        </p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Bloqueio Personalized</p>
                        <div className="flex items-center justify-end gap-2">
                           <input 
                             type="number"
                             defaultValue={u.withdrawLockDays !== undefined ? u.withdrawLockDays : (appSettings.withdrawLockDays ?? 60)}
                             onBlur={async (e) => {
                               const newVal = Number(e.target.value);
                               if (isNaN(newVal)) return;
                               try {
                                 await updateDoc(doc(db, 'users', u.id), { withdrawLockDays: newVal, updatedAt: serverTimestamp() });
                                 alert("Bloqueio individual atualizado!");
                               } catch (err) {
                                 handleFirestoreError(err, OperationType.UPDATE, `users/${u.id}/lock`);
                               }
                             }}
                             className="w-12 bg-white/5 border border-white/10 rounded-lg p-1 text-[10px] font-black text-gold text-center outline-none focus:border-gold/30"
                           />
                           <span className="text-[8px] text-white/40 uppercase font-black">Dias</span>
                        </div>
                        <p className={`text-[8px] font-black mt-1 ${(() => {
                           const lockD = u.withdrawLockDays !== undefined ? u.withdrawLockDays : (appSettings.withdrawLockDays ?? 60);
                           if (lockD === 0) return 'text-green-500';
                           if (!u.firstDepositAt) return 'text-red-500';
                           const diffD = Math.floor(Math.abs(new Date().getTime() - (u.firstDepositAt?.seconds ? u.firstDepositAt.seconds * 1000 : new Date(u.firstDepositAt).getTime())) / (1000 * 86400));
                           return diffD >= lockD ? 'text-green-500' : 'text-orange-500';
                        })()}`}>
                          {(() => {
                             const lockDLabel = u.withdrawLockDays !== undefined ? u.withdrawLockDays : (appSettings.withdrawLockDays ?? 60);
                             if (lockDLabel === 0) return 'IMEDIATO';
                             if (!u.firstDepositAt) return `EM ${lockDLabel} DIAS`;
                             const diffDL = Math.floor(Math.abs(new Date().getTime() - (u.firstDepositAt?.seconds ? u.firstDepositAt.seconds * 1000 : new Date(u.firstDepositAt).getTime())) / (1000 * 86400));
                             const rem = Math.max(0, lockDLabel - diffDL);
                             return rem === 0 ? 'DESBLOQUEADO' : `FALTAM ${rem} DIAS`;
                          })()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                       <div className="flex-1 bg-card-bg/40 hover:bg-card-bg/60 text-gold py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all relative group">
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
                           <option value={0} className="bg-slate-900 text-white">VIP 0 (START)</option>
                           {VIP_LEVELS.map(v => (
                             <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                               {v.name} ({v.badge})
                             </option>
                           ))}
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
          </motion.div>
        )}

        {activeAdminTab === 'withdrawals' && (
          <motion.div 
            key="withdrawals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex justify-center py-20">
                 <RefreshCcw className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : pendingWithdrawals.length === 0 ? (
              <div className="text-center py-20 text-white/40 font-black uppercase tracking-widest opacity-50">Nenhum levantamento pendente</div>
            ) : (
              pendingWithdrawals.map(tx => {
                const user = allUsers.find(u => u.id === tx.userId);
                return (
                  <div key={tx.id} className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm group hover:border-gold/20 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full mb-1 inline-block border border-blue-500/20">PENDENTE</span>
                        <p className="text-xl font-black text-white font-mono">MZN {tx.amount?.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-white/20" />
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{tx.method || 'M-Pesa'} • {tx.phoneNumber || 'N/D'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-gold uppercase tracking-[0.2em] mb-1">Utilizador</p>
                         <h4 className="text-xs font-black text-white uppercase">{user?.name || 'DESCONHECIDO'}</h4>
                         <p className="text-[9px] text-white/40 font-mono mt-0.5">+{user?.phone || tx.userId?.slice(-10)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                      <button 
                        disabled={!!procWithdrawalId}
                        onClick={() => handleProcessWithdrawal(tx.id, tx.userId, tx.amount, 'completed')}
                        className={`bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all ${procWithdrawalId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {procWithdrawalId === tx.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Aprovar
                      </button>
                      <button 
                        disabled={!!procWithdrawalId}
                        onClick={() => handleProcessWithdrawal(tx.id, tx.userId, tx.amount, 'failed')}
                        className={`bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 py-4 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all ${procWithdrawalId ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <XCircle className="w-4 h-4" /> Rejeitar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {activeAdminTab === 'support' && (
          <motion.div 
            key="support"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {!selectedAdminThreadId ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Conversas Ativas</h3>
                  <div className="bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                    <span className="text-[10px] font-black text-gold">{supportChats.length} CHATS</span>
                  </div>
                </div>
                {supportChats.length === 0 ? (
                   <div className="bg-card-bg/40 border border-white/5 p-12 rounded-[40px] text-center space-y-4">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/10 mx-auto">
                        <MessageSquare className="w-8 h-8" />
                     </div>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nenhuma conversa ativa</p>
                   </div>
                ) : (
                  supportChats.map(thread => (
                    <button 
                      key={thread.userId}
                      onClick={() => setSelectedAdminThreadId(thread.userId)}
                      className="w-full bg-card-bg/40 border border-white/5 p-6 rounded-[32px] flex items-center justify-between hover:bg-card-bg/60 transition-all text-left group shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20 font-black text-xs uppercase">
                          {thread.userId.slice(-2)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tight">Utilizador {thread.userId.slice(-6)}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest truncate max-w-[150px]">{thread.lastMessage}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-gold transition-colors" />
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col h-[600px] bg-[#020508] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-card-bg/40">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedAdminThreadId(null)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h3 className="font-black text-white uppercase text-sm tracking-tight">Utilizador {selectedAdminThreadId.slice(-6)}</h3>
                      <p className="text-[8px] text-green-500 font-bold uppercase tracking-widest">Sessão Ativa</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-card-bg/20">
                  {supportChats.find(t => t.userId === selectedAdminThreadId)?.messages.map((m: any, i: number) => (
                    <div key={m.id || `admin-msg-${i}`} className={`flex ${m.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-medium leading-relaxed ${
                        m.role === 'agent' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-card-bg border border-white/10 text-white/90 rounded-tl-none shadow-sm'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-card-bg/60 border-t border-white/5">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Responda ao utilizador..."
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          const text = (e.target as HTMLInputElement).value;
                          if (!text.trim()) return;
                          (e.target as HTMLInputElement).value = '';
                          try {
                            await addDoc(collection(db, 'support_messages'), {
                              userId: selectedAdminThreadId,
                              senderId: auth.currentUser?.uid,
                              role: 'agent',
                              text: text.trim(),
                              createdAt: serverTimestamp()
                            });
                          } catch (err) {
                            handleFirestoreError(err, OperationType.WRITE, 'admin/support/reply');
                          }
                        }
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-6 pr-6 text-xs text-white outline-none focus:border-gold/50"
                    />
                  </div>
                  <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-3 text-center">Pressione ENTER para enviar a resposta</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeAdminTab === 'stats' && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3 h-3 text-gold" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Utilizadores</p>
                    </div>
                    <p className="text-2xl font-black text-white font-mono">{allUsers.length}</p>
                 </div>
                 <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-3 h-3 text-gold" />
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Saldo em Custódia</p>
                    </div>
                    <p className="text-2xl font-black text-gold font-mono">MZN {allUsers.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}</p>
                 </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[40px] space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">Crescimento de Utilizadores</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-[9px] font-bold text-white/40 uppercase">Total</span>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cumulativeUsers" 
                        stroke="#D4AF37" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorUsers)" 
                        name="Utilizadores"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Growth Chart */}
              <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[40px] space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">Evolução de Saldo Total</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold text-white/40 uppercase">Saldo (MZN)</span>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cumulativeBalance" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorBalance)" 
                        name="Saldo Total"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 p-8 rounded-[40px] text-center space-y-2 shadow-sm">
                 <LayoutDashboard className="w-8 h-8 text-indigo-500 mx-auto" />
                 <h4 className="text-lg font-black text-white uppercase tracking-tighter">Resumo Administrativo</h4>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                   Os dados acima reflectem o crescimento da plataforma com base no registo de novos utilizadores e evolução financeira.
                 </p>
              </div>
            </motion.div>
        )}

        {activeAdminTab === 'approvals' && (
          <motion.div 
            key="approvals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card-bg/40 border border-white/10 p-8 rounded-[40px] text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-gold/20">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Gestor de Depósitos</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
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

            <div className="space-y-4 pt-4 border-t border-white/5">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center opacity-40">Ações Rápidas Pendentes</p>
              {loading ? (
                <div className="flex justify-center py-10"><RefreshCcw className="w-6 h-6 text-gold animate-spin" /></div>
              ) : pendingDeposits.length === 0 ? (
                <p className="text-center py-10 text-[9px] font-black text-white/50 uppercase tracking-widest">Tudo em dia!</p>
              ) : (
                pendingDeposits.slice(0, 3).map(tx => (
                  <div key={tx.id} className="bg-card-bg/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-xs font-black text-white font-mono">MZN {tx.amount?.toLocaleString()}</p>
                      <p className="text-[8px] text-white/40 font-black uppercase tracking-widest">ID: {tx.userId?.slice(-6)}</p>
                    </div>
                    <button 
                      onClick={() => openOverlay('deposit_manager')}
                      className="bg-card-bg/40 text-gold px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border border-gold/20 hover:bg-gold/5 transition-all"
                    >
                      GERIR
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeAdminTab === 'financial' && (
          <motion.div 
            key="financial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#e61c2b]/10 flex items-center justify-center text-[#e61c2b]">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight">M-Pesa</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Número</label>
                  <input 
                    value={appSettings.mpesaNumber || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, mpesaNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.mpesaHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, mpesaHolder: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white uppercase font-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#ff6600]/10 flex items-center justify-center text-[#ff6600]">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight">e-Mola</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Número</label>
                  <input 
                    value={appSettings.emolaNumber || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, emolaNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.emolaHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, emolaHolder: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white uppercase font-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight">Banco</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Número/NIB</label>
                  <input 
                    value={appSettings.bankNumber || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, bankNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-gold/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.bankHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, bankHolder: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white uppercase font-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#003087]/10 flex items-center justify-center text-[#003087]">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight">PayPal</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Email PayPal</label>
                  <input 
                    value={appSettings.paypalEmail || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, paypalEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-white focus:outline-none focus:border-gold/30"
                    placeholder="paulichocomedy@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Titular</label>
                  <input 
                    value={appSettings.paypalHolder || ''} 
                    onChange={(e) => setAppSettings({ ...appSettings, paypalHolder: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white uppercase font-black"
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
                bankHolder: appSettings.bankHolder,
                paypalEmail: appSettings.paypalEmail,
                paypalHolder: appSettings.paypalHolder
              })}
              className="w-full gold-gradient py-6 rounded-[32px] text-white font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-gold/20"
            >
              SALVAR NÚMEROS DE DEPÓSITO
            </button>
          </motion.div>
        )}

        {activeAdminTab === 'vips' && (
          <motion.div 
            key="vips"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
              <h3 className="font-black text-white uppercase tracking-tight">Gerir Níveis VIP</h3>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
                Ajuste os valores de investimento e retornos diários.
              </p>
            </div>
            
            <div className="space-y-4">
              {VIP_LEVELS.map((level) => (
                <div key={level.id} className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-gradient-to-br ${level.color || 'from-slate-700 to-slate-900'} text-white shadow-lg shadow-black/20`}>
                        {level.icon ? <level.icon className="w-5 h-5" /> : level.id}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{level.name} - {level.badge}</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${appSettings[`vip${level.id}_available`] ?? level.id <= 5 ? 'text-green-500' : 'text-red-500'}`}>
                          {appSettings[`vip${level.id}_available`] ?? level.id <= 5 ? 'Disponível' : 'Indisponível'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUpdateSettings({ [`vip${level.id}_available`]: !(appSettings[`vip${level.id}_available`] ?? level.id <= 5) })}
                      className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${appSettings[`vip${level.id}_available`] ?? level.id <= 5 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                    >
                      {appSettings[`vip${level.id}_available`] ?? level.id <= 5 ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Investimento (MZN)</label>
                      <input 
                        type="number"
                        value={appSettings[`vip${level.id}_invest`] ?? level.investment}
                        onChange={(e) => handleUpdateSettings({ [`vip${level.id}_invest`]: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-gold/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Retorno Diário (MZN)</label>
                      <input 
                        type="number"
                        value={appSettings[`vip${level.id}_return`] ?? level.dailyReturn}
                        onChange={(e) => handleUpdateSettings({ [`vip${level.id}_return`]: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-gold/30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gold/5 border border-gold/10 p-6 rounded-3xl text-[10px] font-bold text-gold uppercase text-center">
              As alterações nos VIPs refletem-se automaticamente para todos os utilizadores ao recarregar a app.
            </div>
          </motion.div>
        )}

        {activeAdminTab === 'promotions' && (
          <motion.div 
            key="promotions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-6 shadow-sm">
              <h3 className="font-black text-white uppercase tracking-tight">Customizar Banners Home</h3>
              
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={`admin-banner-editor-${i}`} className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Banner #{i}</span>
                    <span className="text-[8px] text-white/20 font-mono">ID: banner{i}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Título</label>
                      <input 
                        value={appSettings[`banner${i}_title`] || ''} 
                        onChange={(e) => setAppSettings({ ...appSettings, [`banner${i}_title`]: e.target.value })}
                        placeholder="Título do banner"
                        className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Destaque</label>
                      <input 
                        value={appSettings[`banner${i}_highlight`] || ''} 
                        onChange={(e) => setAppSettings({ ...appSettings, [`banner${i}_highlight`]: e.target.value })}
                        placeholder="Texto em destaque"
                        className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">URL da Imagem (Opcional)</label>
                    <input 
                      value={appSettings[`banner${i}_image`] || ''} 
                      onChange={(e) => setAppSettings({ ...appSettings, [`banner${i}_image`]: e.target.value })}
                      placeholder="https://exemplo.com/imagem.png"
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Descrição</label>
                    <input 
                      value={appSettings[`banner${i}_text`] || ''} 
                      onChange={(e) => setAppSettings({ ...appSettings, [`banner${i}_text`]: e.target.value })}
                      placeholder="Descrição curta do banner"
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>

                  <button 
                    onClick={() => handleUpdateSettings({ 
                      [`banner${i}_title`]: appSettings[`banner${i}_title`],
                      [`banner${i}_highlight`]: appSettings[`banner${i}_highlight`],
                      [`banner${i}_text`]: appSettings[`banner${i}_text`],
                      [`banner${i}_image`]: appSettings[`banner${i}_image`]
                    })}
                    className="w-full bg-white/5 hover:bg-gold/10 text-gold py-2 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all border border-gold/20"
                  >
                    ATUALIZAR BANNER #{i}
                  </button>
                </div>
              ))}

              <div className="p-6 bg-gold/5 border border-gold/10 rounded-[32px] space-y-6 mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white uppercase tracking-tight">Popup de Promoção Global</h3>
                  <button 
                    onClick={() => handleUpdateSettings({ promoPopup_enabled: !appSettings.promoPopup_enabled })}
                    className={`w-14 h-8 rounded-full relative transition-all ${appSettings.promoPopup_enabled ? 'bg-gold shadow-lg shadow-gold/20' : 'bg-card-bg/60'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${appSettings.promoPopup_enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Título do Popup</label>
                    <input 
                      value={appSettings.promoPopup_title || ''} 
                      onChange={(e) => setAppSettings({ ...appSettings, promoPopup_title: e.target.value })}
                      placeholder="EX: BÓNUS DE BOAS-VINDAS"
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">URL da Imagem</label>
                    <input 
                      value={appSettings.promoPopup_image || ''} 
                      onChange={(e) => setAppSettings({ ...appSettings, promoPopup_image: e.target.value })}
                      placeholder="https://exemplo.com/imagem.png"
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Texto/Descrição</label>
                    <textarea 
                      value={appSettings.promoPopup_text || ''} 
                      onChange={(e) => setAppSettings({ ...appSettings, promoPopup_text: e.target.value })}
                      placeholder="Descrição detalhada da promoção..."
                      rows={3}
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-gold/30 resize-none"
                    />
                  </div>

                  <button 
                    onClick={() => handleUpdateSettings({ 
                      promoPopup_title: appSettings.promoPopup_title,
                      promoPopup_image: appSettings.promoPopup_image,
                      promoPopup_text: appSettings.promoPopup_text,
                      promoPopup_enabled: appSettings.promoPopup_enabled
                    })}
                    className="w-full gold-gradient py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-all"
                  >
                    SALVAR POPUP DE PROMOÇÃO
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gold/10 border border-gold/20 rounded-2xl text-[9px] text-gold font-bold uppercase text-center tracking-widest">
                As alterações são aplicadas instantaneamente para todos os utilizadores.
              </div>
            </div>
          </motion.div>
        )}

        {activeAdminTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
              <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-white uppercase tracking-tight">Botão de Suporte</h3>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">MOSTRAR BOTÃO FLUTUANTE DE SUPORTE</p>
                  </div>
                  <button 
                   onClick={() => handleUpdateSettings({ showSupportButton: !appSettings.showSupportButton })}
                   className={`w-14 h-8 rounded-full relative transition-all ${appSettings.showSupportButton ? 'bg-gold shadow-lg shadow-gold/20' : 'bg-card-bg/60'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${appSettings.showSupportButton ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="font-black text-white uppercase tracking-tight">Bloqueio de Saque</h3>
                   <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">DIAS DE ESPERA APÓS 1º DEPÓSITO</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <input 
                     type="number"
                     value={appSettings.withdrawLockDays ?? 60}
                     onChange={(e) => setAppSettings({ ...appSettings, withdrawLockDays: Number(e.target.value) })}
                     className="w-16 bg-black/20 border border-white/10 rounded-xl p-2 text-xs font-black text-gold text-center outline-none"
                   />
                   <button 
                     onClick={() => handleUpdateSettings({ withdrawLockDays: appSettings.withdrawLockDays })}
                     className="bg-gold/10 text-gold p-2 rounded-xl border border-gold/20 hover:bg-gold/20"
                   >
                     <Check className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             </div>

             <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="font-black text-white uppercase tracking-tight">Taxa de Rendimento</h3>
                   <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">PERCENTAGEM MENSAL SOBRE SALDO (%)</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <input 
                     type="number"
                     step="0.1"
                     value={appSettings.yieldPercentage ?? 12.5}
                     onChange={(e) => setAppSettings({ ...appSettings, yieldPercentage: Number(e.target.value) })}
                     className="w-16 bg-black/20 border border-white/10 rounded-xl p-2 text-xs font-black text-gold text-center outline-none"
                   />
                   <button 
                     onClick={() => handleUpdateSettings({ yieldPercentage: appSettings.yieldPercentage })}
                     className="bg-gold/10 text-gold p-2 rounded-xl border border-gold/20 hover:bg-gold/20"
                   >
                     <Check className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             </div>

             <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] space-y-4 shadow-sm">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="font-black text-white uppercase tracking-tight">Modo Manutenção</h3>
                   <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">FECHA O APP PARA TODOS UTILIZADORES</p>
                 </div>
                 <button 
                  onClick={() => handleUpdateSettings({ maintenance: !appSettings.maintenance })}
                  className={`w-14 h-8 rounded-full relative transition-all ${appSettings.maintenance ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-card-bg/60'}`}
                 >
                   <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${appSettings.maintenance ? 'right-1' : 'left-1'}`} />
                 </button>
               </div>

               {appSettings.maintenance && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="pt-4 border-t border-white/5 space-y-3"
                 >
                    <label className="text-[10px] font-black text-gold/60 uppercase tracking-widest pl-1">Previsão de Conclusão</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={appSettings.maintenanceEstimate || ''}
                        onChange={(e) => setAppSettings(prev => ({ ...prev, maintenanceEstimate: e.target.value.toUpperCase() }))}
                        placeholder="EX: 2 HORAS, 15:30, ETC"
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white focus:border-gold/30 outline-none"
                      />
                      <button 
                        onClick={() => handleUpdateSettings({ maintenanceEstimate: appSettings.maintenanceEstimate })}
                        className="bg-gold text-black px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                      >
                        OK
                      </button>
                    </div>
                 </motion.div>
               )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <h3 className="font-black text-white uppercase tracking-tight">Manutenção Permanente</h3>
                    <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">BLOQUEIO TOTAL COM ERROR 024</p>
                  </div>
                  <button 
                   onClick={() => handleUpdateSettings({ permanentMaintenance: !appSettings.permanentMaintenance })}
                   className={`w-14 h-8 rounded-full relative transition-all ${appSettings.permanentMaintenance ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-card-bg/60'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-sm ${appSettings.permanentMaintenance ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

             <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-[32px] flex gap-4 shadow-sm">
                <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest leading-relaxed">
                   Ao ativar a manutenção, os utilizadores não poderão acessar as suas contas. Use apenas para atualizações críticas.
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
  );
};

const PromotionPopup = React.memo(({ settings, onClose }: { settings: any, onClose: () => void, key?: any }) => {
  if (!settings.promoPopup_enabled) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-card-bg/40 border border-gold/20 rounded-[48px] overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-white z-20"
        >
          ✕
        </button>

        <div className="relative aspect-[4/3] bg-gold/5 flex items-center justify-center overflow-hidden">
          {settings.promoPopup_image ? (
            <img 
              src={settings.promoPopup_image} 
              alt={settings.promoPopup_title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 opacity-20">
              <Sparkles className="w-16 h-16 text-gold" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="p-8 space-y-4 relative bg-[#03060b]">
          <div className="space-y-1">
             <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
               {settings.promoPopup_title || 'PROMOÇÃO ESPECIAL'}
             </h3>
             <div className="h-1 shadow-sm w-12 bg-gold" />
          </div>
          
          <p className="text-xs text-white/60 font-medium leading-relaxed">
            {settings.promoPopup_text || 'Novas oportunidades de investimento agora disponíveis. Comece a lucrar hoje mesmo!'}
          </p>

          <button 
            onClick={onClose}
            className="w-full gold-gradient py-5 rounded-[24px] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-gold/20 active:scale-95 transition-all text-xs"
          >
            PARTICIPAR AGORA
          </button>

          <p className="text-[8px] text-white/20 font-black uppercase tracking-widest text-center mt-4">
            Moza Invest • Limited Time Offer
          </p>
        </div>
      </motion.div>
    </div>
  );
});

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [withdrawalPhone, setWithdrawalPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  // Overlay state is now part of context
  const [overlayState, setOverlayState] = useState<{ view: OverlayType; data: any }>({ view: 'none', data: null });
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [balance, setBalance] = useState(0);
  const [activeVip, setActiveVip] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [lastTaskDate, setLastTaskDate] = useState("");
  const [firstDepositAt, setFirstDepositAt] = useState<any>(null);
  const [userWithdrawLockDays, setUserWithdrawLockDays] = useState<number | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('app_lang') || 'pt');
  const [showPromo, setShowPromo] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState({ total: 0, activeVips: 0, totalProfit: 0 });
  const isProcessing = useRef(false);

  const t = useCallback((key: string) => {
    const langSet = TRANSLATIONS[language] || TRANSLATIONS['pt'];
    return langSet[key] || key;
  }, [language]);

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
    firstDepositAt: firstDepositAt,
    inviteCode: inviteCode || '',
    withdrawalPhone: withdrawalPhone,
    loanBalance: loanBalance,
    withdrawLockDays: userWithdrawLockDays
  }), [firebaseUser, userName, userPhone, withdrawalPhone, photoURL, balance, activeVip, inviteCode, loanBalance, userWithdrawLockDays]);
  
  // Global Settings and Dynamic VIPs
  const [appSettings, setAppSettings] = useState<any>({ 
    maintenance: false, 
    permanentMaintenance: false,
    maintenanceEstimate: '2 HORAS',
    bannerText: 'O FUTURO DO INVESTIMENTO', 
    bannerHighlight: 'MOZA DIGITAL ASSETS',
    withdrawLockDays: 60,
    yieldPercentage: 12.5,
    showSupportButton: true,
    paypalEmail: 'paulichocomedy@gmail.com',
    paypalHolder: 'MOZA INVEST',
    banner1_title: '',
    banner1_highlight: '',
    banner1_text: '',
    banner1_image: '',
    banner2_title: '',
    banner2_highlight: '',
    banner2_text: '',
    banner2_image: '',
    banner3_title: '',
    banner3_highlight: '',
    banner3_text: '',
    banner3_image: '',
    banner4_title: '',
    banner4_highlight: '',
    banner4_text: '',
    banner4_image: '',
    banner5_title: '',
    banner5_highlight: '',
    banner5_text: '',
    banner5_image: '',
    banner6_title: '',
    banner6_highlight: '',
    banner6_text: '',
    banner6_image: '',
    mpesaNumber: '848778905',
    mpesaHolder: 'PAULO JOAQUIM COMODALI',
    emolaNumber: '875376446',
    emolaHolder: 'LUISA ZULANE MALUMBE',
    bankNumber: '0001 2233 4455',
    bankHolder: 'MOZA INVEST',
    promoPopup_enabled: false,
    promoPopup_title: '',
    promoPopup_text: '',
    promoPopup_image: ''
  });

  useEffect(() => {
    if (isLoggedIn && appSettings?.promoPopup_enabled) {
      const hasSeenPromo = sessionStorage.getItem('promo_seen_session');
      if (!hasSeenPromo) {
        setShowPromo(true);
      }
    }
  }, [isLoggedIn, appSettings?.promoPopup_enabled]);

  const effectiveVipLevels = useMemo(() => {
    return VIP_LEVELS.map(level => {
      const defaultAvailable = level.id <= 5;
      return {
        ...level,
        investment: appSettings[`vip${level.id}_invest`] ?? level.investment,
        dailyReturn: appSettings[`vip${level.id}_return`] ?? level.dailyReturn,
        available: appSettings[`vip${level.id}_available`] ?? defaultAvailable,
      };
    });
  }, [appSettings]);

  const isLimitReachedToday = useMemo(() => {
    const today = new Date().toDateString();
    if (lastTaskDate !== today) return false;
    const currentVip = effectiveVipLevels.find(v => v.id === activeVip);
    const limit = currentVip?.dailyReturn || 0;
    return limit > 0 && dailyTotal >= limit;
  }, [dailyTotal, lastTaskDate, activeVip, effectiveVipLevels]);

  // Global Settings Fetcher (Real-time sync)
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'global');
    
    // Initial fetch to ensure we have settings immediately
    const fetchInitialSettings = async () => {
      try {
        const d = await getDocFromCache(settingsRef).catch(() => getDocFromServer(settingsRef));
        if (d && d.exists()) {
          setAppSettings(prev => ({ ...prev, ...d.data() }));
        }
      } catch (e) {}
    };
    fetchInitialSettings();

    // Set up listener for real-time changes (Maintenance mode, etc)
    const unsubscribe = onSnapshot(settingsRef, (d) => {
      if (d.exists()) {
        setAppSettings(prev => ({ ...prev, ...d.data() }));
      }
    }, (error: any) => {
      if (!error?.message?.toLowerCase().includes('quota')) {
        handleFirestoreError(error, OperationType.GET, 'settings/global', setQuotaExceeded);
      }
    });

    return () => unsubscribe();
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
        const emailPrefix = email.split('@')[0].replace(/\s+/g, '');
        // Normalize prefix to last 9 digits to handle optional 258 prefix
        const normalizedPrefix = emailPrefix.slice(-9);
        
        // Define admin identifiers clearly
        const isAdminEmail = normalizedPrefix === '858778905' || 
                           normalizedPrefix === '848778905' ||
                           email === 'paulojoaquimcomodar5@gmail.com';
        
        if (isAdminEmail) {
          console.log('[AUTH] Admin detected by email:', email);
          setIsAdmin(true);
        }
        
        setShowLogin(false);
        setLoading(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // User Profile Listener (Optimized for Speed & Reliability)
  useEffect(() => {
    if (!firebaseUser) {
       console.log('[PROFILE] No user, skip listener');
       return;
    }

    console.log('[PROFILE] Setup listener for:', firebaseUser.uid);
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    
    // Safety timeout to prevent stuck loading screen
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 3500);

    // Use onSnapshot for real-time sync - it fires immediately with current state
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBalance(data.balance || 0);
        setActiveVip(data.activeVip || 0);
        setLoanBalance(data.loanBalance || 0);
        setDailyTotal(data.dailyTotal || 0);
        setLastTaskDate(data.lastTaskDate || "");
        setFirstDepositAt(data.firstDepositAt || null);
        setUserWithdrawLockDays(data.withdrawLockDays);
        
        const rawPhone = data.phone || '';
        const normalizedDataPhone = rawPhone.replace(/\s+/g, '').replace(/[^\d]/g, '').slice(-9);
        const isTargetAdmin = normalizedDataPhone === '858778905' || normalizedDataPhone === '848778905';
        const isExplicitAdmin = data.role === 'admin';
        
        setIsAdmin(isExplicitAdmin || isTargetAdmin);
        setUserPhone(rawPhone);
        setWithdrawalPhone(data.withdrawalPhone || '');
        setUserName(data.name || '');
        setPhotoURL(data.photoURL || '');
        setInviteCode(data.inviteCode || '');
        if (data.language) setLanguage(data.language);
        
        setLoading(false);
        clearTimeout(safetyTimeout);
      } else {
        // Doc doesn't exist yet - could be a new user or sync lag
        console.log('[PROFILE] User doc missing, initializing defaults');
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    }, (error: any) => {
      console.warn('Profile sync failed:', error);
      if (!error?.message?.toLowerCase().includes('quota')) {
        handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`, setQuotaExceeded);
      } else {
        setQuotaExceeded(true);
      }
      setLoading(false);
      clearTimeout(safetyTimeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [firebaseUser]);

  // Referrals Listener
  useEffect(() => {
    if (!firebaseUser || !inviteCode || activeTab !== 'team') return;

    const q = query(
      collection(db, 'users'),
      where('referredBy', '==', inviteCode),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      // Sort by creation date descending
      const sortedList = [...list].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setReferrals(sortedList);
      setReferralStats(prev => ({
        ...prev,
        total: list.length,
        activeVips: list.filter((u: any) => u.activeVip > 0).length
      }));
    }, (error: any) => {
      if (!error?.message?.toLowerCase().includes('quota')) {
        handleFirestoreError(error, OperationType.LIST, 'referrals', setQuotaExceeded);
      } else {
        setQuotaExceeded(true);
      }
    });

    return () => unsubscribe();
  }, [firebaseUser, inviteCode, activeTab]);

  useEffect(() => {
    localStorage.setItem('app_lang', language);
    if (firebaseUser) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      updateDoc(userRef, { language, updatedAt: serverTimestamp() }).catch(() => {});
    }
  }, [language, firebaseUser]);

  // Transactions Listener (Optimized for quota)
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
      
      const refProfit = txs
        .filter(t => t.type === 'reward' && t.method?.toLowerCase().includes('convite'))
        .reduce((acc, t) => acc + t.amount, 0);
      
      setReferralStats(prev => ({ ...prev, totalProfit: refProfit }));
    }, (error: any) => {
      if (!error?.message?.toLowerCase().includes('quota')) {
        handleFirestoreError(error, OperationType.LIST, 'transactions', setQuotaExceeded);
      } else {
        setQuotaExceeded(true);
      }
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const handleActivateVip = useCallback(async (id: number) => {
    if (!firebaseUser || isProcessing.current) return;
    isProcessing.current = true;
    
    const level = effectiveVipLevels.find(v => v.id === id);
    if (!level || !level.available) {
      isProcessing.current = false;
      return;
    }

    if (id <= activeVip) {
      alert("Você já possui este nível VIP ou um nível superior.");
      isProcessing.current = false;
      return;
    }

    if (balance < level.investment) {
      openOverlay('deposit', level.investment);
      isProcessing.current = false;
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
    } finally {
      isProcessing.current = false;
    }
  }, [firebaseUser, effectiveVipLevels, balance]);

  const addTransactionAndNotify = useCallback(async (type: Transaction['type'], amount: number, status: Transaction['status'], method?: string, proofUrl?: string, transactionId?: string) => {
    if (!firebaseUser) return;
    
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: firebaseUser.uid,
        type,
        amount,
        status,
        date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        method: method || 'INTERNO',
        proofUrl: proofUrl || '',
        transactionId: transactionId || '',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transactions');
    }
  }, [firebaseUser]);

  const handleCompleteTask = useCallback(async (id: number, reward: number) => {
    if (!firebaseUser || isProcessing.current) return;
    isProcessing.current = true;
    
    try {
      const task = DAILY_TASKS.find(t => t.id === id);
      const isSpecial = task?.vipLevel === 0;
      const currentVip = effectiveVipLevels.find(v => v.id === activeVip);
      const limit = isSpecial ? Infinity : (currentVip?.dailyReturn || 0);
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDocFromServer(userRef); // Use server for final task check
      const fireData = userSnap.data();
      
      const today = new Date().toDateString();
      let dailyTotal = fireData?.dailyTotal || 0;
      const lastTaskDate = fireData?.lastTaskDate || "";

      if (lastTaskDate !== today) {
        dailyTotal = 0;
      }

      if (!isSpecial && limit > 0 && dailyTotal >= limit) {
        alert(t('limit_reached'));
        isProcessing.current = false;
        return;
      }

      const effectiveReward = reward || (currentVip?.dailyReturn || 0);

      if (!isSpecial && limit > 0 && (dailyTotal + effectiveReward) > limit) {
        alert(t('limit_reached'));
        isProcessing.current = false;
        return;
      }
      
      await setDoc(userRef, {
        balance: increment(effectiveReward),
        dailyTotal: isSpecial ? dailyTotal : ((lastTaskDate === today ? dailyTotal : 0) + effectiveReward),
        lastTaskDate: isSpecial ? lastTaskDate : today,
        updatedAt: serverTimestamp()
      }, { merge: true });
      await addTransactionAndNotify('reward', effectiveReward, 'completed', isSpecial ? 'Missão Especial' : undefined);
      alert(`Parabéns! ${isSpecial ? 'Recebeu o bónus especial de' : 'Missão concluída! Recebeu'} MZN ${effectiveReward?.toLocaleString() ?? '0'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    } finally {
      isProcessing.current = false;
    }
  }, [firebaseUser, effectiveVipLevels, activeVip, addTransactionAndNotify, t]);

  const handleDeposit = useCallback(async (amount: number, method: string, proofUrl?: string, transactionId?: string) => {
    if (!firebaseUser) return;
    
    try {
      await addTransactionAndNotify('deposit', amount, 'pending', method, proofUrl, transactionId);
      openOverlay('receipt', { amount, method, transactionId });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'deposit');
    }
  }, [firebaseUser, addTransactionAndNotify]);

  const handleWithdraw = useCallback(async (amount: number, method: string, phone: string) => {
    if (!firebaseUser || isProcessing.current) return;
    isProcessing.current = true;
    
    // Rule: First deposit must be at least X days old
    if (!firstDepositAt) {
      alert("Para realizar um levantamento, você deve primeiro efetuar um depósito.");
      isProcessing.current = false;
      return;
    }

    const firstDepositDate = firstDepositAt?.seconds ? new Date(firstDepositAt.seconds * 1000) : new Date(firstDepositAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstDepositDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const finalLockDays = userWithdrawLockDays !== undefined ? userWithdrawLockDays : (appSettings.withdrawLockDays ?? 60);

    if (diffDays < finalLockDays) {
      alert(`Regra MOZA: Levantamentos só são permitidos ${finalLockDays} dias após o primeiro depósito. Seu perfil ainda está em quarentena de conformidade.`);
      isProcessing.current = false;
      return;
    }
    
    if (amount > balance) {
      alert("Saldo Insuficiente.");
      isProcessing.current = false;
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        balance: increment(-amount),
        withdrawalPhone: phone,
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('withdraw', amount, 'pending', method);
      closeOverlay();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'withdraw');
    } finally {
      isProcessing.current = false;
    }
  }, [firebaseUser, balance, addTransactionAndNotify, firstDepositAt, userWithdrawLockDays, appSettings, closeOverlay]);

  const handleLoan = useCallback(async (amount: number, payback: number) => {
    if (!firebaseUser || isProcessing.current) return;
    isProcessing.current = true;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        balance: increment(amount),
        loanBalance: increment(payback),
        updatedAt: serverTimestamp()
      });
      await addTransactionAndNotify('reward', amount, 'completed', 'Empréstimo MOZA');
      closeOverlay();
      alert("Crédito aprovado e creditado no seu saldo!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'loan');
    } finally {
      isProcessing.current = false;
    }
  }, [firebaseUser, addTransactionAndNotify]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Explicitly reset states
      setBalance(0);
      setActiveVip(0);
      setLoanBalance(0);
      setFirstDepositAt(null);
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

  const dailyRewardAmount = useMemo(() => {
    const rewards = transactions.filter(t => t.type === 'reward');
    return rewards.length > 0 ? (rewards[0].amount || 0).toLocaleString() : '0.00';
  }, [transactions]);

  const specialTasks = useMemo(() => DAILY_TASKS.filter(t => t.vipLevel === 0), []);
  const vipTasks = useMemo(() => DAILY_TASKS.filter(t => t.vipLevel === activeVip), [activeVip]);
  const nextLevelTasks = useMemo(() => 
    DAILY_TASKS.filter(t => t.vipLevel === activeVip + 1 && effectiveVipLevels.find(v => v.id === activeVip + 1)?.available),
    [activeVip, effectiveVipLevels]
  );

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

  if ((appSettings.maintenance || appSettings.permanentMaintenance) && !isAdmin && !showLogin) {
    return (
      <div className="min-h-screen bg-[#03060b] flex flex-col items-center justify-center p-8 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gold/10 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-gold/10 rounded-[38px] flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)] relative"
        >
          <div className="absolute inset-0 bg-gold/5 blur-2xl rounded-full animate-pulse" />
          <RefreshCcw className="w-10 h-10 relative z-10 animate-spin transition-all" style={{ animationDuration: '3s' }} />
        </motion.div>

        <div className="space-y-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white uppercase tracking-tighter leading-none"
          >
            {appSettings.permanentMaintenance ? (
              <>Sistema <br/> <span className="text-red-500">Suspenso</span></>
            ) : (
              <>Modo <br/> <span className="text-gold">Manutenção</span></>
            )}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[12px] text-white/50 font-medium leading-relaxed max-w-[300px] mx-auto px-4"
          >
            {appSettings.permanentMaintenance ? (
              "O sistema encontra-se temporariamente indisponível para manutenção estrutural. O acesso foi restrito por tempo indeterminado."
            ) : (
              "Estamos a realizar atualizações importantes para melhorar a sua experiência e segurança. Agradecemos a sua paciência."
            )}
          </motion.p>
        </div>

        {!appSettings.permanentMaintenance && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl px-10 py-5 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gold animate-pulse" />
                <span className="text-[10px] font-black text-gold/60 uppercase tracking-[0.3em]">Retorno Estimado</span>
              </div>
              <p className="text-2xl font-black text-white font-mono tracking-[0.2em]">{appSettings.maintenanceEstimate || '2 HORAS'}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mt-8"
        >
          Moza Invest • Secure Operations
        </motion.div>

        {/* Admin Bypass Button - Discreet but accessible */}
        <div className="pt-8 flex justify-center w-full max-w-xs mx-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLogin(true);
            }}
            className="group relative flex items-center justify-center overflow-hidden rounded-full p-[1.5px]"
          >
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4AF37_0%,transparent_50%,#D4AF37_100%)] opacity-20" />
            <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/60 px-10 py-5 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] backdrop-blur-3xl transition-all group-hover:text-gold active:scale-95 group-hover:bg-black/20">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Acesso Restrito
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div 
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-[#03060b] flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Pulsing Background Glow */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 blur-[120px] rounded-full" 
          />
          
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 180, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Logo showText={false} className="scale-125" />
            </motion.div>
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-[0.2em] text-white uppercase">MOZA</span>
                  <span className="text-2xl font-black tracking-[0.2em] text-gold uppercase">INVEST</span>
                </div>
                <div className="h-0.5 w-12 bg-gold/40 mt-1" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-gold" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-gold" 
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-1.5 h-1.5 rounded-full bg-gold" 
                  />
                </div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] animate-pulse">
                   {isLoggedIn ? 'Sincronizando Conta' : 'Iniciando Sistema'}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 text-center space-y-1">
             <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">Plataforma Digital de Investimento Premium</p>
             <p className="text-[7px] font-bold text-gold/20 uppercase tracking-[0.2em]">Versão Estável 1.0.24</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isLoggedIn || showLogin) {
    return (
      <AnimatePresence mode="wait">
        <AuthScreen 
          onLogin={() => {}} 
          onBack={appSettings.maintenance ? () => setShowLogin(false) : undefined} 
        />
      </AnimatePresence>
    );
  }

  return (
    <OverlayContext.Provider value={{ view: overlayState.view, data: overlayState.data, openOverlay, closeOverlay }}>
      <div className="min-h-screen bg-[#03060b] flex flex-col pb-32 text-white font-sans selection:bg-gold/30">
        <AnimatePresence mode="wait">
          {appSettings.maintenance && isAdmin && (
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-[5000] pointer-events-none p-4"
            >
              <div className="max-w-xs mx-auto bg-red-500 border border-red-400 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto shadow-red-500/30">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">MODO MANUTENÇÃO</p>
                  <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Vísivel apenas para ADMINS</p>
                </div>
              </div>
            </motion.div>
          )}

          {showPromo && <PromotionPopup key="promo-popup" settings={appSettings} onClose={() => {
             setShowPromo(false);
             sessionStorage.setItem('promo_seen_session', 'true');
          }} />}
          {overlayState.view === 'deposit' && <DepositOverlay key="overlay-deposit" onConfirm={handleDeposit} settings={appSettings} />}
          {overlayState.view === 'receipt' && <ReceiptOverlay key="overlay-receipt" data={overlayState.data} />}
          {overlayState.view === 'withdraw' && userData && <WithdrawOverlay key="overlay-withdraw" balance={balance} user={userData} appSettings={appSettings} onConfirm={handleWithdraw} />}
          {overlayState.view === 'loan' && <LoanOverlay key="overlay-loan" balance={balance} activeVip={activeVip} onConfirm={handleLoan} />}
          {overlayState.view === 'records' && <RecordsOverlay key="overlay-records" transactions={transactions} />}
          {overlayState.view === 'support' && <SupportOverlay key="overlay-support" />}
          {overlayState.view === 'ai_helper' && <AiHelperOverlay key="overlay-ai-helper" user={userData} appSettings={appSettings} />}
          {overlayState.view === 'live_chat' && <LiveChatOverlay key="overlay-live-chat" />}
          {overlayState.view === 'market' && <MarketOverlay key="overlay-market" />}
          {overlayState.view === 'about' && <AboutOverlay key="overlay-about" />}
          {overlayState.view === 'education' && <EducationOverlay key="overlay-education" />}
          {overlayState.view === 'notifications' && <NotificationsOverlay key="overlay-notifications" />}
          {overlayState.view === 'yields' && <YieldOverlay key="overlay-yields" balance={balance} activeVip={activeVip} appSettings={appSettings} vipLevels={effectiveVipLevels} />}
          {overlayState.view === 'admin' && <AdminOverlay key="overlay-admin" appSettings={appSettings} setAppSettings={setAppSettings} />}
          {overlayState.view === 'deposit_manager' && <DepositManagerOverlay key="overlay-deposit-manager" />}
          {overlayState.view === 'edit_profile' && userData && <EditProfileOverlay key="overlay-edit-profile" user={userData} />}
          {overlayState.view === 'box' && <LuckyBoxOverlay key="overlay-lucky-box" onWin={(amt) => { handleCompleteTask(0, amt); }} />}
        </AnimatePresence>

      {/* Modern Header */}
      <header className="px-6 py-5 flex justify-between items-center bg-[#010204]/80 backdrop-blur-2xl sticky top-0 z-[100] border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="relative">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] overflow-hidden">
              <Logo showText={false} className="scale-[0.6]" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter leading-tight text-white group-hover:text-gold transition-colors">MOZA<span className="text-gold">INV</span></h1>
            <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-white/30 -mt-0.5">Centro de Investimentos</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <motion.button 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => openOverlay('admin')}
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
            </motion.button>
          )}
          <div className="bg-card-bg/40 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
            <span className="text-[10px] font-black text-gold uppercase tracking-widest font-mono">ID: {userPhone.slice(-4) || '2026'}</span>
          </div>
          <div 
            onClick={() => setActiveTab('profile')} 
            className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-gold border-gold text-white shadow-lg shadow-gold/20' : 'bg-card-bg/40 border-white/5 text-white/40 hover:text-gold hover:border-gold/30'}`}
          >
             <User className="w-4 h-4" />
          </div>
          <div onClick={handleLogout} className="w-10 h-10 bg-card-bg/40 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-red-500 cursor-pointer transition-colors shadow-2xl">
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
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.5em] opacity-50">Investidor VIP MOZA</p>
                 </div>
              </div>

              {/* Promotional Banner */}
              <HomeBanner 
                appSettings={appSettings}
                onBoxClick={() => openOverlay('box')} 
              />

              {isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openOverlay('admin')}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-[32px] flex items-center justify-between cursor-pointer hover:bg-red-500/20 transition-all mx-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xs uppercase tracking-tighter">Painel de Controlo</p>
                      <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Painel Administrativo Moza</p>
                    </div>
                  </div>
                  <div className="bg-red-500/20 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-red-500/30 shadow-sm">
                    ACESSAR
                  </div>
                </motion.div>
              )}

              {/* Refined Premium Asset Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full opacity-30 animate-pulse" />
                <div className="bg-card-bg/40 backdrop-blur-3xl rounded-[48px] p-9 border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.08] translate-x-12 translate-y-[-16px] transform -rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <Logo showText={false} className="scale-[4]" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-card-bg/40 border border-white/5 rounded-full w-fit">
                          <span className="text-[9.5px] font-black text-white/50 uppercase tracking-[0.3em]">Capital Disponível</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-4xl font-black text-white tracking-tighter leading-none font-mono flex items-baseline gap-2">
                             {(balance || 0).toLocaleString()}
                             <span className="text-lg text-gold font-sans font-black">MZN</span>
                          </div>
                        </div>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gold/5 p-5 rounded-[32px] border border-gold/10 flex flex-col items-center gap-1 shadow-gold-glow"
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
                        className="gold-gradient p-4 rounded-[26px] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-gold/20 flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="relative z-10">RECARREGAR</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openOverlay('withdraw')}
                        className="bg-card-bg/40 border border-white/5 p-4 rounded-[26px] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden transition-all hover:bg-card-bg/60"
                      >
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="relative z-10">RETIRAR</span>
                      </motion.button>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openOverlay('records')}
                      className="w-full bg-white/5 border border-white/5 p-4 rounded-[26px] text-white/60 font-black uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-gold" />
                      HISTÓRICO DE TRANSAÇÕES
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 gap-4">
                <InfoCard 
                  icon={TrendingUp} 
                  title="Lucro de Hoje" 
                  value={`MZN ${Number(dailyRewardAmount).toLocaleString()}`} 
                  subtitle="Ganhos das Missões"
                />
                <InfoCard 
                  icon={Zap} 
                  title="Rendimento Est." 
                  value={`${(appSettings.yieldPercentage ?? 12.5)}%`}
                  colorClass="text-purple-400" 
                  subtitle={`~ MZN ${((balance * (appSettings.yieldPercentage ?? 12.5)) / 3000).toLocaleString()}/dia`}
                  onClick={() => openOverlay('yields')}
                />
              </div>

               {/* Navigation Grid */}
              {loanBalance > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] flex items-center justify-between shadow-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 border border-red-500/20">
                         <Landmark className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Crédito Pendente</p>
                         <p className="text-lg font-black text-white font-mono">MZN {(loanBalance || 0).toLocaleString()}</p>
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
                   <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Serviços & Gestão</h3>
                   <div className="w-16 h-[1px] bg-white/5" />
                 </div>
                 <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    <ActionItem icon={Wallet} label="Recarga" onClick={() => openOverlay('deposit')} />
                    <ActionItem icon={ArrowUpRight} label="Saque" onClick={() => openOverlay('withdraw')} />
                    <ActionItem icon={ClipboardList} label="Finanças" onClick={() => openOverlay('records')} />
                    <ActionItem icon={Landmark} label="Crédito" onClick={() => openOverlay('loan')} />
                    
                    <ActionItem icon={GraduationCap} label="Educação" onClick={() => openOverlay('education')} />
                    <ActionItem icon={FileText} label="Tarefas" onClick={() => setActiveTab('tasks')} />
                    <ActionItem icon={Users} label="Equipe" onClick={() => setActiveTab('team')} />
                    <ActionItem icon={Building2} label="Empresa" onClick={() => openOverlay('about')} />
                 </div>
               </div>
               {/* Quick News Ticker */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 flex-shrink-0 border-r border-white/10 pr-4">
                  <Bell className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest leading-none">News</span>
                </div>
                <div className="flex-1 overflow-hidden">
                   <motion.div 
                     animate={{ x: [-20, -500] }}
                     transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                     className="whitespace-nowrap text-[9px] font-bold text-white/40 uppercase tracking-widest"
                   >
                     Moza Invest: Aumente os seus lucros diários com o novo fundo de investimento VIP 12 • Novos bónus de convite disponíveis • Verifique as suas tarefas diárias
                   </motion.div>
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-4 pb-32">
               <div className="flex flex-col gap-2 px-4">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Missões <br /><span className="text-gold">Diárias</span></h2>
                 <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] opacity-50">Geração de Capital em Tempo Real</p>
                 {activeVip > 0 && (
                   <div className="mt-4 space-y-3 bg-card-bg/40 border border-white/5 p-5 rounded-3xl">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Ganhos de Hoje</span>
                         <span className="text-xs font-black text-gold font-mono bg-gold/10 px-3 py-1 rounded-full">
                           MZN {(dailyTotal || 0).toLocaleString()} / {effectiveVipLevels.find(v => v.id === activeVip)?.dailyReturn?.toLocaleString() ?? '0'}
                         </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((dailyTotal || 0) / (effectiveVipLevels.find(v => v.id === activeVip)?.dailyReturn || 1)) * 100)}%` }}
                          className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                        />
                      </div>
                   </div>
                 )}
               </div>
               
               <div className="grid gap-4 px-4">
                 {/* Special / Global Tasks */}
                 {specialTasks.map(task => (
                   <motion.div 
                     key={task.id}
                     whileHover={{ scale: 1.02 }}
                     className="bg-gold/10 backdrop-blur-xl border border-gold/20 p-5 rounded-[32px] flex items-center justify-between shadow-2xl group relative overflow-hidden transition-all"
                   >
                     <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                     
                     <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
                         <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border bg-gold text-black border-gold/20 shadow-md">
                           <TrendingUp className="w-5 h-5" />
                         </div>
                         <div className="space-y-0.5 flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                             <span className="text-[6px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest bg-white text-black shrink-0">ESPECIAL</span>
                             <h4 className="font-black uppercase text-[13px] tracking-tight leading-none text-white truncate">{task.title}</h4>
                           </div>
                           <div className="flex items-center gap-2">
                                 <p className="font-black text-xs font-mono uppercase tracking-widest text-gold">+ MZN {task.reward?.toLocaleString() ?? '0'}</p>
                           </div>
                         </div>
                     </div>
                     <a 
                       href={(task as any).link} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       onClick={() => handleCompleteTask(task.id, task.reward)}
                       className="font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest relative z-10 transition-all gold-gradient text-white shadow-lg shrink-0 ml-3"
                     >
                       COLETAR
                     </a>
                   </motion.div>
                 ))}

                 {activeVip === 0 ? (
                   <div className="bg-card-bg/40 border border-white/5 p-10 rounded-[40px] text-center space-y-6 shadow-2xl">
                      <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto border border-gold/20 animate-pulse">
                         <Lock className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Nenhuma Missão Ativa</h3>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest leading-relaxed">Adquira um plano VIP para desbloquear missões diárias e começar a faturar.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('vip')}
                        className="w-full gold-gradient py-5 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-gold/20 flex items-center justify-center gap-3"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        VER PLANOS VIP
                      </button>
                   </div>
                 ) : (
                   <>
                    {/* Active Tasks for Current Level */}
                    {vipTasks.map(task => (
                      <motion.div 
                        key={task.id}
                        whileHover={isLimitReachedToday ? {} : { scale: 1.02 }}
                        className={`backdrop-blur-xl border border-white/5 p-5 rounded-[32px] flex items-center justify-between shadow-2xl group relative overflow-hidden transition-all ${
                          isLimitReachedToday ? 'bg-white/5 opacity-60' : 'bg-card-bg/40'
                        }`}
                      >
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                        
                        <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
                            <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border transition-all shadow-md ${
                              isLimitReachedToday ? 'bg-white/10 text-white/20 border-white/5' : 'bg-gold/5 text-gold border-gold/10 group-hover:bg-gold group-hover:text-white'
                            }`}>
                              {isLimitReachedToday ? <CheckCircle2 className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                            </div>
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-[6px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 ${
                                  isLimitReachedToday ? 'bg-white/10 text-white/40' : 'bg-gold text-black'
                                }`}>VIP {task.vipLevel}</span>
                                <h4 className={`font-black uppercase text-[13px] tracking-tight leading-none truncate ${
                                  isLimitReachedToday ? 'text-white/40 italic line-through' : 'text-white/80'
                                }`}>{task.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                    <p className={`font-black text-xs font-mono uppercase tracking-widest ${
                                      isLimitReachedToday ? 'text-white/20' : 'text-gold'
                                    }`}>+ MZN {task.reward?.toLocaleString() ?? '0'}</p>
                              </div>
                            </div>
                        </div>
                        <motion.button 
                          whileHover={isLimitReachedToday ? {} : { scale: 1.05 }}
                          whileTap={isLimitReachedToday ? {} : { scale: 0.95 }}
                          disabled={isLimitReachedToday}
                          onClick={() => handleCompleteTask(task.id, task.reward)} 
                          className={`font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest relative z-10 transition-all shrink-0 ml-3 ${
                            isLimitReachedToday 
                            ? 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5 shadow-none' 
                            : 'gold-gradient text-white shadow-lg'
                          }`}
                        >
                          {isLimitReachedToday ? 'OK' : 'COLETAR'}
                        </motion.button>
                      </motion.div>
                    ))}

                    {/* Preview of next level tasks */}
                    {nextLevelTasks.map(task => (
                      <div 
                        key={task.id}
                        className="bg-white/5 border border-white/5 p-6 rounded-[40px] flex items-center justify-between shadow-sm opacity-50 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-5 grayscale">
                            <div className="w-14 h-14 rounded-[20px] bg-white/10 flex items-center justify-center text-white/40 border border-white/10">
                              <Lock className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-white/10 text-white/40 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">VIP {task.vipLevel}</span>
                                <h4 className="font-black uppercase text-sm tracking-tight leading-none text-white/20 italic">{task.title}</h4>
                              </div>
                              <p className="text-white/20 font-black text-xs font-mono uppercase tracking-widest">+ MZN {task.reward?.toLocaleString() ?? '0'}</p>
                            </div>
                        </div>
                        <div className="bg-white/10 text-white/40 font-black px-6 py-3.5 rounded-[18px] text-[10px] uppercase tracking-widest border border-white/5">
                          BLOQUEADO
                        </div>
                      </div>
                    ))}
                   </>
                 )}
               </div>

               <div className="px-6 py-8">
                 <div className="h-px w-full bg-white/5" />
               </div>
               
               <div className="pb-32">
                 <LiveReturnsFeed />
               </div>
            </motion.div>
          )}

          {activeTab === 'mines' && (
            <motion.div 
               key="mines"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-6 pt-4 px-4"
            >
                <MinesSection balance={balance} onUpdateBalance={(amt) => {
                    if (!firebaseUser) return;
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    updateDoc(userRef, {
                        balance: increment(amt),
                        updatedAt: serverTimestamp()
                    }).catch(e => handleFirestoreError(e, OperationType.UPDATE, 'mines-balance'));
                }} />
            </motion.div>
          )}

           {activeTab === 'vip' && (
            <motion.div key="vip" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <div className="text-center space-y-2">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-gold">Premium VIP</h2>
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Carteira de Investimentos</p>
               </div>
               <div className="grid gap-6">
                 {effectiveVipLevels.filter(v => v.available).map(level => (
                   <React.Fragment key={level.id}>
                     <VipCard level={level} status={activeVip === level.id ? 'active' : activeVip > level.id ? 'passed' : 'available'} onActivate={handleActivateVip} />
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
              className="space-y-8 pt-4 pb-20"
            >
               <div className="bg-bg-deep/40 backdrop-blur-3xl rounded-[48px] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users className="w-32 h-32 text-gold" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                     <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-lg">
                        <Users className="w-10 h-10" />
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Minha Rede</h2>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest max-w-[240px] leading-relaxed opacity-60">Expanda a sua influência e maximize os seus lucros.</p>
                     </div>
                     
                     <div className="w-full space-y-4 pt-2">
                        <div className="bg-white/5 border border-white/5 px-6 py-5 rounded-2xl font-mono text-gold text-center shadow-inner relative group/code premium-letters-glow">
                           {inviteCode || 'MOZA-VIP'}
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={async () => {
                            const text = `Regista-te na Moza Invest e começa a lucrar hoje! Usa o meu código de convite: ${inviteCode}`;
                            if (navigator.share) {
                              try {
                                await navigator.share({ title: 'Moza Invest', text, url: window.location.href });
                              } catch (err: any) {
                                if (err.name !== 'AbortError') {
                                  console.error('Erro ao partilhar:', err);
                                }
                              }
                            } else {
                              alert("Use a função de partilha do sistema.");
                            }
                          }}
                          className="w-full gold-gradient text-white py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gold/20"
                        >
                           CONVIDAR AGORA
                        </motion.button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-1">
                     <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">Total Convites</p>
                     <p className="text-2xl font-black text-white font-mono">{referralStats.total}</p>
                  </div>
                  <div className="bg-card-bg/40 border border-white/5 p-6 rounded-[32px] space-y-1">
                     <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">Membros VIP</p>
                     <p className="text-2xl font-black text-gold font-mono">{referralStats.activeVips}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Lista de Membros</h3>
                    <span className="text-[9px] font-bold text-gold uppercase tracking-widest">Ativos Agora</span>
                  </div>

                  <div className="space-y-3">
                    {referrals.length === 0 ? (
                      <div className="p-12 text-center bg-white/5 rounded-[40px] border border-white/5 space-y-4 opacity-50">
                        <Users className="w-12 h-12 text-white/10 mx-auto" />
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Ainda não tem convidados na sua rede.</p>
                      </div>
                    ) : (
                      referrals.map((member) => (
                        <motion.div 
                          key={member.id}
                          layout
                          className="bg-card-bg/40 border border-white/5 p-5 rounded-[32px] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5 overflow-hidden">
                              {member.photoURL ? (
                                <img src={member.photoURL} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5" />
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-black text-white uppercase tracking-tight">{member.name || (member.phone ? `+258 ${member.phone}` : 'Utilizador Novo')}</p>
                              <div className="flex items-center gap-2">
                                <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${member.activeVip > 0 ? 'bg-gold text-black' : 'bg-white/10 text-white/40'}`}>
                                  {member.activeVip > 0 ? `INVESTIDOR VIP ${member.activeVip}` : 'REGISTADO'}
                                </span>
                                <span className="text-[8px] text-white/30 font-mono font-medium lowercase">registou-se em {member.createdAt?.toDate?.() ? member.createdAt.toDate().toLocaleDateString('pt-PT') : 'recentemente'}</span>
                              </div>
                            </div>
                          </div>
                          {member.activeVip > 0 && (
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
               </div>

               <div className="bg-card-bg/40 border border-white/5 p-8 rounded-[40px] flex items-center justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[22px] bg-gold/5 flex items-center justify-center text-gold border border-gold/10 shadow-inner group-hover:scale-110 transition-transform">
                       <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Lucro de Rede</p>
                       <p className="text-3xl font-black text-white font-mono leading-none tracking-tighter">MZN {referralStats.totalProfit?.toLocaleString() ?? '0'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20">COMISSÕES 15%</p>
                  </div>
               </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Níveis de Comissão</h3>
                   <div className="w-16 h-[1px] bg-white/5" />
                </div>
                <div className="grid gap-4">
                  {TEAM_LEVELS.map((level, i) => (
                     <motion.div 
                       key={i} 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex justify-between items-center group transition-all hover:bg-white/5 shadow-2xl"
                     >
                         <div className="flex gap-5 items-center">
                             <div className="w-10 h-10 rounded-2xl bg-gold/5 flex items-center justify-center text-gold border border-gold/10">
                               <span className="text-xs font-black">{i + 1}</span>
                             </div>
                             <div>
                                 <h4 className="font-black text-sm uppercase tracking-tight text-white/80">{level.level}</h4>
                                 <div className="flex items-center gap-2 mt-0.5">
                                   <TrendingUp className="w-3 h-3 text-gold" />
                                   <p className="text-[9px] text-gold font-black uppercase tracking-widest">Ganhos: {level.commission}</p>
                                 </div>
                             </div>
                         </div>
                         <div className="space-y-0.5 text-right">
                              <div className="text-2xl font-black text-white font-mono leading-none tracking-tighter">{level.count}</div>
                              <p className="text-[8px] text-white/20 font-black uppercase tracking-widest opacity-50">MEMBROS</p>
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
                        <h2 className="text-2xl font-black tracking-widest text-white uppercase italic tracking-tighter">
                          {userName || (userPhone.slice(-4) ? `INVESTIDOR_${userPhone.slice(-4)}` : 'UTILIZADOR')}
                        </h2>
                        <button 
                          onClick={() => openOverlay('edit_profile')}
                          className="text-gold hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Clique para editar perfil</p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-[10px] font-black text-gold border border-gold/30 px-3 py-1 rounded-full uppercase tracking-widest bg-gold/5">
                        {effectiveVipLevels.find(v => v.id === activeVip)?.badge || 'START'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                     <p className="text-white/60 font-black text-xs font-mono tracking-widest">+{userPhone}</p>
                   </div>

                   <div className="flex flex-col items-center gap-1 mt-2 p-4 bg-white/5 rounded-[24px] border border-white/5 w-full max-w-[200px] premium-letters-glow">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest opacity-50">CÓDIGO EXCLUSIVO</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-gold font-mono">{inviteCode || '...'}</span>
                      </div>
                   </div>
                 </div>
               </div>

              {/* Asset Overview Card - Premium Refined */}
               <div className="relative group">
                 <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full opacity-30 animate-pulse" />
                 <div className="bg-card-bg/40 backdrop-blur-3xl rounded-[48px] p-9 border border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] translate-x-12 translate-y-[-16px] transform -rotate-12 group-hover:scale-110 transition-transform duration-1000">
                      <Logo showText={false} className="scale-[4]" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full w-fit">
                             <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                             <span className="text-[9.5px] font-black text-white/50 uppercase tracking-[0.3em]">{t('balance')}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-4xl sm:text-5xl font-black text-white px-1 tracking-tighter leading-none font-mono flex items-baseline gap-2 premium-letters-glow">
                               {(balance || 0).toLocaleString()}
                               <span className="text-lg text-gold font-sans font-black">MZN</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-gold/10 px-4 py-2 rounded-2xl flex items-center gap-3 border border-gold/20 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-[9px] font-black text-gold uppercase tracking-widest">Ativo</span>
                          </div>
                          {activeVip > 0 && (
                            <div className={`px-4 py-2 rounded-2xl border border-white/10 shadow-lg bg-gradient-to-br ${(effectiveVipLevels.find(v => v.id === activeVip)?.color) || 'from-gold to-yellow-600'} flex items-center gap-2`}>
                              {(() => {
                                const VIcon = effectiveVipLevels.find(v => v.id === activeVip)?.icon || ShieldCheck;
                                return <VIcon className="w-3 h-3 text-white" />;
                              })()}
                              <span className="text-[9px] font-black text-white uppercase tracking-widest">VIP {activeVip}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-lg bg-gold/10 flex items-center justify-center">
                               <TrendingUp className="w-3 h-3 text-gold" />
                             </div>
                             <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Ganhos diários</span>
                          </div>
                          <p className="text-lg font-black text-white font-mono tracking-tight flex items-baseline gap-1.5">
                            + {((balance * (appSettings.yieldPercentage ?? 12.5) / 100) / 30 + (activeVip > 0 ? (effectiveVipLevels.find(v => v.id === activeVip)?.dailyReturn || 0) : 0)).toLocaleString()}
                            <span className="text-[10px] text-green-400 font-black">
                              ({(balance > 0 ? ((((balance * (appSettings.yieldPercentage ?? 12.5) / 100) / 30) + (activeVip > 0 ? (effectiveVipLevels.find(v => v.id === activeVip)?.dailyReturn || 0) : 0)) / balance * 100).toFixed(2) : '0.00')}%)
                            </span>
                          </p>
                        </div>
                        
                        <div className="space-y-1.5 text-right">
                           <div className="flex items-center gap-2 justify-end">
                             <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Rendimento Médio</span>
                             <div className="w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center">
                               <Zap className="w-3 h-3 text-blue-400" />
                             </div>
                           </div>
                           <p className="text-lg font-black text-gold font-mono">
                             {appSettings.yieldPercentage ?? 12.5}%<span className="text-[10px] ml-1 uppercase text-white/30 font-bold">Mês</span>
                           </p>
                        </div>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Language Selector */}
               <div className="bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 space-y-4 mb-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gold" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('settings')}</span>
                  </div>
                  <div className="h-24 overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-2 pb-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setLanguage(lang.id)}
                          className={`min-w-[80px] p-3 rounded-2xl flex flex-col items-center gap-1 transition-all flex-shrink-0 ${language === lang.id ? 'bg-gold text-white shadow-lg scale-105 shadow-gold/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-[8px] font-black uppercase tracking-tight">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
               </div>

               {/* Video Trailer Section */}
               <div className="py-2">
                 <VideoTrailer />
               </div>

               {/* Operations Grid */}
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t('withdraw'), icon: Wallet, action: () => openOverlay('withdraw'), color: "bg-blue-500/10 text-blue-500" },
                    { label: t('records'), icon: ClipboardList, action: () => openOverlay('records'), color: "bg-purple-500/10 text-purple-500" },
                    { label: "Mensagens", icon: MessageSquare, action: () => openOverlay('notifications'), color: "bg-green-500/10 text-green-500" },
                    { label: "Suporte", icon: Headphones, action: () => openOverlay('support'), color: "bg-cyan-500/10 text-cyan-500" },
                    { label: "Empresa", icon: Building2, action: () => openOverlay('about'), color: "bg-gold/10 text-gold" },
                    { label: "Painel Admin", icon: ShieldCheck, action: () => openOverlay('admin'), color: "bg-red-500/10 text-red-500", hide: !isAdmin }
                  ].filter(item => !item.hide).map((item, i) => (
                    <motion.button 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                      className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex flex-col items-center gap-4 group shadow-sm transition-all hover:bg-white/10"
                    >
                      <div className={`w-12 h-12 rounded-2xl ${item.color.split(' ')[0]} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-gold transition-colors text-center">{item.label}</span>
                    </motion.button>
                  ))}
               </div>

               {/* Account Stats List */}
               {loanBalance > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] flex items-center justify-between mb-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                          <Landmark className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Dívida de Crédito</p>
                          <h4 className="text-2xl font-black text-white font-mono">MZN {(loanBalance || 0).toLocaleString()}</h4>
                        </div>
                    </div>
                  </div>
               )}
               <div className="bg-card-bg/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 mt-6">
                 <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck className="w-5 h-5 text-gold" />
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Privacidade & Segurança</h4>
                 </div>
                 <div className="bg-white/10 rounded-[40px] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-2xl">
                    {[
                      { 
                        l: "Nível VIP Atual", 
                        v: activeVip > 0 ? `VIP ${activeVip}` : 'STARTER', 
                        icon: activeVip > 0 ? (effectiveVipLevels.find(v => v.id === activeVip)?.icon || Star) : User,
                        customColor: activeVip > 0 ? (effectiveVipLevels.find(v => v.id === activeVip)?.color) : null
                      },
                      { l: "Lucro Total Acumulado", v: `MZN ${(balance * 0.45).toLocaleString()}`, icon: TrendingUp, color: "text-gold" },
                      { l: "Membros Diretos", v: TEAM_LEVELS[0].count.toString(), icon: Users },
                      { l: "Rendimento Diário", v: `+${activeVip > 0 ? (effectiveVipLevels.find(v => v.id === activeVip)?.dailyReturn || 0).toLocaleString() : '0'} MZN`, icon: Zap, color: "text-green-400" },
                      { l: "Status Conta", v: "Verificada", icon: ShieldCheck, color: "text-green-400" },
                      { 
                        l: "Desbloqueio Saque", 
                        v: (() => {
                          const lockD = userData?.withdrawLockDays !== undefined ? userData.withdrawLockDays : (appSettings.withdrawLockDays ?? 60);
                          if (lockD === 0) return 'IMEDIATO';
                          if (!firstDepositAt) return `${lockD} DIAS`;
                          const firstDepositDate = firstDepositAt?.seconds ? new Date(firstDepositAt.seconds * 1000) : new Date(firstDepositAt);
                          const now = new Date();
                          const diffTime = Math.abs(now.getTime() - firstDepositDate.getTime());
                          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                          const rem = Math.max(0, lockD - diffDays);
                          return rem === 0 ? 'DESBLOQUEADO' : `FALTAM ${rem} DIAS`;
                        })(), 
                        icon: Lock, 
                        color: "text-blue-400" 
                      }
                    ].map((s, i) => (
                      <div key={i} className="px-8 py-5 flex justify-between items-center group hover:bg-white/10 transition-all">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold/30 group-hover:bg-gold/10 transition-all ${s.customColor ? `bg-gradient-to-br ${s.customColor}` : ''}`}>
                              <s.icon className={`w-5 h-5 ${s.customColor ? 'text-white' : 'text-gold opacity-50 group-hover:opacity-100'}`} />
                            </div>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{s.l}</span>
                         </div>
                         <span className={`text-xs font-black uppercase tracking-widest ${s.color || 'text-white'}`}>{s.v}</span>
                      </div>
                    ))}
                 </div>
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

      {/* Floating Support Button - Persistent */}
      {appSettings.showSupportButton !== false && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-36 right-6 z-[900]"
        >
          <button 
            onClick={() => openOverlay('support')}
            className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-[#03060b] shadow-[0_8px_25px_rgba(212,175,55,0.4)] relative group overflow-hidden active:scale-95 transition-all"
          >
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Headphones className="w-7 h-7 relative z-10 stroke-[2.5px]" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#03060b] animate-bounce" />
          </button>
        </motion.div>
      )}

        {/* Premium Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-[1000] pb-8 pt-4 px-6 bg-gradient-to-t from-[#03060b] via-[#03060b]/80 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto bg-card-bg/40 backdrop-blur-3xl border border-white/5 p-2.5 rounded-[40px] shadow-2xl flex justify-between items-center relative overflow-hidden group pointer-events-auto">
            {/* Nav inner glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />
            
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-[28px] transition-all relative group/nav min-w-[64px] ${isActive ? 'text-gold' : 'text-white/40 hover:text-white'}`}
                >
                 {isActive && (
                   <motion.div 
                     layoutId="nav-active-bg"
                     className="absolute inset-0 bg-gold/10 rounded-[24px] border border-gold/20"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 <Icon className={`w-6 h-6 relative z-10 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] stroke-[2.5px]' : 'group-hover/nav:scale-110 stroke-[2.0px]'}`} />
                 {item.id === 'mines' && (
                   <div className="absolute -top-1 -right-1 bg-red-500 text-[6px] font-black px-1 rounded-full text-white animate-pulse z-20">NEW</div>
                 )}
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

