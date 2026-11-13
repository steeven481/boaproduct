import {Component,inject,signal} from '@angular/core';
import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {Store} from '../core/store';

@Component({selector:'app-admin',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<div class="adm"><aside class="side" [class.show]="open()">
 <a class="logo light" routerLink="/admin"><span class="logo-m">B</span>BoaProduct</a>
 <nav>@for(l of links;track l.to){<a [routerLink]="l.to" routerLinkActive="on" [routerLinkActiveOptions]="{exact:l.exact}" (click)="open.set(false)"><span>{{l.i}}</span>{{l.t}}</a>}</nav>
 <a class="back" routerLink="/">← Retour au site</a></aside>
<div><header class="top"><button class="icon-btn burger" (click)="open.set(!open())" aria-label="Menu">☰</button>
 <div class="search"><input placeholder="Rechercher une commande, un produit…"></div><span class="grow"></span>
 <button class="icon-btn" (click)="s.toast('3 nouvelles notifications')" aria-label="Notifications">🔔</button><div class="avatar">AD</div></header>
<div class="adm-body"><router-outlet/></div></div></div>`})
export class AdminLayout{s=inject(Store);open=signal(false);
 links=[{to:'/admin',t:'Tableau de bord',i:'📊',exact:true},{to:'/admin/commandes',t:'Commandes',i:'📦',exact:false},{to:'/admin/produits',t:'Produits',i:'🛍️',exact:false}];}
