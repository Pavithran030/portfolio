import { useState, useRef, useEffect } from "react";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import { THEMES, ThemeMode } from "@/types/theme";

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  compact?: boolean;
}

export function ThemeSwitcher({ currentTheme, onThemeChange, compact = false }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeThemeConfig = THEMES[currentTheme] || THEMES["cyber-emerald"];

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        {(Object.keys(THEMES) as ThemeMode[]).map((themeKey) => {
          const cfg = THEMES[themeKey];
          const isActive = currentTheme === themeKey;
          return (
            <button
              key={themeKey}
              type="button"
              onClick={() => onThemeChange(themeKey)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                isActive
                  ? "bg-slate-800 text-white shadow-sm ring-1 ring-white/10 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
              title={`Switch to ${cfg.name}`}
              aria-label={`Switch to ${cfg.name}`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ background: cfg.previewGradient }}
              />
              <span className="truncate">{cfg.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border border-slate-700/60 bg-slate-900/70 hover:bg-slate-850 hover:border-slate-600 text-slate-200 shadow-sm backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select visual theme"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-sm"
          style={{ background: activeThemeConfig.previewGradient }}
        />
        <span className="hidden sm:inline-block uppercase text-[11px] font-medium text-slate-300">
          {activeThemeConfig.name}
        </span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900/95 border border-slate-700/70 shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 mb-1 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800/80 flex items-center gap-1.5">
            <Sparkles size={11} className="text-emerald-400" />
            <span>Visual Theme</span>
          </div>
          {(Object.keys(THEMES) as ThemeMode[]).map((themeKey) => {
            const cfg = THEMES[themeKey];
            const isSelected = currentTheme === themeKey;
            return (
              <button
                key={themeKey}
                type="button"
                onClick={() => {
                  onThemeChange(themeKey);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-mono transition-all text-left group ${
                  isSelected
                    ? "bg-slate-800/90 text-white font-medium shadow-inner"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-white/10 shrink-0 shadow-sm"
                    style={{ background: cfg.previewGradient }}
                  />
                  <div>
                    <div className="text-[12px] leading-tight">{cfg.name}</div>
                    <div className="text-[10px] text-slate-400">{cfg.label}</div>
                  </div>
                </div>
                {isSelected && <Check size={14} className="text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
