import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";
import { TextMessageSelectBoxComponent, TextMessageSelectEvent } from "../../components/text-boxes/textMessageSelectBox/textMessageSelectBox.component";
import { TextMessageEvent } from "@components/text-boxes/textMessageFileBox/textMessageFileBox.component";

@Component({
    selector: 'app-traslate-page',
    standalone: true,
    templateUrl: './traslatePage.component.html',
    styleUrl: './traslatePage.component.css',
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
export default class TraslatePageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);

    public languages = signal([
        { id: 'alemán', text: 'Alemán' },
        { id: 'árabe', text: 'Árabe' },
        { id: 'bengalí', text: 'Bengalí' },
        { id: 'español', text: 'Español' },
        { id: 'francés', text: 'Francés' },
        { id: 'hindi', text: 'Hindi' },
        { id: 'inglés', text: 'Inglés' },
        { id: 'japonés', text: 'Japonés' },
        { id: 'mandarín', text: 'Mandarín' },
        { id: 'portugués', text: 'Portugués' },
        { id: 'ruso', text: 'Ruso' },
    ]);

    handleMessageWithSelect({prompt, selectedOption}  : TextMessageSelectEvent) {

        const message = `Traduce a ${selectedOption}: ${prompt}`;
       
        this.isLoading.set(true);
        this.messages.update((prev) => [
            ...prev, 
            {
                text: message, 
                isGpt: false
            }
        ]);

        this.openIaService.translateText(prompt, selectedOption).subscribe((resp) => {
            this.isLoading.set(false);
            this.messages.update((prev) => [
                ...prev,
                {
                    text: resp.message,
                    isGpt: true
                }
            ]);
        });
    }
}
