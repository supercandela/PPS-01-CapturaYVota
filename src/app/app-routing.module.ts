import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
        canMatch: [authGuard],
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'secciones',
    children: [
      {
        path: ':seleccion',
        loadChildren: () =>
          import('./secciones/secciones.module').then(
            (m) => m.SeccionesPageModule
          ),
        canMatch: [authGuard],
      },
    ],
  },
  {
    path: 'listados',
    children: [
      {
        path: ':tipo',
        loadChildren: () =>
          import('./listados/listados.module').then(
            (m) => m.ListadosPageModule
          ),
        canMatch: [authGuard],
      },
    ],
  },  {
    path: 'estadisticas',
    loadChildren: () => import('./estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
