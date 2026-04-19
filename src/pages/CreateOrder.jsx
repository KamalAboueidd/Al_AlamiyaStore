import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useOrderStore from '../store/orderStore';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const schema = yup.object({
  customer: yup.string().required('Customer name is required'),
  items: yup.array().of(
    yup.object({
      name: yup.string().required('Item name is required'),
      quantity: yup.number().min(1, 'Quantity must be at least 1').required(),
      price: yup.number().min(0, 'Price must be positive').required(),
    })
  ).min(1, 'At least one item is required'),
});

const CreateOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addOrder } = useOrderStore();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customer: '',
      items: [{ name: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const subtotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);
  const tax = subtotal * 0.1; 
  const total = subtotal + tax;

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading(t('toast.savingOrder'));
    try {
      const order = {
        ...data,
        subtotal,
        total,
        date: new Date().toISOString(),
      };
      addOrder(order);
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success(t('toast.orderCreated'), { id: toastId });
      navigate('/');
    } catch (error) {
      toast.error(t('toast.actionFailed'), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  
  const primaryBtnClass = "bg-black text-white border-black hover:bg-black dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/10 transition-none";
  const secondaryBtnClass = "bg-black text-white border-gray-200 dark:bg-white/5 dark:text-white dark:border-white/10 dark:backdrop-blur-md dark:hover:bg-white/5 transition-none";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.create')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Section */}
        <div className="card dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <label className="block text-sm font-medium mb-3 text-lg">{t('order.customer')}</label>
          <input
            {...register('customer')}
            className="input w-full text-lg py-4 bg-white dark:bg-black/40 dark:border-white/20 dark:text-white focus:ring-0"
            placeholder={t('order.customerPlaceholder')}
          />
          {errors.customer && <p className="text-red-500 text-sm mt-2">{errors.customer.message}</p>}
        </div>

        {/* Items Section */}
        <div className="card dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">{t('order.items')}</h2>
            <Button
              type="button"
              onClick={() => append({ name: '', quantity: 1, price: 0 })}
              className={secondaryBtnClass}
            >
              <Plus size={16} className="mr-2" />
              {t('order.addItem')}
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  className="border border-gray-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-gray-50/50 dark:bg-black/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div>
                    <input
                      {...register(`items.${index}.name`)}
                      className="input w-full bg-white dark:bg-black/40 dark:border-white/20 focus:ring-0"
                      placeholder={t('order.itemNamePlaceholder')}
                    />
                    {errors.items?.[index]?.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.items[index].name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500">Quantity</label>
                      <input
                        type="number"
                        {...register(`items.${index}.quantity`)}
                        className="input w-full bg-white dark:bg-black/40 dark:border-white/20 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.price`)}
                        className="input w-full bg-white dark:bg-black/40 dark:border-white/20 focus:ring-0"
                      />
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-full bg-red-50 text-red-600 border-transparent hover:bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Remove Item
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Totals Section */}
        <div className="card dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-xl border-t dark:border-white/10 pt-4 mt-2">
              <span>{t('order.total')}:</span>
              <span className="text-black dark:text-white">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="submit" 
            loading={loading} 
            className={`${primaryBtnClass} flex-1 order-2 sm:order-1 py-4 text-lg`}
          >
            {t('order.save')}
          </Button>
          <Button 
            type="button" 
            onClick={() => navigate('/')} 
            className={`${secondaryBtnClass} py-4 text-lg order-1 sm:order-2`}
          >
            {t('order.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;