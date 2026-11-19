import {Component,computed,inject,signal} from '@angular/core';
import {ActivatedRoute,Router,RouterLink} from '@angular/router';
import {CARRIERS,Product,Store} from '../core/store';
import {I18n} from '../core/i18n';
import {EurPipe,LocPipe,ProductCardComponent,QuickViewComponent,TPipe} from '../shared/shared';

@Component({selector:'app-product-page',standalone:true,imports:[RouterLink,EurPipe,TPipe,LocPipe,ProductCardComponent,QuickViewComponent],template:`
@if(p(); as pr){<div class="wrap"><nav class="crumb"><a routerLink="/">{{'tab.home'|t}}</a> / <a routerLink="/boutique">{{'nav.shop'|t}}</a> / {{pr.name|loc}}</nav>
<div class="pd"><div class="gal"><div class="gal-main"><img [src]="pr.image" [alt]="pr.name|loc"></div></div>
<div class="pd-info"><p class="eyebrow">{{'cat.'+pr.category|t}}</p><h1>{{pr.name|loc}}</h1><div class="price big">{{pr.price|eur}}</div>
 <p class="mut">{{pr.description|loc}}</p><p class="meta"><span>{{'prod.origin'|t}} {{pr.origin}}</span><span>{{pr.weight}}</span><span class="stock" [class.low]="pr.stock<=10">{{pr.stock<=10?('prod.low'|t:{n:pr.stock}):('prod.in'|t)}}</span></p>
 <div class="row gap" style="justify-content:flex-start;margin:28px 0"><div class="qty"><button (click)="n=n>1?n-1:1">−</button><span>{{n}}</span><button (click)="n=n+1">+</button></div>
  <button class="btn btn-solid grow" (click)="add(pr)">{{'common.add'|t}}</button></div>
 <button class="btn btn-full-line" (click)="buy(pr)">{{'prod.buy'|t}}</button>
 <details open><summary>{{'prod.ship'|t}}</summary>@for(c of carriers;track c.id){<div class="dl"><span>{{'car.'+c.id|t}} <small class="mut">· {{'car.'+c.id+'.d'|t}}</small></span><b>{{c.price|eur}}</b></div>}</details>
 <details><summary>{{'prod.care'|t}}</summary><p class="mut">{{'prod.careText'|t}}</p></details>
 <details><summary>{{'prod.issue'|t}}</summary><p class="mut">{{'prod.issueText'|t}}</p><a class="lnk" routerLink="/sav">{{'nav.sav'|t}} →</a></details></div></div>
<section class="sec"><div class="sec-head"><div><p class="eyebrow">{{'prod.alsoEye'|t}}</p><h2>{{'prod.also'|t}}</h2></div></div><div class="grid-p">@for(x of rel();track x.id){<app-product-card [p]="x" (quick)="qv.set($event)"/>}</div></section></div>}
@else{<div class="wrap sec"><div class="empty"><p>…</p></div></div>}
<app-quick [product]="qv()" (closed)="qv.set(null)"/>`})
export class ProductPage{
 s=inject(Store);i=inject(I18n);r=inject(Router);id=signal(0);n=1;carriers=CARRIERS;qv=signal<Product|null>(null);
 p=computed(()=>this.s.products().find(x=>x.id===this.id()));
 rel=computed(()=>this.s.products().filter(x=>x.id!==this.id()).sort((a,b)=>+(b.category===this.p()?.category)-+(a.category===this.p()?.category)).slice(0,4));
 constructor(){inject(ActivatedRoute).params.subscribe(x=>{this.id.set(+x['id']);this.n=1})}
 add(p:Product){this.s.add(p,this.n,this.i.t('toast.added',{n:this.i.loc(p.name)}))}
 buy(p:Product){this.s.add(p,this.n);this.r.navigateByUrl('/commande')}}
