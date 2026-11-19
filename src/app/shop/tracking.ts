import {Component,inject,signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Order,STATUSES,Store} from '../core/store';
import {EurPipe,TPipe} from '../shared/shared';

@Component({selector:'app-tracking',standalone:true,imports:[FormsModule,DatePipe,EurPipe,TPipe],template:`
<section class="page-top wrap"><p class="eyebrow">{{'nav.track'|t}}</p><h1>{{'trk.title'|t}}</h1><p class="mut">{{'trk.hint'|t}}</p></section>
<div class="wrap narrow"><div class="row gap srch"><input class="grow" [(ngModel)]="q" (keyup.enter)="find()" placeholder="AG-2026-0141"><button class="btn btn-solid" (click)="find()">{{'trk.find'|t}}</button></div>
@if(res()===null){<div class="empty"><p>{{'trk.none'|t}}</p></div>}
@if(res(); as o){<div class="panel"><div class="row"><div><h3>{{o.id}}</h3><small class="mut">{{o.date|date:'dd/MM/yyyy'}} · {{o.total|eur}}</small></div><span [class]="s.sc(o.status)">{{'st.'+o.status|t}}</span></div>
 <div class="tl">@for(st of steps;track st;let i=$index){<div class="tl-step" [class.done]="i<=idx(o)" [class.cur]="i===idx(o)"><i>{{mark(i,o)}}</i>{{'st.'+st|t}}</div>}</div>
 <div class="two"><div><h4>{{'trk.carrier'|t}}</h4><p>{{o.carrier}}<br><small class="mut">{{'trk.number'|t}} {{o.tracking}}</small></p><h4>{{'trk.dest'|t}}</h4><p>{{o.city}}</p></div>
 <div><h4>{{'trk.history'|t}}</h4><ul class="ev">@for(e of o.events;track e.code){<li>{{'ev.'+e.code|t}}<small>{{e.date|date:'dd/MM/yyyy'}}</small></li>}</ul></div></div></div>}</div>`})
export class Tracking{s=inject(Store);q='AG-2026-0141';res=signal<Order|null|undefined>(undefined);steps=STATUSES;
 mark(i:number,o:Order){return i<this.idx(o)?'✓':String(i+1)}
 idx(o:Order){return STATUSES.indexOf(o.status)}
 find(){this.res.set(this.s.orders().find(o=>o.id.toLowerCase()===this.q.trim().toLowerCase())??null)}}
