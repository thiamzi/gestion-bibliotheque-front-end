import { MesReservationsComponent } from './mes-reservations.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste emprunts',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'mes-reservations' }
      ]
    },
    component: MesReservationsComponent
  }
];

@NgModule({
  declarations: [MesReservationsComponent],
  imports: [CommonModule , RouterModule.forChild(routes) ,
    FormsModule,
    ReactiveFormsModule,
    NgbModule]
})
export class MesReservationsModule { }
