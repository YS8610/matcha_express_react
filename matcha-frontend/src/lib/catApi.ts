const CATAAS_URL = 'https://cataas.com/cat';

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export async function getRandomCatPhoto(): Promise<CatImage> {
  const randomId = Math.random().toString(36).substring(7);
  const timestamp = Date.now();
  return {
    id: randomId,
    url: `${CATAAS_URL}?${timestamp}`,
    width: 800,
    height: 600,
  };
}

export async function getRandomCatPhotoAsFile(): Promise<File> {
  try {
    const catData = await getRandomCatPhoto();

    const imageResponse = await fetch(catData.url);

    if (!imageResponse.ok) {
      throw new Error('Failed to download cat image');
    }

    const blob = await imageResponse.blob();

    const file = new File([blob], `cat-${catData.id}.jpg`, { type: blob.type || 'image/jpeg' });

    return file;
  } catch (error) {
    throw new Error('Failed to load random cat photo. Try uploading your own photo instead.');
  }
}
