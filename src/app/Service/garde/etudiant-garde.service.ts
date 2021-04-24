import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService, Userdetails } from '../authservice.service';

@Injectable({
  providedIn: 'root'
})
export class EtudiantGardeService implements CanActivate{

  user: Userdetails;

  constructor(
    private authservice: AuthserviceService,
    private router: Router,
  ) {this.user = this.authservice.getUserdetails()}


  canActivate() {
    if (this.authservice.Islogged() && ( this.user.isAdmin || this.user.isEtudiant)) {
      return true;
    } else {
      this.router.navigateByUrl("/login");
      return false;
    }
  }
}
