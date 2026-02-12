// Class/SubClass Models
export interface NewClassOrSubClass {
  merchantId: string;
  classId: string;
  className: string;
  subClassId: string;
}

export interface UpdateClassOrSubClass {
  merchantId: string;
  classId: string;
  className: string;
  subClassId: string;
}

export interface GetClassParams {
  MerchantId: string;
  ClassId?: string;
}


export interface DeleteClassOrSubClass {
  merchantId: string;
  classId: string;
  subClassId: string;
}

// Subject Models
export interface NewSubject {
  merchantId: string;
  subjectId: string;
  subjectName: string;
  parentSubjectId: string;
  percentageOfParent: number;
}

export interface UpdateSubject {
  merchantId: string;
  subjectId: string;
  subjectName: string;
  parentSubjectId: string;
  percentageOfParent: number;
}

export interface GetSubjectParams {
  MerchantId: string;
  SubjectId?: string;
}

export interface SubjectResponse {
  merchantId: string;
  subjectId: string;
  subjectName: string;
  parentSubjectId: string;
  percentageOfParent: number;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

export interface DeleteSubject {
  merchantId: string;
  subjectId: string;
}
