import { BottomNav } from '../components/BottomNav';
import { MobileHeader } from '../components/MobileHeader';
import { TopBar } from '../components/TopBar';
import { WelcomeModal } from '../components/WelcomeModal';
import { useIsMobile } from '../services/platform';
import { useApp } from '../store/useAppStore';
import { HomePage, CatalogPage } from '../pages/HomeAndCatalog';
import { FavoritesPage, HistoryPage, SettingsPage } from '../pages/OtherPages';
import { BlockBlast } from '../games/BlockBlast';
import { SiteWebview } from '../webview/SiteWebview';

// Desktop: сайдбар слева (классический формат). Mobile: header + контент + нижняя навигация.
export function AppLayout() {
  const { route, activeSite, hasOnboarded } = useApp();
  const isMobile = useIsMobile();
  const isSite = route.name === 'site';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: 'var(--background)',
        color: 'var(--text)',
      }}
    >
      {!isMobile && <TopBar />}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flex: 1,
          minHeight: 0,
          minWidth: 0,
        }}
      >
      {isMobile && !isSite && <MobileHeader />}
      <main
        className="anida-main"
        style={{
          flex: 1,
          padding: isMobile ? 12 : 20,
          overflowY: 'auto',
          minWidth: 0,
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div key={route.name === 'site' ? `site-${activeSite?.id ?? 'none'}` : route.name} className="anim-page">
          {route.name === 'home' && <HomePage />}
          {route.name === 'catalog' && <CatalogPage />}
          {route.name === 'favorites' && <FavoritesPage />}
          {route.name === 'history' && <HistoryPage />}
          {route.name === 'settings' && <SettingsPage />}
          {route.name === 'games' && <BlockBlast />}
          {route.name === 'site' && activeSite && <SiteWebview key={activeSite.id} site={activeSite} />}
          {route.name === 'site' && !activeSite && <div>Сервис не найден.</div>}
        </div>
      </main>
      </div>
      {isMobile && <BottomNav />}
      {!hasOnboarded && <WelcomeModal />}
    </div>
  );
}
