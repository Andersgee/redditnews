import { useTheme } from "next-themes";

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      console.log("setting dark");
      setTheme("dark");
    } else {
      console.log("setting light");
      setTheme("light");
    }
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="justify-around p-3 font-medium hover:opacity-75 transition duration-100 ease-out hover:ease-in"
    >
      Theme
    </button>
  );
}
