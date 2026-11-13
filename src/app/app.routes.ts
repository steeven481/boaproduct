import {Routes} from '@angular/router';
import {ShopLayout} from './shop/shop-layout';
import {Home} from './shop/home';
import {Catalogue} from './shop/catalogue';
import {ProductPage} from './shop/product-page';
import {Checkout} from './shop/checkout';
import {Tracking} from './shop/tracking';
import {AdminLayout} from './admin/admin-layout';
import {Dashboard} from './admin/dashboard';
import {AdminOrders} from './admin/admin-orders';
import {AdminProducts} from './admin/admin-products';
export const routes:Routes=[
 {path:'',component:ShopLayout,children:[{path:'',component:Home},{path:'catalogue',component:Catalogue},{path:'produit/:id',component:ProductPage},{path:'commande',component:Checkout},{path:'suivi',component:Tracking}]},
 {path:'admin',component:AdminLayout,children:[{path:'',component:Dashboard},{path:'commandes',component:AdminOrders},{path:'produits',component:AdminProducts}]},
 {path:'**',redirectTo:''}];
