import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TextMessageEvent } from '@components/text-boxes/textMessageFileBox/textMessageFileBox.component';
import { TextMessageSelectEvent } from '@components/text-boxes/textMessageSelectBox/textMessageSelectBox.component';
import { Message } from 'app/interfaces';
import { OpenIaService } from 'app/presentation/services/openia.service';
import { ChatMessageComponent } from "../../presentation/components/chat-bubbles/chatMessage/chatMessage.component";
import { MyMessageComponent } from "../../presentation/components/chat-bubbles/MyMessage/MyMessage.component";
import { TypingLoaderComponent } from "../../presentation/components/typingLoader/typingLoader.component";
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';

@Component({
    selector: 'app-chat-template',
    standalone: true,
    templateUrl: './chatTemplate.component.html',
    styleUrl: './chatTemplate.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ChatMessageComponent,
        MyMessageComponent,
        TypingLoaderComponent,
        TextMessageBoxComponent
    ]
})
export class ChatTemplateComponent {

  public messages = signal<Message[]>([{text:'Hola', isGpt:true}]);
  public isLoading = signal<boolean>(false);
  public openIaService = inject(OpenIaService);


  handleMessage(prompt :string){
      console.log({prompt});
  }

  handleMessageFile({prompt , file}: TextMessageEvent){
      console.log({prompt, file});
  }

  handleMessageWithSelect(event:TextMessageSelectEvent){
      console.log(event)
      
  }

 }
