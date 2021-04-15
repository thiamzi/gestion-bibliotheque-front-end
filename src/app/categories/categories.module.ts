import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesComponent } from './categories.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Liste categories',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'categories' }
      ]
    },
    component: CategoriesComponent
  }
];

@NgModule({
  imports: [FormsModule, CommonModule, RouterModule.forChild(routes) , ReactiveFormsModule],
  declarations: [CategoriesComponent]
})
export class CategoriesModule { }
