import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #2a2a2a',
        },
      }}
    />
  );
};

export default ToastContainer;