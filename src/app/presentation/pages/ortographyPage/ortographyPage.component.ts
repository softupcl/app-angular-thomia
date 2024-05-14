import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { GptMessageOrthopraphyComponent } from "@components/chat-bubbles/gptMessageOrthopraphy/gptMessageOrthopraphy.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TextMessageEvent, TextMessageFileBoxComponent } from "@components/text-boxes/textMessageFileBox/textMessageFileBox.component";
import { TextMessageSelectBoxComponent, TextMessageSelectEvent } from "@components/text-boxes/textMessageSelectBox/textMessageSelectBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-ortography-page',
    standalone: true,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent,
        TextMessageFileBoxComponent,
        TextMessageSelectBoxComponent,
        GptMessageOrthopraphyComponent
    ],
    templateUrl: './ortographyPage.component.html',
    styleUrl: './ortographyPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrtographyPageComponent {


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

        this.openIaService.checkOrthography(prompt).subscribe((resp) => {
            this.isLoading.set(false);
            this.messages.update((prev) => [
                ...prev,
                {
                    text: resp.message,
                    info: resp,
                    isGpt: true
                }
            ]);
        });
       
    }



 }
