import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Printer, Share2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useOrderStore from '../store/orderStore';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const InvoicePreview = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const order = useOrderStore((state) => state.getOrder(id));
  const invoiceRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handleExportPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice-${id}.pdf`);
    toast.success(t('toast.pdfExported'));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invoice',
          text: `Invoice for ${order.customer}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('toast.linkCopied'));
    }
  };

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('invoice.title')}</h1>
        <div className="flex space-x-2">
          <Button onClick={handleExportPDF} className="btn-secondary">
            <Download size={16} className="mr-2" />
            {t('invoice.export')}
          </Button>
          <Button onClick={handlePrint} className="btn-secondary">
            <Printer size={16} className="mr-2" />
            {t('invoice.print')}
          </Button>
          <Button onClick={handleShare} className="btn-secondary">
            <Share2 size={16} className="mr-2" />
            {t('invoice.share')}
          </Button>
        </div>
      </div>

      <motion.div
        ref={invoiceRef}
        className="card max-w-4xl mx-auto p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">Order</h2>
          <p className="text-gray-400">ID: {id}</p>
          <p className="text-gray-400">Date: {new Date(order.date).toLocaleDateString()}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Bill To:</h3>
          <p className="text-lg">{order.customer}</p>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Quantity</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b border-dark-border">
                <td className="py-2">{item.name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">${item.price.toFixed(2)}</td>
                <td className="text-right py-2">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoicePreview;