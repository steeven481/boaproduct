import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
bootstrapApplication(AppComponent,appConfig).catch(e=>console.error(e));

// Si une photo en ligne ne charge pas, on affiche l'image locale de repli
document.addEventListener('error',(e:Event)=>{const t=e.target as HTMLImageElement;if(t&&t.tagName==='IMG'&&!t.dataset['fb']){t.dataset['fb']='1';t.src='assets/img/default.svg'}},true);
