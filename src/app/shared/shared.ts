import {Component,EventEmitter,Input,Output,Pipe,PipeTransform,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Product,Store} from '../core/store';

@Pipe({name:'eur',standalone:true})
export class EurPipe implements PipeTransform{transform(v:number|null|undefined){return (v??0).toFixed(2).replace('.',',')+' €'}}

@Component({selector:'app-modal',standalone:true,template:`
@if(open){<div class="backdrop" (click)="closed.emit()"><div class="modal" [class.drawer]="drawer" [class.wide]="wide" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
<header><h3>{{title}}</h3><button class="icon-btn" (click)="closed.emit()" aria-label="Fermer">✕</button></header>
<div class="modal-body"><ng-content/></div><ng-content select="[footer]"/></div></div>}`})
export class ModalComponent{@Input() open=false;@Input() title='';@Input() drawer=false;@Input() wide=false;@Output() closed=new EventEmitter<void>();}

@Component({selector:'app-toasts',standalone:true,template:`<div class="toasts">@for(t of s.toasts();track t.id){<div class="toast" [class.err]="t.err">{{t.msg}}</div>}</div>`})
export class ToastsComponent{s=inject(Store);}

@Component({selector:'app-product-card',standalone:true,imports:[RouterLink,EurPipe],template:`
<article class="card product"><a class="img" [routerLink]="['/produit',p.id]"><img [src]="p.image" [alt]="p.name">@if(p.badge){<span class="badge">{{p.badge}}</span>}</a>
<div class="info"><small>{{p.category}} · {{p.origin}}</small><h4>{{p.name}}</h4><div class="rating">★ {{p.rating}} <span class="mut">({{p.reviews}})</span></div>
<div class="row"><span class="price">{{p.price|eur}}</span><span class="stock" [class.low]="p.stock<=10">{{p.stock<=10?'Plus que '+p.stock:'En stock'}}</span></div>
<div class="row gap" style="margin-top:12px"><button class="btn btn-primary btn-sm grow" (click)="s.add(p)">Ajouter</button><button class="btn btn-ghost btn-sm" (click)="quick.emit(p)">Aperçu</button></div></div></article>`})
export class ProductCardComponent{@Input({required:true}) p!:Product;@Output() quick=new EventEmitter<Product>();s=inject(Store);}

@Component({selector:'app-quick',standalone:true,imports:[ModalComponent,RouterLink,EurPipe],template:`
<app-modal [open]="!!product" [title]="product?.name||''" (closed)="closed.emit()">
@if(product){<div class="qv"><img [src]="product.image" [alt]="product.name"><div><span class="tag">{{product.category}}</span><p class="mut" style="margin-top:10px">{{product.description}}</p>
<p><b>Origine :</b> {{product.origin}} · {{product.weight}}</p><div class="price" style="margin:6px 0 14px">{{product.price|eur}}</div>
<div class="row gap" style="justify-content:flex-start"><div class="qty"><button (click)="n=n>1?n-1:1">−</button><span>{{n}}</span><button (click)="n=n+1">+</button></div><button class="btn btn-primary" (click)="add()">Ajouter au panier</button></div>
<p style="margin-top:14px"><a class="link" [routerLink]="['/produit',product.id]" (click)="closed.emit()">Voir la fiche complète →</a></p></div></div>}
</app-modal>`})
export class QuickViewComponent{@Input() product:Product|null=null;@Output() closed=new EventEmitter<void>();n=1;s=inject(Store);
 add(){if(this.product){this.s.add(this.product,this.n);this.n=1;this.closed.emit()}}}
