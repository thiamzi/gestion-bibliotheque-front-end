import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsComponent } from './agents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

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
    component: AgentsComponent
  }
];

@NgModule({
  imports: [FormsModule, CommonModule, RouterModule.forChild(routes) , ReactiveFormsModule],
  declarations: [AgentsComponent]
})
export class AgentsModule { }
