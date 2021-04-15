import { MesEmpruntsComponent } from './mes-emprunts.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste emprunts',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'mes-emprunts' }
      ]
    },
    component: MesEmpruntsComponent
  }
];

@NgModule({
  declarations: [MesEmpruntsComponent],
  imports: [CommonModule , RouterModule.forChild(routes) ,
    FormsModule,
    ReactiveFormsModule,
    NgbModule]
})
export class MesEmpruntsModule { }
