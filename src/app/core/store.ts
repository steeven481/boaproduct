import {Injectable,signal,computed,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
export interface L{fr:string;en:string}
export interface Product{id:number;name:L;category:string;type:string;price:number;weight:string;origin:string;stock:number;rating:number;reviews:number;image:string;description:L;tag?:string}
export interface Ev{date:string;code:string}
export interface Order{id:string;customer:string;email:string;city:string;date:string;status:string;carrier:string;tracking:string;total:number;kind:string;items:{productId:number;qty:number}[];events:Ev[]}
export interface User{id:number;name:string;email:string;role:string;status:string;lang:string;joined:string;orders:number}
export interface Ticket{id:string;orderId:string;productId:number;customer:string;reason:string;message:string;date:string;status:string;decision?:string;recommendedId?:number}
export const STATUSES=['paid','prepared','shipped','delivery','delivered'];
export const CATS=['spices','oils','flours','snacks','drinks','craft','beauty'];
export const ROLES=['client','grossiste','support','gestionnaire','admin','superadmin'];
export const CARRIERS=[{id:'cr',carrier:'Chronopost',price:4.5},{id:'cs',carrier:'Colissimo',price:8.89},{id:'cd',carrier:'Colissimo',price:9.59},{id:'c13',carrier:'Chronopost',price:23.4}];
@Injectable({providedIn:'root'})
export class Store{
 private http=inject(HttpClient);
 products=signal<Product[]>([]);orders=signal<Order[]>([]);users=signal<User[]>([]);tickets=signal<Ticket[]>([]);
 sales=signal<{day:string;total:number}[]>([]);media=signal<Record<string,{src:string}>>({});
 cart=signal<{id:number;qty:number}[]>(this.load());
 toasts=signal<{id:number;msg:string;err:boolean}[]>([]);
 accountOpen=signal(false);cartOpen=signal(false);user=signal<string|null>(null);
 lines=computed(()=>this.cart().map(c=>({p:this.products().find(p=>p.id===c.id)!,qty:c.qty})).filter(l=>!!l.p));
 count=computed(()=>this.cart().reduce((a,c)=>a+c.qty,0));
 subtotal=computed(()=>this.lines().reduce((a,l)=>a+l.p.price*l.qty,0));
 constructor(){
  const g=<T>(f:string,s:(d:T)=>void)=>this.http.get<T>('assets/data/'+f+'.json').subscribe(s);
  g<Product[]>('products',d=>this.products.set(d));g<Order[]>('orders',d=>this.orders.set(d));g<User[]>('users',d=>this.users.set(d));
  g<Ticket[]>('tickets',d=>this.tickets.set(d));g<{day:string;total:number}[]>('sales',d=>this.sales.set(d));g<Record<string,{src:string}>>('media',d=>this.media.set(d));
 }
 private load(){try{return JSON.parse(localStorage.getItem('ag-cart')||'[]')}catch{return []}}
 private save(){localStorage.setItem('ag-cart',JSON.stringify(this.cart()))}
 add(p:Product,qty=1,msg=''){this.cart.update(c=>c.find(i=>i.id===p.id)?c.map(i=>i.id===p.id?{...i,qty:i.qty+qty}:i):[...c,{id:p.id,qty}]);this.save();this.toast(msg)}
 setQty(id:number,q:number){if(q<1)return this.remove(id);this.cart.update(c=>c.map(i=>i.id===id?{...i,qty:q}:i));this.save()}
 remove(id:number){this.cart.update(c=>c.filter(i=>i.id!==id));this.save()}
 clear(){this.cart.set([]);this.save()}
 toast(msg:string,err=false){if(!msg)return;const id=Date.now()+Math.random();this.toasts.update(t=>[...t,{id,msg,err}]);setTimeout(()=>this.toasts.update(t=>t.filter(x=>x.id!==id)),3200)}
 addOrder(o:Order){this.orders.update(l=>[o,...l])}
 updateOrder(id:string,patch:Partial<Order>){this.orders.update(l=>l.map(o=>o.id===id?{...o,...patch}:o))}
 saveProduct(p:Product){this.products.update(l=>l.some(x=>x.id===p.id)?l.map(x=>x.id===p.id?p:x):[...l,p])}
 deleteProduct(id:number){this.products.update(l=>l.filter(x=>x.id!==id))}
 saveUser(u:User){this.users.update(l=>l.some(x=>x.id===u.id)?l.map(x=>x.id===u.id?u:x):[...l,u])}
 deleteUser(id:number){this.users.update(l=>l.filter(x=>x.id!==id))}
 addTicket(t:Ticket){this.tickets.update(l=>[t,...l])}
 updateTicket(id:string,patch:Partial<Ticket>){this.tickets.update(l=>l.map(t=>t.id===id?{...t,...patch}:t))}
 sc(status:string){return 'st st-'+(STATUSES.indexOf(status)>=0?STATUSES.indexOf(status):status)}
}
