import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {I18n} from '../core/i18n';
import {TPipe} from '../shared/shared';

@Component({selector:'app-admin-langs',standalone:true,imports:[FormsModule,TPipe],template:`
<div class="page-h"><div><p class="eyebrow">FR · EN</p><h1>{{'adm.langs'|t}}</h1><p class="mut">{{'lang.lead'|t}}</p></div><button class="btn" (click)="export()">{{'lang.export'|t}}</button></div>
<div class="panel"><div class="fbar"><input class="fsearch" [ngModel]="q()" (ngModelChange)="q.set($event)" [placeholder]="'lang.search'|t"></div>
<div class="tscroll"><table class="tbl"><thead><tr><th>{{'lang.key'|t}}</th><th>Français</th><th>English</th></tr></thead><tbody>
@for(k of keys();track k){<tr><td><small class="mut">{{k}}</small></td><td><input class="tin" [ngModel]="i.dict()['fr'][k]" (ngModelChange)="i.edit('fr',k,$event)"></td><td><input class="tin" [ngModel]="i.dict()['en'][k]" (ngModelChange)="i.edit('en',k,$event)"></td></tr>}</tbody></table></div></div>`})
export class AdminLangs{
 i=inject(I18n);q=signal('');
 keys=computed(()=>{const q=this.q().toLowerCase();const d=this.i.dict();return Object.keys(d['fr']).filter(k=>!q||k.toLowerCase().includes(q)||(d['fr'][k]||'').toLowerCase().includes(q)||(d['en'][k]||'').toLowerCase().includes(q)).slice(0,60)});
 export(){const b=new Blob([JSON.stringify(this.i.dict(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='translations.json';a.click()}}
