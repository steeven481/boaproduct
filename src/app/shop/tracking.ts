import {Component,inject,signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Store,Order,STATUSES} from '../core/store';
import {EurPipe} from '../shared/shared';

@Component({selector:'app-tracking',standalone:true,imports:[FormsModule,DatePipe,EurPipe],template:`
    <div class="container sec" style="max-width:820px"><h1>Suivre ma commande</h1><p class="mut">Saisissez votre numéro de commande. Essayez <b>BP-2026-0141</b> (démonstration).</p>
      <div class="card" style="padding:18px;margin:18px 0"><div class="row gap"><input class="grow" style="border:1px solid var(--bd);border-radius:10px;padding:11px 12px;font:inherit" [(ngModel)]="q" (keyup.enter)="find()" placeholder="BP-2026-0141"><button class="btn btn-primary" (click)="find()">Rechercher</button></div></div>
      @if(res()===null){<div class="card empty"><p>Aucune commande trouvée avec ce numéro.</p></div>}
      @if(res(); as o){<div class="card" style="padding:24px"><div class="row" style="flex-wrap:wrap;gap:8px"><div><h3>Commande {{o.id}}</h3><small class="mut">Passée le {{o.date|date:'dd/MM/yyyy'}} · {{o.total|eur}}</small></div><span [class]="s.sc(o.status)">{{o.status}}</span></div>
        <div class="tl" style="margin-top:26px">@for(st of steps;track st;let i=$index){<div class="tl-step" [class.done]="i<=idx(o)" [class.cur]="i===idx(o)"><i>{{mark(i,o)}}</i>{{st}}</div>}</div>
        <div class="two"><div><h4>Transporteur</h4><p>{{o.carrier}}<br><small class="mut">N° de suivi : {{o.tracking}}</small></p><h4>Destination</h4><p>{{o.city}}</p></div>
          <div><h4 style="margin-bottom:8px">Historique</h4><ul class="ev">@for(e of o.events;track e.label){<li>{{e.label}}<small>{{e.date|date:'dd/MM/yyyy'}}</small></li>}</ul></div></div></div>}</div>`})
export class Tracking{s=inject(Store);q='BP-2026-0141';res=signal<Order|null|undefined>(undefined);steps=STATUSES;
  mark(i:number,o:Order){return i<this.idx(o)?'✓':String(i+1)}
  idx(o:Order){return STATUSES.indexOf(o.status)}
  find(){this.res.set(this.s.orders().find(o=>o.id.toLowerCase()===this.q.trim().toLowerCase())??null)}}
