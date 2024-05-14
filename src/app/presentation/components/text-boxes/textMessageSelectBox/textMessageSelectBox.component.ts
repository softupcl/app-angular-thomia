import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


interface Option {
  id:string;
  text:string
}

export interface TextMessageSelectEvent {
  prompt:string;
  selectedOption: string;
}

@Component({
  selector: 'app-text-message-select-box',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './textMessageSelectBox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageSelectBoxComponent { 
  @Input() placeholder: string = '';
  @Input({required:true}) options!: Option[] ;
  
  @Output() onMessage = new EventEmitter<TextMessageSelectEvent>();

  public fb = inject(FormBuilder);
  public form = this.fb.group({
    prompt: [],
    selectedOption: ['', Validators.required]
  });

  public file: File | undefined;


  handleSubmit() {
    if (this.form.invalid) return;

    const { prompt, selectedOption } = this.form.value;


    this.onMessage.emit({prompt:prompt!, selectedOption:selectedOption! });
    this.form.reset();
  }
}
