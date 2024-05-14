import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";
import { TextMessageSelectBoxComponent, TextMessageSelectEvent } from "../../components/text-boxes/textMessageSelectBox/textMessageSelectBox.component";

@Component({
    selector: 'app-text-to-audio-page',
    standalone: true,
    templateUrl: './textToAudioPage.component.html',
    styleUrl: './textToAudioPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent,
        TextMessageSelectBoxComponent
    ]
})
export default class TextToAudioPageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);

    public voices = signal([
        { id: "nova", text: "Nova" },
        { id: "alloy", text: "Alloy" },
        { id: "echo", text: "Echo" },
        { id: "fable", text: "Fable" },
        { id: "onyx", text: "Onyx" },
        { id: "shimmer", text: "Shimmer" },
    ]);  


    handleMessageWithSelect({prompt, selectedOption}  : TextMessageSelectEvent) {
        const message = `${selectedOption} ${prompt}`;

        this.messages.update((prev) => [...prev, { text: message, isGpt: false }]);
        this.isLoading.set(true);

        this.openIaService.textToAudio(prompt, selectedOption)
            .subscribe(({ message, aurioUrl }) => {
                this.isLoading.set(false);
                this.messages.update((prev) => [
                    ...prev, 
                    { 
                        text: message, 
                        isGpt: true, 
                        audioUrl: aurioUrl 
                    }
                ]);
            });
             

    }
}
