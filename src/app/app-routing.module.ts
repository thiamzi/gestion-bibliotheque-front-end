import { EtudiantGardeService } from './Service/garde/etudiant-garde.service';
import { AgentGardeService } from './Service/garde/agent-garde.service';
import { BibliothecaireGardeService } from './Service/garde/bibliothecaire-garde.service';
import { GardeService } from './Service/garde/garde.service';
import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/accueil', pathMatch: 'full' },
      {
        path: 'accueil',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
      {
        path: 'categories', canActivate : [BibliothecaireGardeService],
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'livres', canActivate : [BibliothecaireGardeService],
        loadChildren: () => import('./livres/livres.module').then(m => m.LivresModule)
      },
      {
        path: 'agents', canActivate : [BibliothecaireGardeService],
        loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule)
      },
      {
        path: 'reservations', canActivate : [AgentGardeService],
        loadChildren: () => import('./reservations/reservations.module').then(m => m.ReservationsModule)
      },
      {
        path: 'prets', canActivate : [AgentGardeService],
        loadChildren: () => import('./emprunts/emprunts.module').then(m => m.EmpruntsModule)
      },

      {
        path: 'etudiants', canActivate : [BibliothecaireGardeService],
        loadChildren: () => import('./etudiants/etudiants.module').then(m => m.EtudiantsModule)
      },

      {
        path: 'mes-emprunts', canActivate : [EtudiantGardeService],
        loadChildren: () => import('./mes-emprunts/mes-emprunts.module').then(m => m.MesEmpruntsModule)
      },

      {
        path: 'mes-reservations', canActivate : [EtudiantGardeService],
        loadChildren: () => import('./mes-reservations/mes-reservations.module').then(m => m.MesReservationsModule)
      },

      {
        path: 'infos-compte',
        loadChildren: () => import('./infos-compte/infos-compte.module').then(m => m.InfosCompteModule)
      },


    ]
  },
  {
    path: '**',
    redirectTo: '/accueil'
  }
];
