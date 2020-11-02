export enum InfoType {
    ErrorResponse,
    PackageInfo
}
export class Info {
    infotype: InfoType
    shippingStates: any
    transferStates: any
    constructor(infotype_: InfoType, shippingStates_: any, transferStates_: any) {
        this.infotype = infotype_
        this.transferStates = transferStates_
        this.shippingStates = shippingStates_
    }
}
