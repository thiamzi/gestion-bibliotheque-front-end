import { ReactiveFormsModule } from '@angular/forms';
import { InfosCompteComponent } from './infos-compte.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste emprunts',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'infos-compte' }
      ]
    },
    component: InfosCompteComponent
  }
];

@NgModule({
  declarations: [InfosCompteComponent],
  imports: [CommonModule , RouterModule.forChild(routes) ,
    ReactiveFormsModule,
    ReactiveFormsModule,
    NgbModule]
})
export class InfosCompteModule { }
