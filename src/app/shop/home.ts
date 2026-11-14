import {Component,OnInit,computed,inject,signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Store,Product} from '../core/store';
import {ModalComponent,ProductCardComponent,QuickViewComponent} from '../shared/shared';

@Component({selector:'app-home',standalone:true,imports:[RouterLink,ModalComponent,ProductCardComponent,QuickViewComponent],template:`
<section class="hero"><div class="container hero-in"><div>
 <span class="tag">Du Cameroun à votre porte</span><h1>Les saveurs et l’artisanat du Cameroun, livrés chez vous</h1>
 <p>Épices, huiles, farines, cafés et créations artisanales, avec paiement sécurisé et suivi de commande en temps réel.</p>
 <div class="row gap" style="justify-content:flex-start;margin-top:22px"><a class="btn btn-yellow" routerLink="/catalogue">Découvrir le catalogue</a><a class="btn btn-light" routerLink="/suivi">Suivre ma commande</a></div>
 <ul class="chips"><li>✔ Paiement sécurisé</li><li>✔ Colissimo et Chronopost</li><li>✔ Suivi en temps réel</li></ul></div>
 <div class="hero-art">@for(p of s.products().slice(0,3);track p.id){<img [src]="p.image" [alt]="p.name">}</div></div></section>
<section class="sec container"><div class="sec-head"><h2>Parcourir par catégorie</h2></div>
 <div class="cats">@for(c of cats;track c.n){<a class="card cat" routerLink="/catalogue" [queryParams]="{cat:c.n}"><span>{{c.e}}</span>{{c.n}}</a>}</div></section>
<section class="sec container"><div class="sec-head"><h2>Nos produits préférés</h2><a class="btn btn-ghost btn-sm" routerLink="/catalogue">Tout voir →</a></div>
 <div class="grid-products">@for(p of best();track p.id){<app-product-card [p]="p" (quick)="qv.set($event)"/>}</div></section>
<section class="sec container"><div class="sec-head"><h2>Comment ça marche</h2></div>
 <div class="steps">@for(st of steps;track st.t;let i=$index){<div class="card step"><b>{{i+1}}</b><h4>{{st.t}}</h4><p class="mut">{{st.d}}</p></div>}</div></section>
<section class="sec container"><div class="sec-head"><h2>Paiement et livraison de confiance</h2></div>
 <div class="partners"><span>Apple Pay</span><span>Mastercard</span><span>Visa</span><span>Carte Bancaire</span><span>Colissimo</span><span>Chronopost</span></div></section>
<app-quick [product]="qv()" (closed)="qv.set(null)"/>
<app-modal [open]="promo()" title="Offre de bienvenue" (closed)="closePromo()"><div class="success"><div class="ico">%</div><h3>-10 % sur votre première commande</h3><p class="mut" style="margin:10px 0 18px">Utilisez le code <b>BIENVENUE</b> au moment du paiement.</p>
 <button class="btn btn-primary" (click)="s.toast('Code BIENVENUE copié');closePromo()">Copier le code</button></div></app-modal>`})
export class Home implements OnInit{
 s=inject(Store);qv=signal<Product|null>(null);promo=signal(false);
 best=computed(()=>[...this.s.products()].sort((a,b)=>b.rating-a.rating).slice(0,4));
 cats=[{n:'Épices',e:'🌶️'},{n:'Huiles',e:'🫒'},{n:'Farines',e:'🌾'},{n:'Snacks',e:'🥜'},{n:'Boissons',e:'☕'},{n:'Artisanat',e:'👜'},{n:'Cosmétiques',e:'🧴'}];
 steps=[{t:'Choisissez',d:'Parcourez le catalogue alimentaire et non alimentaire.'},{t:'Payez',d:'Apple Pay, Mastercard ou carte bancaire, avec 3-D Secure.'},{t:'Nous expédions',d:'Colissimo ou Chronopost, à domicile ou en point relais.'},{t:'Suivez',d:'Un statut et des alertes à chaque étape jusqu’à la livraison.'}];
 ngOnInit(){if(!sessionStorage.getItem('bp-promo'))setTimeout(()=>this.promo.set(true),2500)}
 closePromo(){sessionStorage.setItem('bp-promo','1');this.promo.set(false)}}
