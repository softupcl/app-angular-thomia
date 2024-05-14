import { Injectable } from '@angular/core';
import { audioToTextUseCase, imageDescriptionUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyUseCase, prosConsStreamUseCase, prosConsUseCase, textToAudioUseCase } from '@use-cases/index';
import { translateUseCase } from '@use-cases/translate/translate-text.use-case';
import { Observable, from, of, tap } from 'rxjs';
import { createThreadUseCase } from '../../core/use-cases/assistant/create-thread.use-case';
import { postQuestionUseCase } from '../../core/use-cases/assistant/post-question.use-case';


@Injectable({ providedIn: 'root' })
export class OpenIaService {

    checkOrthography(prompt: string) {
        return from(orthographyUseCase(prompt));
    }

    prosCons(prompt: string) {
        return from(prosConsUseCase(prompt));
    }

    prosConsStream(prompt: string, abortSignal: AbortSignal) {
        return prosConsStreamUseCase(prompt, abortSignal);
    }

    translateText(prompt: string, lang: string) {
        return from(translateUseCase(prompt, lang));
    }

    textToAudio(prompt: string, voice: string) {
        return from(textToAudioUseCase(prompt, voice));
    }

    audioToText(file: File, prompt?: string) {
        return from(audioToTextUseCase(file, prompt));
    }

    imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
        return from(imageGenerationUseCase(prompt, originalImage, maskImage));
    }

    imageVariation(originalImage: string,) {
        return from(imageVariationUseCase(originalImage));
    }

    createThreadId(): Observable<string> {
        if (localStorage.getItem('thread')) {
            return of(localStorage.getItem('thread')!);
        }
        return from(createThreadUseCase())
            .pipe(
                tap((thread) => {
                    console.log({thread})
                    localStorage.setItem('thread', thread);
                })
            )
    }

    postQuestion(threadId: string,question: string ) {
        return from(postQuestionUseCase( threadId, question));
    }
    
    imageDescription(file: File, prompt?: string) {
        return from(imageDescriptionUseCase(file, prompt));
    }

}


