import {Injectable,signal,computed,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
export interface Product{id:number;name:string;category:string;type:string;price:number;weight:string;origin:string;stock:number;rating:number;reviews:number;image:string;description:string;badge?:string}
export interface Ev{date:string;label:string}
export interface Order{id:string;customer:string;email:string;city:string;date:string;status:string;carrier:string;tracking:string;total:number;items:{productId:number;qty:number}[];events:Ev[]}
export const STATUSES=['Payée','Préparée','Expédiée','En livraison','Livrée'];
export const CATEGORIES=['Épices','Huiles','Farines','Snacks','Boissons','Artisanat','Cosmétiques'];
export const CARRIERS=[
 {id:'cr',name:'Chronopost Shop2Shop (point relais)',carrier:'Chronopost',price:4.5,delay:'2 à 4 jours'},
 {id:'cs',name:'Colissimo point de retrait',carrier:'Colissimo',price:8.89,delay:'2 à 3 jours'},
 {id:'cd',name:'Colissimo à domicile',carrier:'Colissimo',price:9.59,delay:'2 à 3 jours'},
 {id:'c13',name:'Chrono 13 à domicile (express)',carrier:'Chronopost',price:23.4,delay:'Lendemain avant 13 h'}];
@Injectable({providedIn:'root'})
export class Store{
 private http=inject(HttpClient);
 products=signal<Product[]>([]);orders=signal<Order[]>([]);sales=signal<{day:string;total:number}[]>([]);
 cart=signal<{id:number;qty:number}[]>(this.load());
 toasts=signal<{id:number;msg:string;err:boolean}[]>([]);
 loginOpen=signal(false);cartOpen=signal(false);user=signal<string|null>(null);
 lines=computed(()=>this.cart().map(c=>({p:this.products().find(p=>p.id===c.id)!,qty:c.qty})).filter(l=>!!l.p));
 count=computed(()=>this.cart().reduce((a,c)=>a+c.qty,0));
 subtotal=computed(()=>this.lines().reduce((a,l)=>a+l.p.price*l.qty,0));
 constructor(){
  this.http.get<Product[]>('assets/data/products.json').subscribe(d=>this.products.set(d));
  this.http.get<Order[]>('assets/data/orders.json').subscribe(d=>this.orders.set(d));
  this.http.get<{day:string;total:number}[]>('assets/data/sales.json').subscribe(d=>this.sales.set(d));
 }
 private load(){try{return JSON.parse(localStorage.getItem('bp-cart')||'[]')}catch{return []}}
 private save(){localStorage.setItem('bp-cart',JSON.stringify(this.cart()))}
 add(p:Product,qty=1){this.cart.update(c=>c.find(i=>i.id===p.id)?c.map(i=>i.id===p.id?{...i,qty:i.qty+qty}:i):[...c,{id:p.id,qty}]);this.save();this.toast(p.name+' ajouté au panier')}
 setQty(id:number,q:number){if(q<1)return this.remove(id);this.cart.update(c=>c.map(i=>i.id===id?{...i,qty:q}:i));this.save()}
 remove(id:number){this.cart.update(c=>c.filter(i=>i.id!==id));this.save()}
 clear(){this.cart.set([]);this.save()}
 toast(msg:string,err=false){const id=Date.now()+Math.random();this.toasts.update(t=>[...t,{id,msg,err}]);setTimeout(()=>this.toasts.update(t=>t.filter(x=>x.id!==id)),3200)}
 addOrder(o:Order){this.orders.update(l=>[o,...l])}
 updateOrder(id:string,patch:Partial<Order>){this.orders.update(l=>l.map(o=>o.id===id?{...o,...patch}:o))}
 saveProduct(p:Product){this.products.update(l=>l.some(x=>x.id===p.id)?l.map(x=>x.id===p.id?p:x):[...l,p])}
 deleteProduct(id:number){this.products.update(l=>l.filter(x=>x.id!==id))}
 sc(status:string){return 'st st-'+STATUSES.indexOf(status)}
}
