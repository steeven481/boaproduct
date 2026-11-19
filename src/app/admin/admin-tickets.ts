import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Store} from '../core/store';
import {I18n} from '../core/i18n';
import {LocPipe,ModalComponent,TPipe} from '../shared/shared';

@Component({selector:'app-admin-tickets',standalone:true,imports:[FormsModule,DatePipe,TPipe,LocPipe,ModalComponent],template:`
<div class="page-h"><div><p class="eyebrow">{{s.tickets().length}}</p><h1>{{'adm.sav'|t}}</h1></div></div>
<div class="panel"><div class="tscroll"><table class="tbl"><thead><tr><th>N°</th><th>{{'tbl.customer'|t}}</th><th>{{'pro.product'|t}}</th><th>{{'sav.reason'|t}}</th><th>{{'tbl.date'|t}}</th><th>{{'tbl.status'|t}}</th><th></th></tr></thead><tbody>
@for(t of s.tickets();track t.id){<tr><td><b>{{t.id}}</b></td><td>{{t.customer}}</td><td>{{pname(t.productId)}}</td><td>{{'reason.'+t.reason|t}}</td><td>{{t.date|date:'dd/MM/yyyy'}}</td><td><span [class]="'st st-'+t.status">{{'tk.'+t.status|t}}</span></td><td class="r"><button class="btn btn-sm" (click)="open(t.id)">{{'common.details'|t}}</button></td></tr>}</tbody></table></div></div>
<app-modal [open]="!!cur()" [title]="cur()?.id||''" [wide]="true" (closed)="sel.set('')">
@if(cur(); as t){<div class="two"><div><h4>{{'tbl.customer'|t}}</h4><p>{{t.customer}} · {{t.orderId}}</p><h4>{{'pro.product'|t}}</h4><p>{{pname(t.productId)}}</p><h4>{{'sav.reason'|t}}</h4><p>{{'reason.'+t.reason|t}}</p><h4>{{'sav.message'|t}}</h4><p class="mut">{{t.message}}</p></div>
<div><div class="field"><label>{{'tk.decision'|t}}</label><select [ngModel]="decision()" (ngModelChange)="decision.set($event)"><option value="refund">{{'dec.refund'|t}}</option><option value="replace">{{'dec.replace'|t}}</option><option value="recommend">{{'dec.recommend'|t}}</option><option value="reject">{{'dec.reject'|t}}</option></select></div>
@if(decision()==='recommend'){<div class="field"><label>{{'tk.recoProduct'|t}}</label><select [ngModel]="reco()" (ngModelChange)="reco.set(+$event)">@for(p of s.products();track p.id){<option [value]="p.id">{{p.name|loc}}</option>}</select></div>}
<div class="field"><label>{{'tk.reply'|t}}</label><textarea rows="3" [ngModel]="reply()" (ngModelChange)="reply.set($event)"></textarea></div></div></div>}
<div footer class="mfoot"><button class="btn" (click)="sel.set('')">{{'common.cancel'|t}}</button><button class="btn btn-solid" (click)="send()">{{'tk.send'|t}}</button></div></app-modal>`})
export class AdminTickets{
 s=inject(Store);i=inject(I18n);sel=signal('');decision=signal('recommend');reco=signal(5);reply=signal('');
 cur=computed(()=>this.s.tickets().find(t=>t.id===this.sel()));
 pname(id:number){return this.i.loc(this.s.products().find(p=>p.id===id)?.name)}
 open(id:string){const t=this.s.tickets().find(x=>x.id===id);this.decision.set(t?.decision||'recommend');this.reco.set(t?.recommendedId||5);this.reply.set('');this.sel.set(id)}
 send(){const t=this.cur();if(!t)return;this.s.updateTicket(t.id,{status:'resolved',decision:this.decision(),recommendedId:this.decision()==='recommend'?this.reco():undefined});this.sel.set('');this.s.toast(this.i.t('tk.sent',{id:t.id}))}}
