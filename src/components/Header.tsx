import {
  Avatar,
  Button,
  Tab,
  TabList,
  Text,
  Toolbar,
  Tooltip,
} from '@fluentui/react-components';
import {
  DarkThemeRegular,
  HomeRegular,
  BuildingRegular,
  HeartPulseRegular,
  ClipboardTaskRegular,
  WeatherSunnyRegular,
  CubeRegular,
} from '@fluentui/react-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const navigation = [
  { path: '/', label: 'Overview', icon: <HomeRegular /> },
  { path: '/buildings', label: 'Buildings', icon: <BuildingRegular /> },
  { path: '/3d-model', label: '3D model', icon: <CubeRegular /> },
  { path: '/wellbeing', label: 'Wellbeing', icon: <HeartPulseRegular /> },
  { path: '/build-guide', label: 'Build guide', icon: <ClipboardTaskRegular /> },
];

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <Toolbar className="app-toolbar" aria-label="Main site header">
        <Link className="brand-lockup" to="/" aria-label="AI Smart Wellbeing School home">
          <span className="brand-lockup__mark" aria-hidden="true"><HeartPulseRegular /></span>
          <span className="brand-lockup__copy">
            <Text weight="semibold" className="brand-lockup__title">Wellbeing School</Text>
            <Text size={200} className="brand-lockup__subtitle">Grade 10 · Science exhibition</Text>
          </span>
        </Link>
        <TabList
          className="site-nav"
          aria-label="Main navigation"
          selectedValue={location.pathname}
          onTabSelect={(_event, data) => navigate(String(data.value))}
        >
          {navigation.map((item) => (
            <Tab key={item.path} value={item.path} icon={item.icon}>
              {item.label}
            </Tab>
          ))}
        </TabList>
        <div className="header-actions">
          <Tooltip content={isDark ? 'Switch to light theme' : 'Switch to dark theme'} relationship="label">
            <Button
              appearance="subtle"
              icon={isDark ? <WeatherSunnyRegular /> : <DarkThemeRegular />}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={onToggleTheme}
            />
          </Tooltip>
          <Avatar name="Grade 10 science exhibition" color="brand" />
        </div>
      </Toolbar>
    </header>
  );
}
