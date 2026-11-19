import {Component,HostListener,inject} from '@angular/core';
import {Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {EurPipe,LocPipe,MarkComponent,ModalComponent,TPipe} from '../shared/shared';
import {Store} from '../core/store';
import {I18n} from '../core/i18n';
const SV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
@Component({selector:'app-shop',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,FormsModule,ModalComponent,MarkComponent,EurPipe,TPipe,LocPipe],template:`
<header class="hdr" [class.over]="over()"><div class="hdr-in">
 <nav class="nav-l"><a routerLink="/boutique" routerLinkActive="on">{{'nav.shop'|t}}</a><a routerLink="/pro" routerLinkActive="on">{{'nav.pro'|t}}</a><a routerLink="/sav" routerLinkActive="on">{{'nav.sav'|t}}</a><a routerLink="/suivi" routerLinkActive="on">{{'nav.track'|t}}</a></nav>
 <a routerLink="/" class="brand"><app-mark [size]="34"/><span>AFROGOÛT</span></a>
 <div class="nav-r"><span class="lang"><button [class.on]="i.lang()==='fr'" (click)="i.set('fr')">FR</button><button [class.on]="i.lang()==='en'" (click)="i.set('en')">EN</button></span>
  <button class="lnk hide-m" (click)="s.accountOpen.set(true)">{{s.user()||('nav.account'|t)}}</button>
  <button class="lnk" (click)="s.cartOpen.set(true)">{{'nav.cart'|t}} ({{s.count()}})</button></div>
</div></header>
<main><router-outlet/></main>
<footer class="foot"><div class="wrap foot-in">
 <div><img src="assets/img/logo-light.png" alt="Afrogoût" class="foot-logo"><p>{{'foot.about'|t}}</p></div>
 <div><h4>{{'foot.shop'|t}}</h4><a routerLink="/boutique">{{'nav.shop'|t}}</a><a routerLink="/pro">{{'nav.pro'|t}}</a></div>
 <div><h4>{{'foot.help'|t}}</h4><a routerLink="/suivi">{{'nav.track'|t}}</a><a routerLink="/sav">{{'nav.sav'|t}}</a><a>{{'foot.legal'|t}}</a><a>{{'foot.privacy'|t}}</a></div>
 <div><h4>{{'foot.pay'|t}}</h4><a>Apple Pay · Mastercard · Visa · CB</a><a>Colissimo · Chronopost</a><a routerLink="/admin">{{'foot.admin'|t}} →</a></div>
</div><div class="wrap foot-end">© 2026 Afrogoût · {{'foot.poc'|t}}</div></footer>

<nav class="tabbar" [attr.aria-label]="'nav.main'|t">
<a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>{{'tab.home'|t}}</a>
<a routerLink="/boutique" routerLinkActive="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>{{'tab.shop'|t}}</a>
<a routerLink="/pro" routerLinkActive="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>{{'tab.pro'|t}}</a>
<button (click)="s.cartOpen.set(true)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>{{'tab.cart'|t}}@if(s.count()){<span class="dot">{{s.count()}}</span>}</button>
<button (click)="s.accountOpen.set(true)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>{{'tab.account'|t}}</button></nav>

<app-modal [open]="s.cartOpen()" [title]="'cart.title'|t" [drawer]="true" (closed)="s.cartOpen.set(false)">
@if(!s.lines().length){<div class="empty"><p>{{'cart.empty'|t}}</p><button class="btn btn-solid" (click)="go('/boutique')">{{'cart.discover'|t}}</button></div>}
@else{@for(l of s.lines();track l.p.id){<div class="line"><img [src]="l.p.image" [alt]="l.p.name|loc"><div class="grow"><b>{{l.p.name|loc}}</b><small class="mut">{{l.p.price|eur}}</small>
 <div class="qty"><button (click)="s.setQty(l.p.id,l.qty-1)">−</button><span>{{l.qty}}</span><button (click)="s.setQty(l.p.id,l.qty+1)">+</button></div></div>
 <div><b>{{l.p.price*l.qty|eur}}</b><button class="lnk" (click)="s.remove(l.p.id)">{{'common.remove'|t}}</button></div></div>}}
@if(s.lines().length){<div footer class="mfoot col"><div class="row"><span>{{'cart.subtotal'|t}}</span><b>{{s.subtotal()|eur}}</b></div><small class="mut">{{'cart.note'|t}}</small><button class="btn btn-solid full" (click)="go('/commande')">{{'cart.checkout'|t}}</button></div>}
</app-modal>

<app-modal [open]="s.accountOpen()" [title]="s.user()?s.user()!:(mode==='in'?('acc.login'|t):('acc.signup'|t))" (closed)="s.accountOpen.set(false)">
@if(s.user()){<div class="menu"><a (click)="go('/suivi')">{{'nav.track'|t}}</a><a (click)="go('/sav')">{{'nav.sav'|t}}</a><a (click)="go('/pro')">{{'nav.pro'|t}}</a><a (click)="go('/admin')">{{'foot.admin'|t}}</a><a (click)="logout()">{{'acc.logout'|t}}</a></div>}
@else{<form (ngSubmit)="login()">
 @if(mode==='up'){<div class="field"><label>{{'acc.name'|t}}</label><input name="n" [(ngModel)]="name" required></div>}
 <div class="field"><label>{{'acc.email'|t}}</label><input name="e" type="email" [(ngModel)]="email" required></div>
 <div class="field"><label>{{'acc.password'|t}}</label><input name="p" type="password" [(ngModel)]="pwd" required></div>
 <button class="btn btn-solid full">{{mode==='in'?('acc.login'|t):('acc.signup'|t)}}</button>
 <p class="mut center" style="margin-top:16px">{{mode==='in'?('acc.noaccount'|t):('acc.hasaccount'|t)}} <button type="button" class="lnk" (click)="mode=mode==='in'?'up':'in'">{{mode==='in'?('acc.signup'|t):('acc.login'|t)}}</button></p></form>}
</app-modal>`})
export class ShopLayout{s=inject(Store);i=inject(I18n);r=inject(Router);scrolled=false;mode:'in'|'up'='in';name='';email='';pwd='';
 @HostListener('window:scroll') onScroll(){this.scrolled=window.scrollY>40}
 over(){return this.r.url==='/'&&!this.scrolled}
 go(u:string){this.s.cartOpen.set(false);this.s.accountOpen.set(false);this.r.navigateByUrl(u)}
 login(){const n=this.name||(this.email?this.email.split('@')[0]:'Client');this.s.user.set(n);this.s.toast(this.i.t('toast.welcome',{n}))}
 logout(){this.s.user.set(null);this.s.accountOpen.set(false)}}
