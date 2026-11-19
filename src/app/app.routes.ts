import {Routes} from '@angular/router';
import {ShopLayout} from './shop/shop-layout';
import {Home} from './shop/home';
import {Catalogue} from './shop/catalogue';
import {ProductPage} from './shop/product-page';
import {Checkout} from './shop/checkout';
import {Tracking} from './shop/tracking';
import {Pro} from './shop/pro';
import {Sav} from './shop/sav';
import {AdminLayout} from './admin/admin-layout';
import {Dashboard} from './admin/dashboard';
import {AdminOrders} from './admin/admin-orders';
import {AdminProducts} from './admin/admin-products';
import {AdminUsers} from './admin/admin-users';
import {AdminTickets} from './admin/admin-tickets';
import {AdminLangs} from './admin/admin-langs';
export const routes:Routes=[
 {path:'',component:ShopLayout,children:[{path:'',component:Home},{path:'boutique',component:Catalogue},{path:'produit/:id',component:ProductPage},{path:'commande',component:Checkout},{path:'suivi',component:Tracking},{path:'pro',component:Pro},{path:'sav',component:Sav}]},
 {path:'admin',component:AdminLayout,children:[{path:'',component:Dashboard},{path:'commandes',component:AdminOrders},{path:'produits',component:AdminProducts},{path:'utilisateurs',component:AdminUsers},{path:'sav',component:AdminTickets},{path:'langues',component:AdminLangs}]},
 {path:'**',redirectTo:''}];
