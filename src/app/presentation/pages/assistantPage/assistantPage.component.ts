import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MyMessageComponent } from "@components/chat-bubbles/MyMessage/MyMessage.component";
import { ChatMessageComponent } from "@components/chat-bubbles/chatMessage/chatMessage.component";
import { TextMessageBoxComponent } from "@components/text-boxes/textMessageBox/textMessageBox.component";
import { TypingLoaderComponent } from "@components/typingLoader/typingLoader.component";
import { Message } from "app/interfaces";
import { OpenIaService } from "app/presentation/services/openia.service";

@Component({
    selector: 'app-assistant-page',
    standalone: true,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent
    ],
    templateUrl: './assistantPage.component.html',
    styleUrl: './assistantPage.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {

    public messages = signal<Message[]>([]);
    public isLoading = signal<boolean>(false);
    public openIaService = inject(OpenIaService);

    public threadId = signal<string| undefined>(undefined);

    ngOnInit(): void {
        console.log('Creae thread');
        this.openIaService.createThreadId().subscribe(id => {
            this.threadId.set(id);
        });
    }

    handleMessage(question: string) {
        this.isLoading.set(true);
        this.messages.update(prev => [...prev ,{text:question, isGpt: false}]);

        this.openIaService.postQuestion(this.threadId()!, question)
        .subscribe(resp => {
            this.isLoading.set(false);
            
            for (const reply of resp) {
                for (const messages of reply.content) {
                    this.messages.update(prev => [
                        ...prev, 
                        {
                            text: messages, 
                            isGpt: reply.role === 'assistant'
                        }
                    ]);
                    
                }    
            }
        });
    }
}
