import { ProsConsResponse } from "app/interfaces";
import { environment } from "environments/environment";

export async function* prosConsStreamUseCase (prompt:string, abortySignal: AbortSignal) {
    try {

        const resp = await fetch(`${environment.backendApi}/pros-cons-discusser-stream`, {
            method: 'POST',
            body: JSON.stringify({prompt}),
            headers: {
                'Content-Type': 'application/json'
            },
            signal: abortySignal
        });

        if(!resp.ok) throw new Error('No se pudo realizar la comparación');
        
        const reader = resp.body?.getReader();
        if(!reader) {
            console.log('No se pudo generar el reader')
            throw new Error('No se pudo generar el reader');
        }

        const decoder = new TextDecoder();
        let text = '';
        while(true) {
            const { done, value } = await reader.read();
            if(done) break;
            const decodeShunk = decoder.decode(value,{stream:true});
            text += decodeShunk;
            yield text;
        }

        return text;
        
    } catch (error) {
        return null
    }
}