
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsComponent } from './reservations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste reservations',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'emprunts' }
      ]
    },
    component: ReservationsComponent
  }
];

@NgModule({
  declarations: [ReservationsComponent],
  imports: [CommonModule , RouterModule.forChild(routes) ,
    FormsModule,
    ReactiveFormsModule,
    NgbModule]
})
export class ReservationsModule { }
