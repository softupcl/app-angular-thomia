import { environment } from "environments/environment";

type GeneratedIamge = Image | null;

interface Image {
    url:string
    alt:string
}

export const imageVariationUseCase = async (originalImage:String):Promise<GeneratedIamge> => {

    try {

        const resp = await fetch(`${environment.backendApi}/image-variation`, {
            method: 'POST',
            body: JSON.stringify({
                baseImage:originalImage,
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