import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authApi } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const showToast = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const fileInputRef = useRef(null);

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        showToast('Razorpay SDK failed to load. Are you offline?', '❌');
        return;
      }

      // Fetch the auth token to pass to our API routes
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
            // Optimistically update the local user context
            updateUser({ ...user, is_pro: true });
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

  // Utility function to convert VAPID key string to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported by your browser.');
      }

      // 1. Request notification permission FIRST
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission was denied. Please allow notifications in your browser settings.');
      }

      const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('VAPID Public Key is missing from environment variables.');
      }
      
      console.log('Using VAPID Key starting with:', publicKey.substring(0, 10));

      // Forcefully unregister old broken service workers that might be holding onto the bad keys
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let reg of registrations) {
        console.log('Unregistering old service worker:', reg);
        await reg.unregister();
      }

      // 2. Register service worker completely fresh
      console.log('Registering fresh service worker...');
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered');

      // 3. Wait for the service worker to become active
      if (registration.installing) {
        console.log('Waiting for service worker to activate...');
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') resolve();
          });
        });
      } else if (registration.waiting) {
        await new Promise((resolve) => {
          registration.waiting.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') resolve();
          });
        });
      }
      console.log('Service worker is active');

      // 4. Double check there are no phantom subscriptions
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        console.log('Found old subscription, unsubscribing...');
        await existingSub.unsubscribe();
      }

      // 5. Subscribe to push service
      console.log('Subscribing to push service with VAPID...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      console.log('Push subscription created successfully!', subscription);

      // 6. Save to Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .insert([{ user_id: user.id, subscription: subscription.toJSON() }]);

      if (error) {
        if (error.code === '23505') {
          showToast('Already subscribed on this device!', '✅');
          return;
        }
        throw error;
      }

      showToast('Notifications enabled successfully!', '🔔');
    } catch (err) {
      console.error('Detailed Push Error:', err);
      
      // Handle Brave/Privacy browser specific block
      if (err.name === 'AbortError' && err.message.includes('push service error')) {
        showToast('Push blocked! If using Brave, enable "Google services for push messaging" in Settings.', '❌');
      } else {
        showToast(err.message || 'Failed to enable notifications', '❌');
      }
    } finally {
      setSubscribing(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be less than 2MB', '⚠️');
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatar(publicUrl);
      showToast('Avatar uploaded successfully', '✅');
    } catch (error) {
      showToast('Error uploading avatar', '❌');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Profile (public.users)
      const data = { name, email, avatar };
      const res = await authApi.updateProfile(data);
      updateUser(res.data);

      // 2. Update Password if provided (auth.users)
      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword('');
      }
      
      showToast('Profile updated successfully', '✅');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', '❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page active" style={{ maxWidth: 600, margin: '0 auto', paddingTop: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Your Profile</h1>
          <p className="page-subtitle">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div 
              className="user-avatar" 
              style={{ width: 100, height: 100, fontSize: '3rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.75rem', padding: '6px 0', textAlign: 'center', fontWeight: '500' }}>
                Edit
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="form-input"
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Email (Cannot be changed here)</label>
            <input 
              type="email" 
              value={email} 
              className="form-input"
              disabled
              style={{ opacity: 0.6 }}
            />
          </div>

          <div className="form-group">
            <label>New Password (optional)</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="form-input"
              placeholder="Leave blank to keep current"
              minLength={6}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-raised)', borderRadius: 'var(--radius-md)', border: user?.is_pro ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
            <div>
              <label style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: user?.is_pro ? 'var(--accent)' : 'inherit' }}>
                {user?.is_pro ? '🌟 Pro Plan Active' : 'Free Plan'}
              </label>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: '4px 0 0 0', maxWidth: '300px', lineHeight: 1.5 }}>
                {user?.is_pro ? 'You have full access to premium features including the AI Coach and deep analytics.' : 'Upgrade to Pro for AI coaching, unlimited habits, and deep analytics.'}
              </p>
            </div>
            {!user?.is_pro && (
              <button 
                type="button" 
                onClick={handleUpgrade}
                disabled={upgrading}
                style={{ 
                  background: 'var(--accent)', 
                  border: 'none', 
                  color: '#fff', 
                  padding: '10px 20px', 
                  borderRadius: 'var(--radius-full)',
                  cursor: upgrading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.2s',
                  opacity: upgrading ? 0.7 : 1,
                  whiteSpace: 'nowrap'
                }}
              >
                {upgrading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            )}
          </div>

          <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <label style={{ margin: 0, fontWeight: 600 }}>App Theme</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Switch between dark and light mode</p>
            </div>
            <button 
              type="button" 
              onClick={toggleTheme} 
              style={{ 
                background: 'var(--bg-raised)', 
                border: '1px solid var(--border)', 
                color: 'var(--text-primary)', 
                padding: '8px 16px', 
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <label style={{ margin: 0, fontWeight: 600 }}>Push Notifications</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Receive habit reminders on this device</p>
            </div>
            <button 
              type="button" 
              onClick={handleSubscribe} 
              disabled={subscribing}
              style={{ 
                background: 'var(--accent)', 
                border: 'none', 
                color: '#fff', 
                padding: '8px 16px', 
                borderRadius: 'var(--radius-full)',
                cursor: subscribing ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                opacity: subscribing ? 0.7 : 1
              }}
            >
              {subscribing ? 'Enabling...' : 'Enable Reminders'}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button 
            type="button" 
            className="btn" 
            onClick={logout} 
            style={{ 
              marginTop: '0.5rem', 
              width: '100%', 
              background: 'transparent', 
              border: '1px solid rgba(251, 113, 133, 0.3)', 
              color: 'var(--rose)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(251, 113, 133, 0.1)';
              e.currentTarget.style.borderColor = 'var(--rose)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(251, 113, 133, 0.3)';
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </section>
  );
}
