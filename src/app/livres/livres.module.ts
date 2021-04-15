import { LivresComponent } from './livres.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gerer livres',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'livres' }
      ]
    },
    component: LivresComponent
  }
];

@NgModule({
  imports: [FormsModule, CommonModule, RouterModule.forChild(routes) , ReactiveFormsModule],
  declarations: [LivresComponent]
})
export class LivresModule { }
