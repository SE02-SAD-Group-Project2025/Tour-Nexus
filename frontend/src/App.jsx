import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TourismDesign from './tourismDesign';


function App() {
  return (
    <BrowserRouter>
      <Toaster position = "top-center" />
      <Routes>
        <Route path="/" element={<TourismDesign />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


