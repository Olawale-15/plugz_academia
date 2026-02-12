// Student Models
export interface NewStudent {
  merchantId: string;
  studentId: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  alternateEmail: string;
  telephone: string;
  alternateTelephone: string;
  contactAddress: string;
  enrollmentDate: string;
  studentStatus: string;
}

export interface UpdateStudent {
  merchantId: string;
  studentId: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  alternateEmail: string;
  telephone: string;
  alternateTelephone: string;
  contactAddress: string;
  enrollmentDate: string;
  studentStatus: string;
}

export interface UpdateStudentStatus {
  merchantId: string;
  studentId: string;
  studentname: string;
  email: string;
  telephone: string;
  studentStatus: string;
}

export interface GetStudentParams {
  MerchantId: string;
  StudentId?: string;
  Studentname?: string;
  Email?: string;
  Telephone?: string;
  StudentStatus?: string;
}

export interface StudentResponse {
  merchantId: string;
  studentId: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  alternateEmail: string;
  telephone: string;
  alternateTelephone: string;
  contactAddress: string;
  enrollmentDate: string;
  studentStatus: string;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

export interface DeleteStudent {
  merchantId: string;
  studentId: string;
  studentname: string;
  email: string;
  telephone: string;
  studentStatus: string;
}

// Enrollment Models
export interface NewEnrollment {
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  enrollmentDate: string;
  enrolmentStatus: string;
}

export interface UpdateEnrollment {
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  enrollmentDate: string;

}

export interface UpdateEnrollmentStatus {
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  enrolmentStatus: string;
}

export interface GetEnrollmentParams {
  MerchantId: string;
  EnrollmentId?: string;
  StudentId?: string;
  StudentName?: string;
  ProgrammeId?: string;
  AcademicSession?: string;
  AcademicTerm?: string;
  ClassId?: string;
  SubClassId?: string;
  EnrolmentStatus?: string;
}

export interface EnrollmentResponse {
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  enrollmentDate: string;
  enrolmentStatus: string;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

export interface DeleteEnrollment {
  merchantId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  enrolmentStatus: string;
}
