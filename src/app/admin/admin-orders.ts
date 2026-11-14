import {Component,computed,inject,signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Store,Order,STATUSES} from '../core/store';
import {EurPipe,ModalComponent} from '../shared/shared';

@Component({selector:'app-admin-orders',standalone:true,imports:[FormsModule,DatePipe,EurPipe,ModalComponent],template:`
<div class="page-h"><div><h1>Commandes</h1><span class="mut">{{list().length}} commande(s)</span></div></div>
<div class="card panel"><div class="filters-row"><div class="chips2"><button [class.on]="f()===''" (click)="f.set('')">Toutes ({{s.orders().length}})</button>@for(st of statuses;track st){<button [class.on]="f()===st" (click)="f.set(st)">{{st}} ({{count(st)}})</button>}</div>
 <div class="search"><input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="N° ou client"></div></div>
<div class="tscroll" style="margin-top:14px"><table class="tbl"><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Transporteur</th><th>Statut</th><th>Total</th><th></th></tr></thead><tbody>
@for(o of list();track o.id){<tr><td><b>{{o.id}}</b></td><td>{{o.customer}}<br><small class="mut">{{o.city}}</small></td><td>{{o.date|date:'dd/MM/yyyy'}}</td><td>{{o.carrier}}</td><td><span [class]="s.sc(o.status)">{{o.status}}</span></td><td><b>{{o.total|eur}}</b></td><td><button class="btn btn-ghost btn-sm" (click)="sel.set(o.id)">Détails</button></td></tr>}
@empty{<tr><td colspan="7" class="empty">Aucune commande.</td></tr>}</tbody></table></div></div>

<app-modal [open]="!!cur()" [title]="'Commande '+(cur()?.id||'')" [wide]="true" (closed)="sel.set('')">
@if(cur(); as o){<div class="tl">@for(st of statuses;track st;let i=$index){<div class="tl-step" [class.done]="i<=idx(o)" [class.cur]="i===idx(o)"><i>{{mark(i,o)}}</i>{{st}}</div>}</div>
<div class="od"><div><h4>Client</h4><p>{{o.customer}}<br>{{o.email}}<br>{{o.city}}</p><h4>Livraison</h4><p>{{o.carrier}}<br><small class="mut">Suivi : {{o.tracking}}</small></p>
 <h4>Articles</h4>@for(i of o.items;track i.productId){<div class="mini"><img [src]="prod(i.productId)?.image" alt=""><span>{{prod(i.productId)?.name}} × {{i.qty}}</span></div>}<p style="margin-top:10px"><b>Total : {{o.total|eur}}</b></p></div>
<div><h4 style="margin-bottom:8px">Historique</h4><ul class="ev">@for(e of o.events;track $index){<li>{{e.label}}<small>{{e.date|date:'dd/MM/yyyy'}}</small></li>}</ul></div></div>}
<div footer class="mfoot"><button class="btn btn-ghost" (click)="label.set(true)">Étiquette transporteur</button><button class="btn btn-primary" [disabled]="cur()?.status==='Livrée'" (click)="advance()">{{cur()?.status==='Livrée'?'Commande livrée':'Passer au statut suivant →'}}</button></div></app-modal>

<app-modal [open]="label()" title="Étiquette d’expédition" (closed)="label.set(false)">
@if(cur(); as o){<div style="border:2px dashed var(--gd);border-radius:12px;padding:18px"><b style="font-size:18px">{{o.carrier}}</b><p class="mut" style="margin:2px 0">Destinataire : {{o.customer}}, {{o.city}}</p><div class="barcode"></div><div style="text-align:center;letter-spacing:2px"><b>{{o.tracking}}</b></div></div>}
<div footer class="mfoot"><button class="btn btn-ghost" (click)="label.set(false)">Fermer</button><button class="btn btn-primary" (click)="label.set(false);s.toast('Étiquette envoyée à l’impression')">Imprimer</button></div></app-modal>`})
export class AdminOrders{
 s=inject(Store);statuses=STATUSES;f=signal('');q=signal('');sel=signal('');label=signal(false);
 list=computed(()=>{const q=this.q().toLowerCase();return this.s.orders().filter(o=>(!this.f()||o.status===this.f())&&(!q||(o.id+o.customer).toLowerCase().includes(q)))});
 cur=computed(()=>this.s.orders().find(o=>o.id===this.sel()));
 count(st:string){return this.s.orders().filter(o=>o.status===st).length}
 mark(i:number,o:Order){return i<this.idx(o)?'✓':String(i+1)}
 idx(o:Order){return STATUSES.indexOf(o.status)}
 prod(id:number){return this.s.products().find(p=>p.id===id)}
 advance(){const o=this.cur();if(!o)return;const i=this.idx(o);if(i>=4)return;
  const lb=['','Colis préparé','Pris en charge par '+o.carrier,'En cours de livraison','Livré au client'][i+1];
  this.s.updateOrder(o.id,{status:STATUSES[i+1],events:[{date:new Date().toISOString().slice(0,10),label:lb},...o.events]});
  this.s.toast('Commande '+o.id+' : '+STATUSES[i+1]+' (email envoyé au client)')}}
