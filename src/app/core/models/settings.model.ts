// Dynamic Field Models
export interface NewDynamicField {
    referenceId: string;
    referenceName: string;
    metaDataType: string;
    merchantId: string;
}

export interface UpdateDynamicField {
    referenceId: string;
    referenceName: string;
    metaDataType: string;
    merchantId: string;
}

export interface GetDynamicFieldsParams {
    MerchantId: string;
    MetaDataType: string;
    ReferenceId?: string;
}

export interface DynamicFieldResponse {
    referenceId: string;
    referenceName: string;
    metaDataType: string;
    merchantId: string;
    createdBy: string;
    dateCreated: string;
    editedBy: string;
    dateEdited: string;
}

export interface DeleteDynamicField {
    merchantId: string;
    metaDataType: string;
    referenceId: string;
}
