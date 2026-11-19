import {Component,inject,signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CARRIERS,Order,Store} from '../core/store';
import {I18n} from '../core/i18n';
import {EurPipe,LocPipe,ModalComponent,TPipe} from '../shared/shared';

@Component({selector:'app-checkout',standalone:true,imports:[FormsModule,RouterLink,EurPipe,TPipe,LocPipe,ModalComponent],template:`
<section class="page-top wrap"><p class="eyebrow">{{'co.eye'|t}}</p><h1>{{'co.title'|t}}</h1></section>
<div class="wrap"><div class="stepper"><div [class.on]="step()===1" [class.ok]="step()>1">1 · {{'co.s1'|t}}</div><div [class.on]="step()===2" [class.ok]="step()>2">2 · {{'co.s2'|t}}</div><div [class.on]="step()===3">3 · {{'co.s3'|t}}</div></div>
@if(step()===3){<div class="success"><div class="ico">✓</div><h2>{{'co.thanks'|t}}</h2><p class="mut">{{'co.order'|t}} <b>{{done.id}}</b> · {{done.total|eur}}<br>{{'co.mail'|t:{e:f.email} }}</p>
 <div class="row gap" style="justify-content:center"><a class="btn btn-solid" routerLink="/suivi">{{'nav.track'|t}}</a><a class="btn" routerLink="/boutique">{{'co.continue'|t}}</a></div></div>}
@else if(!s.lines().length){<div class="empty"><p>{{'cart.empty'|t}}</p><a class="btn btn-solid" routerLink="/boutique">{{'cart.discover'|t}}</a></div>}
@else{<div class="co"><div>
 @if(step()===1){<h3>{{'co.addr'|t}}</h3>
  <div class="field"><label>{{'co.name'|t}}</label><input name="nm" [(ngModel)]="f.name"></div><div class="field"><label>{{'acc.email'|t}}</label><input name="em" type="email" [(ngModel)]="f.email"></div>
  <div class="field"><label>{{'co.address'|t}}</label><input name="ad" [(ngModel)]="f.address"></div><div class="two"><div class="field"><label>{{'co.zip'|t}}</label><input name="zp" [(ngModel)]="f.zip"></div><div class="field"><label>{{'co.city'|t}}</label><input name="ct" [(ngModel)]="f.city"></div></div>
  <h3 style="margin:28px 0 14px">{{'co.delivery'|t}}</h3>
  @for(c of carriers;track c.id){<label class="opt" [class.on]="carrierId===c.id"><input type="radio" name="car" [value]="c.id" [(ngModel)]="carrierId"><span class="grow"><b>{{'car.'+c.id|t}}</b><br><small class="mut">{{'car.'+c.id+'.d'|t}}</small></span><b>{{c.price|eur}}</b></label>}
  <button class="btn btn-solid full" [disabled]="!valid()" (click)="step.set(2)">{{'co.toPay'|t}}</button>}
 @if(step()===2){<h3>{{'co.method'|t}}</h3>
  @for(m of methods;track m.id){<label class="opt" [class.on]="method===m.id"><input type="radio" name="pay" [value]="m.id" [(ngModel)]="method"><span class="pm">{{m.i}}</span><span class="grow"><b>{{m.n}}</b><br><small class="mut">{{'pay.'+m.id|t}}</small></span></label>}
  @if(method!=='apple'){<div class="field"><label>{{'co.card'|t}}</label><input name="cn" [(ngModel)]="card.num" placeholder="4242 4242 4242 4242" maxlength="19"></div>
   <div class="two"><div class="field"><label>{{'co.exp'|t}}</label><input name="ce" [(ngModel)]="card.exp" placeholder="MM/YY"></div><div class="field"><label>CVC</label><input name="cc" [(ngModel)]="card.cvc" placeholder="123" maxlength="4"></div></div>}
  @else{<p class="mut">{{'co.applehint'|t}}</p>}
  <div class="row gap"><button class="btn" (click)="step.set(1)">←</button><button class="btn btn-solid grow" [disabled]="method!=='apple'&&card.num.length<12" (click)="payNow()">{{'co.pay'|t}} {{total()|eur}}</button></div>
  <p class="mut center" style="margin-top:16px;font-size:13px">{{'co.secure'|t}}</p>}
</div>
<aside class="sum"><h3>{{'co.summary'|t}}</h3>
 @for(l of s.lines();track l.p.id){<div class="sumline"><span>{{l.p.name|loc}} × {{l.qty}}</span><span>{{l.p.price*l.qty|eur}}</span></div>}
 <div class="sumline"><span>{{'co.ship'|t}}</span><span>{{car().price|eur}}</span></div><div class="sumline tot"><span>{{'co.total'|t}}</span><span>{{total()|eur}}</span></div></aside></div>}</div>
<app-modal [open]="secure()" [title]="'co.3ds'|t" (closed)="secure.set(false)"><div class="success"><div class="spinner"></div><h4>{{'co.3dsText'|t}}</h4></div></app-modal>`})
export class Checkout{
 s=inject(Store);i=inject(I18n);carriers=CARRIERS;step=signal(1);secure=signal(false);carrierId='cr';method='apple';
 f={name:'',email:'',address:'',zip:'',city:''};card={num:'',exp:'',cvc:''};done={id:'',total:0};
 methods=[{id:'apple',n:'Apple Pay',i:'Pay'},{id:'mc',n:'Mastercard / Visa',i:'MC'},{id:'cb',n:'Carte Bancaire',i:'CB'}];
 car(){return CARRIERS.find(c=>c.id===this.carrierId)!}
 total(){return this.s.subtotal()+this.car().price}
 valid(){const f=this.f;return !!(f.name&&f.email.includes('@')&&f.address&&f.zip&&f.city)}
 payNow(){this.secure.set(true);setTimeout(()=>{this.secure.set(false);this.finish()},2200)}
 finish(){const n=this.s.orders().length;const id='AG-2026-'+String(134+n).padStart(4,'0');const d=new Date().toISOString().slice(0,10);
  const o:Order={id,customer:this.f.name,email:this.f.email,city:this.f.city,date:d,status:'paid',carrier:this.car().carrier,tracking:'6A'+String(4900000+n*211).padStart(9,'0')+'FR',total:this.total(),kind:'b2c',items:this.s.lines().map(l=>({productId:l.p.id,qty:l.qty})),events:[{date:d,code:'paid'}]};
  this.done={id,total:o.total};this.s.addOrder(o);this.s.clear();this.step.set(3);this.s.toast(this.i.t('toast.paid',{id}))}}
