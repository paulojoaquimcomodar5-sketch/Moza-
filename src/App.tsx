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
  TrendingUp as ChartIcon,
  Shield,
  Star,
  Users,
  User,
  Grid,
  ArrowUpRight,
  Headphones,
  LineChart as LineChartIcon,
  ArrowDownRight,
  ClipboardList,
  Building2,
  Award,
  CheckCircle2,
  Sparkles,
  Send,
  MessageSquare,
  Bot
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

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'reward' | 'investment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method?: string;
}

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
        // Login success will be handled by the state listener in the main App component
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Initialize user profile in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          phone: sanitizedPhone,
          balance: 25,
          activeVip: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Add initial bonus transaction
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
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-sm space-y-8 z-10">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-5 rounded-[40px] bg-card-bg border border-gold/10 shadow-2xl"
          >
            <h1 className="text-4xl font-black tracking-widest leading-none">
              MOZA <br /><span className="text-gold uppercase text-2xl">Invest</span>
            </h1>
          </motion.div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">
            {isLogin ? 'Bem-vindo de Volta' : 'Aderir ao Premium'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-black p-4 rounded-2xl flex items-center gap-2 uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/10 border border-green-500/50 text-green-500 text-[10px] font-black p-4 rounded-2xl flex items-center gap-2 uppercase tracking-widest"
              >
                {status}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Introduzir Telefone"
                disabled={isLoading}
                className="w-full bg-card-bg border border-border-dim rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all font-mono"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de Acesso"
                disabled={isLoading}
                className="w-full bg-card-bg border border-border-dim rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-gold/50 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative group"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar Senha"
                  disabled={isLoading}
                  className="w-full bg-card-bg border border-border-dim rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all"
                />
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full gold-gradient py-4 rounded-2xl text-black font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-98 shadow-2xl flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : (isLogin ? 'Entrar na Conta' : 'Criar Conta')}
          </button>
        </form>

        <div className="text-center pt-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-text-gray text-[10px] font-black hover:text-gold transition-colors uppercase tracking-[0.3em]"
          >
            {isLogin ? 'Novo Membro? Registe-se Agora' : 'Voltar ao Login'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Action Item (Square Boxes) ---
const ActionItem = ({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) => (
  <motion.button 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-card-bg aspect-square rounded-[32px] flex flex-col items-center justify-center gap-3 border border-border-dim hover:border-gold/30 transition-all group shadow-lg"
  >
    <div className="w-12 h-12 rounded-full bg-gold-muted flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-colors duration-300">
      <Icon className="w-6 h-6 " />
    </div>
    <span className="text-[9px] font-black text-text-gray group-hover:text-white uppercase tracking-widest leading-none text-center px-1">{label}</span>
  </motion.button>
);

// --- Info Stat Card ---
const InfoCard = ({ icon: Icon, title, value, colorClass = "text-green-500" }: { icon: LucideIcon, title: string, value: string, colorClass?: string }) => (
  <div className="bg-card-bg border border-border-dim p-6 rounded-[32px] flex-1 flex flex-col gap-2 shadow-xl hover:border-gold/10 transition-colors">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      <span className="text-[10px] text-text-gray font-black uppercase tracking-widest">{title}</span>
    </div>
    <div className={`text-2xl font-black ${colorClass} tracking-tighter flex items-center gap-2`}>
        {colorClass.includes('green') && <TrendingUp className="w-5 h-5" />}
        {value}
    </div>
  </div>
);

// --- VIP Platform Card ---
const VipCard = ({ level, status, onActivate }: { level: any, status: string, onActivate: (id: number) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-8 rounded-[40px] border flex flex-col gap-6 transition-all shadow-2xl relative overflow-hidden group ${
      status === 'active' ? 'bg-card-active border-gold border-2 shadow-gold-glow' : 'bg-card-bg border-border-dim'
    }`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div className="flex gap-5 items-center">
        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-black font-black text-3xl shadow-lg border-4 border-black/10 ${status === 'active' ? 'bg-gold' : 'gold-gradient'}`}>
          {level.id}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-black text-2xl uppercase tracking-tighter ${status === 'active' ? 'text-gold' : 'text-white'}`}>{level.name}</h3>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase shadow-sm ${status === 'active' ? 'bg-gold text-black' : 'bg-white/10 text-white/50'}`}>
              {level.badge}
            </span>
          </div>
          <p className="text-xs text-text-gray font-medium mt-1">Investimento: <span className="text-white font-black font-mono">MZN {level.investment.toLocaleString()}</span></p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-gold font-mono leading-none">MZN {level.dailyReturn.toLocaleString()}</div>
        <div className="text-[9px] font-black text-text-gray uppercase tracking-widest mt-1">Retorno Diário</div>
      </div>
    </div>

    <div className="relative z-10 space-y-3">
      <h4 className="text-[10px] font-black text-text-gray uppercase tracking-[0.2em]">Benefícios & Vantagens</h4>
      <div className="grid grid-cols-1 gap-2">
        {level.benefits?.map((benefit: string, idx: number) => (
          <div key={idx} className="flex items-center gap-3 text-white/70">
            <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold">{benefit}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="relative z-10 pt-4 border-t border-white/5">
       {status !== 'active' ? (
         <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActivate(level.id)} 
            className="w-full gold-gradient py-4 text-black text-xs font-black rounded-2xl shadow-xl uppercase tracking-[0.2em] transform transition-all group-hover:brightness-110"
         >
            ATIVAR AGORA
         </motion.button>
       ) : (
         <div className="w-full bg-gold/10 border border-gold/20 py-4 text-gold text-xs font-black rounded-2xl text-center uppercase tracking-[0.2em] animate-pulse">
            CONTRATO ATIVO • GERANDO LUCRO
         </div>
       )}
    </div>

    {/* Decorative background number */}
    <div className="absolute right-[-10px] top-[-20px] text-white opacity-[0.03] text-9xl font-black select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">
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
               <ChartIcon className="w-6 h-6" />}
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
  const [activeTab, setActiveTab] = useState('home');
  const [overlayView, setOverlayView] = useState<'none' | 'deposit' | 'withdraw' | 'records' | 'box' | 'support' | 'market' | 'about' | 'ai_helper'>('none');
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
        {overlayView === 'box' && <LuckyBoxOverlay onClose={() => setOverlayView('none')} onWin={(amt) => { handleCompleteTask(0, amt); }} />}
      </AnimatePresence>

      {/* Modern Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-bg-deep/50 backdrop-blur-3xl sticky top-0 z-[100] border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
            <ChartIcon className="w-5 h-5 text-gold" />
          </div>
          <h1 className="text-xl font-black tracking-widest leading-none">MOZA</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Refined Balance Section */}
              <div className="relative pt-4">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-[44px] p-10 border border-white/10 relative overflow-hidden shadow-2xl group">
                  <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12">
                    <Wallet className="w-48 h-48 text-gold" />
                  </div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-text-gray text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Saldo Disponível</span>
                        <div className="text-5xl font-black text-gold tracking-tighter leading-none font-mono">
                          MZN {balance.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gold/10 p-3 rounded-2xl border border-gold/30">
                        <span className="text-xs font-black text-gold uppercase">VIP {activeVip}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setOverlayView('deposit')}
                        className="flex-1 bg-gold text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                      >
                        RECARREGAR
                      </button>
                      <button 
                        onClick={() => setOverlayView('withdraw')}
                        className="flex-1 border border-white/10 text-white/80 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                      >
                        SAQUE
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex flex-col gap-1">
                  <span className="text-[9px] text-text-gray font-black uppercase tracking-widest">Lucro Total</span>
                  <span className="text-xl font-black text-green-500 font-mono">MZN 0.00</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex flex-col gap-1">
                  <span className="text-[9px] text-text-gray font-black uppercase tracking-widest">Rendimento Hoje</span>
                  <span className="text-xl font-black text-gold font-mono">MZN 0.00</span>
                </div>
              </div>

              {/* Menu Grid */}
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black text-text-gray uppercase tracking-[0.5em] px-2 opacity-50">Centro de Operações</h3>
                 <div className="grid grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map(action => (
                      <React.Fragment key={action.id}>
                        <ActionItem 
                          icon={action.icon} 
                          label={action.label} 
                          onClick={() => {
                            if (action.id === 'recharge') setOverlayView('deposit');
                            if (action.id === 'withdraw') setOverlayView('withdraw');
                            if (action.id === 'records') setOverlayView('records');
                            if (action.id === 'box') setOverlayView('box');
                            if (action.id === 'support') setOverlayView('support');
                            if (action.id === 'company') setOverlayView('about');
                            if (action.id === 'team') setActiveTab('team');
                            if (action.id === 'graph') setOverlayView('market');
                            if (action.id === 'tasks') setActiveTab('tasks');
                          }}
                        />
                      </React.Fragment>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <div className="flex flex-col gap-2 px-2">
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Missões Diárias</h2>
                 <p className="text-text-gray text-xs font-bold uppercase tracking-widest">Complete para gerar rendimento imediato.</p>
               </div>
               
               <div className="grid gap-5">
                 {DAILY_TASKS.map(task => (
                   <motion.div 
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card-bg border-2 border-border-dim p-8 rounded-[40px] flex items-center justify-between shadow-2xl hover:border-gold/20 transition-all group"
                   >
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-gold-muted flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors shadow-lg">
                           <Gift className="w-8 h-8" />
                        </div>
                        <div>
                           <h4 className="font-black uppercase text-base tracking-tight leading-none mb-2">{task.title}</h4>
                           <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <p className="text-gold font-black text-sm font-mono">+ MZN {task.reward}</p>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => handleCompleteTask(task.id, task.reward)} className="gold-gradient text-black font-black px-8 py-4 rounded-[20px] text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 shadow-xl">COLETAR</button>
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
            <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="bg-card-bg p-12 rounded-[50px] border border-gold/10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gold/5 blur-[100px] pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center text-center gap-6">
                     <div className="w-24 h-24 rounded-full bg-gold-muted flex items-center justify-center text-gold border-2 border-gold/20 shadow-2xl mb-2">
                        <Users className="w-12 h-12" />
                     </div>
                     <h2 className="text-4xl font-black uppercase tracking-tighter">Minha Rede</h2>
                     <p className="text-text-gray text-xs font-bold uppercase tracking-widest max-w-[280px] leading-relaxed opacity-60">Expanda a sua influência e ganhe bónus em todos os níveis.</p>
                     
                     <div className="w-full space-y-4 pt-4">
                        <div className="bg-black/40 px-8 py-6 rounded-3xl border border-white/5 font-mono font-black text-xl text-gold text-center tracking-[0.2em] shadow-inner">
                           MOZA-VIP-GOLD
                        </div>
                        <button className="w-full gold-gradient text-black py-5 rounded-[25px] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)] hover:scale-105 transition-transform">
                           PARTILHAR CÓDIGO
                        </button>
                     </div>
                  </div>
               </div>

               <div className="grid gap-4">
                 {TEAM_LEVELS.map((level, i) => (
                    <div key={i} className="bg-card-bg border border-border-dim rounded-[32px] p-8 flex justify-between items-center group transition-all hover:bg-white/5">
                        <div className="flex gap-6 items-center">
                            <div className="w-1 h-12 bg-gold rounded-full opacity-30 shadow-gold-glow" />
                            <div>
                                <h4 className="font-black text-xl uppercase tracking-tighter text-white">{level.level}</h4>
                                <p className="text-[10px] text-gold font-black uppercase tracking-widest mt-1">Comissão: {level.commission}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                             <div className="text-3xl font-black text-white font-mono leading-none tracking-tighter">{level.count}</div>
                             <p className="text-[9px] text-text-gray font-black uppercase tracking-widest opacity-60">MEMBROS</p>
                        </div>
                    </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
               <div className="flex flex-col items-center gap-8 py-6">
                 <div className="relative">
                    <div className="w-40 h-40 rounded-[50px] bg-gold p-1 shadow-[0_30px_60px_-15px_rgba(197,160,89,0.4)]">
                        <div className="w-full h-full rounded-[45px] bg-bg-deep flex items-center justify-center text-gold font-black text-6xl shadow-inner group transition-transform hover:scale-105">
                            <User className="w-16 h-16" />
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold-muted border-2 border-gold text-gold px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                        {VIP_LEVELS.find(v => v.id === activeVip)?.badge || 'CONVIDADO'}
                    </div>
                 </div>
                 <div className="text-center space-y-1">
                   <h2 className="text-3xl font-black tracking-widest uppercase">ID: {userPhone.slice(-4) ? `MOZA_${userPhone.slice(-4)}` : 'DESCONHECIDO'}</h2>
                   <p className="text-gold font-black text-lg font-mono">+{userPhone}</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: "Saque", icon: Wallet, action: () => setOverlayView('withdraw') },
                    { label: "Registos", icon: Grid, action: () => setOverlayView('records') },
                    { label: "Suporte", icon: Headphones, action: () => setOverlayView('support') },
                    { label: "Empresa", icon: Building2, action: () => setOverlayView('about') }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      onClick={item.action}
                      className="bg-card-bg border border-border-dim p-8 rounded-[40px] flex flex-col items-center gap-4 group cursor-pointer shadow-xl"
                    >
                      <item.icon className="w-10 h-10 text-gold group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-gold transition-colors">{item.label}</span>
                    </motion.div>
                  ))}
               </div>

               <div className="bg-card-bg rounded-[40px] overflow-hidden divide-y divide-white/5 border border-white/5 shadow-2xl">
                 {[
                   { l: "Saldo Atual", v: `MZN ${balance.toLocaleString()}`, highlight: true },
                   { l: "Lucro Estimado", v: "MZN 0.00" },
                   { l: "Nível VIP", v: `VIP ${activeVip} ${VIP_LEVELS.find(v => v.id === activeVip)?.badge || 'START'}` },
                   { l: "Segurança de Conta", v: "SSL ATIVO-256" }
                 ].map((s, i) => (
                   <div key={i} className="px-10 py-6 flex justify-between items-center group hover:bg-white/5 transition-colors">
                      <span className="text-[10px] text-text-gray font-black uppercase tracking-widest">{s.l}</span>
                      <span className={`text-base font-black font-mono ${s.highlight ? 'text-gold' : 'text-white'}`}>{s.v}</span>
                   </div>
                 ))}
               </div>

               <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full bg-red-500/10 border-2 border-red-500/20 text-red-500 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-red-500 hover:text-white transition-all shadow-[0_20px_40px_-10px_rgba(239,68,68,0.2)]"
               >
                 <LogOut className="w-6 h-6" />
                 Sair da Conta
               </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/5 px-6 py-5 flex justify-around items-center z-[1000] rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-2 relative transition-all duration-300 ${isActive ? 'text-gold scale-110' : 'text-text-gray hover:text-white/80'}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
              <span className={`text-[8px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>{item.label}</span>
              {isActive && (
                <motion.div layoutId="navDot" className="absolute -bottom-2 w-1 h-1 rounded-full bg-gold shadow-gold-glow" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

