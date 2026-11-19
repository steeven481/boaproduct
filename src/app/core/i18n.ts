import {Injectable,inject,signal,effect} from '@angular/core';
import {HttpClient} from '@angular/common/http';
type Lang='fr'|'en';
@Injectable({providedIn:'root'})
export class I18n{
 private http=inject(HttpClient);
 lang=signal<Lang>(this.initial());
 dict=signal<Record<string,Record<string,string>>>({fr:{},en:{}});
 constructor(){
  (['fr','en'] as Lang[]).forEach(l=>this.http.get<Record<string,string>>('assets/i18n/'+l+'.json').subscribe(d=>this.dict.update(x=>({...x,[l]:d}))));
  effect(()=>{document.documentElement.lang=this.lang()});
 }
 private initial():Lang{const s=localStorage.getItem('ag-lang');return s==='en'||s==='fr'?s:(navigator.language.startsWith('en')?'en':'fr')}
 set(l:Lang){this.lang.set(l);localStorage.setItem('ag-lang',l)}
 t(k:string,p?:Record<string,string|number>){const d=this.dict();let s=d[this.lang()][k]??d['fr'][k]??k;if(p)for(const x in p)s=s.split('{'+x+'}').join(String(p[x]));return s}
 loc(o:{fr:string;en:string}|undefined){return o?(o[this.lang()]||o.fr):''}
 edit(l:Lang,k:string,v:string){this.dict.update(d=>({...d,[l]:{...d[l],[k]:v}}))}
}
