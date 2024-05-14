import { environment } from "environments/environment";

export const textToAudioUseCase = async (prompt: string, voice: string) => {

    try {

        const resp = await fetch(`${environment.backendApi}/text-to-audio`, {
            method: 'POST',
            body: JSON.stringify({ prompt, voice }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!resp.ok) throw new Error('No se pudo generar el audio');

        const audioFile = await resp.blob();
        const aurioUrl = URL.createObjectURL(audioFile);

        return {
            ok: true,
            message: prompt,
            aurioUrl: aurioUrl
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo generar el audio',
            aurioUrl: ''
        }
    }

}