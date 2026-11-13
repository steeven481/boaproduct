import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastsComponent} from './shared/shared';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,ToastsComponent],template:`<router-outlet/><app-toasts/>`})
export class AppComponent{}
