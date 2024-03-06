import Group from "~/models/Group";
import {action} from "mobx";
import {client} from "~/utils/ApiClient";
import {PaginationParams, type SearchResult} from "~/types";
import omitBy from "lodash/omitBy";
import {SearchParams} from "~/stores/DocumentsStore";
import Store from "~/stores/base/Store";
import Document from "~/models/Document";
import Room from "~/models/Room";
import RootStore from "~/stores/RootStore";

type FetchPageParams = PaginationParams & { query?: string };
export default class RoomStore extends Store<Room>{

    constructor(rootStore: RootStore) {
        super(rootStore, Room);
    }
    // @action
    // createRoom = async () => {
    //     const res = await client.post("/rooms.create",{query : "1"});
    // }
}