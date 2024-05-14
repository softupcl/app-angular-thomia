import { environment } from "environments/environment";

export const createThreadUseCase = async() => {
    try {
        const resp = await fetch(`${environment.assinstantApi}/create-thread`, {
            method: 'POST',
        });

        const {id} = await resp.json() as {id: string};
        console.log({id})
        return id;

    } catch (error) {
        throw new Error('Error creando el hilo.')
    }
}