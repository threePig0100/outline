import { observable } from "mobx";
import Model from "./base/Model";
import Field from "./decorators/Field";

class Room extends Model {
  static modelName = "Room";

  @Field
  @observable
  id: string;

  @Field
  @observable
  name: string;

  @observable
  memberCount: number;
}

export default Room;
