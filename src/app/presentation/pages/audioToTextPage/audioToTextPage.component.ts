import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TextMessageEvent, TextMessageFileBoxComponent } from "@components/text-boxes/textMessageFileBox/textMessageFileBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { AudioToTextResponse, Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-audio-to-text-page',
    standalone: true,
    templateUrl: './audioToTextPage.component.html',
    styleUrl: './audioToTextPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent,
        TextMessageFileBoxComponent
    ]
})
export default class AudioToTextPageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);


    handleMessageFile({ prompt, file }: TextMessageEvent) {
       const text = prompt ?? file.name ?? 'Traduce el siguiente audio a texto';
       this.isLoading.set(true);

       this.messages.update((prev) => [...prev, { text, isGpt: false }]);

       this.openIaService.audioToText(file, text)
        .subscribe(resp => this.handleResponse(resp) );
    }

    handleResponse(resp: AudioToTextResponse | null) {
        this.isLoading.set(false);
        if(!resp) return;

        const text = `## Transcripción
__Duracion: ${Math.round(resp.duration)} segundos.__

## El Texto es:
${resp.text}
        `;

        this.messages.update((prev) => [...prev, { text, isGpt: true }]);

        for (const segment of resp.segments) {
            const segmentMessage=`
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__ 
${segment.text}        
            `;
            this.messages.update((prev) => [...prev, { text:segmentMessage , isGpt: true }]);
        }
       
    }

}
