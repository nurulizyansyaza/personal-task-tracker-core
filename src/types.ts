export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string | null;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}
