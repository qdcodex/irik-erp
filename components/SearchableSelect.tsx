"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
};

export interface SearchableSelectProps {
  options: (string | SelectOption)[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  size?: "sm" | "md";
  clearable?: boolean;
}

export default function SearchableSelect({
  options,
  value = "",
  onChange,
  placeholder = "Select an option...",
  label,
  disabled = false,
  className = "",
  size = "md",
  clearable = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize options to { value, label, sublabel }
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) =>
      typeof opt === "string" ? { value: opt, label: opt } : opt
    );
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const term = searchTerm.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(term)) ||
        opt.value.toLowerCase().includes(term)
    );
  }, [normalizedOptions, searchTerm]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const isSmall = size === "sm";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full text-left border rounded-lg bg-white flex items-center justify-between transition shadow-2xs ${
          isSmall ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-xs"
        } ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-slate-300 hover:border-slate-400"
        } ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" : "text-slate-800"}`}
      >
        <span className={`truncate mr-2 ${selectedOption ? "font-medium text-slate-900" : "text-slate-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {clearable && selectedOption && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 hover:text-slate-700 rounded-full transition"
              title="Clear selection"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 min-w-[200px]">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsOpen(false);
                  if (e.key === "Enter" && filteredOptions.length > 0) {
                    e.preventDefault();
                    handleSelect(filteredOptions[0].value);
                  }
                }}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-50 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2 text-left rounded-lg text-xs transition flex items-center justify-between group ${
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate">{option.label}</div>
                      {option.sublabel && (
                        <div className="text-[10px] text-slate-400 truncate">{option.sublabel}</div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-xs text-slate-400 text-center">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
