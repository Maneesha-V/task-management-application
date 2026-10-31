import { IUser } from "../models/User.model";
import { UserDTO } from "../types/authTypes";

export class UserMapper {
    static mapUserDTO(doc: IUser): UserDTO {
        return {
            _id: doc._id.toString(),
            name: doc.name.toString(),
            email: doc.email.toString()
        }
    }
    static mapUsersDTO(docs: IUser[]): UserDTO[] {
        return docs.map((doc)=>this.mapUserDTO(doc))
    }
}