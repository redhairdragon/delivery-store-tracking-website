export enum InfoType {
    ErrorResponse,
    PackageInfo
}
export class Info {
    infotype: InfoType
    content: any
    constructor(infotype_: InfoType, content_: any) {
        this.infotype = infotype_
        this.content = content_
    }
}
