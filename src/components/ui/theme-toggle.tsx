import * as React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";

const ThemeToggle: React.FC = () => {
  const { theme, cycleTheme, resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  // Only show on desktop devices
  if (isMobile) {
    return null;
  }

  // show icon for current theme (system shows laptop)
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="default"
        onClick={() => cycleTheme()}
        aria-label={`Toggle color theme (current: ${theme}, applied: ${resolvedTheme})`}
        title={`Theme: ${theme} (applied: ${resolvedTheme})`}
      >
        <Icon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ThemeToggle;