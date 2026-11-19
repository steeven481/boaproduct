import {Component,computed,inject,signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CATS,Product,Store} from '../core/store';
import {I18n} from '../core/i18n';
import {ProductCardComponent,QuickViewComponent,TPipe} from '../shared/shared';

@Component({selector:'app-catalogue',standalone:true,imports:[FormsModule,ProductCardComponent,QuickViewComponent,TPipe],template:`
<section class="page-top wrap"><p class="eyebrow">{{'shop.eye'|t}}</p><h1>{{'nav.shop'|t}}</h1></section>
<div class="wrap"><div class="fbar"><div class="chips"><button [class.on]="!cat()" (click)="cat.set('')">{{'shop.all'|t}}</button>@for(c of cats;track c){<button [class.on]="cat()===c" (click)="cat.set(c)">{{'cat.'+c|t}}</button>}</div>
 <div class="fbar-r"><input class="fsearch" [ngModel]="q()" (ngModelChange)="q.set($event)" [placeholder]="'shop.search'|t">
 <select [ngModel]="sort()" (ngModelChange)="sort.set($event)"><option value="pop">{{'shop.sortPop'|t}}</option><option value="asc">{{'shop.sortAsc'|t}}</option><option value="desc">{{'shop.sortDesc'|t}}</option></select></div></div>
 @if(list().length){<div class="grid-p">@for(p of list();track p.id){<app-product-card [p]="p" (quick)="qv.set($event)"/>}</div>}
 @else{<div class="empty"><p>{{'shop.none'|t}}</p><button class="btn btn-solid" (click)="reset()">{{'shop.reset'|t}}</button></div>}</div>
<app-quick [product]="qv()" (closed)="qv.set(null)"/>`})
export class Catalogue{
 s=inject(Store);i=inject(I18n);cats=CATS;qv=signal<Product|null>(null);q=signal('');cat=signal('');sort=signal('pop');
 list=computed(()=>{const q=this.q().toLowerCase().trim();
  const l=this.s.products().filter(p=>(!q||(p.name.fr+p.name.en+p.origin).toLowerCase().includes(q))&&(!this.cat()||p.category===this.cat()));
  return l.sort((a,b)=>this.sort()==='asc'?a.price-b.price:this.sort()==='desc'?b.price-a.price:b.rating-a.rating)});
 constructor(){inject(ActivatedRoute).queryParams.subscribe(p=>{this.q.set(p['q']||'');this.cat.set(p['cat']||'')})}
 reset(){this.q.set('');this.cat.set('')}}
