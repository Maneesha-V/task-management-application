import { injectable } from "inversify";
import { getIO } from "../socket/socket";

@injectable()
export class RealtimeService {
  emitToUser(userId: string, event: string, payload: unknown) {
    getIO().to(userId).emit(event, payload);
  }
}