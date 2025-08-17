import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './components/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
