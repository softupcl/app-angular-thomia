import type{ OrthographyResponse } from "app/interfaces";
import { environment } from "environments/environment";

export const orthographyUseCase = async (prompt:string) =>{

    try {

        const resp = await fetch(`${environment.backendApi}/orthography-check`, {
            method: 'POST',
            body: JSON.stringify({prompt}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!resp.ok) throw new Error('No se pudo realizar la corrección');
        const data = await resp.json() as OrthographyResponse;
        
        return {
          ok: true,  
          ...data
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'Error'
        }
    }

}