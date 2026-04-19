import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Plus, Edit, Trash2, Eye, SortAsc, SortDesc, ChevronDown, Check, X } from 'lucide-react';
import useOrderStore from '../store/orderStore';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Home = () => {
  const { t } = useTranslation();
  const { orders, deleteOrder } = useOrderStore();
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSortOpen, setIsSortOpen] = useState(false); // حالة القائمة المخصصة
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!search) {
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(() => setSearchLoading(false), 450);
    return () => clearTimeout(timeout);
  }, [search]);

  const filteredOrders = orders
    .filter((order) => {
      const searchLower = search.toLowerCase();
      return (
        order.customer.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        new Date(order.date).toLocaleDateString().toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      if (sortBy === 'date') {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else if (sortBy === 'total') {
        aValue = a.total;
        bValue = b.total;
      } else if (sortBy === 'customer') {
        aValue = a.customer.toLowerCase();
        bValue = b.customer.toLowerCase();
      }
      if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedOrder) return;
    deleteOrder(selectedOrder.id);
    toast.success(t('toast.orderDeleted'));
    setConfirmOpen(false);
    setSelectedOrder(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setSelectedOrder(null);
  };

  // خيارات الترتيب
  const sortOptions = [
    { value: 'date', label: t('orders.date') },
    { value: 'total', label: t('orders.total') },
    { value: 'customer', label: t('orders.customer') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('orders.title')}</h1>
        <Link to="/create">
          <Button className="border-gray-300 bg-white/90 text-gray-900 
            dark:bg-white/10 dark:text-white dark:backdrop-blur-md dark:border-white/20 dark:hover:bg-white/10">
            <Plus size={16} className="mr-2" />
            {t('orders.createNew')}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input Container */}
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {searchLoading ? (
              <Loader2 className=" animate-spin" size={20} />
            ) : (
              <Search className="text-gray-400 dark:text-gray-500 transition-colors" size={20} />
            )}
          </div>
          <input
            type="text"
            placeholder={t('orders.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl 
              dark:bg-white/10 dark:backdrop-blur-md dark:border-white/20 dark:text-white 
               transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        <div className="flex gap-2 sm:gap-4 relative">
          {/* Custom Select Dropdown */}
          <div className="relative flex-1 sm:w-52 z-30">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full h-full flex items-center justify-between pl-4 pr-3 py-3 bg-white border border-gray-300 rounded-2xl 
                dark:bg-white/10 dark:backdrop-blur-md dark:border-white/20 dark:text-white
                focus:outline-none font-medium transition-all"
            >
              <span className="truncate">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown 
                size={18} 
                className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''} text-gray-400 dark:text-white/60`} 
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <>
                  {/* Overlay to close when clicking outside */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  
                {/* Custom Dropdown Menu */}
<motion.ul
  initial={{ opacity: 0, y: -10, scale: 0.95 }}
  animate={{ opacity: 1, y: 5, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  className="absolute left-0 right-0 z-40 p-1.5 mt-1 overflow-hidden bg-white/95 dark:bg-black/80 backdrop-blur-xl
    border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl"
>
  {sortOptions.map((option) => {
    const isSelected = sortBy === option.value;
    return (
      <li key={option.value}>
        <button
          onClick={() => {
            setSortBy(option.value);
            setIsSortOpen(false);
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all
            ${isSelected 
              ? 
                'bg-black text-white dark:bg-white dark:text-black shadow-md scale-[1.02]' 
              : 'dark:text-white'
            }`}
        >
          {option.label}
          {isSelected && <Check size={16} strokeWidth={3} />}
        </button>
      </li>
    );
  })}
</motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 bg-white/90 border-gray-300 dark:bg-white/10 dark:border-white/20 dark:backdrop-blur-md dark:hover:bg-white/10 h-[50px] sm:h-auto"
          >
            {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
          </Button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <motion.div className="card text-center py-12 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-semibold mb-2">{t('orders.noOrders')}</h2>
          <p className="text-gray-400 mb-4">{t('orders.noOrdersDesc')}</p>
          <Link to="/create" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            <Plus size={16} />
            {t('orders.createNew')}
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            initial="hidden" animate="show" className="grid gap-4"
          >
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm
                  dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10"
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{order.customer}</h3>
                    <p className="text-gray-400 text-xs mt-1">ID: {order.id.slice(0,8)}...</p>
                    <div className="flex gap-3 mt-3">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-500/10 dark:text-blue-400 font-medium">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-lg dark:bg-green-500/10 dark:text-green-400 font-bold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Link to={`/order/${order.id}`}>
                      <Button size="sm" className="bg-gray-50 border-none hover:bg-gray-100 dark:bg-white/10 dark:hover:bg-white/20">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Link to={`/order/${order.id}/edit`}>
                      <Button size="sm" className="bg-gray-50 border-none hover:bg-gray-100 dark:bg-white/10 dark:hover:bg-white/20">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-gray-50 border-none hover:bg-red-50 text-red-500 dark:bg-white/10 dark:hover:bg-red-500/20"
                      onClick={() => handleDelete(order)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      <AnimatePresence>
  {confirmOpen && selectedOrder && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-[32px] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-black mb-2 dark:text-white tracking-tighter">
          {t('orders.deleteTitle')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {t('orders.deleteMessage', { customer: selectedOrder.customer })}
        </p>

        <div className="flex gap-3">

          <Button
            onClick={cancelDelete}
            className="flex-1 bg-gray-100 text-black dark:bg-white/5 dark:text-white border-none rounded-2xl py-3 font-bold"
          >
            {t('common.no')}
          </Button>
          
         
          <Button
            onClick={confirmDelete}
            className="flex-1 bg-black text-white dark:bg-white dark:text-black border-none rounded-2xl py-3 font-bold"
          >
            {t('common.yes')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default Home;