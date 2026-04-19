import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Edit, FileText, User, ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react';
import useOrderStore from '../store/orderStore';
import Button from '../components/Button';

const ViewOrder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const order = useOrderStore((state) => state.getOrder(id));

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <h2 className="text-2xl font-bold">Order not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl transition-all">
            <ArrowLeft size={24} />
          </Link>


<h1 className="text-4xl font-black tracking-tighter">
  {t('orders.orderDetails')}
</h1> 
        </div>

        <div className="flex gap-3 p-1.5 bg-gray-100/50 dark:bg-white/5 backdrop-blur-md rounded-[24px] border border-gray-200 dark:border-white/10">
          <Link to={`/order/${id}/edit`}>
            <Button className="bg-white dark:bg-white/10 border-none shadow-sm text-sm py-2.5 px-5">
              <Edit size={16} className="mr-2 opacity-70" />
              {t('orders.edit')}
            </Button>
          </Link>
          <Link to={`/invoice/${id}`}>
            <Button className="bg-black text-white dark:bg-white dark:text-black border-none shadow-xl text-sm py-2.5 px-5">
              <FileText size={16} className="mr-2 opacity-70" />
              {t('invoice.preview')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar: Customer & Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Info */}
          <div className="p-8 bg-white dark:bg-white/5 rounded-[35px] border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4 opacity-40">
              <User size={18} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t('order.customer')}</p>
            </div>
            <h3 className="text-2xl font-black truncate">{order.customer}</h3>
          </div>

          {/* Payment Card (The High-Contrast Card) */}
          <div className="p-8 bg-black dark:bg-white rounded-[35px] text-white dark:text-black shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 opacity-60">
                <CreditCard size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">{t('order.summary')}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm opacity-60">
                  <span>{t('order.subtotal')}</span>
                  <span className="font-mono">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-60">
                  <span>{t('order.tax')}</span>
                  <span className="font-mono">${order.tax.toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t border-white/10 dark:border-black/10 flex justify-between items-end">
                  <span className="text-sm font-black uppercase">{t('order.total')}</span>
                  <span className="text-4xl font-black tracking-tighter">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Items List */}
        <div className="lg:col-span-8 p-8 bg-white dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="opacity-40" />
              <h3 className="text-xl font-black tracking-tight">{t('order.items')}</h3>
            </div>
            <div className="px-4 py-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
              {order.items.length} Products
            </div>
          </div>
          
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-6 p-6 rounded-[28px] hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5 group"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center font-black group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                  {item.quantity}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg tracking-tight">{item.name}</p>
                  <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">${item.price.toFixed(2)} / unit</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black tracking-tighter">${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;