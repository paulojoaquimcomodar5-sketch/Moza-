import { 
  Home, 
  ClipboardList, 
  ShieldCheck, 
  Users, 
  User,
  ArrowUpFromLine,
  Wallet,
  Trophy,
  Gift,
  Users2,
  LineChart,
  FileText,
  Building2,
  Headphones,
  Award,
  CheckCircle2,
  TrendingUp,
  Star
} from "lucide-react";

export const QUICK_ACTIONS = [
  { id: 'recharge', label: 'RECARGA', icon: Wallet },
  { id: 'withdraw', label: 'SAQUE', icon: ArrowUpFromLine },
  { id: 'box', label: 'CAIXA SORTE', icon: Gift },
  { id: 'team', label: 'EQUIPE', icon: Users2 },
  { id: 'company', label: 'EMPRESA', icon: Building2 },
  { id: 'tasks', label: 'TAREFA', icon: FileText },
  { id: 'records', label: 'REGISTOS', icon: ClipboardList },
  { id: 'support', label: 'SUPORTE', icon: Headphones },
];

export const COMPANY_INFO = {
  name: 'MOZA Investimentos S.A.',
  since: '2019',
  headquarters: 'Maputo, Moçambique',
  license: 'MOZ-INV-2024-08X',
  mission: 'Empoderar cidadãos moçambicanos através de investimentos acessíveis e rentáveis no mercado digital.',
  certificates: [
    { id: 1, title: 'Certificado de Operação Digital', issuer: 'Autoridade Financeira de Maputo' },
    { id: 2, title: 'Selo de Segurança SSL 256-bit', issuer: 'GlobalSign Cloud' },
    { id: 3, title: 'Parceria Platina de Pagamentos', issuer: 'M-Pesa/e-Mola' }
  ]
};

export const NAV_ITEMS = [
  { id: 'home', label: 'INÍCIO', icon: Home },
  { id: 'tasks', label: 'TAREFA', icon: ClipboardList },
  { id: 'vip', label: 'VIP', icon: ShieldCheck },
  { id: 'team', label: 'EQUIPA', icon: Users },
  { id: 'profile', label: 'PERFIL', icon: User },
];

export const FINANCIAL_METHODS = [
  { id: 'mpesa', name: 'M-Pesa', color: 'bg-[#e61c2b]', delay: 'Instantâneo', number: '848778905', holder: 'PAULO JOAQUIM COMODALI' },
  { id: 'emola', name: 'e-Mola', color: 'bg-[#ff6600]', delay: 'Instantâneo', number: '875376446', holder: 'LUISA ZULANE MALUMBE' },
  { id: 'bank', name: 'Transferência Bancária', color: 'bg-gold', delay: '24-48h', number: '0001 2233 4455', holder: 'MOZA INVEST' },
];

export const DAILY_TASKS = [
  { id: 1, title: 'Assistir Anúncio Premium', reward: 50, category: 'PUBLICIDADE', time: '30s' },
  { id: 2, title: 'Validar Transação VIP 4', reward: 120, category: 'VALIDAÇÃO', time: '1min' },
  { id: 3, title: 'Compartilhar Link Diário', reward: 30, category: 'SOCIAL', time: '2min' },
  { id: 4, title: 'Reclame Recompensa Log-in', reward: 10, category: 'DIÁRIO', time: 'Agora' },
  { id: 5, title: 'Feedback de Mercado', reward: 80, category: 'PESQUISA', time: '5min' },
];

export const TEAM_LEVELS = [
  { level: 'Nível 1', commission: '10%', count: 5, totalProfit: 1250 },
  { level: 'Nível 2', commission: '5%', count: 12, totalProfit: 840 },
  { level: 'Nível 3', commission: '2%', count: 3, totalProfit: 110 },
];

export const VIP_LEVELS = [
  { 
    id: 1, 
    name: 'VIP 1', 
    badge: 'PREMIUM',
    investment: 700, 
    dailyReturn: 36,
    isPremium: true,
    benefits: ['Acesso a tarefas básicas', 'Saque antecipado', 'Suporte prioritário']
  },
  { 
    id: 2, 
    name: 'VIP 2', 
    badge: 'LUXURY',
    investment: 2500, 
    dailyReturn: 145,
    isPremium: false,
    benefits: ['Comissões de rede +5%', 'Tarefas exclusivas', 'Bónus de ativação']
  },
  { 
    id: 3, 
    name: 'VIP 3', 
    badge: 'ELITE',
    investment: 8000, 
    dailyReturn: 520,
    isPremium: false,
    benefits: ['Gerente de conta VIP', 'Retornos diários altos', 'Certificado de investidor']
  },
  { 
    id: 4, 
    name: 'VIP 4', 
    badge: 'ATIVO',
    investment: 35000, 
    dailyReturn: 2800,
    isPremium: false,
    benefits: ['Participação nos lucros', 'Acesso total a Caixa Sorte', 'Eventos exclusivos']
  },
];
