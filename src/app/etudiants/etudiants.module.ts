import { EtudiantsComponent } from './etudiants.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste etudiants',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'etudiants' }
      ]
    },
    component: EtudiantsComponent
  }
];

@NgModule({
  declarations: [EtudiantsComponent],
  imports: [CommonModule , RouterModule.forChild(routes) ,
    FormsModule,
    ReactiveFormsModule,
    NgbModule]
})
export class EtudiantsModule { }
