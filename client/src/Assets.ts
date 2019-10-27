import { Shared } from './shared/Shared'

export default class Assets {
    private static instance: Assets;
    private assets: { [key: string]: HTMLImageElement }
    private downloadPromise: Promise<PromiseLike<never>[]>

    private constructor() {
        this.downloadPromise = Promise.all(Shared.Constants.ASSET_NAMES.map(this.downloadAsset.bind(this)))
        this.assets = {}
    }

    downloadAsset(assetName: string) {
        return new Promise(resolve => {
            const asset = new Image()
            asset.onload = () => {
                console.log(`Downloaded ${assetName}`)
                this.assets[assetName] = asset;
                resolve()
            }
            asset.src = `./assets/${assetName}`
        })
    }

    downloadAssets(){
        return this.downloadPromise
    }

    getAsset(assetName: string): HTMLImageElement {
        return  this.assets[assetName]
    }

    static getInstance(): Assets {
        if (!Assets.instance) {
          Assets.instance = new Assets();
        }
        return Assets.instance;
    }
}