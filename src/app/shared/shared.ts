import {Component,ElementRef,EventEmitter,Input,OnDestroy,Output,Pipe,PipeTransform,ViewChild,inject,signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Product,Store} from '../core/store';
import {I18n} from '../core/i18n';

@Pipe({name:'eur',standalone:true})
export class EurPipe implements PipeTransform{transform(v:number|null|undefined){return (v??0).toFixed(2).replace('.',',')+' €'}}
@Pipe({name:'t',standalone:true,pure:false})
export class TPipe implements PipeTransform{i=inject(I18n);transform(k:string,p?:Record<string,string|number>){return this.i.t(k,p)}}
@Pipe({name:'loc',standalone:true,pure:false})
export class LocPipe implements PipeTransform{i=inject(I18n);transform(o:{fr:string;en:string}|undefined){return this.i.loc(o)}}

@Component({selector:'app-mark',standalone:true,template:`<svg viewBox="0 0 76 96" [attr.width]="size*0.79" [attr.height]="size" aria-hidden="true"><path fill="#B5472B" d="M32 3C28 3 27 7 28 11 29 15 22 18 21 26 20 31 23 34 20 38 14 44 11 52 11 62 11 78 20 90 32 90 44 90 53 78 53 62 53 52 50 44 44 38 41 34 44 31 43 26 42 18 35 15 36 11 37 7 36 3 32 3Z"/><path fill="none" stroke="#E8891D" stroke-width="5" d="M13 56 20 49 27 56 34 49 41 56 48 49 52 54"/><path fill="none" stroke="#D9A21B" stroke-width="3" stroke-linecap="round" d="M66 20V70M60 6V20M66 6V20M72 6V20M60 20H72"/><ellipse cx="66" cy="80" rx="6" ry="9" fill="#D9A21B"/></svg>`})
export class MarkComponent{@Input() size=40;}

@Component({selector:'app-modal',standalone:true,imports:[TPipe],template:`
@if(open){<div class="backdrop" (click)="closed.emit()"><div class="modal" [class.drawer]="drawer" [class.wide]="wide" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
<header><h3>{{title}}</h3><button class="x" (click)="closed.emit()" [attr.aria-label]="'common.close'|t">✕</button></header>
<div class="modal-body"><ng-content/></div><ng-content select="[footer]"/></div></div>}`})
export class ModalComponent{@Input() open=false;@Input() title='';@Input() drawer=false;@Input() wide=false;@Output() closed=new EventEmitter<void>();}

@Component({selector:'app-toasts',standalone:true,template:`<div class="toasts">@for(t of s.toasts();track t.id){<div class="toast" [class.err]="t.err">{{t.msg}}</div>}</div>`})
export class ToastsComponent{s=inject(Store);}

@Component({selector:'app-video',standalone:true,template:`<div class="vid"><div class="vfall" [style.--a]="a" [style.--b]="b"></div>@if(src&&!fail()){<video #v [src]="src" [muted]="true" loop playsinline disablepictureinpicture preload="metadata" (loadeddata)="tryPlay()" (canplay)="tryPlay()" (error)="onErr(v)"></video>}<div class="vshade"></div><div class="vcap"><ng-content/></div>@if(blocked()&&src&&!fail()){<button class="vplay" (click)="manual()" aria-label="Lecture / Play">▶</button>}</div>`})
export class VideoComponent implements OnDestroy{
 @Input() slot='';@Input() a='#3a2216';@Input() b='#b5472b';s=inject(Store);fail=signal(false);blocked=signal(false);
 private vid?:HTMLVideoElement;private io?:IntersectionObserver;private vis=false;private evs=['pointerdown','keydown','touchstart','wheel','scroll'];
 private retry=()=>this.tryPlay();
 get src(){return this.s.media()[this.slot]?.src||''}
 @ViewChild('v') set ref(el:ElementRef<HTMLVideoElement>|undefined){
  if(!el||el.nativeElement===this.vid)return;const v=this.vid=el.nativeElement;
  v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');
  this.io?.disconnect();this.io=new IntersectionObserver(es=>es.forEach(e=>{this.vis=e.isIntersecting;if(this.vis)this.tryPlay();else v.pause()}),{threshold:.2});this.io.observe(v);
  this.evs.forEach(e=>window.addEventListener(e,this.retry,{passive:true}));}
 private reduced(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches}
 tryPlay(){const v=this.vid;if(!v||!this.vis)return;if(this.reduced()){this.blocked.set(true);return}v.muted=true;
  const p=v.play();if(p)p.then(()=>{this.blocked.set(false);this.evs.forEach(e=>window.removeEventListener(e,this.retry))}).catch(()=>this.blocked.set(true))}
 manual(){const v=this.vid;if(!v)return;v.muted=true;v.play().then(()=>this.blocked.set(false)).catch(()=>{})}
 onErr(v:HTMLVideoElement){console.warn('[Afrogoût] Vidéo non lue : '+this.src+' (code '+v.error?.code+'). 4 = fichier introuvable ou codec non supporté (HEVC/H.265) ; 3 = fichier corrompu ; 2 = réseau.');this.fail.set(true)}
 ngOnDestroy(){this.io?.disconnect();this.evs.forEach(e=>window.removeEventListener(e,this.retry))}}

@Component({selector:'app-product-card',standalone:true,imports:[RouterLink,EurPipe,TPipe,LocPipe],template:`
<article class="pc"><a class="pc-img" [routerLink]="['/produit',p.id]"><img [src]="p.image" [alt]="p.name|loc" loading="lazy">
 @if(p.tag){<span class="pc-tag">{{'tag.'+p.tag|t}}</span>}
 <button class="pc-add" (click)="add($event)">{{'common.add'|t}}</button></a>
<div class="pc-info"><small>{{'cat.'+p.category|t}}</small><h4><a [routerLink]="['/produit',p.id]">{{p.name|loc}}</a></h4>
<div class="pc-row"><span>{{p.price|eur}}</span><button class="lnk" (click)="quick.emit(p)">{{'common.preview'|t}}</button></div></div></article>`})
export class ProductCardComponent{@Input({required:true}) p!:Product;@Output() quick=new EventEmitter<Product>();s=inject(Store);i=inject(I18n);
 add(e:Event){e.preventDefault();this.s.add(this.p,1,this.i.t('toast.added',{n:this.i.loc(this.p.name)}))}}

@Component({selector:'app-quick',standalone:true,imports:[ModalComponent,RouterLink,EurPipe,TPipe,LocPipe],template:`
<app-modal [open]="!!product" [title]="(product?.name|loc)||''" [wide]="true" (closed)="closed.emit()">
@if(product){<div class="qv"><img [src]="product.image" [alt]="product.name|loc"><div><small class="eyebrow">{{'cat.'+product.category|t}}</small>
<p class="mut" style="margin:14px 0">{{product.description|loc}}</p><p class="mut"><b>{{'prod.origin'|t}}</b> {{product.origin}} · {{product.weight}}</p>
<div class="price">{{product.price|eur}}</div>
<div class="row gap" style="justify-content:flex-start;margin:18px 0"><div class="qty"><button (click)="n=n>1?n-1:1">−</button><span>{{n}}</span><button (click)="n=n+1">+</button></div><button class="btn btn-solid" (click)="add()">{{'common.add'|t}}</button></div>
<a class="lnk" [routerLink]="['/produit',product.id]" (click)="closed.emit()">{{'common.seeFull'|t}} →</a></div></div>}
</app-modal>`})
export class QuickViewComponent{@Input() product:Product|null=null;@Output() closed=new EventEmitter<void>();n=1;s=inject(Store);i=inject(I18n);
 add(){if(this.product){this.s.add(this.product,this.n,this.i.t('toast.added',{n:this.i.loc(this.product.name)}));this.n=1;this.closed.emit()}}}
