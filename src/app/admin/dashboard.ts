import {Component,computed,inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Store,STATUSES} from '../core/store';
import {EurPipe} from '../shared/shared';

@Component({selector:'app-dashboard',standalone:true,imports:[RouterLink,DatePipe,EurPipe],template:`
<div class="page-h"><div><h1>Tableau de bord</h1><span class="mut">Vue d’ensemble de la boutique · données de démonstration</span></div><a class="btn btn-primary" routerLink="/admin/produits">+ Nouveau produit</a></div>
<div class="kpis">
 <div class="card kpi"><small>Chiffre d’affaires</small><b>{{ca()|eur}}</b><span class="up">▲ 12 % cette semaine</span></div>
 <div class="card kpi"><small>Commandes</small><b>{{s.orders().length}}</b><span class="up">▲ 8 %</span></div>
 <div class="card kpi"><small>À expédier</small><b>{{toShip()}}</b><span class="mut">Payées ou préparées</span></div>
 <div class="card kpi"><small>Panier moyen</small><b>{{avg()|eur}}</b><span class="up">▲ 3 %</span></div></div>
<div class="dash"><div class="card panel"><h3>Ventes des 7 derniers jours</h3><div class="bars">@for(d of s.sales();track d.day){<div class="bar"><em>{{d.total}} €</em><i [style.height.%]="d.total/max()*100"></i><small>{{d.day}}</small></div>}</div></div>
<div class="card panel"><h3>Commandes par statut</h3>@for(st of statuses;track st){<div class="hbar"><span>{{st}}</span><div class="meter"><i [style.width.%]="count(st)/s.orders().length*100"></i></div><b>{{count(st)}}</b></div>}</div></div>
<div class="dash"><div class="card panel"><div class="row"><h3>Dernières commandes</h3><a class="link" routerLink="/admin/commandes">Tout voir →</a></div>
 <div class="tscroll"><table class="tbl"><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Statut</th><th>Total</th></tr></thead><tbody>@for(o of recent();track o.id){<tr><td><b>{{o.id}}</b></td><td>{{o.customer}}</td><td>{{o.date|date:'dd/MM/yyyy'}}</td><td><span [class]="s.sc(o.status)">{{o.status}}</span></td><td>{{o.total|eur}}</td></tr>}</tbody></table></div></div>
<div class="card panel"><h3>⚠ Stock bas</h3>@for(p of low();track p.id){<div class="mini"><img [src]="p.image" [alt]="p.name"><span class="grow">{{p.name}}</span><b style="color:var(--r)">{{p.stock}}</b></div>}@empty{<p class="mut">Aucun produit en alerte.</p>}</div></div>`})
export class Dashboard{s=inject(Store);statuses=STATUSES;
 ca=computed(()=>this.s.orders().reduce((a,o)=>a+o.total,0));
 toShip=computed(()=>this.s.orders().filter(o=>o.status==='Payée'||o.status==='Préparée').length);
 avg=computed(()=>this.s.orders().length?this.ca()/this.s.orders().length:0);
 max=computed(()=>Math.max(1,...this.s.sales().map(x=>x.total)));
 recent=computed(()=>this.s.orders().slice(0,5));
 low=computed(()=>this.s.products().filter(p=>p.stock<=10));
 count(st:string){return this.s.orders().filter(o=>o.status===st).length}}
