import { AuthserviceService, Userdetails } from 'src/app/Service/authservice.service';
import { Etudiant } from './../modeles/etudiant';
import { Livre } from './../modeles/livre';
import { Emprunt } from './../modeles/emprunt';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from '../Service/database.service';
import { ModalService } from '../Service/modal.service';
import Swal from 'sweetalert2';
import { EmailModel } from '../modeles/EmailModel';

@Component({
  selector: 'app-emprunts',
  templateUrl: './emprunts.component.html',
  styleUrls: ['./emprunts.component.css']
})
export class EmpruntsComponent implements OnInit {


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

  empruntsCours: Emprunt[] = [];
  empruntsNouveaux: Emprunt[] = [];
  empruntsRetards: Emprunt[] = [];
  empruntsRegles: Emprunt[] = [];

  livre: Livre = {
    idlivre: 0,
    titre: "",
    auteur: "",
    description: "",
    exmplaire: 0,
    nbdisponible: 0,
    imageCle: {
      cle: 0,
      nom: "",
      url: "",
      file: null
    },
    dateCreation: null,
    empruntList: [],
    reservationList: [],
    categorieIdcategorie: 0
  };
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

  emprunt: Emprunt;
  date: Date;

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
    objet: "",
    destinataire: "",
    message: "",
    numero: "",
    password: ""
  }
  timerInterval: any;

  constructor(private modal: ModalService, private data: DatabaseService, private auth: AuthserviceService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserdetails();
    this.date = new Date;
    this.getAllNouveaux();
    this.getAllEncours();
    this.getAllRegles();
    this.getAllRetards();
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }


  open2(content2, emprunt: Emprunt) {
    this.emprunt = emprunt;
    this.getEtudiant(emprunt.etudiantUserIduser);
    this.getLivre(emprunt.livreIdlivre);
    this.modal.openmd(content2)
  }

  getAllEncours() {
    this.data.getAllEmpruntsEncours().subscribe(res => {
      this.empruntsCours = res;
    })
  }

  getAllNouveaux() {
    this.data.getAllEmpruntsNouveaux().subscribe(res => {
      this.empruntsNouveaux = res;
    })
  }

  getAllRetards() {
    this.data.getAllEmpruntsEnRetard().subscribe(res => {
      this.empruntsRetards = res;
    })
  }

  getAllRegles() {
    this.data.getAllEmpruntsregles().subscribe(res => {
      this.empruntsRegles = res;
    })
  }

  getLivre(id) {
    this.data.oneLivre(id).subscribe(res => {
      this.livre = res;
    })
  }

  //recuperer un etudiant
  getEtudiant(id) {
    this.data.oneEtudiant(id).subscribe(res => {
      this.etudiant = res;
    })
  }

  //confirmer emprunt
  confirmerEmprunt(emprunt) {
    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, confirmer!",
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
            }
          })
          this.data.confirmerEmprunt(emprunt).subscribe(_ => {
            this.Model.objet="Confirmation emprunt"
            this.Model.destinataire = this.etudiant.user.email;
            this.Model.message = "Votre emprunt qui a pour numero " + emprunt.numeroEmprunt + " vient d'etre confirmé";
            this.data.sendEmailEtudiant(this.Model).subscribe(_ => {
            this.ngOnInit();
            this.modal.close();
            this.swalWithBootstrapButtons.fire(
              "Confirmé!",
              "Emprunt confirmer avec succes",
              "success"
            );
          },
            err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de l'operation",
                "error"
              );
            });
          },
          err => {
            this.swalWithBootstrapButtons.fire(
              "Erreur!",
              "Une erreur est survenue lors de l'operation",
              "error"
            );
          });
        }
      });
  }

  //regler emprunt
  reglerEmprunt(emprunt, livre: Livre) {
    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, regler!",
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
            }
          })
          livre.nbdisponible += 1;
          this.data.editLivre(livre).subscribe(res => {
            this.data.reglerEmprunt(emprunt).subscribe(_ => {
              this.Model.objet="Reglage emprunt"
              this.Model.destinataire = this.etudiant.user.email;
              this.Model.message = "Votre emprunt qui a pour numero " + emprunt.numeroEmprunt + " vient d'etre reglé";
              this.data.sendEmailEtudiant(this.Model).subscribe(_ => {
              this.modal.close();
              this.swalWithBootstrapButtons.fire(
                "reglée!",
                "Reservation reglée avec succes",
                "success"
              );
              this.ngOnInit();
            },
              err => {
                this.swalWithBootstrapButtons.fire(
                  "Erreur!",
                  "Une erreur est survenue lors de l'operation",
                  "error"
                );
              })
            },
            err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de l'operation",
                "error"
              );
            })
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

  //rechercher emprunyt
  rechercherEmprunt(e) {
    console.log(e.target.value)
    const resultats1: Emprunt[] = [];
    const resultats2: Emprunt[] = [];
    const resultats3: Emprunt[] = [];
    const resultats4: Emprunt[] = [];

    for (const emprunt of this.empruntsCours) {
      if (emprunt.numeroEmprunt.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats1.push(emprunt);
      }
    }
    for (const emprunt of this.empruntsRegles) {
      if (emprunt.numeroEmprunt.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats2.push(emprunt);
      }
    }

    for (const emprunt of this.empruntsNouveaux) {
      if (emprunt.numeroEmprunt.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats3.push(emprunt);
      }
    }

    for (const emprunt of this.empruntsRetards) {
      if (emprunt.numeroEmprunt.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats4.push(emprunt);
      }
    }

    this.empruntsCours = resultats1;
    this.empruntsRegles = resultats2;
    this.empruntsNouveaux = resultats3;
    this.empruntsRetards = resultats4;

    if (resultats1.length === 0 || !e.target.value) {
      this.getAllEncours()
    }
    if (resultats2.length === 0 || !e.target.value) {
      this.getAllRegles()
    }
    if (resultats3.length === 0 || !e.target.value) {
      this.getAllNouveaux()
    }
    if (resultats4.length === 0 || !e.target.value) {
      this.getAllRetards()
    }
  }

  SupprimerEmprunt(id, idlivre, iduser) {

    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, confirmer!",
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
          this.getLivre(idlivre);
          this.getEtudiant(iduser);
          this.livre.nbdisponible += 1;
          this.data.editLivre(this.livre).subscribe(res1 => {
            this.data.deleteEmprunt(id).subscribe(res => {
              this.Model.objet="Annulation emprunt"
              this.Model.destinataire = this.etudiant.user.email;
              this.Model.message = "Votre emprunt qui a pour numero " + id + " a ete annulé car le delai de confirmation a été dépasseé";
              this.data.sendEmailEtudiant(this.Model).subscribe(_ => {
                this.ngOnInit()
                this.swalWithBootstrapButtons.fire(
                  "Validé!",
                  "Emprunt annulé  avec succes",
                  "success"
                );
              }, err => {
                this.swalWithBootstrapButtons.fire(
                  "Erreur!",
                  "Une erreur est survenue lors de l'annulation",
                  "error"
                );
              })
            }, err => {
              this.swalWithBootstrapButtons.fire(
                "Erreur!",
                "Une erreur est survenue lors de l'annulation",
                "error"
              );
            })
          }, err => {
            this.swalWithBootstrapButtons.fire(
              "Erreur!",
              "Une erreur est survenue lors de l'annulation",
              "error"
            );
          }
          )
        }
      })
  }

}
