import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-gpt-message-orthopraphy',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './gptMessageOrthopraphy.component.html',
  styleUrl: './gptMessageOrthopraphy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageOrthopraphyComponent { 
  @Input({required:true}) userScore!: number;
  @Input({required:true}) text!: string;
  @Input() errors: string[]=[];
}
