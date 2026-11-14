import {Component,inject,signal} from '@angular/core';
import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {Store} from '../core/store';

@Component({selector:'app-admin',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<div class="adm"><aside class="side" [class.show]="open()">
 <a class="logo light" routerLink="/admin"><span class="logo-m">B</span>BoaProduct</a>
 <nav>@for(l of links;track l.to){<a [routerLink]="l.to" routerLinkActive="on" [routerLinkActiveOptions]="{exact:l.exact}" (click)="open.set(false)">{{l.t}}</a>}</nav>
 <a class="back" routerLink="/">← Retour au site</a></aside>
<div><header class="top"><a class="logo mlogo" routerLink="/admin"><span class="logo-m">B</span></a><button class="icon-btn burger" (click)="open.set(!open())" aria-label="Menu">☰</button>
 <div class="search"><input placeholder="Rechercher une commande, un produit…"></div><span class="grow"></span>
 <button class="icon-btn" (click)="s.toast('3 nouvelles notifications')" aria-label="Notifications"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg></button><div class="avatar">AD</div></header>
<div class="adm-body"><router-outlet/></div></div></div>
<nav class="tabbar four" aria-label="Navigation admin">
<a routerLink="/admin" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Tableau</a>
<a routerLink="/admin/commandes" routerLinkActive="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>Commandes</a>
<a routerLink="/admin/produits" routerLinkActive="on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>Produits</a>
<a routerLink="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>Site</a></nav>`})
export class AdminLayout{s=inject(Store);open=signal(false);
 links=[{to:'/admin',t:'Tableau de bord',i:'📊',exact:true},{to:'/admin/commandes',t:'Commandes',i:'📦',exact:false},{to:'/admin/produits',t:'Produits',i:'🛍️',exact:false}];}
