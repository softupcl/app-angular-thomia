import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


export interface TextMessageEvent{
  file : File
  prompt?: string | null
}

@Component({
  selector: 'app-text-message-file-box',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageFileBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageFileBoxComponent {
  @Input() placeholder: string = '';
  @Input() disableCorrection: boolean = false;

  @Output() onMessage = new EventEmitter<TextMessageEvent>();
  

  public fb = inject(FormBuilder);
  public form = this.fb.group({
    prompt: [],
    file: [null, Validators.required]
  });

  public file: File | undefined;

  handleSelectedFile(event: any) {
    const file = event.target.files.item(0);
    this.form.controls.file.setValue(file);
  }

  handleSubmit() {
    if (this.form.invalid) return;

    const { prompt, file } = this.form.value;
    this.onMessage.emit({prompt, file: file! });
    this.form.reset();
  }
}