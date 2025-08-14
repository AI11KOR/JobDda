import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/layout/Layout';
import FirstPage from './pages/common/FirstPage';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Condition from './pages/auth/Condition';
import MyPage from './pages/auth/MyPage';
import FindPassword from './pages/auth/FindPassword';
import SuccessFind from './pages/auth/SuccessFind';

import List from './pages/post/List';
import Write from './pages/post/Write';
import Detail from './pages/post/Detail';
import Edit from './pages/post/Edit';

import Shop from './pages/shop/Shop';
import StockDetail from './pages/shop/StockDetail';
import Cart from './pages/shop/Cart';
import Payment from './pages/shop/Payment';
import PaymentSuccess from './pages/shop/PaymentSuccess';

import EmptyCart from './pages/shop/EmptyCart';

import PublicRoute from './pages/common/PublicRoute';
import NotFountPage from './pages/common/NotFoundPage';

import ChangeInfoModal from './pages/auth/ChangeInfoModal';
import Practice from './pages/auth/Practice';

import AdminDashBoard from './pages/admin/AdminDashBoard';
import AdminPostPage from './pages/admin/AdminPostPage';
import AdminProductPage from './pages/admin/AdminProductPage';

function App() {
  return (
    <div className="App">
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<FirstPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/condition" element={<PublicRoute><Condition /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/myPage" element={<PublicRoute requireAuth={true}><MyPage /></PublicRoute>} />
          <Route path="/findPassword" element={<PublicRoute><FindPassword /></PublicRoute>} />
          <Route path="/successFind" element={<PublicRoute><SuccessFind /></PublicRoute>} />

          <Route path="/list" element={<List />} />
          <Route path="/write" element={<Write />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/edit/:id" element={<Edit />} />

          <Route path="/shop" element={<Shop />} />
          <Route path="/stockDetail/:id" element={<StockDetail />} />
          <Route path="/cart" element={<PublicRoute requireAuth={true}><Cart /></PublicRoute>} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymentSuccess" element={<PaymentSuccess />} />

          <Route path="/emptyCart" element={<EmptyCart />} />
          <Route path="/changeModal" element={<ChangeInfoModal />} />
          <Route path="/practice" element={<Practice />} />

          <Route path="/adminDashBoard" element={<AdminDashBoard />} />
          <Route path="/adminPost" element={<AdminPostPage />} />
          <Route path="/adminProduct" element={<AdminProductPage />} />
        </Route>
        <Route path="*" element={<NotFountPage />} />
      </Routes>
    </div>
  );
}

export default App;
