import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function useRazorpay() {
  const [upgrading, setUpgrading] = useState(false);
  const showToast = useToast();
  const { user, updateUser } = useAuth();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (onSuccessCallback) => {
    setUpgrading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        showToast('Razorpay SDK failed to load. Are you offline?', '❌');
        return;
      }

      // Fetch the auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error("Authentication required");

      // Create Order
      const orderRes = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Habitly Pro",
        description: "Lifetime Pro Access",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");
            
            showToast('Welcome to Habitly Pro! 🎉', '✅');
            updateUser({ ...user, is_pro: true });
            if (onSuccessCallback) onSuccessCallback();
          } catch (err) {
            console.error(err);
            showToast(err.message, '❌');
          }
        },
        prefill: {
          name: user?.name || "Habitly User",
          email: user?.email || ""
        },
        theme: {
          color: "#6366f1"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      showToast(err.message, '❌');
    } finally {
      setUpgrading(false);
    }
  };

  return { handleCheckout, upgrading };
}
