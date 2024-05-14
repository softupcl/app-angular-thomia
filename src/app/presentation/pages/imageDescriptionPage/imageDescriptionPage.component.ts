import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TextMessageEvent, TextMessageFileBoxComponent } from "@components/text-boxes/textMessageFileBox/textMessageFileBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-image-description-page',
    standalone: true,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent,
        TextMessageFileBoxComponent
    ],
    templateUrl: './imageDescriptionPage.component.html',
    styleUrl: './imageDescriptionPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageDescriptionPageComponent {
    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);

    public fileMessage = signal<File | null>(null);
    public typeFile = signal<string>('');
    public newImage: any

    public imageFile: string | ArrayBuffer | null = null;

    async handleMessageFile({ prompt, file }: TextMessageEvent) {
        const text = prompt ?? 'Que ves en la imagen';

        const type = file.type.split('/').shift() ?? '';
        this.typeFile.set(type);

        if (this.typeFile() === 'image') {
            await this.cargarImagen(file)
        }

        this.isLoading.set(true);

        this.messages.update((prev) => [...prev, { text, isGpt: false }]);

        this.openIaService.imageDescription(file, text).subscribe((resp) => {
            this.isLoading.set(false);
            this.messages.update((prev) => [
                ...prev,
                {
                    text: resp!.msg,
                    isGpt: true
                }
            ]);
        });
    }

    async cargarImagen(image: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageFile = reader.result
        };
        reader.readAsDataURL(image)
    }
}




