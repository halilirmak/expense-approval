export interface ApproveAssignmentCommand {
  expenseId: string;
  userId: string;
  approval: string;
  reason?: string;
}

export interface ApproveAssignmentResponse {
  expense: {
    id: string;
    amount: string;
    status: string;
    submitterId: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  assignment: {
    id: string;
    expenseId: string;
    reason?: string;
    approverId: string;
    status: string;
    createdAt?: Date;
  };

  nextApprover?: string;
}

export interface CreateExpenseCommand {
  amount: string;
  submitterId: string;
}
