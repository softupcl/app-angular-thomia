import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";
import { TextMessageBoxComponent } from "../../components/text-boxes/textMessageBox/textMessageBox.component";

@Component({
    selector: 'app-pros-cons-page',
    standalone: true,
    templateUrl: './prosConsPage.component.html',
    styleUrl: './prosConsPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent
    ]
})
export default class ProsConsPageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);


    handleMessage(prompt :string){
        this.isLoading.set(true);
        this.messages.update((prev) => [
            ...prev, 
            {
                text: prompt, 
                isGpt: false
            }
        ]);

        this.openIaService.prosCons(prompt).subscribe((resp) => {
            this.isLoading.set(false);
            this.messages.update((prev) => [
                ...prev,
                {
                    text: resp.content,
                    isGpt: true
                }
            ]);
        });
       
    }

 }
