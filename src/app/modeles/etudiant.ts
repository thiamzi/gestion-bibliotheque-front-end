import { Reservation } from './reservation';
import { Emprunt } from './emprunt';
import { Image } from './image';
import { User } from './user';

export interface Etudiant {
  userIduser: number;
  numeroDossier: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  dateCreation: Date;
  user: User;
  empruntList:Emprunt[];
  reservationList:Reservation[];
}
