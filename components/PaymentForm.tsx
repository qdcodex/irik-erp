"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface PaymentFormProps {
  invoiceId: string;
  studentId: string;
  amount: number;
  studentEmail: string;
  studentPhone: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentForm({
  invoiceId,
  studentId,
  amount,
  studentEmail,
  studentPhone,
  onSuccess,
}: PaymentFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const initiatePayment = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Create order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          studentId,
          amount,
          studentEmail,
          studentPhone,
        }),
      });

      if (!orderResponse.ok) {
        const data = await orderResponse.json();
        throw new Error(data.error || "Failed to create payment order");
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // Set QR code data
      if (orderData.order.qrCodeData) {
        setQrCodeUrl(orderData.order.qrCodeData);
      }

      // Initialize Razorpay payment
      if (!window.Razorpay) {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          openRazorpayCheckout(orderData);
        };
        document.body.appendChild(script);
      } else {
        openRazorpayCheckout(orderData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment initiation failed";
      setError(errorMessage);
      setPaymentStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  const openRazorpayCheckout = (orderData: any) => {
    const options = {
      key: orderData.razorpayKey,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "IRIK College",
      description: `Fee Payment - Invoice ${invoiceId}`,
      order_id: orderData.order.id,
      prefill: {
        name: user?.fullName || "",
        email: studentEmail,
        contact: studentPhone,
      },
      theme: {
        color: "#3b82f6",
      },
      handler: async (response: any) => {
        try {
          setPaymentStatus("processing");

          // Verify payment on backend
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            setPaymentStatus("success");
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setPaymentStatus("failed");
            setError("Payment verification failed");
          }
        } catch (err) {
          setPaymentStatus("failed");
          setError("Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentStatus("idle");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Fee Payment</h2>

      {/* Status Messages */}
      {error && <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-lg mb-4 text-sm">
          ✅ Payment successful! Your receipt has been sent to your email.
        </div>
      )}

      {paymentStatus === "processing" && (
        <div className="bg-blue-50 border border-blue-300 text-blue-800 p-3 rounded-lg mb-4 text-sm">
          ⏳ Processing your payment...
        </div>
      )}

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
        <p className="text-gray-600 text-sm mb-1">Amount Due</p>
        <p className="text-4xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
        <p className="text-gray-500 text-xs mt-2">Invoice: {invoiceId}</p>
      </div>

      {/* QR Code Section */}
      {qrCodeUrl && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">Scan with any UPI app</p>
          {/* QR Code would be generated here */}
          <div className="bg-white p-4 rounded border border-gray-300 aspect-square flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm">📱 UPI Payment</p>
              <p className="text-gray-400 text-xs mt-2">Amount: ₹{amount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="space-y-3">
        <button
          onClick={initiatePayment}
          disabled={isLoading || paymentStatus === "success"}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : paymentStatus === "success" ? "✅ Payment Complete" : "💳 Pay Now"}
        </button>

        <button
          className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
          title="Open UPI apps to scan and pay"
        >
          📱 Pay via UPI App
        </button>
      </div>

      {/* Payment Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2 text-sm text-gray-600">
          <p>✅ 100% Secure Payment</p>
          <p>✅ Instant Receipt</p>
          <p>✅ Multiple Payment Methods</p>
        </div>
      </div>

      {/* Student Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p>
          <strong>Student Email:</strong> {studentEmail}
        </p>
        <p className="mt-1">
          <strong>Student Phone:</strong> {studentPhone}
        </p>
      </div>
    </div>
  );
}
