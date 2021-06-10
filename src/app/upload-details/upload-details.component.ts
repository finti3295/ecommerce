import { Component, OnInit, Input } from '@angular/core';
import { FileUpload } from '../helpers/file-upload';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.css']
})
export class UploadDetailsComponent implements OnInit {

  @Input() fileUpload: FileUpload = new FileUpload(null);;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  deleteFileUpload(fileUpload:FileUpload): void {
    this.uploadService.deleteFile(fileUpload);
  }

}
