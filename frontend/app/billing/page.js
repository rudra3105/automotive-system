'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { api } from '../../lib/api';

export default function BillingPage() {
  const [list, setList] = useState([]);
  const [invoiceId, setInvoiceId] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  const load = () => api('/invoices').then(setList);
  useEffect(load, []);

  const markPayment = async (e) => {
    e.preventDefault();
    await api(`/invoices/${invoiceId}/payment`, { method: 'PATCH', body: JSON.stringify({ paidAmount: Number(paidAmount) }) });
    setInvoiceId('');
    setPaidAmount('');
    load();
  };

  return <Layout>
    <h1 className='text-lg mb-2'>Billing & Invoices</h1>
    <form onSubmit={markPayment} className='card grid grid-cols-1 md:grid-cols-3 gap-2 mb-4'>
      <input className='border p-2' placeholder='Invoice ID' value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} />
      <input className='border p-2' placeholder='Payment Amount' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
      <button className='bg-blue-600 text-white rounded p-2'>Record Payment</button>
    </form>
    <div className='space-y-2'>{list.map((i) => <div key={i.id} className='card text-sm'>#{i.id} {i.reference} | {i.paymentStatus} | {i.currency} {i.paidAmount}/{i.amount}</div>)}</div>
  </Layout>;
}
