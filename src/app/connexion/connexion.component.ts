import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../Service/authservice.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  form: FormGroup;
  valid: boolean = true;

  constructor(private build: FormBuilder, private auth: AuthserviceService, private route: Router) { }

  ngOnInit(): void {
    this.form = this.build.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  login() {
    this.auth.connexion(this.form.value).subscribe(res => {
      this.route.navigateByUrl("/biblio/accueil")
    }, err => {
      this.valid = false;
    })
  }
}
