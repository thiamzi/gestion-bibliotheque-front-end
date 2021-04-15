import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { StarterComponent } from './starter.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: '',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Accueil' }
      ]
    },
    component: StarterComponent
  }
];

@NgModule({
  imports: [FormsModule, CommonModule, RouterModule.forChild(routes) , ReactiveFormsModule],
  declarations: [StarterComponent]
})
export class StarterModule {}
