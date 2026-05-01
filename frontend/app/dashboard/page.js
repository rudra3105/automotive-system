'use client';
import { useEffect, useState } from 'react'; import Layout from '../../components/Layout'; import { api } from '../../lib/api';
export default function Dashboard(){const [d,setD]=useState({});useEffect(()=>{api('/dashboard').then(setD)},[]);return <Layout><div className='grid grid-cols-2 md:grid-cols-4 gap-3'>{Object.entries({Revenue:d.dailyRevenue,PendingJobs:d.pendingJobs,StockValue:d.stockValue,Outstanding:d.outstanding}).map(([k,v])=><div key={k} className='card'><div className='text-xs'>{k}</div><div className='text-xl font-bold'>{v??'-'}</div></div>)}</div></Layout>}
