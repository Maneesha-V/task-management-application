import { ITask } from "../models/Task.model";
import { TaskDTO } from "../types/taskTypes";

export class TaskMapper {
    static mapTaskDTO(doc: ITask): TaskDTO {
        return {
            _id: doc._id.toString(),
            title: doc.title.toString(),
            description: doc.description?.toString() ?? "",
            status: doc.status.toString(),
            dueDate: doc.dueDate ?? "",
            owner: doc.owner.toString(),
        }
    }
    static mapTasksDTO(docs: ITask[]): TaskDTO[] {
        return docs.map((doc) => this.mapTaskDTO(doc));
    } 
}