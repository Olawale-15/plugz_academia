export interface NewTransfer {
  recId: number;
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  sourceClassId: string;
  sourceSubClassId: string;
  destinationClassId: string;
  destinationSubClassId: string;
  naration: string;
  transferDate: string;
}

export interface UpdateTransfer {
  recId: number;
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  sourceClassId: string;
  sourceSubClassId: string;
  destinationClassId: string;
  destinationSubClassId: string;
  naration: string;
  transferDate: string;
}

export interface ApproveTransfer {
  merchantId: string;
  recId: 0;
  studentId: string;
  studentName: string;
  academicSession: string;
  academicTerm: string;
  transferStatus: string;
}

export interface DeleteTransfer {
  merchantId: string;
  recId: number;
  studentId: string;
  studentName: string;
  academicSession: string;
  academicTerm: string;
  transferStatus: string;
}

export interface GetTransferPrams {
  MerchantId: string;
  RecId: number;
  StudentId: string;
  StudentName: string;
  AcademicSession: string;
  AcademicTerm: string;
  TransferStatus: string;
}

export interface GetTransferResponse {
  merchantId: string;
  recId: number;
  studentId: string;
  StudentName: string;
  academicSession: string;
  academicTerm: string;
  TransferStatus: string;
  sourceClassId: string;
  sourceSubClassId: string;
  destinationClassId: string;
  destinationSubClassId: string;
  naration: string;
  transferDate: string;
}
