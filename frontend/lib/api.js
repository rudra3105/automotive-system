const API=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function api(path,opts={}){const token=typeof window!=='undefined'?localStorage.getItem('token'):null;const res=await fetch(`${API}${path}`,{...opts,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}});if(!res.ok) throw new Error(await res.text());return res.json();}
