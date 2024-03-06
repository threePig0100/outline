import {observer} from "mobx-react";
import * as React from "react";
import './index.css';
import { AccessToken } from "livekit-server-sdk";
import Storage from "@shared/utils/Storage";
import useStores from "~/hooks/useStores";
import axios from "axios";
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks
} from "@livekit/components-react";
import {RoomEvent,Track} from "livekit-client";
import '@livekit/components-styles';
import Router from "koa-router";
import LoadingIndicator from "~/components/LoadingIndicator";


import {useEffect, useState} from "react";
import Heading from "~/components/Heading";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {newDocumentPath} from "~/utils/routeHelpers";
import {CopyIcon, PlusIcon} from "outline-icons";
import Button from "~/components/Button";
import Flex from "~/components/Flex";
import Input from "~/components/Input";
import CopyToClipboard from "~/components/CopyToClipboard";
import styled from "styled-components";
import {s} from "@shared/styles";

type Props = { notFound?: boolean };
const serverUrl = "wss://treepig-xfr1lc4a.livekit.cloud"
interface Room {
    sid: string;
    name: string;
    emptyTimeout: number;
    maxParticipants: number;
    creationTime: string;
    turnPassword: string;
    enabledCodecs: Array<{ mime: string; fmtpLine: string }>;
    metadata: string;
    numParticipants: number;
    numPublishers: number;
    activeRecording: boolean;
}

function Room(props: Props) {
    const { t } = useTranslation();
    const [roomList, setRooms] = useState<Room[]>([]);
    const [token, setToken] = useState("");
    const [roomName, setRoomName] = useState(""); // 新增的 state
    const router = new Router();
    const [loading, setLoading] = useState(false);
    const handleGenerateRoom = () => { //生成房间
        // rooms.createRoom().then(r => {})
        setLoading(true)
        axios.post('https://121.41.58.48:4000/createRoom', {roomName}) // 修改的 axios 请求
            .then(function (response: { data: any; }) {
                getRooms(); // 创建房间成功后刷新房间列表
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }
    const getToken = (roomName: string) => {
        const participantName = Storage.get("AUTH_STORE").user.name;
        axios.post('https://121.41.58.48:4000/getToken', {roomName, participantName})
            .then(function (response: { data: any; }) {
                setToken(response.data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };
    const getRooms = () => {
        setLoading(true)
        axios.get('https://121.41.58.48:4000/listRoom')
            .then(function (response: { data: any; }) {
                setRooms(response.data);
                setLoading(false)
            })
            .catch(function (error: any) {
                console.log(error);
            });
    }
    useEffect(() => {
        getRooms(); // Call roomList on component mount

    }, []);
    return (
        <div>
            <Heading>{t("Room")}</Heading>
            <div style={{width: '500px', marginTop: '20px 0'}}>
                <CopyBlock>
                    <Flex align="flex-end" gap={8}>
                        <Input type="text"
                               value={roomName}
                               label={t("Want create a room with your team?")}
                               flex
                               onChange={e => setRoomName(e.target.value)}/>
                        <Button style={{marginLeft: '10px', marginBottom: "16px",}}
                                flex
                                onClick={handleGenerateRoom}>
                            {t("创建房间")}
                        </Button>
                    </Flex>
                </CopyBlock>
            </div>
            {
                roomList.length > 0 &&
                <table className={'room-table'}>
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>房间名</th>
                    </tr>
                    </thead>
                    <tbody>
                    {roomList.map((room, index) => (
                        <tr key={index} onClick={
                            () => {
                                getToken(room.name);
                                setLoading(true);
                            }
                        }>
                            <td style={{}}>{index + 1}</td>
                            <td style={{}}>{room.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
            <div>
                {loading && <LoadingIndicator/>}
                {token && (
                    <LiveKitRoom
                        onDisconnected={() => {
                            console.log("disconnected")
                            setToken("")
                        }}
                        onConnected={() => {
                            console.log("connected")
                            setLoading(false)
                        }}
                        video={true}
                        audio={true}
                        token={token}
                        serverUrl={serverUrl}
                        data-lk-theme="default"
                        style={{height: '100vh'}}
                    >
                        <MyVideoConference/>
                        <RoomAudioRenderer/>
                        <ControlBar/>
                    </LiveKitRoom>
                )}
            </div>
        </div>
    );
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
        [
            {source: Track.Source.Camera, withPlaceholder: true},
            {source: Track.Source.ScreenShare, withPlaceholder: false},
        ],
        {onlySubscribed: false},
    );
    return (
        <GridLayout tracks={tracks} style={{height: 'calc(100vh - var(--lk-control-bar-height))'}}>
            {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
            <ParticipantTile />
        </GridLayout>
    );
}

const CopyBlock = styled("div")`
  margin: 2em 0;
  font-size: 14px;
  background: ${s("secondaryBackground")};
  border-radius: 8px;
  padding: 16px 16px 8px;
`;
export default observer(Room);