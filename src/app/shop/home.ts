import {Component,computed,inject,signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Store,Product} from '../core/store';
import {I18n} from '../core/i18n';
import {ProductCardComponent,QuickViewComponent,TPipe,VideoComponent} from '../shared/shared';

@Component({selector:'app-home',standalone:true,imports:[RouterLink,ProductCardComponent,QuickViewComponent,VideoComponent,TPipe],template:`
<section class="hero"><app-video slot="hero" a="#1f1510" b="#7a3a20"><div class="hero-in">
 <img class="hero-logo" src="assets/img/logo-light.png" alt="Afrogoût">
 <p class="eyebrow light">{{'home.eyebrow'|t}}</p><h1>{{'home.title'|t}}</h1>
 <div class="cta"><a class="btn btn-light" routerLink="/boutique">{{'home.cta'|t}}</a><a class="btn btn-ghost-l" routerLink="/admin">{{'nav.pro'|t}}</a></div></div></app-video></section>

<section class="sec wrap center narrow"><p class="eyebrow">{{'home.manifestoEye'|t}}</p><p class="manifesto">{{'home.manifesto'|t}}</p></section>

<section class="sec wrap"><div class="sec-head"><div><p class="eyebrow">{{'home.collEye'|t}}</p><h2>{{'home.collTitle'|t}}</h2></div></div>
 <div class="colls">@for(c of colls;track c.cat){<a class="coll" routerLink="/boutique" [queryParams]="{cat:c.cat}"><img [src]="img(c.id)" alt=""><span class="coll-t"><small>{{'home.collection'|t}}</small>{{'cat.'+c.cat|t}}</span></a>}</div></section>

<section class="split"><div class="split-v"><app-video slot="terroir" a="#3b2a12" b="#c49a3a"><span class="vlabel">{{'home.terroirLabel'|t}}</span></app-video></div>
 <div class="split-t"><p class="eyebrow">{{'home.terroirEye'|t}}</p><h2>{{'home.terroirTitle'|t}}</h2><p class="mut">{{'home.terroirText'|t}}</p><a class="btn btn-solid" routerLink="/boutique" [queryParams]="{cat:'drinks'}">{{'home.terroirCta'|t}}</a></div></section>

<section class="sec wrap"><div class="sec-head"><div><p class="eyebrow">{{'home.selEye'|t}}</p><h2>{{'home.selTitle'|t}}</h2></div><a class="lnk" routerLink="/boutique">{{'common.seeAll'|t}} →</a></div>
 <div class="grid-p">@for(p of best();track p.id){<app-product-card [p]="p" (quick)="qv.set($event)"/>}</div></section>

<section class="band"><app-video slot="artisanat" a="#2a1a10" b="#b5472b"><div class="band-in"><p class="eyebrow light">{{'home.craftEye'|t}}</p><h2>{{'home.craftTitle'|t}}</h2><a class="btn btn-light" routerLink="/boutique" [queryParams]="{cat:'craft'}">{{'home.craftCta'|t}}</a></div></app-video></section>

<section class="sec wrap"><div class="vals">@for(v of vals;track v){<div class="val"><span>{{v}}</span><h3>{{'val.'+v+'.t'|t}}</h3><p class="mut">{{'val.'+v+'.d'|t}}</p></div>}</div></section>

<section class="pro-teaser"><div class="wrap pro-in"><div><p class="eyebrow light">{{'pro.eyebrow'|t}}</p><h2>{{'home.proTitle'|t}}</h2><p>{{'home.proText'|t}}</p></div><a class="btn btn-light" routerLink="/pro">{{'home.proCta'|t}}</a></div></section>

<section class="sec wrap center narrow"><p class="eyebrow">{{'news.eye'|t}}</p><h2>{{'news.title'|t}}</h2>
 <div class="news"><input type="email" [placeholder]="'acc.email'|t"><button class="btn btn-solid" (click)="s.toast(i.t('news.ok'))">{{'news.cta'|t}}</button></div></section>
<app-quick [product]="qv()" (closed)="qv.set(null)"/>`})
export class Home{s=inject(Store);i=inject(I18n);qv=signal<Product|null>(null);vals=['1','2','3'];
 best=computed(()=>[...this.s.products()].sort((a,b)=>b.rating-a.rating).slice(0,4));
 colls=[{cat:'spices',id:1},{cat:'drinks',id:5},{cat:'craft',id:8},{cat:'beauty',id:9}];
 img(id:number){return this.s.products().find(p=>p.id===id)?.image||''}}
