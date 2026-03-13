// D:\ap_fe\src\components\signup\MajorAutocomplete.tsx
"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMajorSuggestions } from "@/components/signup/signup.helpers";

type MajorAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
};

export function MajorAutocomplete({
  value,
  onChange,
  onClearError,
}: MajorAutocompleteProps) {
  const [open, setOpen] = React.useState(false);

  const suggestions = React.useMemo(() => getMajorSuggestions(value), [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="major" className="ui-eyebrow pl-1 text-muted-foreground">
        Current Major
      </Label>

      <div className="relative">
        <Input
          id="major"
          value={value}
          onChange={(e) => {
            onClearError?.();
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (value.trim()) setOpen(true);
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          className="h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
          placeholder="Start typing..."
          autoComplete="off"
        />

        {open && suggestions.length > 0 && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-border/40 bg-card/95 backdrop-blur-md shadow-xl overflow-hidden">
            <ul className="max-h-56 overflow-auto py-1">
              {suggestions.map((major) => (
                <li key={major}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-secondary/40 transition-colors"
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => {
                      onClearError?.();
                      onChange(major);
                      setOpen(false);
                    }}
                  >
                    {major}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}