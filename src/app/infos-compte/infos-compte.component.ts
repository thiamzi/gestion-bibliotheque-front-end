import { FirebaseService } from 'src/app/Service/firebase.service';
import { AuthserviceService, Userdetails } from 'src/app/Service/authservice.service';
import { DatabaseService } from 'src/app/Service/database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../Service/modal.service';
import { MustMatch } from '../validator/mustmatch';
import { User } from '../modeles/user';
import Swal from 'sweetalert2';
import { Etudiant } from '../modeles/etudiant';
import { Image } from '../modeles/image';

@Component({
  selector: 'app-infos-compte',
  templateUrl: './infos-compte.component.html',
  styleUrls: ['./infos-compte.component.css']
})
export class InfosCompteComponent implements OnInit {
  user: any = {};
  swalWithBootstrapButtons = Swal.mixin({
    buttonsStyling: true
  });

  user1: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false,
  }
  mode1: boolean = true;
  mode2: boolean = false;
  updatedUser: any;

  form: FormGroup;
  form1: FormGroup;
  verifEtudiant: boolean = false;
  users: User[] = [];

  credential = {
    email: "",
    password: ""
  }


  valid: boolean = true;
  constructor(private data: DatabaseService, private auth: AuthserviceService, private uploadService: FirebaseService, private build: FormBuilder, private modal: ModalService) { }

  ngOnInit(): void {
    this.user1 = this.auth.getUserdetails();
    this.getAllUsers();
    this.data.oneUser(this.auth.getUserdetails().sub).subscribe(res => {
      if (this.auth.getUserdetails().isAgent) {
        this.data.oneAgent(res.iduser).subscribe(res1 => {
          this.user = res1;
        })
      }
      if (this.auth.getUserdetails().isBibliothecaire) {
        this.data.oneBiblio(res.iduser).subscribe(res2 => {
          this.user = res2;
        })
      }
      if (this.auth.getUserdetails().isEtudiant) {
        this.data.oneEtudiant(res.iduser).subscribe(res3 => {
          this.user = res3;
        })
      }
    })

    this.form = this.build.group({
      "password": ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]],
      'confirm': ['', Validators.required],
    }, {
      'validator': MustMatch('password', 'confirm')
    })

    this.form1 = this.build.group({
      "nom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/)]],
      "prenom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z A-Z]*$/)]],
      "email": ['', [Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/), Validators.required]],
      "mdp": ['', Validators.required],
    })
  }

  open2(content2) {
    if (this.user1.isBibliothecaire) {
      this.form1.patchValue(this.user)
      this.form1.patchValue(this.user.user)
    } else {
      this.mode1 = false;
      this.mode2 = true;
    }
    this.modal.open(content2)
  }

  changermode1() {
    this.mode2 = true;
    this.mode1 = false;
  }

  changermode2() {
    this.mode1 = true;
    this.mode2 = false;
  }

  editUser() {
    this.user.nom = this.form1.get("nom").value;
    this.user.prenom = this.form1.get("prenom").value;
    this.user.user.email = this.form1.get("email").value;
    if (this.data.verifier1(this.user, this.users)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "L'adesse email que vous avez entre existe deja",
        "error"
      );
    }
    else {
      this.data.editUser(this.user.user).subscribe(_ => {
        if (this.auth.getUserdetails().isBibliothecaire) {
          this.data.editBiblio(this.user).subscribe(_ => {
            this.credential.email = this.form1.get("email").value;
            this.credential.password = this.form1.get("mdp").value;
            this.auth.connexion(this.credential).subscribe(res => {
              this.modal.close();
              this.swalWithBootstrapButtons.fire(
                "modifieé!",
                "Infos modifiée avec succes.",
                "success"
              );
              this.ngOnInit();
            }, err => {
              this.user.user.email = this.auth.getUserdetails().sub;
              this.data.editUser(this.user.user).subscribe(_ => {
                this.valid = false;
              })
            })
          }, err => {
            this.swalWithBootstrapButtons.fire(
              "Erreur!",
              "Une erreur est survenue lors de la modification",
              "error"
            );
          })
        }
      }, err => {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "Une erreur est survenue lors de la modification",
          "error"
        );
      })
    }

  }

  getAllUsers() {
    this.data.getAllUsers().subscribe(res => {
      this.users = res;
    })
  }

  updatePassword() {
    console.log()
    this.user.user.password = this.form.get("password").value;
    this.data.UpdatePassword(this.user.user).subscribe(_ => {
      this.modal.close();
      this.swalWithBootstrapButtons.fire(
        "modifieé!",
        "Mot de passe modifié avec succes.",
        "success"
      );
      this.ngOnInit();
    }, err => {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Une erreur est survenue lors de la modification",
        "error"
      );
    })
  }

}
