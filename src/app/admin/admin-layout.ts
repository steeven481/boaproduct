import {Component,inject} from '@angular/core';
import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {MarkComponent,TPipe} from '../shared/shared';
import {Store} from '../core/store';
import {I18n} from '../core/i18n';
@Component({selector:'app-admin',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,MarkComponent,TPipe],template:`
<div class="adm"><aside class="side"><a class="brand dark" routerLink="/admin"><app-mark [size]="30"/><span>AFROGOÛT</span></a>
 <nav>@for(l of links;track l.to){<a [routerLink]="l.to" routerLinkActive="on" [routerLinkActiveOptions]="{exact:l.exact}">{{l.k|t}}</a>}<a routerLink="/admin/langues" routerLinkActive="on">{{'adm.langs'|t}}</a></nav>
 <a class="back" routerLink="/">← {{'adm.back'|t}}</a></aside>
<div class="adm-main"><header class="top"><a class="brand dark mlogo" routerLink="/admin"><app-mark [size]="28"/></a><span class="grow"></span>
 <span class="lang"><button [class.on]="i.lang()==='fr'" (click)="i.set('fr')">FR</button><button [class.on]="i.lang()==='en'" (click)="i.set('en')">EN</button></span>
 <a class="lnk mlangs" routerLink="/admin/langues">{{'adm.langs'|t}}</a><div class="avatar">AG</div></header>
<div class="adm-body"><router-outlet/></div></div></div>
<nav class="tabbar five" [attr.aria-label]="'nav.main'|t">
@for(l of links;track l.to){<a [routerLink]="l.to" routerLinkActive="on" [routerLinkActiveOptions]="{exact:l.exact}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" >@switch(l.i){@case('dash'){<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>}@case('ord'){<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>}@case('prd'){<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/>}@case('usr'){<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6"/>}@default{<path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12z"/>}}</svg>{{l.k+'.s'|t}}</a>}</nav>`})
export class AdminLayout{s=inject(Store);i=inject(I18n);
 links=[{to:'/admin',k:'adm.dash',exact:true,i:'dash'},{to:'/admin/commandes',k:'adm.orders',exact:false,i:'ord'},{to:'/admin/produits',k:'adm.products',exact:false,i:'prd'},{to:'/admin/utilisateurs',k:'adm.users',exact:false,i:'usr'},{to:'/admin/sav',k:'adm.sav',exact:false,i:'sav'}];}
