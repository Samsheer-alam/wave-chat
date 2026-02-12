import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';

// Routes
import Chat from './Chat';
import Home from './Home';

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
