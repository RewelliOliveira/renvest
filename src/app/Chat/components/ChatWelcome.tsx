import { BankIcon, PiggyBankIcon, ShieldCheckIcon, TrendUpIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { MascotHello } from "@/assets/icons";
import type { MascotVariant } from "@/assets/mascotPalettes";

const TOPICS = [
  { text: "Como funciona o FGC?", icon: ShieldCheckIcon, color: "text-sky-400" },
  { text: "Como montar uma reserva de emergência?", icon: PiggyBankIcon, color: "text-red-light" },
  { text: "O que são juros compostos?", icon: TrendUpIcon, color: "text-emerald-400" },
  { text: "Tesouro Direto ou CDB?", icon: BankIcon, color: "text-amber-300" },
];

interface ChatWelcomeProps {
  avatar: MascotVariant;
  userName: string;
  disabled: boolean;
  onSelectTopic: (text: string) => void;
}

export function ChatWelcome({ avatar, userName, disabled, onSelectTopic }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rev-wave h-28 lg:h-36"
      >
        <MascotHello variant={avatar} className="h-full w-auto object-contain" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 max-w-sm"
      >
        <h2 className="type-h2 text-white">Olá{userName ? `, ${userName}` : ""}! Eu sou o Rev.</h2>
        <p className="mt-2 type-body text-neutral-400">
          Pode me perguntar qualquer coisa sobre investimentos, FGC, reserva de emergência e finanças pessoais.
        </p>
      </motion.div>

      <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TOPICS.map(({ text, icon: Icon, color }, index) => (
          <motion.button
            key={text}
            type="button"
            disabled={disabled}
            onClick={() => onSelectTopic(text)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.06 }}
            className="press-3d flex items-center gap-3 rounded-xl px-4 py-3 text-left font-heading font-bold type-body text-white bg-option-dark border border-white/10 border-b-4 border-b-option-dark-border hover:border-white/20 hover:brightness-110 transition-[filter,border-color] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <Icon weight="duotone" className={`w-5 h-5 ${color}`} />
            </span>
            <span className="leading-snug">{text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
