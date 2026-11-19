import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CATS,Product,Store} from '../core/store';
import {I18n} from '../core/i18n';
import {EurPipe,LocPipe,ModalComponent,TPipe} from '../shared/shared';
const blank=():Product=>({id:0,name:{fr:'',en:''},category:'spices',type:'food',price:0,weight:'',origin:'',stock:0,rating:0,reviews:0,image:'assets/img/default.svg',description:{fr:'',en:''}});

@Component({selector:'app-admin-products',standalone:true,imports:[FormsModule,EurPipe,TPipe,LocPipe,ModalComponent],template:`
<div class="page-h"><div><p class="eyebrow">{{list().length}}</p><h1>{{'adm.products'|t}}</h1></div><button class="btn btn-solid" (click)="openNew()">+ {{'adm.newProduct'|t}}</button></div>
<div class="panel"><div class="fbar"><input class="fsearch" [ngModel]="q()" (ngModelChange)="q.set($event)" [placeholder]="'shop.search'|t"></div>
<div class="tscroll"><table class="tbl"><thead><tr><th>{{'pro.product'|t}}</th><th>{{'tbl.category'|t}}</th><th class="r">{{'tbl.price'|t}}</th><th>{{'tbl.stock'|t}}</th><th>{{'tbl.status'|t}}</th><th></th></tr></thead><tbody>
@for(p of list();track p.id){<tr><td><div class="mini"><img class="thumb" [src]="p.image" [alt]="p.name|loc"><div><b>{{p.name|loc}}</b><br><small class="mut">{{p.origin}} · {{p.weight}}</small></div></div></td><td>{{'cat.'+p.category|t}}</td><td class="r"><b>{{p.price|eur}}</b></td>
<td style="min-width:120px"><div class="meter"><i [style.width.%]="pct(p)" [class.low]="p.stock<=10"></i></div><small class="mut">{{p.stock}}</small></td>
<td><span [class]="'st '+stCls(p)">{{p.stock>10?('prod.in'|t):(p.stock>0?('prod.lowShort'|t):('prod.out'|t))}}</span></td>
<td class="r nowrap"><button class="btn btn-sm" (click)="edit(p)">{{'common.edit'|t}}</button> <button class="btn btn-sm" (click)="del.set(p)">{{'common.delete'|t}}</button></td></tr>}</tbody></table></div></div>

<app-modal [open]="open()" [title]="form.id?('common.edit'|t):('adm.newProduct'|t)" [wide]="true" (closed)="open.set(false)">
<div class="two"><div class="field"><label>{{'adm.nameFr'|t}}</label><input name="n1" [(ngModel)]="form.name.fr"></div><div class="field"><label>{{'adm.nameEn'|t}}</label><input name="n2" [(ngModel)]="form.name.en"></div></div>
<div class="two"><div class="field"><label>{{'tbl.category'|t}}</label><select name="c" [(ngModel)]="form.category">@for(c of cats;track c){<option [value]="c">{{'cat.'+c|t}}</option>}</select></div>
<div class="field"><label>{{'tbl.price'|t}} (€)</label><input name="p" type="number" min="0" step="0.1" [(ngModel)]="form.price"></div></div>
<div class="two"><div class="field"><label>{{'tbl.stock'|t}}</label><input name="s" type="number" min="0" [(ngModel)]="form.stock"></div><div class="field"><label>{{'prod.origin'|t}}</label><input name="o" [(ngModel)]="form.origin"></div></div>
<div class="field"><label>{{'adm.descFr'|t}}</label><textarea name="d1" rows="2" [(ngModel)]="form.description.fr"></textarea></div><div class="field"><label>{{'adm.descEn'|t}}</label><textarea name="d2" rows="2" [(ngModel)]="form.description.en"></textarea></div>
<div footer class="mfoot"><button class="btn" (click)="open.set(false)">{{'common.cancel'|t}}</button><button class="btn btn-solid" [disabled]="!form.name.fr||form.price<=0" (click)="save()">{{'common.save'|t}}</button></div></app-modal>
<app-modal [open]="!!del()" [title]="'adm.delTitle'|t" (closed)="del.set(null)"><p>{{'adm.delText'|t:{n:del()?.name?.fr||''} }}</p>
<div footer class="mfoot"><button class="btn" (click)="del.set(null)">{{'common.cancel'|t}}</button><button class="btn btn-danger" (click)="remove()">{{'common.delete'|t}}</button></div></app-modal>`})
export class AdminProducts{
 s=inject(Store);i=inject(I18n);cats=CATS;q=signal('');open=signal(false);del=signal<Product|null>(null);form:Product=blank();
 list=computed(()=>{const q=this.q().toLowerCase();return this.s.products().filter(p=>!q||(p.name.fr+p.name.en).toLowerCase().includes(q))});
 stCls(p:Product){return p.stock>10?'st-4':p.stock>0?'st-3':'st-red'}
 pct(p:Product){return Math.min(100,p.stock)}
 openNew(){this.form=blank();this.open.set(true)}
 edit(p:Product){this.form={...p,name:{...p.name},description:{...p.description}};this.open.set(true)}
 save(){const f={...this.form,price:+this.form.price,stock:+this.form.stock};if(!f.id)f.id=Math.max(0,...this.s.products().map(p=>p.id))+1;if(!f.name.en)f.name.en=f.name.fr;if(!f.description.en)f.description.en=f.description.fr;
  this.s.saveProduct(f);this.open.set(false);this.s.toast(this.i.t('adm.saved'))}
 remove(){const p=this.del();if(p){this.s.deleteProduct(p.id);this.s.toast(this.i.t('adm.deleted'),true)}this.del.set(null)}}
