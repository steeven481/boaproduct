import {Component,computed,inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {STATUSES,Store} from '../core/store';
import {EurPipe,LocPipe,TPipe} from '../shared/shared';

@Component({selector:'app-dashboard',standalone:true,imports:[RouterLink,DatePipe,EurPipe,TPipe,LocPipe],template:`
<div class="page-h"><div><p class="eyebrow">{{'adm.overview'|t}}</p><h1>{{'adm.dash'|t}}</h1></div><a class="btn btn-solid" routerLink="/admin/produits">+ {{'adm.newProduct'|t}}</a></div>
<div class="kpis"><div class="kpi"><small>{{'kpi.revenue'|t}}</small><b>{{ca()|eur}}</b><span class="up">▲ 12 %</span></div><div class="kpi"><small>{{'adm.orders'|t}}</small><b>{{s.orders().length}}</b><span class="up">▲ 8 %</span></div>
 <div class="kpi"><small>{{'kpi.toShip'|t}}</small><b>{{toShip()}}</b></div><div class="kpi"><small>{{'kpi.avg'|t}}</small><b>{{avg()|eur}}</b></div><div class="kpi"><small>{{'kpi.tickets'|t}}</small><b>{{openTickets()}}</b></div></div>
<div class="dash"><div class="panel"><h3>{{'dash.sales'|t}}</h3><div class="bars">@for(d of s.sales();track d.day){<div class="bar"><em>{{d.total}}</em><i [style.height.%]="d.total/max()*100"></i><small>{{d.day}}</small></div>}</div></div>
<div class="panel"><h3>{{'dash.byStatus'|t}}</h3>@for(st of statuses;track st){<div class="hbar"><span>{{'st.'+st|t}}</span><div class="meter"><i [style.width.%]="count(st)/s.orders().length*100"></i></div><b>{{count(st)}}</b></div>}</div></div>
<div class="dash"><div class="panel"><div class="row"><h3>{{'dash.recent'|t}}</h3><a class="lnk" routerLink="/admin/commandes">{{'common.seeAll'|t}} →</a></div>
 <div class="tscroll"><table class="tbl"><thead><tr><th>N°</th><th>{{'tbl.customer'|t}}</th><th>{{'tbl.date'|t}}</th><th>{{'tbl.status'|t}}</th><th class="r">Total</th></tr></thead><tbody>@for(o of recent();track o.id){<tr><td><b>{{o.id}}</b></td><td>{{o.customer}}</td><td>{{o.date|date:'dd/MM/yyyy'}}</td><td><span [class]="s.sc(o.status)">{{'st.'+o.status|t}}</span></td><td class="r">{{o.total|eur}}</td></tr>}</tbody></table></div></div>
<div class="panel"><h3>{{'dash.low'|t}}</h3>@for(p of low();track p.id){<div class="mini"><img [src]="p.image" [alt]="p.name|loc"><span class="grow">{{p.name|loc}}</span><b class="neg">{{p.stock}}</b></div>}@empty{<p class="mut">—</p>}</div></div>`})
export class Dashboard{s=inject(Store);statuses=STATUSES;
 ca=computed(()=>this.s.orders().reduce((a,o)=>a+o.total,0));
 toShip=computed(()=>this.s.orders().filter(o=>o.status==='paid'||o.status==='prepared').length);
 avg=computed(()=>this.s.orders().length?this.ca()/this.s.orders().length:0);
 openTickets=computed(()=>this.s.tickets().filter(t=>t.status!=='resolved').length);
 max=computed(()=>Math.max(1,...this.s.sales().map(x=>x.total)));
 recent=computed(()=>this.s.orders().slice(0,5));
 low=computed(()=>this.s.products().filter(p=>p.stock<=10));
 count(st:string){return this.s.orders().filter(o=>o.status===st).length}}
