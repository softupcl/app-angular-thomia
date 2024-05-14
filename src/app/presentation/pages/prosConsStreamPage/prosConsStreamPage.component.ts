import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-pros-cons-stream-page',
    standalone: true,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent
    ],
    templateUrl: './prosConsStreamPage.component.html',
    styleUrl: './prosConsStreamPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);

    public abortSignal = new AbortController();


    async handleMessage(prompt: string) {

        this.abortSignal.abort();
        this.abortSignal = new AbortController();

        this.messages.update(prev => [
            ...prev,
            {
                text: prompt,
                isGpt: false
            },
            {
                text: '...',
                isGpt: true
            }
        ]);

        this.isLoading.set(true);
        const stream = this.openIaService.prosConsStream(prompt, this.abortSignal.signal);
        this.isLoading.set(false);

        for await (const text of stream) {
            this.handleStreamResponse(text);
        }
    }

    handleStreamResponse(message: string) {
        this.messages().pop();
        const messages = this.messages();

        this.messages.set([...messages, { isGpt: true, text: message }]);
    }

}
