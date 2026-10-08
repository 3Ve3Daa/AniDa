import { AppProvider } from './store/useAppStore';
import { AppLayout } from './layouts/AppLayout';

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
