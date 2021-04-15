import { Image } from "./image";

export interface Livre{
  idlivre: number;
  titre: string;
  auteur: string;
  description: string;
  exmplaire: number;
  nbdisponible: number;
  imageCle: Image;
  dateCreation: Date;
  empruntList: [];
  reservationList: [];
  categorieIdcategorie: number;
}
