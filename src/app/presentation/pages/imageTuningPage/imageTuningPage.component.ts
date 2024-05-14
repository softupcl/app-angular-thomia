import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { GptEditableImageComponent } from "@components/chat-bubbles/gptEditableImage/gptEditableImage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-image-tuning-page',
    standalone: true,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent,
        GptEditableImageComponent
    ],
    templateUrl: './imageTuningPage.component.html',
    styleUrl: './imageTuningPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTuningPageComponent { 
    public messages = signal<Message[]>([]);


    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);

    public originalImage = signal<string | undefined>(undefined);
    public maskImage = signal<string | undefined>(undefined);

    
    handleMessage(prompt: string) {
       this.isLoading.set(true);
       this.messages.update(prev =>[...prev, {text: prompt, isGpt: false}]);

       this.openIaService.imageGeneration(prompt, this.originalImage(), this.maskImage())
       .subscribe(resp => {

            if(!resp)return

            this.isLoading.set(false);
            this.messages.update(prev =>[...prev, {text: resp.alt, isGpt: true, imageInfo: resp}]);

       })

    }

    generateVariation() {
        this.isLoading.set(true);
        this.openIaService.imageVariation(this.originalImage()!)
        .subscribe(resp => {
            if(!resp) return;
            this.isLoading.set(false);
            this.messages.update(prev =>[...prev, {text: resp.alt, isGpt: true, imageInfo: resp}]);
        })

    }

    handleImageChange(newImage: string, originalImage: string ) {
        this.originalImage.set(originalImage);
        this.maskImage.set(newImage);
        


    }
}
