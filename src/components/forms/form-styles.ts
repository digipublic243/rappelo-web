import { cn } from "@/lib/cn";

export const formFieldInputClassName = cn(
  "w-full rounded-2xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439] outline-none transition-colors",
  "placeholder:text-[#9aa4aa] focus:border-[#b7c7d8]",
);

export const formFieldMutedInputClassName = cn(
  "w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439] outline-none transition-colors",
  "placeholder:text-[#9aa4aa] focus:border-[#b7c7d8]",
);

export const formFieldLabelClassName = "block text-sm font-medium text-[#566166]";

export const formHintClassName = "text-[11px] text-[#717c82]";

export const formInlineErrorClassName =
  "rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]";
