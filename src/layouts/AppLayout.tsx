import { BottomNav } from '../components/BottomNav';
import { MobileHeader } from '../components/MobileHeader';
import { Sidebar } from '../components/Sidebar';
import { WelcomeModal } from '../components/WelcomeModal';
import { useIsMobile } from '../services/platform';
import { useApp } from '../store/useAppStore';
import { HomePage, CatalogPage } from '../pages/HomeAndCatalog';
import { FavoritesPage, HistoryPage, SettingsPage } from '../pages/OtherPages';
import { SiteWebview } from '../webview/SiteWebview';

// Desktop: sidebar слева. Mobile (§3): верхний header + контент + нижняя навигация.
export function AppLayout() {
  const { route, activeSite, hasOnboarded } = useApp();
  const isMobile = useIsMobile();
  const isSite = route.name === 'site';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100dvh',
        background: 'var(--background)',
        color: 'var(--text)',
      }}
    >
      {!isMobile && <Sidebar />}
      {isMobile && !isSite && <MobileHeader />}
      <main
        className="anida-main"
        style={{
          flex: 1,
          padding: isMobile ? 12 : 20,
          paddingBottom: isMobile && !isSite ? 12 : isMobile ? 12 : 20,
          overflowY: 'auto',
          minWidth: 0,
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {route.name === 'home' && <HomePage />}
        {route.name === 'catalog' && <CatalogPage />}
        {route.name === 'favorites' && <FavoritesPage />}
        {route.name === 'history' && <HistoryPage />}
        {route.name === 'settings' && <SettingsPage />}
        {route.name === 'site' && activeSite && <SiteWebview key={activeSite.id} site={activeSite} />}
        {route.name === 'site' && !activeSite && <div>Сервис не найден.</div>}
      </main>
      {isMobile && <BottomNav />}
      {!hasOnboarded && <WelcomeModal />}
    </div>
  );
}
