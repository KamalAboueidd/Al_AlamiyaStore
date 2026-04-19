import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowLeft, Save } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useOrderStore from '../store/orderStore';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const schema = yup.object({
  customer: yup.string().required('Required'),
  items: yup.array().of(
    yup.object({
      name: yup.string().required('Required'),
      quantity: yup.number().min(1).required(),
      price: yup.number().min(0).required(),
    })
  ).min(1),
});

const EditOrder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrder } = useOrderStore();
  const [loading, setLoading] = useState(false);

  const order = getOrder(id);

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (order) reset({ customer: order.customer, items: order.items });
  }, [order, reset]);

  const watchedItems = watch('items');
  const total = watchedItems?.reduce((sum, item) => sum + (Number(item?.quantity) * Number(item?.price) || 0), 0) * 1.1 || 0;

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading(t('toast.updatingOrder'));
    try {
      updateOrder(id, { ...data, total });
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success(t('toast.orderUpdated'), { id: toastId });
      navigate(`/order/${id}`);
    } catch (error) {
      toast.error(t('toast.actionFailed'), { id: toastId });
    } finally { setLoading(false); }
  };

  if (!order) return <div className="text-center py-20 dark:text-white opacity-50">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl transition-all dark:text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black tracking-tighter dark:text-white">{t('order.orderDetails')}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Section */}
        <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('order.customer')}</p>
          <input
            {...register('customer')}
            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 font-bold dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
            placeholder={t('order.customerPlaceholder')}
          />
        </div>

        {/* Items Section */}
        <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[24px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest dark:text-white">{t('order.items')}</h2>
            <button
              type="button"
              onClick={() => append({ name: '', quantity: 1, price: 0 })}
              className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:scale-105 transition-all shadow-sm"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div key={field.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center">
                  <input
                    {...register(`items.${index}.name`)}
                    className="flex-1 bg-gray-50 dark:bg-white/5 border-none rounded-lg p-2.5 text-sm font-bold dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                    placeholder={t('order.itemNamePlaceholder')}
                  />
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`)}
                    className="w-16 bg-gray-50 dark:bg-white/5 border-none rounded-lg p-2.5 text-sm font-mono dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.price`)}
                    className="w-20 bg-gray-50 dark:bg-white/5 border-none rounded-lg p-2.5 text-sm font-mono dark:text-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Total & Small Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-black dark:bg-white rounded-[24px] text-white dark:text-black shadow-lg">
          <div>
            <p className="text-[10px] font-black uppercase opacity-50">{t('order.total')}</p>
            <p className="text-3xl font-black tracking-tighter">${total.toFixed(2)}</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              type="submit" 
              loading={loading} 
              className="flex-1 md:flex-none bg-white text-black dark:bg-black dark:text-white px-8 py-2.5 text-sm font-black rounded-xl border-none hover:scale-105 transition-all"
            >
              <Save size={16} className="mr-2" /> {t('order.update')}
            </Button>
            <Button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="flex-1 md:flex-none bg-white/10 dark:bg-black/10 text-white dark:text-black px-6 py-2.5 text-sm font-black rounded-xl border-none hover:bg-white/20 transition-all"
            >
              {t('order.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;