// Grade Model
export interface NewGrading{

    merchantId: string,
    programmeId: string,
    gradeId: string,
    minMark: number,
    maxMark: number,
    gradePoint: number,
    remarks: string

}

export interface UpdateGrade{
    recId: number,
    merchantId: string,
    programmeId: string,
    gradeId: string,
    minMark: number,
    maxMark: number,
    gradePoint: number,
    remarks: string
}

export interface GetGradeParams{
    MerchantId: string
    RecId:string
}

export interface GradeResponse{
    recId: number,
    merchantId: string,
    programmeId: string,
    gradeId: string,
    minMark: number,
    maxMark: number,
    gradePoint:number
    remarks: string,
    createdBy: string,
    dateCreated:string,
    editedBy: string,
    dateEdited: string
}

export interface DeleteGradeParams{
    merchantId: string,
    recId: number
}