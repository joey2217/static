import Dexie from 'dexie';

export interface ImageData {
    name: string
    url: string
}

//
// Declare Database
//
class ImageDatabase extends Dexie {
    public images: Dexie.Table<ImageData, number>; // id is number in this case

    public constructor() {
        super("ImageDatabase");
        this.version(1).stores({
            images: "++id,name,url"
        });
        this.images = this.table("images");
    }
}

const imageDatabase = new ImageDatabase();

export function select() {
    return imageDatabase.transaction('r', imageDatabase.images, async () => {
        // Query:
        const imageList = await imageDatabase.images.toArray()
        return imageList
    }).catch(e => {
        console.error(e);
        return []
    });
}

export function insert(data: ImageData) {
    return imageDatabase.images.add(data)
}