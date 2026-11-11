import { Navigate, Route, Routes } from 'react-router-dom';
import { BuildingDetail } from '../pages/BuildingDetail';
import { BuildGuidePage } from '../pages/BuildGuidePage';
import { CampusOverview } from '../pages/CampusOverview';
import { CampusModelPage } from '../pages/CampusModelPage';
import { WellbeingDashboard } from '../pages/WellbeingDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CampusOverview />} />
      <Route path="/buildings" element={<BuildingDetail />} />
      <Route path="/3d-model" element={<CampusModelPage />} />
      <Route path="/wellbeing" element={<WellbeingDashboard />} />
      <Route path="/build-guide" element={<BuildGuidePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
