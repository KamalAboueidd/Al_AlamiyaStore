import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const sanitizeButtonClassName = (className) =>
  className
    .split(' ')
    .filter(
      (cn) =>
        cn &&
        !cn.startsWith('hover:') &&
        !cn.startsWith('dark:hover:') &&
        !cn.startsWith('group-hover:')
    )
    .join(' ');

const Button = ({ children, loading = false, disabled, className = '', ...props }) => {
  return (
    <motion.button
      className={`btn ${sanitizeButtonClassName(className)} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && <Loader2 className="animate-spin mr-2" size={16} />}
      {children}
    </motion.button>
  );
};

export default Button;