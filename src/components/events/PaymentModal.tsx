/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripeClient';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';

interface InnerProps {
  eventId: string;
  amount: number;
  onSuccess: (paymentId: string) => Promise<void>;
  onClose: () => void;
}

const CardPaymentForm = ({ eventId, amount, onSuccess, onClose }: InnerProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    try {
      setLoading(true);
      const { data } = await axios.post('/payments/create-intent', { eventId });
      const clientSecret = data.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent?.status === 'succeeded') {
        await onSuccess(result.paymentIntent.id);
        toast.success('Payment successful');
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
              },
            },
          }}
        />
      </div>
      <div className="flex gap-3">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handlePayment} loading={loading}>
          Pay ${(amount / 100).toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  eventId,
  onPaymentSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  eventId: string;
  onPaymentSuccess: (paymentId: string) => Promise<void>;
}) => {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    getStripe()
      .then((inst) => setStripePromise(inst))
      .catch(() => toast.error('Stripe key missing'));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
            <p className="text-sm text-gray-500">
              Use test card 4242 4242 4242 4242, any future date, any CVC.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CardPaymentForm
              eventId={eventId}
              amount={amount}
              onClose={onClose}
              onSuccess={onPaymentSuccess}
            />
          </Elements>
        ) : (
          <p className="text-sm text-gray-500">Loading payment form...</p>
        )}
      </div>
    </div>
  );
};
