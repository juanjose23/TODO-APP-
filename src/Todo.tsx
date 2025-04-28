import { AppRouter } from './router/AppRoutes';
import { ThemeProvider } from "@/components/theme-provider";


export function Todo() {
 
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  );
}
