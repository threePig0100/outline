import auth from "@server/middlewares/authentication";
import pagination from "@server/routes/api/middlewares/pagination";
import { rateLimiter } from "@server/middlewares/rateLimiter";
import { RateLimiterStrategy } from "@server/utils/RateLimiter";
import validate from "@server/middlewares/validate";
import * as T from "@server/routes/api/documents/schema";
import { APIContext } from "@server/types";
import Router from "koa-router";
// import { RoomServiceClient, Room } from 'livekit-server-sdk'
const router = new Router();
const axios = require('axios');

router.post(
    "rooms.create",
    auth({ optional: true }),
    pagination(),
    rateLimiter(RateLimiterStrategy.OneHundredPerMinute),
    validate(T.DocumentsSearchSchema),
    async (ctx: APIContext<T.DocumentsSearchReq>) => {
        const {
            query,
            includeArchived,
            includeDrafts,
            collectionId,
            userId,
            dateFilter,
            shareId,
            snippetMinWords,
            snippetMaxWords,
        } = ctx.input.body;
        console.log("收到")
        axios.get('http://localhost:4000/createRoom')
            .then(function (response: { data: any; }) {
                console.log(response.data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }
);

export default router;