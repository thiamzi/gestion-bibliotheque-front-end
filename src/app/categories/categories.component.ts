import { Categorie } from './../modeles/categorie';
import { ModalService } from '../Service/modal.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../Service/database.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, AfterViewInit {

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

  nom: string;
  form: FormGroup;
  categories: Categorie[] = [];
  categorie: Categorie;

  constructor(private modal: ModalService, private build: FormBuilder, private data: DatabaseService) { }

  ngOnInit(): void {
    this.getAllCategories()
    this.form = this.build.group({
      'nom': ['', [Validators.maxLength(20), Validators.minLength(2), Validators.required , Validators.pattern(/^[a-zA-Z]*$/)]]
    })
  }

  ngAfterViewInit() { }

  open1(content1, categorie: Categorie) {
    this.categorie = categorie;
    this.form.patchValue(this.categorie);
    this.modal.open(content1);
  }

  open2(content2) {
    this.ngOnInit()
    this.modal.open(content2)
  }

  getAllCategories() {
    this.data.getAllCategories().subscribe(data => {
      this.categories = data;
    })
  }

  addCategorie() {

    if (this.verifier(this.form.get('nom').value)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Le nom de categorie que vous avez entre existe deja",
        "error"
      );
    }
    else {
      this.data.addCategorie(this.form.value).subscribe(_ => {
        this.modal.close()
        this.swalWithBootstrapButtons.fire(
          "creé!",
          "Categorie crééé avec succes.",
          "success"
        );
        this.ngOnInit();
      }, (_ => {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "Une erreur est survenu lors l'ajout. Veuillez reessayer plutard!",
          "error"
        );
      })
      )
    }

  }

  editCategorie() {
    this.categorie.nom = this.form.get('nom').value;
    if (this.verifier1(this.categorie)) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Le nom de categorie que vous avez entre existe deja",
        "error"
      );
    } else {
      this.data.editCategorie(this.categorie).subscribe(_ => {
        this.modal.close()
        this.swalWithBootstrapButtons.fire(
          "modifieé!",
          "Categorie modifiée avec succes.",
          "success"
        );
        this.ngOnInit();
      })
    }

  }

  delete(categorie: Categorie) {
    if (categorie.livreList.length > 0) {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Supression impossible: cette categorie contients des livres",
        "error"
      );
    }
    else {
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
            this.data.deletCategorie(categorie.idcategorie).subscribe(() => {
              this.getAllCategories();
              this.swalWithBootstrapButtons.fire(
                "Supprimé!",
                "Categorie supprimée avec succes",
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

  verifier(nom: string): boolean {
    this.getAllCategories();
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].nom === nom) {
        return true;
      }
    }
    return false;
  }

  verifier1(categorie: Categorie): boolean {
    this.getAllCategories();
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].idcategorie !== categorie.idcategorie) {
        if (this.categories[i].nom === categorie.nom) {
          return true;
        }
      }
    }
    return false;
  }

}
