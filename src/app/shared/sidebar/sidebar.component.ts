import { AuthserviceService, Userdetails } from './../../Service/authservice.service';
import { Categorie } from './../../modeles/categorie';
import { DatabaseService } from './../../Service/database.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  active = true;
  user: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false
  }
  // this is for the open close

  constructor(private data: DatabaseService, private auth: AuthserviceService) {

  }

  // End open close
  ngOnInit() {
    if (this.islogged()) {
        this.user = this.auth.getUserdetails()
      }
    this.active == true;
  }

  islogged() {
    if (this.auth.Islogged()) {
      return true;
    }
    return false;
  }
}
