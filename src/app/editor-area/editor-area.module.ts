import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorAreaComponent } from './editor-area.component';
import { MatButtonModule, MatProgressBarModule, MatIconModule, MatCardModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from './../file-upload/file-upload.module';
import { KeyframesLineModule } from '../keyframes-line/keyframes-line.module';


@NgModule({
  declarations: [EditorAreaComponent],
  exports: [EditorAreaComponent],
  imports: [
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressBarModule,
    KeyframesLineModule,
  ]
})
export class EditorAreaModule { }
