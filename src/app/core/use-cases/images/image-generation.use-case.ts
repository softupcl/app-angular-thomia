import { environment } from "environments/environment";

type GeneratedIamge = Image | null;

interface Image {
    url:string
    alt:string
}

export const imageGenerationUseCase = async (prompt: string, originalImage?:String, maskImage?:string):Promise<GeneratedIamge> => {

    try {

        const resp = await fetch(`${environment.backendApi}/image-generation`, {
            method: 'POST',
            body: JSON.stringify({
                prompt,
                originalImage,
                maskImage
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            
        });

        const {url,revised_prompt:alt } = await resp.json();
        return {url, alt};
        
    } catch (error) {
        console.log(error)
        return null;
    }

}