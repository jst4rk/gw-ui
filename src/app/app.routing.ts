import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/gateways', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'gateways', loadChildren: () => import('../app/gateways/gateways.module').then(m => m.GatewaysModule) },
      { path: 'devices', loadChildren: () => import('../app/devices/devices.module').then(m => m.DevicesModule) },
    ]
  },
];
