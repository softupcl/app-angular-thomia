import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-my-message',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './MyMessage.component.html',
    styleUrl: './MyMessage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyMessageComponent {
    @Input({required:true}) text!: string;
 }
