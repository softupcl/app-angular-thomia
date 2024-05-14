import { AudioToTextResponse, ImageDescriptionResponse } from "app/interfaces";
import { environment } from "environments/environment";

export const imageDescriptionUseCase = async (imageFile: File,prompt?: string ) => {

    try {

        const formData = new FormData();

        formData.append('file', imageFile);
        
        if(prompt){
            formData.append('prompt', prompt);
        } 


        const resp = await fetch(`${environment.backendApi}/image-description`, {
            method: 'POST',
            body:  formData,
        });

        const data= await resp.json() as ImageDescriptionResponse

        return data;

    } catch (error) {
        console.log(error);
        return null
    }

}