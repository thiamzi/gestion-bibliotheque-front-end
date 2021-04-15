export class Image {
  cle: number;
  nom: string;
  url: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}
