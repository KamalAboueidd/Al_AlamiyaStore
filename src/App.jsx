import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import CreateOrder from './pages/CreateOrder';
import ViewOrder from './pages/ViewOrder';
import EditOrder from './pages/EditOrder';
import InvoicePreview from './pages/InvoicePreview';
import Settings from './pages/Settings';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreateOrder />} />
          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="order/:id/edit" element={<EditOrder />} />
          <Route path="invoice/:id" element={<InvoicePreview />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
       