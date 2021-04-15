import { EmpruntsComponent } from './emprunts.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste emprunts',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'prets' }
      ]
    },
    component: EmpruntsComponent
  }
];

@NgModule({
  declarations: [EmpruntsComponent],
  imports: [CommonModule , RouterModule.forChild(routes) ,
    FormsModule,
    ReactiveFormsModule,
    NgbModule]
})
export class EmpruntsModule { }
