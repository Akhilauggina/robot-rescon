import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import Layout from './components/Layout';
import MissionOverview from './pages/MissionOverview';
import RobotSimulation from './pages/RobotSimulation';
import AIVision from './pages/AIVision';
import SensorMonitoring from './pages/SensorMonitoring';
import MissionLogs from './pages/MissionLogs';
import ProjectInfo from './pages/ProjectInfo';

export default function App() {
  return (
    <BrowserRouter>
      <SimulationProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<MissionOverview />} />
            <Route path="simulation" element={<RobotSimulation />} />
            <Route path="vision" element={<AIVision />} />
            <Route path="sensors" element={<SensorMonitoring />} />
            <Route path="logs" element={<MissionLogs />} />
            <Route path="project" element={<ProjectInfo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SimulationProvider>
    </BrowserRouter>
  );
}
