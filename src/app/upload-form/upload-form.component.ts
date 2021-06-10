import { Component, OnInit } from '@angular/core';
import { FileUpload } from '../helpers/file-upload';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {


   selectedFiles?: FileList;
  currentFileUpload: FileUpload = new FileUpload(null);
  percentage: number = 0;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }



  upload(): void {
    if(this.selectedFiles !== undefined){
      const file = this.selectedFiles.item(0);
      this.selectedFiles = undefined;
  
      this.currentFileUpload = new FileUpload(file);
      this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
        percentage => {
          if(percentage !== undefined)
                    this.percentage = Math.round(percentage);
        },
        error => {
          console.log(error);
        }
      );
    }

  }

}
