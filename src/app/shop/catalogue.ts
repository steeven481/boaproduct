import {Component,computed,inject,signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Store,Product} from '../core/store';
import {ProductCardComponent,QuickViewComponent} from '../shared/shared';

@Component({selector:'app-catalogue',standalone:true,imports:[FormsModule,ProductCardComponent,QuickViewComponent],template:`
<div class="container sec"><div class="sec-head"><h1>Catalogue <small class="mut" style="font-size:15px">({{list().length}} produits)</small></h1><button class="btn btn-ghost fbtn" (click)="fo=!fo">Filtres</button></div>
<div class="cat-layout"><aside class="card filters" [class.open]="fo">
 <div class="field"><label>Recherche</label><input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Nom du produit"></div>
 <div class="field"><label>Type</label><div class="seg">@for(t of types;track t){<button [class.on]="type()===t" (click)="type.set(t)">{{t}}</button>}</div></div>
 <div class="field"><label>Catégorie</label><div class="chips2"><button [class.on]="!cat()" (click)="cat.set('')">Toutes</button>@for(c of cats();track c){<button [class.on]="cat()===c" (click)="cat.set(c)">{{c}}</button>}</div></div>
 <div class="field"><label>Prix maximum : {{max()}} €</label><input type="range" min="3" max="30" [ngModel]="max()" (ngModelChange)="max.set(+$event)"></div>
 <button class="btn btn-ghost full" (click)="reset()">Réinitialiser</button></aside>
<section><div class="toolbar"><select [ngModel]="sort()" (ngModelChange)="sort.set($event)"><option value="pop">Les mieux notés</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option></select></div>
 @if(list().length){<div class="grid-products">@for(p of list();track p.id){<app-product-card [p]="p" (quick)="qv.set($event)"/>}</div>}
 @else{<div class="card empty"><p>Aucun produit ne correspond à votre recherche.</p><button class="btn btn-primary" (click)="reset()">Voir tous les produits</button></div>}</section></div></div>
<app-quick [product]="qv()" (closed)="qv.set(null)"/>`})
export class Catalogue{
 s=inject(Store);fo=false;types=['Tous','alimentaire','non alimentaire'];qv=signal<Product|null>(null);
 q=signal('');type=signal('Tous');cat=signal('');max=signal(30);sort=signal('pop');
 cats=computed(()=>[...new Set(this.s.products().map(p=>p.category))]);
 list=computed(()=>{const q=this.q().toLowerCase().trim();
  const l=this.s.products().filter(p=>(!q||(p.name+p.category+p.origin).toLowerCase().includes(q))&&(this.type()==='Tous'||p.type===this.type())&&(!this.cat()||p.category===this.cat())&&p.price<=this.max());
  return l.sort((a,b)=>this.sort()==='asc'?a.price-b.price:this.sort()==='desc'?b.price-a.price:b.rating-a.rating)});
 constructor(){inject(ActivatedRoute).queryParams.subscribe(p=>{this.q.set(p['q']||'');this.cat.set(p['cat']||'')})}
 reset(){this.q.set('');this.type.set('Tous');this.cat.set('');this.max.set(30)}}
