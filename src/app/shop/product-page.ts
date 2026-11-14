import {Component,computed,inject,signal} from '@angular/core';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import {Store,Product,CARRIERS} from '../core/store';
import {EurPipe,ProductCardComponent,QuickViewComponent} from '../shared/shared';

@Component({selector:'app-product-page',standalone:true,imports:[RouterLink,EurPipe,ProductCardComponent,QuickViewComponent],template:`
@if(p(); as pr){<div class="container"><nav class="crumb"><a routerLink="/">Accueil</a> › <a routerLink="/catalogue">Catalogue</a> › {{pr.name}}</nav>
<div class="pd"><div class="gal"><div class="main"><img [src]="pr.image" [alt]="pr.name"></div><div class="thumbs">@for(i of [1,2,3];track i){<img [src]="pr.image" alt="">}</div></div>
<div><span class="tag">{{pr.category}}</span><h1 style="margin:10px 0">{{pr.name}}</h1><div class="rating">★ {{pr.rating}} <span class="mut">({{pr.reviews}} avis)</span></div>
 <div class="price" style="font-size:32px;margin:8px 0">{{pr.price|eur}}</div><p class="mut">{{pr.description}}</p>
 <p><b>Origine :</b> {{pr.origin}} · <b>Poids :</b> {{pr.weight}}</p><p class="stock" [class.low]="pr.stock<=10">{{pr.stock<=10?'Plus que '+pr.stock+' en stock':'En stock'}}</p>
 <div class="row gap" style="justify-content:flex-start;margin:18px 0"><div class="qty"><button (click)="n=n>1?n-1:1">−</button><span>{{n}}</span><button (click)="n=n+1">+</button></div>
  <button class="btn btn-primary" (click)="s.add(pr,n)">Ajouter au panier</button><button class="btn btn-yellow" (click)="buy(pr)">Acheter maintenant</button></div>
 <div class="card" style="padding:14px"><b>Livraison estimée</b><p class="mut" style="margin:4px 0 0">À partir de 4,50 € en point relais · 2 à 4 jours</p></div></div></div>
<div class="tabs">@for(t of tabs;track t){<button [class.on]="tab===t" (click)="tab=t">{{t}}</button>}</div>
@if(tab==='Description'){<p>{{pr.description}} Produit sélectionné auprès de producteurs camerounais partenaires, conditionné et expédié avec suivi.</p>}
@if(tab==='Avis'){@for(r of reviews;track r.n){<div class="card review"><b>{{r.n}}</b> <span class="rating">{{'★'.repeat(r.r)}}</span><p class="mut" style="margin:4px 0 0">{{r.t}}</p></div>}}
@if(tab==='Livraison'){@for(c of carriers;track c.id){<div class="card review row"><span>{{c.name}} <small class="mut">· {{c.delay}}</small></span><b>{{c.price|eur}}</b></div>}}
<div class="sec"><div class="sec-head"><h2>Vous aimerez aussi</h2></div><div class="grid-products">@for(x of rel();track x.id){<app-product-card [p]="x" (quick)="qv.set($event)"/>}</div></div></div><div class="buybar"><div><small class="mut">Prix</small><br><b>{{pr.price|eur}}</b></div><button class="btn btn-primary grow" (click)="s.add(pr,n)">Ajouter au panier</button></div>}
@else{<div class="container sec"><div class="card empty"><p>Chargement du produit…</p></div></div>}
<app-quick [product]="qv()" (closed)="qv.set(null)"/>`})
export class ProductPage{
 s=inject(Store);r=inject(Router);id=signal(0);n=1;tab='Description';tabs=['Description','Avis','Livraison'];carriers=CARRIERS;qv=signal<Product|null>(null);
 p=computed(()=>this.s.products().find(x=>x.id===this.id()));
 rel=computed(()=>this.s.products().filter(x=>x.id!==this.id()).sort((a,b)=>+(b.category===this.p()?.category)-+(a.category===this.p()?.category)).slice(0,4));
 reviews=[{n:'Aïcha M.',r:5,t:'Qualité exceptionnelle, ça sent vraiment le pays. Livraison rapide.'},{n:'Paul E.',r:4,t:'Très bon produit, emballage soigné. Je recommande.'},{n:'Marie F.',r:5,t:'Je recommande vivement, je recommanderai sans hésiter.'}];
 constructor(){inject(ActivatedRoute).params.subscribe(x=>{this.id.set(+x['id']);this.n=1;this.tab='Description'})}
 buy(p:Product){this.s.add(p,this.n);this.s.cartOpen.set(false);this.r.navigateByUrl('/commande')}}
