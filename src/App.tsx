import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Calculator from "./components/Calculator.tsx";
import Navbar from "./components/Navbar.tsx";
import NamesTable from "./components/NamesTable.tsx";

function App() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full h-full flex pt-6 justify-content-center align-items-center overflow-auto">
        <div className="container-width">
          <BrowserRouter>
            <Routes>
              <Route index path="/calculator" element={<Calculator />} />
              <Route index path="/names" element={<NamesTable />} />
              <Route path="*" element={<Navigate to="/calculator" />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;