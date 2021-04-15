import { async } from '@angular/core/testing';
import { EmailService } from './../Service/email/email.service';
import { EmailModel } from './../modeles/EmailModel';
import { Etudiant } from './../modeles/etudiant';
import { DatabaseService } from './../Service/database.service';
import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../Service/modal.service';
import Swal from 'sweetalert2';
import { AuthserviceService, Userdetails } from '../Service/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { snapshotChanges } from '@angular/fire/database';


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

  etudiantsTrue: Etudiant[] = [];
  etudiantsFalse: Etudiant[] = [];
  etudiant: Etudiant;
  timerInterval: any;

  user: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false
  }

  Model: EmailModel = {
    objet: "Verification pour validation compte",
    destinataire: "",
    message: "",
    numero: "",
    password: ""
  }

  form: FormGroup;
  constructor(private modal: ModalService, private data: DatabaseService, private auth: AuthserviceService, private build: FormBuilder) { }

  ngOnInit(): void {
    this.user = this.auth.getUserdetails();
    this.TousLesEtudiantsFalse();
    this.TousLesEtudiantsTrue();
    this.form = this.build.group({
      'message': ['', [Validators.required]]
    })
  }
  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }
  open1(content1, etudiant) {
    this.etudiant = etudiant;
    this.modal.open(content1)
  }

  open2(content2, etudiant) {
    this.etudiant = etudiant;
    this.modal.openmd(content2)
  }

  TousLesEtudiantsTrue() {
    this.data.getAllEtudiantsTrue().subscribe(res => {
      this.etudiantsTrue = res;
    })
  }

  TousLesEtudiantsFalse() {
    this.data.getAllEtudiantsFalse().subscribe(res => {
      this.etudiantsFalse = res;
    })
  }

  validerEtudiant(etudiant: Etudiant) {

    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, valider!",
        cancelButtonText: "No, annuler!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          Swal.fire({
            title: 'veuillez patientez!',
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          })
          this.Model.destinataire = etudiant.user.email;
          this.Model.message = "Votre inscription a ete valider avec succes!! Desormais vous pouvez emprunter ou reserver un livre";
          this.data.sendEmailEtudiant(this.Model).subscribe(_ => {
            this.data.validerEtudiant(etudiant).subscribe(() => {
              this.ngOnInit()
              this.modal.close();
              this.swalWithBootstrapButtons.fire(
                "Validé!",
                "Compte valide  avec succes",
                "success"
              );
            },
              err => {
                this.swalWithBootstrapButtons.fire(
                  "Erreur!",
                  "Une erreur est survenue lors de la suppression",
                  "error"
                );
              });
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

  rechercherEtudiant(e) {

    const resultats1: Etudiant[] = [];
    const resultats2: Etudiant[] = [];

    for (const etudiant of this.etudiantsFalse) {
      if (etudiant.numeroDossier.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats1.push(etudiant);
      }
    }
    for (const etudiant of this.etudiantsTrue) {
      if (etudiant.numeroDossier.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats2.push(etudiant);
      }
    }

    this.etudiantsFalse = resultats1;
    this.etudiantsTrue = resultats2;


    if (resultats1.length === 0 || !e.target.value) {
      this.TousLesEtudiantsFalse();
    }
    if (resultats2.length === 0 || !e.target.value) {

      this.TousLesEtudiantsTrue()
    }
  }

  envoyeEmail() {
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
  }
}
