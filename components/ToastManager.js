import { useEffect, useState } from 'react';
import styles from '../styles/Toast.module.css';

let toastFunc;

export function showToast(message, type = 'info') {
  toastFunc?.({ message, type });
}

export default function ToastManager() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    toastFunc = ({ message, type }) => {
      setToast({ message, type });

      setTimeout(() => {
        setToast(null);
      }, 3000); // Toast lasts 3 seconds maybe incr time??
    };
  }, []);

  if (!toast) return null;

  return (
    <div className={`${styles.toastContainer} ${styles[toast.type]}`}>
      {toast.message}
    </div>
  );
}
