import type{ OrthographyResponse, ProsConsResponse } from "app/interfaces";
import { environment } from "environments/environment";

export const prosConsUseCase = async (prompt:string) =>{

    try {

        const resp = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
            method: 'POST',
            body: JSON.stringify({prompt}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!resp.ok) throw new Error('No se pudo realizar la comparación');
        const data = await resp.json() as ProsConsResponse;
        
        return {
          ok: true,  
          ...data
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            role: '',
            content: 'No se pudo realizar la comparación'
        }
    }

}