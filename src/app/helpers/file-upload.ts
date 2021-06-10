export class FileUpload {
    key: string = "";
    name: string = "";
    url: string = "";
    file: File | null;
  
    constructor(file: File | null) {
      this.file = file;
    }
  }