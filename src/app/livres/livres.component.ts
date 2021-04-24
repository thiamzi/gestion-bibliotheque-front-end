import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Categorie } from '../modeles/categorie';
import { Image } from '../modeles/image';
import { Livre } from '../modeles/livre';
import { DatabaseService } from '../Service/database.service';
import { FirebaseService } from '../Service/firebase.service';
import { ModalService } from '../Service/modal.service';

@Component({
  selector: 'app-livres',
  templateUrl: './livres.component.html',
  styleUrls: ['./livres.component.css']
})
export class LivresComponent implements OnInit {

  timerInterval: any;
  id_categorie: number;
  name_categorie: string;

  swalWithBootstrapButtons = Swal.mixin({
    buttonsStyling: true
  });

  swalWithBootstrapButtons1 = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: true
  });

  subtitle: string;
  form: FormGroup;
  form1: FormGroup;
  categories: Categorie[] = [];
  livres: Livre[] = [];
  selectedFiles: FileList;
  currentFileUpload: Image;
  percentage: number;
  pathLivres = '/livres';
  livre: Livre = null;
  submit : boolean = false;

  constructor(private modal: ModalService, private build: FormBuilder, private data: DatabaseService, private uploadService: FirebaseService) {
    this.subtitle = 'This is some text within a card block.';
  }
  ngOnInit(): void {
    this.getAllCategories();
    this.TousLesLivte();
    this.form = this.build.group({
      "titre": ['', [Validators.maxLength(45), Validators.required, Validators.minLength(2)]],
      "auteur": ['', [Validators.maxLength(30), Validators.required, Validators.minLength(2)]],
      "description": ['', [Validators.maxLength(255), Validators.required, Validators.minLength(60)]],
      "exmplaire": [0, [Validators.required, Validators.min(1)]],
      "categorieIdcategorie": [0, Validators.required],
      "image": [''],
    })

  }

  //Ouverture des modales----------------------------------------------------------------------------------------------------

  open1(content1) {
    this.ngOnInit();
    this.modal.open(content1)
  }

  open2(content2, livre) {
    this.modal.openlg(content2)
    this.livre = livre;
    this.OneCategorie(livre.categorieIdcategorie)
  }
  open3(content3, livre) {
    this.modal.open(content3)
    this.form.patchValue(livre);
    this.OneCategorie(livre.categorieIdcategorie)
    this.livre = livre;
  }

  open4(content1, livre) {
    this.form1 = this.build.group({
      "image": ['', Validators.required],
    })
    this.livre = livre;
    this.modal.open(content1)
  }
//rcuperetaion des categories---------------------------------------------------------------------------------------------------
  getAllCategories() {
    this.data.getAllCategories().subscribe(data => {
      this.categories = data;
      this.categories.reverse();
    })
  }

  //evenement recuperer un input de type file-------------------------------------------------------------------------------------
  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  //Ajouter un livre-------------------------------------------------------------------------------------------------------------
  ajouter() {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new Image(file);
    Swal.fire({
      title: 'veuillez patientez!',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    })
    this.uploadService.pushFileToStorageLivre(this.currentFileUpload, this.pathLivres, this.form.value).subscribe(
      percentage => {
        this.percentage = Math.round(percentage)
      }
    );
  }
//recuperation des livres-----------------------------------------------------------------------------------------------------------
  TousLesLivte() {
    this.data.getAllLivres().subscribe(res => {
      this.livres = res;
    })
  }

  //selection de categorie-------------------------------------------------------------------------------------------------------
  changeCategorie(e) {
    this.submit = false;
    this.categories.forEach((categorie) => {
      if (categorie.nom === e.target.value) {
        this.form.get('categorieIdcategorie').setValue(categorie.idcategorie, {
          onlySelf: true
        })
        this.submit = true
      }
    })
  }

  //recuperer un categorie-------------------------------------------------------------------------------------------------------
  OneCategorie(id) {
    this.data.oneCategorie(id).subscribe(cate => {
      this.name_categorie = cate.nom;
    })
  }

  //modifier un livre-----------------------------------------------------------------------------------------------------------
  modifier() {
    this.livre.auteur = this.form.get('auteur').value;
    this.livre.titre = this.form.get('titre').value;
    this.livre.exmplaire = this.form.get('exmplaire').value;
    this.livre.description = this.form.get('description').value;
    this.livre.categorieIdcategorie = this.form.get('categorieIdcategorie').value;

    this.data.editLivre(this.livre).subscribe(_ => {
      this.modal.close();
      this.swalWithBootstrapButtons.fire(
        "modfié!",
        "Livre modfié avec succes.",
        "success"
      );
      this.TousLesLivte();
    }, _ => {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Une erreur est survenu. Veuillez verifier reessayer plutard!",
        "error"
      );
    })
  }

  //supprimer livre------------------------------------------------------------------------------------------------------------------
  supprimer(livre: Livre) {
    if (livre.reservationList.length > 0 || livre.empruntList.length > 0) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Supression impossible: ce livre est lies a des emprunts ou reservation",
        "error"
      );
    } else {
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
            this.uploadService.supprmerLivre(livre);
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Livre supprimé avec succes',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.ngOnInit()
            })
          }
        });
    }
  }

//Modifier image livre-----------------------------------------------------------------------------------------------------
  modifierLivreImage() {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new Image(file);
    this.uploadService.editFileToStorage(this.currentFileUpload, this.pathLivres, this.livre).subscribe(
      percentage => {
        this.percentage = Math.round(percentage)
        if (this.percentage == 100) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Image modofiée avec succes',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.modal.close();
            this.TousLesLivte();
            this.percentage = 0;
          })
        }
      }
    );
  }

//Rechercher livre
  rechercherLivre(e){
    const resultats1: Livre[] = [];
    for (const livre of this.livres) {
      if (livre.auteur.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) != -1
          || livre.titre.toLocaleLowerCase().indexOf(e.target.value.toLocaleLowerCase()) != -1) {
        resultats1.push(livre);
      }
    }
    this.livres = resultats1;

    if(resultats1.length===0 || !e.target.value){
      this.TousLesLivte();
    }
  }
}
