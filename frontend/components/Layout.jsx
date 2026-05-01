'use client';
import Link from 'next/link';
export default function Layout({children}){return <div className='min-h-screen'><nav className='bg-slate-800 text-white p-3 flex gap-3 text-sm overflow-x-auto'>{['dashboard','customers','sales','workshop','inventory','billing','settings'].map(i=><Link key={i} href={`/${i}`}>{i}</Link>)}</nav><main className='p-4'>{children}</main></div>}
