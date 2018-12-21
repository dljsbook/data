// http://images.cocodataset.org/val2017/000000397133.jpg

const getFile = (path: string) => (bucket: BUCKET) => `Coco/${BUCKETS[bucket]}/${path}`;
const getImage = (path: string) => getFile(`images/${path}`);

export enum BUCKET {
  VAL,
  TRAIN,
}

// export const IMAGE_ROOT = 'http://images.cocodataset.org';
const BUCKETS = {
  [BUCKET.VAL]: 'val2017',
  [BUCKET.TRAIN]: 'train2017',
};

export const GET_MANIFEST = getImage('manifest.json');

export const GET_IMAGES = (bucket: BUCKET, path: string = '') => getImage(path)(bucket);

// export const GET_IMAGE_PATH = (bucket: BUCKET, path: string) => `${IMAGE_ROOT}/${BUCKETS[bucket]}/${path}`;

export const GET_CATEGORIES = getFile('categories.json');
