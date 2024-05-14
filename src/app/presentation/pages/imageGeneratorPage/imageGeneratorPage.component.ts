import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TextMessageEvent } from "@components/text-boxes/textMessageFileBox/textMessageFileBox.component";
import { TextMessageSelectEvent } from "@components/text-boxes/textMessageSelectBox/textMessageSelectBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-image-generator-page',
    standalone: true,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent
    ],
    templateUrl: './imageGeneratorPage.component.html',
    styleUrl: './imageGeneratorPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGeneratorPageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);


    handleMessage(prompt: string) {
       this.isLoading.set(true);
       this.messages.update(prev =>[...prev, {text: prompt, isGpt: false}]);

       this.openIaService.imageGeneration(prompt)
       .subscribe(resp => {

            if(!resp)return

            this.isLoading.set(false);
            this.messages.update(prev =>[...prev, {text: resp.alt, isGpt: true, imageInfo: resp}]);

       })

    }




}
