import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ROLES,Store,User} from '../core/store';
import {I18n} from '../core/i18n';
import {ModalComponent,TPipe} from '../shared/shared';

@Component({selector:'app-admin-users',standalone:true,imports:[FormsModule,TPipe,ModalComponent],template:`
<div class="page-h"><div><p class="eyebrow">{{list().length}}</p><h1>{{'adm.users'|t}}</h1></div><button class="btn btn-solid" (click)="invite()">+ {{'usr.invite'|t}}</button></div>
<details class="panel roles"><summary>{{'usr.rolesTitle'|t}}</summary>@for(r of roles;track r){<div class="dl"><b>{{'role.'+r|t}}</b><span class="mut">{{'role.'+r+'.d'|t}}</span></div>}</details>
<div class="panel"><div class="fbar"><div class="chips">@for(g of groups;track g){<button [class.on]="grp()===g" (click)="grp.set(g)">{{'usr.g.'+g|t}}</button>}</div><input class="fsearch" [ngModel]="q()" (ngModelChange)="q.set($event)" [placeholder]="'usr.search'|t"></div>
<div class="tscroll"><table class="tbl"><thead><tr><th>{{'tbl.name'|t}}</th><th>{{'tbl.role'|t}}</th><th>{{'tbl.status'|t}}</th><th>{{'tbl.lang'|t}}</th><th class="r">{{'adm.orders'|t}}</th><th></th></tr></thead><tbody>
@for(u of list();track u.id){<tr><td><b>{{u.name}}</b><br><small class="mut">{{u.email}}</small></td><td><span class="role">{{'role.'+u.role|t}}</span></td><td><span [class]="'st us-'+u.status">{{'us.'+u.status|t}}</span></td><td>{{u.lang.toUpperCase()}}</td><td class="r">{{u.orders}}</td>
<td class="r nowrap">@if(u.status==='pending'){<button class="btn btn-sm btn-solid" (click)="approve(u)">{{'usr.approve'|t}}</button> }<button class="btn btn-sm" (click)="edit(u)">{{'common.edit'|t}}</button> <button class="btn btn-sm" (click)="toggle(u)">{{u.status==='suspended'?('usr.reactivate'|t):('usr.suspend'|t)}}</button> <button class="btn btn-sm" (click)="del.set(u)">✕</button></td></tr>}</tbody></table></div></div>

<app-modal [open]="open()" [title]="mode==='invite'?('usr.invite'|t):('common.edit'|t)" (closed)="open.set(false)">
<div class="field"><label>{{'tbl.name'|t}}</label><input name="un" [(ngModel)]="form.name"></div><div class="field"><label>{{'acc.email'|t}}</label><input name="ue" type="email" [(ngModel)]="form.email"></div>
<div class="two"><div class="field"><label>{{'tbl.role'|t}}</label><select name="ur" [(ngModel)]="form.role">@for(r of roles;track r){<option [value]="r">{{'role.'+r|t}}</option>}</select></div>
<div class="field"><label>{{'tbl.lang'|t}}</label><select name="ul" [(ngModel)]="form.lang"><option value="fr">Français</option><option value="en">English</option></select></div></div>
@if(mode==='edit'){<div class="field"><label>{{'tbl.status'|t}}</label><select name="us" [(ngModel)]="form.status"><option value="active">{{'us.active'|t}}</option><option value="pending">{{'us.pending'|t}}</option><option value="suspended">{{'us.suspended'|t}}</option></select></div>}
@if(mode==='invite'){<p class="mut" style="font-size:13px">{{'usr.inviteNote'|t}}</p>}
<div footer class="mfoot"><button class="btn" (click)="open.set(false)">{{'common.cancel'|t}}</button><button class="btn btn-solid" [disabled]="!form.name||!form.email.includes('@')" (click)="save()">{{mode==='invite'?('usr.send'|t):('common.save'|t)}}</button></div></app-modal>
<app-modal [open]="!!del()" [title]="'adm.delTitle'|t" (closed)="del.set(null)"><p>{{'usr.delText'|t:{n:del()?.name||''} }}</p>
<div footer class="mfoot"><button class="btn" (click)="del.set(null)">{{'common.cancel'|t}}</button><button class="btn btn-danger" (click)="remove()">{{'common.delete'|t}}</button></div></app-modal>`})
export class AdminUsers{
 s=inject(Store);i=inject(I18n);roles=ROLES;groups=['all','clients','pros','team'];grp=signal('all');q=signal('');open=signal(false);del=signal<User|null>(null);mode:'invite'|'edit'='edit';
 form:User={id:0,name:'',email:'',role:'client',status:'active',lang:'fr',joined:'',orders:0};
 list=computed(()=>{const q=this.q().toLowerCase();return this.s.users().filter(u=>(this.grp()==='all'||(this.grp()==='clients'&&u.role==='client')||(this.grp()==='pros'&&u.role==='grossiste')||(this.grp()==='team'&&!['client','grossiste'].includes(u.role)))&&(!q||(u.name+u.email).toLowerCase().includes(q)))});
 invite(){this.mode='invite';this.form={id:0,name:'',email:'',role:'gestionnaire',status:'pending',lang:'fr',joined:'',orders:0};this.open.set(true)}
 edit(u:User){this.mode='edit';this.form={...u};this.open.set(true)}
 save(){const f={...this.form};if(!f.id){f.id=Math.max(0,...this.s.users().map(u=>u.id))+1;f.joined=new Date().toISOString().slice(0,10)}
  this.s.saveUser(f);this.open.set(false);this.s.toast(this.i.t(this.mode==='invite'?'usr.sent':'adm.saved',{e:f.email}))}
 approve(u:User){this.s.saveUser({...u,status:'active'});this.s.toast(this.i.t('usr.approved',{n:u.name}))}
 toggle(u:User){const st=u.status==='suspended'?'active':'suspended';this.s.saveUser({...u,status:st});this.s.toast(this.i.t(st==='active'?'usr.reactivated':'usr.suspended',{n:u.name}))}
 remove(){const u=this.del();if(u){this.s.deleteUser(u.id);this.s.toast(this.i.t('adm.deleted'),true)}this.del.set(null)}}
