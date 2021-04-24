import { ModalService } from './modal.service';
import { DatabaseService } from 'src/app/Service/database.service';
import { Image } from '../modeles/image';
import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import Swal from 'sweetalert2';
import { Livre } from '../modeles/livre';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  swalWithBootstrapButtons = Swal.mixin({
    buttonsStyling: true
  });

  image = {
    cle: 0,
    nom: "",
    url: ""
  };
  livre = {
    idlivre: 0,
    titre: "",
    auteur: "",
    description: "",
    exmplaire: 0,
    nbdisponible: 0,
    imageCle: "",
    categorieIdcategorie: 0,
  };

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, private data: DatabaseService , private modal : ModalService) { }

  //AJOUTER LIVRE
  //------------------------------------------------------------------------------------------------------------------------
  pushFileToStorageLivre(fileUpload: Image, basePath: string, livre: any): Observable<number> {
    const path = `${basePath}/${fileUpload.file.name + "" + Date.now().toString()}`;
    const filePath = path;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.nom = filePath;
          this.saveLivreData(fileUpload, livre);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  private saveLivreData(fileUpload: Image, livre: any): void {
    this.data.addImage(fileUpload).subscribe(img => {
      this.livre = livre;
      this.livre.imageCle = img.cle;
      this.livre.nbdisponible = livre.exmplaire;
      this.data.addLivre(this.livre).subscribe(liv => {
        this.modal.close();
        this.swalWithBootstrapButtons.fire(
          "creé!",
          "Livre creé avec succes.",
          "success"
        );
        window.location.reload();
      }, err => {
        this.swalWithBootstrapButtons.fire(
          "Erreur!",
          "Une erreur est survenu. Veuillez reessayer plutard!",
          "error"
        );
      });
    }, err1 => {
      this.swalWithBootstrapButtons.fire(
        "Erreur!",
        "Une erreur est survenu. Veuillez reessayer plutard!",
        "error"
      );
    });
  }

  //EDITER IMAGE LIVRE OU CARTE ETUDUIANT
  //-----------------------------------------------------------------------------------------------------------------------


  editFileToStorage(fileUpload: Image, basePath: string, object: any): Observable<number> {
    const path = `${basePath}/${fileUpload.file.name + "" + Date.now().toString()}`;
    const filePath = path;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          let nonIgm = object.imageCle.nom;
          object.imageCle.url = downloadURL;
          object.imageCle.nom = filePath;
          this.saveImageData(object, nonIgm);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  private saveImageData(object: any, omImg: string): void {
    this.data.editImage(object.imageCle).subscribe(res => {
      this.deleteFileStorage(omImg);
    })
  }


  //SUPPRIMER LIVRE
  //-----------------------------------------------------------------------------------------------------------------------


  supprmerLivre(livre: Livre) {
    this.data.deletlivre(livre.idlivre).subscribe(_ => {
      this.data.deleteImage(livre.imageCle.cle).subscribe(res => {
        this.deleteFileStorage(livre.imageCle.nom)
      },
        err => {
          this.swalWithBootstrapButtons.fire(
            "Erreur!",
            "Une erreur est survenue lors de la suppression",
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
      })
  }

  //RECUPERER DONNEES SUR FIREBASE
  //-------------------------------------------------------------------------------------------------------------------------

  /*getFiles(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }*/

  //SUPRIMMER DONNEES ET FICHIERS SUR FIREBASE
  /*deleteFile(fileUpload: Image, basePath: string): void {
    this.deleteFileDatabase(fileUpload.cle, basePath)
      .then(() => {
        this.deleteFileStorage(fileUpload.nom);
      })
      .catch(error => console.log(error));
  }*/

  /* private deleteFileDatabase(key: string, basePath: string): Promise<void> {
     return this.db.list(basePath).remove(key);
   }*/

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref('');
    return storageRef.child(name).delete();
  }

  //RECUPERER FICHIERS SUR FIREBASE
  //-----------------------------------------------------------------------------------------------------------------------------------
  /*recupImage(key) {
    return new Promise((resolve, reject) => {
      this.db.database.ref('/livres/' + key).once('value').then((data) => {
        resolve(data.val());
      },
        (error) => {
          reject(error);
        }
      );
    });
  }*/

  //SUPRIMER ET FICHIERS ET METTRE A JOUR DONNEES SUR FIRE BASE
  //-----------------------------------------------------------------------------------------------------------------------------------
  editImage(basePth: string, key: string, image: Image, nom: string): Promise<any> {
    this.deleteFileStorage(nom);
    return this.db.list(basePth).update(key, image);
  }
}

