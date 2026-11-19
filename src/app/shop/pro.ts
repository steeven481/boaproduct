import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Order,Store} from '../core/store';
import {I18n} from '../core/i18n';
import {EurPipe,LocPipe,ModalComponent,TPipe,VideoComponent} from '../shared/shared';

@Component({selector:'app-pro',standalone:true,imports:[FormsModule,EurPipe,TPipe,LocPipe,ModalComponent,VideoComponent],template:`
<section class="hero small"><app-video slot="marche" a="#2a1a10" b="#8a3b22"><div class="hero-in"><p class="eyebrow light">{{'pro.eyebrow'|t}}</p><h1>{{'pro.title'|t}}</h1><p class="lead">{{'pro.lead'|t}}</p>
 <div class="cta"><button class="btn btn-light" (click)="access.set(true)">{{'pro.open'|t}}</button><button class="btn btn-ghost-l" (click)="toOrder()">{{'pro.quick'|t}}</button></div></div></app-video></section>
<section class="sec wrap"><div class="vals">@for(v of vals;track v){<div class="val"><span>{{v}}</span><h3>{{'pro.v'+v+'.t'|t}}</h3><p class="mut">{{'pro.v'+v+'.d'|t}}</p></div>}</div></section>
<section class="sec wrap narrow"><div class="sec-head"><div><p class="eyebrow">{{'pro.tiersEye'|t}}</p><h2>{{'pro.tiers'|t}}</h2></div></div>
 <table class="tbl"><thead><tr><th>{{'pro.qty'|t}}</th><th class="r">{{'pro.disc'|t}}</th></tr></thead><tbody>@for(t of tiers;track t.min){<tr><td>{{t.min}}+</td><td class="r">{{t.d}} %</td></tr>}</tbody></table>
 <p class="mut" style="margin-top:12px;font-size:13px">{{'pro.tiersNote'|t}}</p></section>
<section class="sec wrap" id="order"><div class="sec-head"><div><p class="eyebrow">{{'pro.quick'|t}}</p><h2>{{'pro.orderTitle'|t}}</h2></div><button class="btn" (click)="s.toast(i.t('pro.csvToast'))">{{'pro.csv'|t}}</button></div>
 <div class="tscroll"><table class="tbl"><thead><tr><th>{{'pro.product'|t}}</th><th>{{'pro.qty'|t}}</th><th class="r">{{'pro.unit'|t}}</th><th class="r">{{'pro.line'|t}}</th><th></th></tr></thead><tbody>
 @for(r of rows();track $index;let k=$index){<tr><td><select [ngModel]="r.id" (ngModelChange)="setId(k,+$event)">@for(p of s.products();track p.id){<option [value]="p.id">{{p.name|loc}}</option>}</select></td>
  <td><input class="qin" type="number" min="1" [ngModel]="r.qty" (ngModelChange)="setQty(k,+$event)"></td>
  <td class="r">{{unit(r)|eur}} <small class="mut">−{{disc(r.qty)}} %</small></td><td class="r"><b>{{unit(r)*r.qty|eur}}</b></td><td class="r"><button class="lnk" (click)="del(k)">✕</button></td></tr>}</tbody></table></div>
 <button class="lnk" style="margin:14px 0" (click)="add()">+ {{'pro.addRow'|t}}</button>
 <div class="sum-pro"><div><small class="mut">{{'pro.totalHt'|t}}</small><div class="price big">{{total()|eur}}</div><small class="mut">{{'pro.terms'|t}}</small></div>
 <div class="row gap"><button class="btn" (click)="quote.set(true)">{{'pro.quote'|t}}</button><button class="btn btn-solid" (click)="order()">{{'pro.order'|t}}</button></div></div></section>

<app-modal [open]="access()" [title]="'pro.open'|t" (closed)="access.set(false)"><form (ngSubmit)="send(access,'pro.accessToast')">
 <div class="field"><label>{{'pro.company'|t}}</label><input name="a1" required></div><div class="two"><div class="field"><label>SIRET</label><input name="a2" required></div><div class="field"><label>{{'pro.vat'|t}}</label><input name="a3"></div></div>
 <div class="field"><label>{{'acc.email'|t}}</label><input name="a4" type="email" required></div><button class="btn btn-solid full">{{'pro.send'|t}}</button></form></app-modal>
<app-modal [open]="quote()" [title]="'pro.quote'|t" (closed)="quote.set(false)"><form (ngSubmit)="send(quote,'pro.quoteToast')">
 <div class="field"><label>{{'pro.company'|t}}</label><input name="q1" required></div><div class="field"><label>{{'acc.email'|t}}</label><input name="q2" type="email" required></div>
 <div class="field"><label>{{'pro.msg'|t}}</label><textarea name="q3" rows="3"></textarea></div><button class="btn btn-solid full">{{'pro.send'|t}}</button></form></app-modal>
<app-modal [open]="done()!==''" [title]="'pro.doneTitle'|t" (closed)="done.set('')"><div class="success"><div class="ico">✓</div><p>{{'pro.doneText'|t}}</p><b>{{done()}}</b></div></app-modal>`})
export class Pro{
 s=inject(Store);i=inject(I18n);vals=['1','2','3'];access=signal(false);quote=signal(false);done=signal('');
 tiers=[{min:1,d:0},{min:10,d:5},{min:50,d:10},{min:200,d:15}];
 rows=signal<{id:number;qty:number}[]>([{id:1,qty:100},{id:5,qty:60},{id:3,qty:80}]);
 prod(id:number){return this.s.products().find(p=>p.id===id)}
 disc(q:number){return [...this.tiers].reverse().find(t=>q>=t.min)!.d}
 unit(r:{id:number;qty:number}){return (this.prod(r.id)?.price||0)*(1-this.disc(r.qty)/100)}
 total=computed(()=>this.rows().reduce((a,r)=>a+this.unit(r)*r.qty,0));
 setId(k:number,id:number){this.rows.update(l=>l.map((r,j)=>j===k?{...r,id}:r))}
 setQty(k:number,qty:number){this.rows.update(l=>l.map((r,j)=>j===k?{...r,qty:qty>0?qty:1}:r))}
 add(){this.rows.update(l=>[...l,{id:this.s.products()[0]?.id||1,qty:10}])}
 del(k:number){this.rows.update(l=>l.filter((_,j)=>j!==k))}
 toOrder(){document.getElementById('order')?.scrollIntoView({behavior:'smooth'})}
 send(m:{set:(v:boolean)=>void},key:string){m.set(false);this.s.toast(this.i.t(key))}
 order(){const n=this.s.orders().length;const id='AG-PRO-'+String(100+n).padStart(4,'0');const d=new Date().toISOString().slice(0,10);
  const o:Order={id,customer:'Restaurant Le Baobab',email:'pro@exemple.fr',city:'Paris',date:d,status:'paid',carrier:'Colissimo',tracking:'6A'+String(5100000+n*97).padStart(9,'0')+'FR',total:Math.round(this.total()*100)/100,kind:'b2b',items:this.rows().map(r=>({productId:r.id,qty:r.qty})),events:[{date:d,code:'paid'}]};
  this.s.addOrder(o);this.done.set(id)}}
