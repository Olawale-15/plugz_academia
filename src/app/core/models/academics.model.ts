export interface newAssessmentType {
  merchantId: string;
  assessmentId: string;
  assessmentName: string;
  weightPercentage: number;
}

export interface UpdateAssessmentType {
  merchantId: string;
  assessmentId: string;
  assessmentName: string;
  weightPercentage: number;
}

export interface GetAssessmentTypeParams {
  MerchantId: string;
  AssessmentId?: string;
}

export interface DeleteAssessmentType {
  merchantId: string;
  assessmentId: string;
}

export interface Assessment {
  merchantId: string;
  batchId: string;
  studentId: string;
  academicSession: string;
  academicTerm: string;
  subjectId: string;
  assessmentId: string;
  classId: string;
  subClassId: string;
  marksObtained: number;
  maxMark: number;
  gradedBy: string;
}

export interface GetAssessmentSummaryParams {
  MerchantId: string;
  AcademicSession?: string;
  AcademicTerm?: string;
  ClassId?: string;
  SubClassId?: string;
  SubjectId?: string;
  AssessmentId?: string;
  BatchId?: string;
}

export interface AssessmentSummaryResponse {
  merchantId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  subjectId: string;
  assessmentId: string;
  batchId: string;
  numberOfStudents: number;
  gradedBy: string;
  approvedBy: string;
  createdBy: string;
  editedBy: string;
}

export interface GetAssessmentParams {
  MerchantId: string;
  BatchId: string;
}

export interface DeleteAssessment {
  merchantId: string;
  batchId: string;
  academicSession: string;
  academicTerm: string;
  subjectId: string;
  assessmentId: string;
  classId: string;
  subClassId: string;
}

export interface ApproveAssessment {
  merchantId: string;
  batchId: string;
  academicSession: string;
  academicTerm: string;
  subjectId: string;
  assessmentId: string;
  classId: string;
  subClassId: string;
}

