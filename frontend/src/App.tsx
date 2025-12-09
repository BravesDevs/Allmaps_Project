import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { VerifySuccess } from './pages/VerifySuccess';
import { VerifyError } from './pages/VerifyError';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/verify-success" element={<VerifySuccess />} />
      <Route path="/verify-error" element={<VerifyError />} />
    </Routes>
  );
}

export default App;
