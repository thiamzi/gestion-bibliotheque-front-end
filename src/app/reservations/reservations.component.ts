import { AuthserviceService, Userdetails } from './../Service/authservice.service';
import { Reservation } from './../modeles/reservation';
import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Etudiant } from '../modeles/etudiant';
import { Livre } from '../modeles/livre';
import { DatabaseService } from '../Service/database.service';
import { ModalService } from '../Service/modal.service';
import { EmailModel } from '../modeles/EmailModel';


@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})

export class ReservationsComponent implements OnInit {

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

  resrevationCours: Reservation[] = [];
  resrevationReglees: Reservation[] = [];

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
    imageCle: {
      cle: 0,
      nom: "",
      url: "",
      file: null
    },
    valide: null,
    dateCreation: null,
    user: null,
    empruntList: null,
    reservationList: null
  };
  reservation: Reservation;

  user: Userdetails = {
    exp: 0,
    iat: 0,
    sub: "",
    isAdmin: false,
    isAgent: false,
    isBibliothecaire: false,
    isEtudiant: false
  }
  date: Date;

  Model: EmailModel = {
    objet: "Annulation de reservation",
    destinataire: "",
    message: "",
    numero: "",
    password: ""
  }

  constructor(private modal: ModalService, private data: DatabaseService, private auth: AuthserviceService) { }

  ngOnInit(): void {
    this.date = new Date;
    this.user = this.auth.getUserdetails();
    this.getEncours();
    this.getReglees();
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'tab-preventchange2') {
      $event.preventDefault();
    }
  }

  open2(content2, reservation: Reservation) {
    this.reservation = reservation;
    this.getEtudiant(reservation.etudiantUserIduser);
    this.getLivre(this.reservation.livreIdlivre);
    this.modal.openmd(content2);
  }

  getEncours() {
    this.data.getReservationsEnCours().subscribe(res => {
      this.resrevationCours = res;
    });
  }

  getReglees() {
    this.data.getReservationsReglees().subscribe(res => {
      this.resrevationReglees = res;
    });
  }

  getLivre(id) {
    this.data.oneLivre(id).subscribe(res => {
      this.livre = res;
    });
  }

  getEtudiant(id) {
    this.data.oneEtudiant(id).subscribe(res => {
      this.etudiant = res;
    });
  }

  rechercherReservation(e) {
    console.log(e.target.value)
    const resultats1: Reservation[] = [];
    const resultats2: Reservation[] = [];

    for (const reservation of this.resrevationCours) {
      if (reservation.numeroReservation.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats1.push(reservation);
      }
    }
    for (const reservation of this.resrevationReglees) {
      console.log(reservation)
      if (reservation.numeroReservation.toLocaleString().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats2.push(reservation);
        console.log("rse" + resultats2)
      }
    }

    this.resrevationCours = resultats1;
    this.resrevationReglees = resultats2;
    console.log(this.resrevationReglees)

    if (resultats1.length === 0 || !e.target.value) {
      this.getEncours();
    }
    if (resultats2.length === 0 || !e.target.value) {

      this.getReglees()
    }
  }

  SupprimerReservation(id, idlivre, iduser) {
    this.swalWithBootstrapButtons1
      .fire({
        title: "Etes vous sûre?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, confimer!",
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
            this.data.deleteReservation(id).subscribe(res => {
              this.Model.destinataire = this.etudiant.user.email;
              this.Model.message = "Votre reservation qui a pour numero " + id + " a ete annulé car la date fin a été depassée ";
              this.data.sendEmailEtudiant(this.Model).subscribe(_ => {
                this.ngOnInit()
                this.swalWithBootstrapButtons.fire(
                  "Validé!",
                  "Reservation annulée  avec succes",
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

