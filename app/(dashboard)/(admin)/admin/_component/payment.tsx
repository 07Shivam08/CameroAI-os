// components/PaymentButton.js

import { useState } from "react";

interface PaymentButtonProps {
  children?: React.ReactNode;
  className?: string;
  organizationId: string;
  plan: string;
  onClick?: () => void;
}

const PaymentButton = ({
  children,
  className,
  organizationId,
  plan,
  onClick,
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (onClick) {
      onClick();
      return;
    }

    setLoading(true);
    try {
      // Create order by calling your API route
      const res = await fetch(`/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1,
          organizationId,
          plan,
        }), // Example amount: ₹500
      });

      const orderData = await res.json();
      console.log(orderData);
      // Setup Razorpay options
      const options = {
        // subscription_id: orderData.sub.id,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // This is your public key
        // amount: orderData.amount,
        // currency: orderData.currency,
        name: "Camero AI",
        recurring: "1",
        customer_id: orderData.customerId,
        description: `${plan} Plan Subscription`,
        order_id: orderData.id,
        handler: function (response: any) {
          // Handle successful payment here
          alert(`Payment ID: ${response.razorpay_payment_id}`);
          alert(`Order ID: ${response.razorpay_order_id}`);
          alert(`Signature: ${response.razorpay_signature}`);
        },

        theme: {
          color: "#3399cc",
        },
      };

      // Open Razorpay Checkout
      const razorpayInstance = (window as any).Razorpay(options as any);
      //@ts-ignore
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? "Processing..." : children || "Pay Now"}
    </button>
  );
};

export default PaymentButton;
