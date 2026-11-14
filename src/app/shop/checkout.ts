import {Component,inject,signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Store,CARRIERS,Order} from '../core/store';
import {EurPipe,ModalComponent} from '../shared/shared';

@Component({selector:'app-checkout',standalone:true,imports:[FormsModule,RouterLink,EurPipe,ModalComponent],template:`
<div class="container sec"><h1 style="margin-bottom:20px">Commande</h1>
<div class="stepper"><div [class.on]="step()===1" [class.ok]="step()>1">1 · Livraison</div><div [class.on]="step()===2" [class.ok]="step()>2">2 · Paiement</div><div [class.on]="step()===3">3 · Confirmation</div></div>
@if(step()===3){<div class="card success" style="padding:40px;max-width:640px;margin:0 auto"><div class="ico">✓</div><h2>Merci pour votre commande !</h2>
 <p class="mut" style="margin:10px 0">Commande <b>{{done.id}}</b> · {{done.total|eur}}<br>Un email de confirmation vient d’être envoyé à {{f.email}}.</p>
 <div class="row gap" style="justify-content:center"><a class="btn btn-primary" routerLink="/suivi">Suivre ma commande</a><a class="btn btn-ghost" routerLink="/catalogue">Continuer mes achats</a></div></div>}
@else if(!s.lines().length){<div class="card empty"><div style="font-size:44px">🛒</div><p>Votre panier est vide.</p><a class="btn btn-primary" routerLink="/catalogue">Voir le catalogue</a></div>}
@else{<div class="co"><div class="card">
 @if(step()===1){<h3 style="margin-bottom:14px">Adresse de livraison</h3>
  <div class="field"><label>Nom complet</label><input name="nm" [(ngModel)]="f.name"></div><div class="field"><label>Email</label><input name="em" type="email" [(ngModel)]="f.email"></div>
  <div class="field"><label>Adresse</label><input name="ad" [(ngModel)]="f.address"></div><div class="two"><div class="field"><label>Code postal</label><input name="zp" [(ngModel)]="f.zip"></div><div class="field"><label>Ville</label><input name="ct" [(ngModel)]="f.city"></div></div>
  <h3 style="margin:14px 0">Mode de livraison</h3>
  @for(c of carriers;track c.id){<label class="opt" [class.on]="carrierId===c.id"><input type="radio" name="car" [value]="c.id" [(ngModel)]="carrierId"><span class="grow"><b>{{c.name}}</b><br><small class="mut">{{c.delay}}</small></span><b>{{c.price|eur}}</b></label>}
  <button class="btn btn-primary full" [disabled]="!valid()" (click)="step.set(2)">Continuer vers le paiement</button>}
 @if(step()===2){<h3 style="margin-bottom:14px">Moyen de paiement</h3>
  @for(m of methods;track m.id){<label class="opt" [class.on]="method===m.id"><input type="radio" name="pay" [value]="m.id" [(ngModel)]="method"><span class="pm">{{m.i}}</span><span class="grow"><b>{{m.n}}</b><br><small class="mut">{{m.d}}</small></span></label>}
  @if(method!=='apple'){<div class="field"><label>Numéro de carte</label><input name="cn" [(ngModel)]="card.num" placeholder="4242 4242 4242 4242" maxlength="19"></div>
   <div class="two"><div class="field"><label>Expiration</label><input name="ce" [(ngModel)]="card.exp" placeholder="MM/AA"></div><div class="field"><label>CVC</label><input name="cc" [(ngModel)]="card.cvc" placeholder="123" maxlength="4"></div></div>}
  @else{<p class="mut">Vous validerez le paiement avec Face ID ou Touch ID (simulation).</p>}
  <div class="row gap"><button class="btn btn-ghost" (click)="step.set(1)">← Retour</button><button class="btn btn-primary grow" [disabled]="method!=='apple'&&card.num.length<12" (click)="payNow()">Payer {{total()|eur}}</button></div>
  <p class="mut" style="text-align:center;margin:12px 0 0;font-size:13px">🔒 Paiement sécurisé 3-D Secure (simulation, aucune donnée envoyée)</p>}
</div>
<aside class="card sumcard"><h3 style="margin-bottom:10px">Récapitulatif</h3>
 @for(l of s.lines();track l.p.id){<div class="sumline"><span>{{l.p.name}} × {{l.qty}}</span><span>{{l.p.price*l.qty|eur}}</span></div>}
 <div class="sumline"><span>Livraison</span><span>{{car().price|eur}}</span></div><div class="sumline tot"><span>Total</span><span>{{total()|eur}}</span></div></aside></div>}</div>
<app-modal [open]="secure()" title="Authentification 3-D Secure" (closed)="secure.set(false)"><div class="success"><div class="spinner"></div><h4>Validation auprès de votre banque…</h4><p class="mut">Veuillez patienter, ne fermez pas cette fenêtre.</p></div></app-modal>`})
export class Checkout{
 s=inject(Store);carriers=CARRIERS;step=signal(1);secure=signal(false);carrierId='cr';method='apple';
 f={name:'',email:'',address:'',zip:'',city:''};card={num:'',exp:'',cvc:''};
 done={id:'',total:0};
 methods=[{id:'apple',n:'Apple Pay',i:'Pay',d:'Paiement en un geste'},{id:'mc',n:'Mastercard / Visa',i:'MC',d:'Carte de crédit ou de débit'},{id:'cb',n:'Carte Bancaire (CB)',i:'CB',d:'Réseau Cartes Bancaires'}];
 car(){return CARRIERS.find(c=>c.id===this.carrierId)!}
 total(){return this.s.subtotal()+this.car().price}
 valid(){const f=this.f;return !!(f.name&&f.email.includes('@')&&f.address&&f.zip&&f.city)}
 payNow(){this.secure.set(true);setTimeout(()=>{this.secure.set(false);this.finish()},2200)}
 finish(){const n=this.s.orders().length;const id='BP-2026-'+String(142+n-8).padStart(4,'0');const d=new Date().toISOString().slice(0,10);
  const o:Order={id,customer:this.f.name,email:this.f.email,city:this.f.city,date:d,status:'Payée',carrier:this.car().carrier,tracking:'6A'+String(4900000+n*211).padStart(9,'0')+'FR',total:this.total(),items:this.s.lines().map(l=>({productId:l.p.id,qty:l.qty})),events:[{date:d,label:'Paiement confirmé'}]};
  this.done={id,total:o.total};this.s.addOrder(o);this.s.clear();this.step.set(3);this.s.toast('Paiement accepté, commande '+id)}}
