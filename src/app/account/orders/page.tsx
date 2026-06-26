'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Download,
  CheckCircle,
  Truck,
  RefreshCw,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { fetchOrderHistory } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';
import { OrderHistoryItem, OrderLineItem } from '@/types';
import { DashboardLayout } from '@/components/account/DashboardLayout';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: RefreshCw },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  shipped: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-300 border-red-500/20',
};

const STEP_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

function getStepIndex(status: string) {
  return STEP_ORDER.indexOf(status);
}

function OrderTracker({ status }: { status: string }) {
  const current = getStepIndex(status);
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-2">
        <XCircle className="h-5 w-5 text-red-400" />
        <span className="text-sm text-red-300 font-medium capitalize">{status}</span>
      </div>
    );
  }
  return (
    <div className="relative max-w-2xl pt-2">
      <div className="flex items-center justify-between gap-2 relative z-10">
        {STATUS_STEPS.map((step, i) => {
          const done = i <= current;
          const active = i === current;
          const StepIcon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`h-8 w-8 rounded-full border-2 grid place-items-center transition-all bg-zinc-900 ${
                  done ? 'border-cyan-400 text-cyan-400' : 'border-zinc-700 text-zinc-500'
                } ${active ? 'ring-4 ring-cyan-400/25 bg-cyan-400 text-black' : ''}`}
              >
                <StepIcon className={`h-4 w-4 ${active && 'text-black'}`} />
              </div>
              <span
                className={`text-[9px] uppercase tracking-wider text-center leading-tight ${
                  done ? 'text-zinc-200 font-medium' : 'text-zinc-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Connecting line */}
      <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[2px] bg-zinc-800 z-0">
        <div
          className="h-full bg-cyan-400 transition-all duration-700"
          style={{ width: current <= 0 ? '0%' : `${(current / (STATUS_STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onExpand,
  expanded,
}: {
  order: OrderHistoryItem;
  onExpand: () => void;
  expanded: boolean;
}) {
  const id = order._id || order.orderId || '';
  const status = order.orderStatus || 'pending';
  const total = order.financials?.total ?? order.total ?? 0;
  const items = order.items || [];
  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();

  const handleDownloadInvoice = () => {
    const invoiceNum = id.slice(0, 8).toUpperCase();
    const orderDateFormatted = createdAt.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const itemsHtml = items
      .map(
        (item: OrderLineItem) => `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid #27272a;">
            <div style="font-weight: 500; font-size: 13px; color: #ffffff;">${item.name || 'Product'}</div>
            <div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</div>
          </td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #27272a; text-align: center; color: #ffffff;">${item.quantity}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #27272a; text-align: right; color: #ffffff;">$${(item.price || 0).toLocaleString()}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #27272a; text-align: right; font-weight: 500; color: #00d9ff;">$${((item.price || 0) * item.quantity).toLocaleString()}</td>
        </tr>
      `
      )
      .join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Failed to open print window. Please allow popups.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoiceNum}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 40px;
            color: #ffffff;
            background-color: #09090b;
            font-size: 13px;
            line-height: 1.5;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #27272a;
            padding: 40px;
            background: #09090b;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #27272a;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .logo-container h1 {
            font-size: 28px;
            font-weight: 300;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: #ffffff;
          }
          .logo-container p {
            margin: 4px 0 0 0;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #00d9ff;
            font-weight: 600;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h2 {
            font-size: 20px;
            font-weight: 400;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff;
          }
          .invoice-title p {
            margin: 4px 0 0 0;
            color: #a1a1aa;
            font-size: 11px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            margin-bottom: 40px;
          }
          .section-title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #00d9ff;
            font-weight: 700;
            border-bottom: 1px solid #27272a;
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          .info-block p {
            margin: 4px 0;
            color: #d4d4d8;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .table th {
            background-color: #18181b;
            border-bottom: 2px solid #27272a;
            font-weight: 600;
            text-align: left;
            padding: 12px 10px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #a1a1aa;
          }
          .totals-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
          .totals-table {
            width: 320px;
            border-collapse: collapse;
          }
          .totals-table td {
            padding: 6px 10px;
            color: #d4d4d8;
          }
          .totals-table tr.grand-total td {
            font-weight: 700;
            font-size: 15px;
            color: #00d9ff;
            border-top: 1px solid #27272a;
            padding-top: 12px;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 11px;
            color: #71717a;
            border-top: 1px solid #27272a;
            padding-top: 20px;
          }
          @media print {
            body {
              padding: 0;
              background-color: #ffffff;
              color: #000000;
            }
            .invoice-container {
              border: none;
              padding: 0;
              background: #ffffff;
            }
            .logo-container h1, .header, .table th, .totals-table tr.grand-total td, .invoice-container {
              color: #000000 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="logo-container">
              <h1>Plasma Atelier</h1>
              <p>Futuristic Luxury Fashion</p>
            </div>
            <div class="invoice-title">
              <h2>Tax Invoice</h2>
              <p><strong>Invoice ID:</strong> ${invoiceNum}</p>
              <p><strong>Date:</strong> ${orderDateFormatted}</p>
            </div>
          </div>

          <div class="grid">
            <div class="info-block">
              <div class="section-title">Shipping & Billing</div>
              <p>Standard Home Delivery</p>
              <p>United States</p>
            </div>
            <div class="info-block">
              <div class="section-title">Order Info</div>
              <p><strong>Status:</strong> ${status.toUpperCase()}</p>
              <p><strong>Date:</strong> ${orderDateFormatted}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th style="width: 50%;">Product Details</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 20%; text-align: right;">Unit Price</th>
                <th style="width: 20%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals-container">
            <table class="totals-table">
              <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">$${total.toLocaleString()}</td>
              </tr>
              <tr class="grand-total">
                <td>Grand Total</td>
                <td style="text-align: right;">$${total.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>Thank you for choosing Plasma Atelier.</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] hover:border-cyan-400/20 transition-all rounded-2xl overflow-hidden shadow-md">
      {/* Card Header */}
      <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 bg-white/[0.02] border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-wider text-white uppercase">
              Order #{id.slice(0, 8).toUpperCase()}
            </span>
            <span
              className={`border px-2.5 py-0.5 text-[9px] uppercase tracking-widest rounded-full font-semibold ${
                STATUS_COLORS[status] || 'bg-zinc-800'
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1.5 flex gap-2 items-center">
            <span>
              Placed{' '}
              {createdAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="h-1 w-1 bg-zinc-700 rounded-full" />
            <span>{items.length} item(s)</span>
            <span className="h-1 w-1 bg-zinc-700 rounded-full" />
            <span className="font-semibold text-cyan-400">${total.toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-1.5 border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-colors rounded-lg text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Invoice
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-6">
        {/* Thumbnails */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center shrink-0 border border-white/5 p-2 bg-white/[0.01] rounded-xl min-w-[200px]"
            >
              {item.image ? (
                <div className="h-12 w-9 relative shrink-0 rounded overflow-hidden border border-white/10">
                  <Image
                    src={item.image}
                    alt={item.name || 'Product'}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
              ) : (

                <div className="h-12 w-9 bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 rounded">
                  <Package className="h-4 w-4 text-zinc-600" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.name || 'Product'}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tracker */}
        <div>
          <OrderTracker status={status} />
        </div>

        {/* Expand Details button */}
        <div className="flex justify-center border-t border-dashed border-white/10 pt-4">
          <button
            onClick={onExpand}
            className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-semibold"
          >
            {expanded ? 'Hide Details' : 'View Full Details'}
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-white/[0.01]"
          >
            <div className="p-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4 text-cyan-400">Order Items</p>
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      {item.image && (
                        <div className="h-16 w-12 relative shrink-0 rounded overflow-hidden border border-white/10">
                          <Image
                            src={item.image}
                            alt={item.name || 'Product'}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          Size: {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-white shrink-0">
                        ${((item.price || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-cyan-400">Shipping Address</p>
                  <p className="text-zinc-300 leading-relaxed border-l-2 border-zinc-700 pl-3">
                    Standard Delivery Address<br />
                    United States
                  </p>
                </div>

                {order.trackingNumber && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-cyan-400">Tracking Information</p>
                    <code className="text-xs font-mono bg-zinc-900 border border-white/10 px-2 py-1 inline-block text-white rounded">
                      {order.trackingNumber}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    let mounted = true;
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        setError(null);
        const resp = await fetchOrderHistory();
        const data = resp.data;
        let list: OrderHistoryItem[] = [];
        if (data) {
          if ('data' in data && Array.isArray(data.data)) {
            list = data.data;
          } else if (Array.isArray(data)) {
            list = data;
          }
        }
        if (mounted) setOrders(list);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load order history');
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [isLoading, user, router]);

  const filteredOrders = orders.filter((o) => {
    const orderStatus = o.orderStatus || 'pending';
    if (filter === 'all') return true;
    return orderStatus === filter;
  });

  const TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

  return (
    <DashboardLayout title="My Orders" subtitle="Track and view your order history">
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
        {TABS.map((f) => {
          const count = f === 'all' ? orders.length : orders.filter((o) => (o.orderStatus || 'pending') === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pb-3 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all border-b-2 ${
                filter === f
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {f === 'all' ? 'All Orders' : f}{' '}
              <span className="opacity-50 font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {loadingOrders ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border border-white/10 p-6 animate-pulse rounded-2xl bg-white/[0.02]">
                <div className="h-5 bg-white/10 rounded w-48 mb-3" />
                <div className="h-3 bg-white/5 rounded w-64" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 bg-white/[0.02] rounded-2xl space-y-4">
            <Package className="h-10 w-10 mx-auto text-zinc-500 stroke-1" />
            <h3 className="text-xl font-light text-white">No Orders Found</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders in your history.`}
            </p>
            {filter === 'all' && (
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-block bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentOrderId = order._id || order.orderId || '';
            return (
              <OrderCard
                key={currentOrderId}
                order={order}
                expanded={expandedId === currentOrderId}
                onExpand={() => setExpandedId(expandedId === currentOrderId ? null : currentOrderId)}
              />
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}