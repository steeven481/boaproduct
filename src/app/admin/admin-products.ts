import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Store,Product,CATEGORIES} from '../core/store';
import {EurPipe,ModalComponent} from '../shared/shared';

const blank=():Product=>({id:0,name:'',category:'Épices',type:'alimentaire',price:0,weight:'',origin:'',stock:0,rating:0,reviews:0,image:'assets/img/default.svg',description:''});

@Component({selector:'app-admin-products',standalone:true,imports:[FormsModule,EurPipe,ModalComponent],template:`
<div class="page-h"><div><h1>Produits</h1><span class="mut">{{list().length}} produit(s)</span></div><button class="btn btn-primary" (click)="openNew()">+ Nouveau produit</button></div>
<div class="card panel"><div class="filters-row"><div class="search"><input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Rechercher un produit"></div></div>
<div class="tscroll" style="margin-top:14px"><table class="tbl"><thead><tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Statut</th><th></th></tr></thead><tbody>
@for(p of list();track p.id){<tr><td><div class="mini"><img class="thumb" [src]="p.image" [alt]="p.name"><div><b>{{p.name}}</b><br><small class="mut">{{p.origin}} · {{p.weight}}</small></div></div></td><td>{{p.category}}</td><td><b>{{p.price|eur}}</b></td>
<td style="min-width:120px"><div class="meter"><i [style.width.%]="pct(p)" [class.low]="p.stock<=10"></i></div><small class="mut">{{p.stock}} en stock</small></td>
<td><span [class]="'st '+stCls(p)">{{p.stock>10?'Disponible':p.stock>0?'Stock bas':'Rupture'}}</span></td>
<td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" (click)="edit(p)">Modifier</button> <button class="btn btn-ghost btn-sm" (click)="del.set(p)">Supprimer</button></td></tr>}</tbody></table></div></div>

<app-modal [open]="open()" [title]="form.id?'Modifier le produit':'Nouveau produit'" [wide]="true" (closed)="open.set(false)">
<div class="field"><label>Nom du produit</label><input name="n" [(ngModel)]="form.name"></div>
<div class="two"><div class="field"><label>Catégorie</label><select name="c" [(ngModel)]="form.category">@for(c of cats;track c){<option>{{c}}</option>}</select></div>
<div class="field"><label>Type</label><select name="t" [(ngModel)]="form.type"><option>alimentaire</option><option>non alimentaire</option></select></div></div>
<div class="two"><div class="field"><label>Prix (€)</label><input name="p" type="number" min="0" step="0.1" [(ngModel)]="form.price"></div><div class="field"><label>Stock</label><input name="s" type="number" min="0" [(ngModel)]="form.stock"></div></div>
<div class="two"><div class="field"><label>Poids / volume</label><input name="w" [(ngModel)]="form.weight" placeholder="250 g"></div><div class="field"><label>Origine</label><input name="o" [(ngModel)]="form.origin" placeholder="Penja, Littoral"></div></div>
<div class="field"><label>Description</label><textarea name="d" rows="3" [(ngModel)]="form.description"></textarea></div>
<div footer class="mfoot"><button class="btn btn-ghost" (click)="open.set(false)">Annuler</button><button class="btn btn-primary" [disabled]="!form.name||form.price<=0" (click)="save()">Enregistrer</button></div></app-modal>

<app-modal [open]="!!del()" title="Supprimer ce produit ?" (closed)="del.set(null)"><p>Voulez-vous vraiment supprimer <b>{{del()?.name}}</b> ? Cette action est définitive (simulation).</p>
<div footer class="mfoot"><button class="btn btn-ghost" (click)="del.set(null)">Annuler</button><button class="btn btn-danger" (click)="remove()">Supprimer</button></div></app-modal>`})
export class AdminProducts{
 s=inject(Store);cats=CATEGORIES;q=signal('');open=signal(false);del=signal<Product|null>(null);form:Product=blank();
 list=computed(()=>{const q=this.q().toLowerCase();return this.s.products().filter(p=>!q||(p.name+p.category).toLowerCase().includes(q))});
 stCls(p:Product){return p.stock>10?'st-4':p.stock>0?'st-3':'st-red'}
 pct(p:Product){return Math.min(100,p.stock)}
 openNew(){this.form=blank();this.open.set(true)}
 edit(p:Product){this.form={...p};this.open.set(true)}
 save(){const f={...this.form,price:+this.form.price,stock:+this.form.stock};if(!f.id)f.id=Math.max(0,...this.s.products().map(p=>p.id))+1;
  this.s.saveProduct(f);this.open.set(false);this.s.toast('Produit « '+f.name+' » enregistré')}
 remove(){const p=this.del();if(p){this.s.deleteProduct(p.id);this.s.toast('Produit supprimé',true)}this.del.set(null)}}
