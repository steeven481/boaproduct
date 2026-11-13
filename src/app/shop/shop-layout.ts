import {Component,inject} from '@angular/core';
import {Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ModalComponent,EurPipe} from '../shared/shared';
import {Store} from '../core/store';

@Component({selector:'app-shop',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,FormsModule,ModalComponent,EurPipe],template:`
<header class="hdr"><div class="container hdr-in">
 <button class="icon-btn burger" (click)="menu=!menu" aria-label="Menu">☰</button>
 <a routerLink="/" class="logo"><span class="logo-m">B</span>BoaProduct</a>
 <form class="search" (ngSubmit)="search()"><input name="q" [(ngModel)]="q" placeholder="Rechercher : poivre de Penja, plantain, karité…"><button class="btn btn-primary btn-sm">Chercher</button></form>
 <nav class="nav" [class.open]="menu" (click)="menu=false"><a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}">Accueil</a><a routerLink="/catalogue" routerLinkActive="on">Catalogue</a><a routerLink="/suivi" routerLinkActive="on">Suivi de commande</a></nav>
 <span class="grow"></span>
 <button class="btn btn-ghost btn-sm" (click)="s.loginOpen.set(true)">{{s.user()?'👤 '+s.user():'Connexion'}}</button>
 <button class="btn btn-yellow btn-sm" (click)="s.cartOpen.set(true)">🛒 Panier <span class="count">{{s.count()}}</span></button>
</div></header>
<main><router-outlet/></main>
<footer class="foot"><div class="container foot-in">
 <div><div class="logo light"><span class="logo-m">B</span>BoaProduct</div><p style="margin-top:12px">Les saveurs et l’artisanat du Cameroun, livrés en Europe avec suivi de commande.</p></div>
 <div><h4>Boutique</h4><a routerLink="/catalogue">Catalogue</a><a routerLink="/suivi">Suivre ma commande</a></div>
 <div><h4>Aide</h4><a>Livraison</a><a>Retours</a><a>Contact</a></div>
 <div><h4>Paiement et livraison</h4><a>Apple Pay · Mastercard · CB</a><a>Colissimo · Chronopost</a><a routerLink="/admin">Espace admin →</a></div>
 <small class="container">© 2026 BoaProduct · Maquette de démonstration (POC)</small></div></footer>

<app-modal [open]="s.cartOpen()" title="Votre panier" [drawer]="true" (closed)="s.cartOpen.set(false)">
@if(!s.lines().length){<div class="empty"><div style="font-size:48px">🛒</div><p>Votre panier est vide</p><button class="btn btn-primary" (click)="go('/catalogue')">Découvrir les produits</button></div>}
@else{@for(l of s.lines();track l.p.id){<div class="line"><img [src]="l.p.image" [alt]="l.p.name"><div class="grow"><b>{{l.p.name}}</b><br><small class="mut">{{l.p.price|eur}}</small>
 <div class="qty"><button (click)="s.setQty(l.p.id,l.qty-1)">−</button><span>{{l.qty}}</span><button (click)="s.setQty(l.p.id,l.qty+1)">+</button></div></div>
 <div><b>{{l.p.price*l.qty|eur}}</b><button class="link" (click)="s.remove(l.p.id)">Retirer</button></div></div>}}
@if(s.lines().length){<div footer class="mfoot" style="display:grid"><div class="row"><span>Sous-total</span><b>{{s.subtotal()|eur}}</b></div><small class="mut">Frais de livraison calculés à l’étape suivante</small><button class="btn btn-primary full" (click)="go('/commande')">Commander</button></div>}
</app-modal>

<app-modal [open]="s.loginOpen()" [title]="mode==='in'?'Connexion':'Créer un compte'" (closed)="s.loginOpen.set(false)">
<form (ngSubmit)="login()">
 @if(mode==='up'){<div class="field"><label>Nom complet</label><input name="n" [(ngModel)]="name" required></div>}
 <div class="field"><label>Email</label><input name="e" type="email" [(ngModel)]="email" required placeholder="vous@exemple.fr"></div>
 <div class="field"><label>Mot de passe</label><input name="p" type="password" [(ngModel)]="pwd" required></div>
 <button class="btn btn-primary full">{{mode==='in'?'Se connecter':'Créer mon compte'}}</button>
 <button type="button" class="btn btn-ghost full" style="margin-top:10px" (click)="login()">Continuer avec Google</button>
 <p style="text-align:center;margin-top:14px" class="mut">{{mode==='in'?'Pas encore de compte ?':'Déjà inscrit ?'}} <button type="button" class="link" (click)="mode=mode==='in'?'up':'in'">{{mode==='in'?'Créer un compte':'Se connecter'}}</button></p>
</form></app-modal>`})
export class ShopLayout{s=inject(Store);r=inject(Router);menu=false;q='';mode:'in'|'up'='in';name='';email='';pwd='';
 search(){this.r.navigate(['/catalogue'],{queryParams:{q:this.q||null}})}
 go(u:string){this.s.cartOpen.set(false);this.r.navigateByUrl(u)}
 login(){const n=this.name||(this.email?this.email.split('@')[0]:'Client');this.s.user.set(n);this.s.loginOpen.set(false);this.s.toast('Bienvenue '+n+' !')}}
