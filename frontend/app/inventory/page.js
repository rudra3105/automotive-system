'use client';
import { useEffect, useState } from 'react'; import Layout from '../../components/Layout'; import { api } from '../../lib/api';
const map={customers:'/customers',sales:'/sales',inventory:'/parts',billing:'/invoices',settings:'/settings'};
export default function Page(){const [list,setList]=useState([]);useEffect(()=>{api(map['inventory']).then(setList).catch(()=>{})},[]);return <Layout><h1 className='text-lg mb-2 capitalize'>inventory</h1><div className='space-y-2'>{list.map((i)=><div key={i.id} className='card text-sm'>{JSON.stringify(i)}</div>)}</div></Layout>}
