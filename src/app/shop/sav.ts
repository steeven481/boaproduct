import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Product,Store,Ticket} from '../core/store';
import {I18n} from '../core/i18n';
import {EurPipe,LocPipe,ModalComponent,TPipe} from '../shared/shared';

@Component({selector:'app-sav',standalone:true,imports:[FormsModule,DatePipe,EurPipe,TPipe,LocPipe,ModalComponent],template:`
<section class="page-top wrap"><p class="eyebrow">{{'nav.sav'|t}}</p><h1>{{'sav.title'|t}}</h1><p class="mut narrow-p">{{'sav.lead'|t}}</p></section>
<div class="wrap narrow"><div class="panel">
 <div class="field"><label>{{'sav.order'|t}}</label><select [ngModel]="orderId()" (ngModelChange)="orderId.set($event);productId.set(0)"><option value="">—</option>@for(o of s.orders();track o.id){<option [value]="o.id">{{o.id}} · {{o.date|date:'dd/MM/yyyy'}}</option>}</select></div>
 <div class="field"><label>{{'sav.product'|t}}</label><select [ngModel]="productId()" (ngModelChange)="productId.set(+$event)"><option value="0">—</option>@for(p of prods();track p.id){<option [value]="p.id">{{p.name|loc}}</option>}</select></div>
 <div class="field"><label>{{'sav.reason'|t}}</label><div class="chips">@for(r of reasons;track r){<button type="button" [class.on]="reason()===r" (click)="reason.set(r)">{{'reason.'+r|t}}</button>}</div></div>
 <div class="field"><label>{{'sav.message'|t}}</label><textarea rows="4" [ngModel]="message()" (ngModelChange)="message.set($event)"></textarea></div>
 <div class="field"><label>{{'sav.photo'|t}}</label><input type="file" accept="image/*"></div>
 <button class="btn btn-solid full" [disabled]="!productId()||!message()" (click)="submit()">{{'sav.send'|t}}</button></div>
 <h3 style="margin:48px 0 14px">{{'sav.mine'|t}}</h3>
 @for(t of s.tickets();track t.id){<div class="dl"><span><b>{{t.id}}</b> · {{pname(t.productId)}} <small class="mut">· {{'reason.'+t.reason|t}}</small></span><span [class]="'st st-'+t.status">{{'tk.'+t.status|t}}</span></div>}</div>

<app-modal [open]="!!created()" [title]="'sav.doneTitle'|t" [wide]="true" (closed)="created.set(null)">
@if(created(); as c){<p>{{'sav.doneText'|t:{id:c.id} }}</p><h4 style="margin:18px 0 12px">{{'sav.reco'|t}}</h4>
 <div class="reco">@for(p of reco();track p.id){<div class="reco-i"><img [src]="p.image" [alt]="p.name|loc"><b>{{p.name|loc}}</b><span class="mut">{{p.price|eur}}</span><button class="btn btn-sm" [class.btn-solid]="c.recommendedId===p.id" (click)="choose(c,p)">{{c.recommendedId===p.id?('sav.chosen'|t):('sav.choose'|t)}}</button></div>}</div>}
</app-modal>`})
export class Sav{
 s=inject(Store);i=inject(I18n);reasons=['damaged','taste','mismatch','other'];orderId=signal('');productId=signal(0);reason=signal('damaged');message=signal('');created=signal<Ticket|null>(null);
 prods=computed(()=>{const o=this.s.orders().find(x=>x.id===this.orderId());return o?o.items.map(i=>this.s.products().find(p=>p.id===i.productId)).filter((p):p is Product=>!!p):[]});
 reco=computed(()=>{const t=this.created();const p=this.s.products().find(x=>x.id===t?.productId);if(!p)return [];
  const l=this.s.products().filter(x=>x.id!==p.id).sort((a,b)=>(+(b.category===p.category)*10+b.rating)-(+(a.category===p.category)*10+a.rating));return l.slice(0,3)});
 pname(id:number){return this.i.loc(this.s.products().find(p=>p.id===id)?.name)}
 submit(){const t:Ticket={id:'SAV-'+String(22+this.s.tickets().length-3).padStart(4,'0'),orderId:this.orderId(),productId:this.productId(),customer:this.s.user()||'Client',reason:this.reason(),message:this.message(),date:new Date().toISOString().slice(0,10),status:'open'};
  this.s.addTicket(t);this.created.set(t);this.message.set('');this.productId.set(0)}
 choose(t:Ticket,p:Product){this.s.updateTicket(t.id,{decision:'recommend',recommendedId:p.id});this.created.set({...t,recommendedId:p.id});this.s.toast(this.i.t('sav.chosenToast'))}}
