import { motion } from "motion/react";
import { cn } from "cn";
import { MascotHello } from "@/assets/icons";
import type { MascotVariant } from "@/assets/mascotPalettes";
import { ChatRichText } from "./ChatRichText";
import { SourceSeals } from "./SourceSeals";
import { messageSources } from "../utils/messageSources";
import type { ChatMessage } from "../types/types";

interface ChatMessageRowProps {
  message: ChatMessage;
  avatar: MascotVariant;
  isLastInGroup: boolean;
  animate: boolean;
}

export function ChatMessageRow({ message, avatar, isLastInGroup, animate }: ChatMessageRowProps) {
  const isBot = message.sender === "bot";
  const sources = messageSources(message);

  return (
    <motion.div
      initial={isBot ? { opacity: 0, x: -10, scale: 0.97 } : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={cn(
        "flex items-end gap-2 max-w-[88%] lg:max-w-[75%]",
        isBot ? "self-start origin-bottom-left" : "self-end origin-bottom-right"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 shrink-0 mb-1">
          {isLastInGroup && (
            <div className="w-full h-full rounded-full bg-linear-to-br from-red/30 to-sky-500/30 border border-white/15 flex items-center justify-center p-1">
              <MascotHello variant={avatar} className="h-full w-auto object-contain" />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "min-w-0 wrap-break-word rounded-2xl px-3.5 py-2.5 type-body-sm shadow-md flex flex-col gap-1.5 border-2 border-b-4",
          isBot
            ? "bg-[#040a14] border-neutral-600/90 text-neutral-100"
            : "bg-red border-red border-b-red-dark text-white font-medium",
          isLastInGroup && (isBot ? "rounded-bl-md" : "rounded-br-md")
        )}
      >
        {isBot ? (
          <ChatRichText text={message.text} animate={animate} />
        ) : (
          <p className="whitespace-pre-line">{message.text}</p>
        )}

        {isBot && sources.length > 0 && <SourceSeals sources={sources} />}
      </div>
    </motion.div>
  );
}
