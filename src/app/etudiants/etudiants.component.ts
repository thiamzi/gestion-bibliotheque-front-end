import { EmailModel } from './../modeles/EmailModel';
import { Etudiant } from './../modeles/etudiant';
import { DatabaseService } from './../Service/database.service';
import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../Service/modal.service';
import Swal from 'sweetalert2';
import { AuthserviceService } from '../Service/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../modeles/user';


@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrls: ['./etudiants.component.css']
})
export class EtudiantsComponent implements OnInit {

  swalWithBootstrapButtons1 = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: true
  });

  swalWithBootstrapButtons = Swal.mixin({
    buttonsStyling: true
  });

  etudiants: Etudiant[] = [];
  users: User[] = [];

  etudiant: Etudiant = {
    userIduser: 0,
    numeroDossier: 0,
    nom: "",
    prenom: "",
    dateNaissance: null,
    dateCreation: null,
    user: null,
    empruntList: null,
    reservationList: null
  };

  user: User = {
    iduser: 0,
    email: "",
    password: "",
    role: ""
  };

  Model: EmailModel = {
    objet: "Création de compte",
    destinataire: "",
    message: "Votre compte a été crée avec succes . Les identifiants de votre compte sont ci-dessous.",
    numero: "",
    password: ""
  }
  userEidt: any = {};

  form: FormGroup;
  form1: FormGroup;
  constructor(private modal: ModalService, private data: DatabaseService, private auth: AuthserviceService, private build: FormBuilder) { }

  ngOnInit(): void {
    this.getAllEtudiants();
    this.getAllUsers();
    // this.form1 = this.build.group({
    //   'message': ['', [Validators.required]]
    // })

    this.form = this.build.group({
      "nom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/)]],
      "prenom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z A-Z]*$/)]],
      "numeroDossier": ['', [Validators.required, Validators.pattern(/[0-9]{11}/)]],
      "dateNaissance": ['', Validators.required],
      "email": ['', [Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/), Validators.required]],
    });

    this.form1 = this.build.group({
      "nom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]*$/)]],
      "prenom": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2), Validators.pattern(/^[a-z A-Z]*$/)]],
      "email": ['', [Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/), Validators.required]],
      "numeroDossier": ['', [Validators.required, Validators.pattern(/[0-9]{11}/)]],
      "dateNaissance": ['', Validators.required],
    })
  }
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }
  open1(content1, etudiant) {
    this.form1.patchValue(etudiant)
    this.form1.patchValue(etudiant.user)
    this.etudiant = etudiant;
    this.user = etudiant.user;
    this.modal.open(content1)
  }

  open2(content2, etudiant) {
    this.etudiant = etudiant;
    this.modal.open(content2)
  }

  open3(content3) {
    this.ngOnInit();
    this.modal.open(content3);
  }

  async getAllUsers() {
    this.data.getAllUsers().subscribe(res => {
      this.users = res;
    });
  }

  async getAllEtudiants() {
    this.data.getAllEtudiants().subscribe(res => {
      this.etudiants = res;
    });
  }
  rechercherEtudiant(e) {

    const resultats1: Etudiant[] = [];

    for (const etudiant of this.etudiants) {
      if (etudiant.numeroDossier.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats1.push(etudiant);
      }
    }

    this.etudiants = resultats1;

    if (resultats1.length === 0 || !e.target.value) {
      this.getAllEtudiants();
    }
  }


  /*envoyeEmail() {
    this.Model.destinataire = this.etudiant.user.email;
    this.Model.message = this.form.get('message').value;

    Swal.fire({
      title: 'veuillez patientez!',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    })

    this.data.sendEmailEtudiant(this.Model).subscribe(res => {
      this.ngOnInit()
      this.modal.close();
      this.swalWithBootstrapButtons.fire(
        "Validé!",
        "Message envoye ave  avec succes",
        "success"
      )
    },
      err => {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "Une erreur est survenue lors de l'encoie",
          "error"
        );
      });
  }*/

  AjouterEtudiant() {
    Swal.fire({
      title: 'veuillez patientez!',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    })
    if (this.data.verfierNumdoss(this.form.get('numeroDossier').value, this.etudiants)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Le numero de dossier que vous avez entre existe deja",
        "error"
      );
    }
    else {
      if (this.data.verifier(this.form.get('email').value, this.users)) {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "L'adesse email que vous avez entre existe deja",
          "error"
        );
      } else {

        this.user.email = this.form.get("email").value;
        this.user.password = this.data.genererNumero().toString();
        this.user.role = "ROLE_ETUDIANT"
        this.Model.destinataire = this.user.email;
        this.Model.password = this.user.password;

        this.data.addUser(this.user).subscribe(user => {

          this.data.sendEmailCompte(this.Model).subscribe(_ => {

            this.etudiant.nom = this.form.get("nom").value;
            this.etudiant.prenom = this.form.get("prenom").value;
            this.etudiant.numeroDossier = this.form.get("numeroDossier").value;
            this.etudiant.dateNaissance = this.form.get("dateNaissance").value;
            this.etudiant.userIduser = user.iduser;

            this.data.addEtudiant(this.etudiant).subscribe(res2 => {

              this.modal.close();
              this.swalWithBootstrapButtons.fire(
                "creé!",
                "Votre compte a ete creé avec succes",
                "success"
              );
              this.ngOnInit();
            }, err => {

              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenu. Veuillez reessayer plutard!",
                "error"
              );
            });
          }, _ => {
            this.swalWithBootstrapButtons.fire(
              "erreur!",
              "Une erreur est survenu lors de l'envoie du mail. Veuillez reessayer plutard!",
              "error"
            );
          })
        }, err1 => {

          this.swalWithBootstrapButtons.fire(
            "erreur!",
            "Une erreur est survenu lors l'ajout. Veuillez reessayer plutard!",
            "error"
          );
        });
      }
    }
  }

  EditerEtudiant() {
    this.user.email = this.form1.get('email').value;
    this.etudiant.nom = this.form1.get('nom').value;
    this.etudiant.prenom = this.form1.get('prenom').value;
    this.etudiant.dateNaissance = this.form1.get('dateNaissance').value;
    this.etudiant.numeroDossier = this.form1.get('numeroDossier').value;
    this.getAllUsers();
    this.getAllEtudiants();
    if (this.data.verifier1(this.etudiant, this.users)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "L'adesse email que vous avez entre existe deja",
        "error"
      );
    }
    else {
      if (this.data.verfierNumdoss1(this.etudiant, this.etudiants)) {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "Le numero de dossier que vous avez entre existe deja",
          "error"
        );
      } else {
        this.data.editUser(this.user).subscribe(res => {
          this.data.editEtudiant(this.etudiant).subscribe(_ => {
            this.modal.close()
            this.swalWithBootstrapButtons.fire(
              "modifieé!",
              "Categorie modifiée avec succes.",
              "success"
            );
            this.ngOnInit();
          })
        })
      }
    }
  }
  isAgent() {
    if (this.auth.Islogged()) {
      if (this.auth.getUserdetails().isAgent) {
        return true;
      }
      return false;
    }
    else {
      false;
    }
  }

  isAdmin(): boolean {
    if (this.auth.Islogged()) {
      if (this.auth.getUserdetails().isAdmin) {
        return true;
      }
      return false;
    }
    else {
      false;
    }

  }

  supprimer(etudiant:Etudiant){
    if(etudiant.reservationList.length>0 || etudiant.empruntList.length>0){
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Le impossible de supprimer cet etudiant car il a une reservation ou emprunt en cours",
        "error"
      );
    }
    else{
      this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer!",
        cancelButtonText: "No, annuler!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this.data.deleteEtudiant(etudiant.userIduser).subscribe(res => {
            this.ngOnInit()
            this.swalWithBootstrapButtons.fire(
              "Supprimé!",
              "Etudiant supprimé avec succes",
              "success"
            );
          },
            err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de la suppression",
                "error"
              );
            }
          );
        }
      });
    }
  }
}
