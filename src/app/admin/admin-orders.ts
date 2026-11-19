import {Component,computed,inject,signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Order,STATUSES,Store} from '../core/store';
import {I18n} from '../core/i18n';
import {EurPipe,LocPipe,ModalComponent,TPipe} from '../shared/shared';

@Component({selector:'app-admin-orders',standalone:true,imports:[FormsModule,DatePipe,EurPipe,TPipe,LocPipe,ModalComponent],template:`
<div class="page-h"><div><p class="eyebrow">{{list().length}}</p><h1>{{'adm.orders'|t}}</h1></div></div>
<div class="panel"><div class="fbar"><div class="chips"><button [class.on]="f()===''" (click)="f.set('')">{{'shop.all'|t}} ({{s.orders().length}})</button>@for(st of statuses;track st){<button [class.on]="f()===st" (click)="f.set(st)">{{'st.'+st|t}} ({{count(st)}})</button>}</div>
 <input class="fsearch" [ngModel]="q()" (ngModelChange)="q.set($event)" [placeholder]="'adm.searchOrder'|t"></div>
<div class="tscroll"><table class="tbl"><thead><tr><th>N°</th><th>{{'tbl.customer'|t}}</th><th>{{'tbl.date'|t}}</th><th>{{'tbl.type'|t}}</th><th>{{'tbl.carrier'|t}}</th><th>{{'tbl.status'|t}}</th><th class="r">Total</th><th></th></tr></thead><tbody>
@for(o of list();track o.id){<tr><td><b>{{o.id}}</b></td><td>{{o.customer}}<br><small class="mut">{{o.city}}</small></td><td>{{o.date|date:'dd/MM/yyyy'}}</td><td>{{o.kind==='b2b'?'B2B':'B2C'}}</td><td>{{o.carrier}}</td><td><span [class]="s.sc(o.status)">{{'st.'+o.status|t}}</span></td><td class="r"><b>{{o.total|eur}}</b></td><td class="r"><button class="btn btn-sm" (click)="sel.set(o.id)">{{'common.details'|t}}</button></td></tr>}</tbody></table></div></div>

<app-modal [open]="!!cur()" [title]="'adm.order'|t:{id:cur()?.id||''}" [wide]="true" (closed)="sel.set('')">
@if(cur(); as o){<div class="tl">@for(st of statuses;track st;let k=$index){<div class="tl-step" [class.done]="k<=idx(o)" [class.cur]="k===idx(o)"><i>{{mark(k,o)}}</i>{{'st.'+st|t}}</div>}</div>
<div class="two"><div><h4>{{'tbl.customer'|t}}</h4><p>{{o.customer}}<br>{{o.email}}<br>{{o.city}}</p><h4>{{'trk.carrier'|t}}</h4><p>{{o.carrier}}<br><small class="mut">{{o.tracking}}</small></p>
 <h4>{{'adm.items'|t}}</h4>@for(it of o.items;track it.productId){<div class="mini"><img [src]="prod(it.productId)?.image" alt=""><span>{{prod(it.productId)?.name|loc}} × {{it.qty}}</span></div>}<p style="margin-top:10px"><b>Total : {{o.total|eur}}</b></p></div>
<div><h4>{{'trk.history'|t}}</h4><ul class="ev">@for(e of o.events;track $index){<li>{{'ev.'+e.code|t}}<small>{{e.date|date:'dd/MM/yyyy'}}</small></li>}</ul></div></div>}
<div footer class="mfoot"><button class="btn" (click)="label.set(true)">{{'adm.label'|t}}</button><button class="btn btn-solid" [disabled]="cur()?.status==='delivered'" (click)="advance()">{{cur()?.status==='delivered'?('st.delivered'|t):('adm.next'|t)}}</button></div></app-modal>

<app-modal [open]="label()" [title]="'adm.label'|t" (closed)="label.set(false)">
@if(cur(); as o){<div class="labelbox"><b>{{o.carrier}}</b><p class="mut">{{o.customer}}, {{o.city}}</p><div class="barcode"></div><div class="center"><b>{{o.tracking}}</b></div></div>}
<div footer class="mfoot"><button class="btn" (click)="label.set(false)">{{'common.close'|t}}</button><button class="btn btn-solid" (click)="label.set(false);s.toast(i.t('adm.printed'))">{{'adm.print'|t}}</button></div></app-modal>`})
export class AdminOrders{
 s=inject(Store);i=inject(I18n);statuses=STATUSES;f=signal('');q=signal('');sel=signal('');label=signal(false);
 list=computed(()=>{const q=this.q().toLowerCase();return this.s.orders().filter(o=>(!this.f()||o.status===this.f())&&(!q||(o.id+o.customer).toLowerCase().includes(q)))});
 cur=computed(()=>this.s.orders().find(o=>o.id===this.sel()));
 count(st:string){return this.s.orders().filter(o=>o.status===st).length}
 idx(o:Order){return STATUSES.indexOf(o.status)}
 mark(k:number,o:Order){return k<this.idx(o)?'✓':String(k+1)}
 prod(id:number){return this.s.products().find(p=>p.id===id)}
 advance(){const o=this.cur();if(!o)return;const k=this.idx(o);if(k>=4)return;const code=STATUSES[k+1];
  this.s.updateOrder(o.id,{status:code,events:[{date:new Date().toISOString().slice(0,10),code},...o.events]});this.s.toast(this.i.t('adm.advanced',{id:o.id,st:this.i.t('st.'+code)}))}}
