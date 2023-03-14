import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Input, Layout, Modal, Row, Spin } from 'antd';
import { PlusCircleFilled, UserOutlined } from '@ant-design/icons';
import { addDoc, collection, getDocs, doc } from "firebase/firestore"
import firestore from '../../fireBase';
import { orderBy } from 'lodash';


import SimpleImageSlider from 'react-simple-image-slider';
import Image1 from "../../assets/Image1.jpg";

import logo from '../../logo.svg';

const Players = () => {
  const totalCost = useRef(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [perPlayerCost, setPerPlayerCost] = useState(totalCost.current);

  const [dateOfPlay, setdateOfPlay] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [groundName, setGroundName] = useState("");
  const [playTime, setPlayTime] = useState("");


  const fbRef = collection(firestore, "players");
  const groundInforef = collection(firestore, "groundInfo");

  useEffect(() => {
    const cost = (totalCost.current / (players.length === 0 ? + players.length + 1 : players.length));
    setPerPlayerCost(cost);
  }, [players])

  useEffect(() => {
    setPageLoading(true);
    getDocs(fbRef).then((querySnapshot: any) => {
      const newData: any = querySnapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
      const finalData = orderBy(newData, 'date', 'desc');
      console.log("$finalData***", finalData);
      setPlayers(finalData[0].players);
      setPageLoading(false);
    })

    getDocs(groundInforef).then((querySnapshot: any) => {
      const newData: any = querySnapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));

      const groundInfo = newData[0];
      totalCost.current = groundInfo.totalAmount;
      setGroundName(groundInfo.groundName);
      setdateOfPlay(groundInfo.date);
      setDayOfWeek(groundInfo.dayOfWeek);
      setPlayTime(groundInfo.time);
      setPageLoading(false);
    })

  }, [])

  const { Header, Footer, Content } = Layout;

  const images = [
    { url: Image1 },
    { url: Image1 },
    { url: Image1 }
  ];

  const handleOk = () => {
    console.log("**new Player name", newPlayer);

    const lastPlayerId = players.length + 1;

    const newList: any = [...players];
    newList.push({ id: lastPlayerId, name: newPlayer });
    setPlayers(newList);
    setIsModalOpen(false);
    setNewPlayer("");
    setPageLoading(true);
    console.log("****new list", newList)
    try {
      const data = {
        players: newList,
        date: Date.now()
      }
      addDoc(fbRef, data).then(()=>{
        getDocs(fbRef).then((querySnapshot: any) => {
          const newData: any = querySnapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
          const finalData = orderBy(newData, 'date', 'desc');
          setPlayers(finalData[0].players);
        }).then(()=>{
          getDocs(fbRef).then((querySnapshot: any) => {
            const newData: any = querySnapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
            const finalData = orderBy(newData, 'date', 'desc');
            console.log("$finalData***", finalData);
            setPlayers(finalData[0].players);
            setPageLoading(false);
          })
        })
        
      });

    } catch (error) {
      console.log("error", error);

    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewPlayer("");
  }

  const handleDeleteClick = (id: any, name: any) => {
    let indexID: number = 0;
    const updatedPlayersList: any = [];

    players.forEach((playerInfo: any) => {
      if (id !== playerInfo.id && name !== playerInfo.name) {
        ++indexID;
        const tempplayer = {
          id: indexID,
          name: playerInfo.name
        }
        updatedPlayersList.push(tempplayer);
      }
    });

    setPlayers(updatedPlayersList);
    setPageLoading(true);
    try {
      const data = {
        players: updatedPlayersList,
        date: Date.now()
      }
      addDoc(fbRef, data).then(()=>{
        getDocs(fbRef).then((querySnapshot: any) => {
          const newData: any = querySnapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
          const finalData = orderBy(newData, 'date', 'desc');
          console.log("$finalData***", finalData);
          setPlayers(finalData[0].players);
          setPageLoading(false);
        })
      });
    } catch (error) {
      console.log("error", error);
    }

  }

  const renderPlayerName = (id: any, name: any) => {
    return (
      <Card style={{ width: "95%" }}>
        <Row style={{ width: "100%" }}>
          <Col span={2}>{id}.</Col>
          <Col span={13}>
            <div style={{ display: "flex" }}>{name}</div>
          </Col>
          <Col span={9}>
            <Button type="primary" danger size='small' onClick={() => { handleDeleteClick(id, name) }}>
              Delete Entry
            </Button>
          </Col>
        </Row>
      </Card>
    )
  }

  return (
      <div style={{ display: "flex", flexDirection: "column" }}>

        <div style={{ height: "24vh" }}>
          <SimpleImageSlider
            height={"24%"}
            width={"100%"}
            images={images}
            showBullets={true}
            showNavs={true}
            autoPlay={true}
          />
        </div>

        <Spin spinning={pageLoading}>
          <div>
            <div>
              <h1>{groundName}</h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span style={{ paddingRight: 10 }}>
                  <h5>Date: {dateOfPlay} ({dayOfWeek})</h5>
                </span>
                <span style={{ display: "flex" }}>
                  <h5 style={{ color: "#ff4d4f" }}>{`Time: 8.30PM - 10.30PM`}</h5>
                </span>
              </div>
              <div>
                <h5>Booking Cost: {totalCost.current}/-</h5>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "center", margin: 20, flexDirection: 'column' }}>
                {
                  players.map((playerInfo: any, index: number) => {
                    return (
                      <div style={{ paddingBottom: 10 }} key={index + playerInfo.name}>
                        {renderPlayerName(playerInfo.id, playerInfo.name)}
                      </div>
                    )
                  })
                }
              </div>
              <div>
                <Button shape='circle' size='large' type="primary" icon={<PlusCircleFilled />} onClick={() => { setIsModalOpen(true) }}>
                  Add Player
                </Button>
              </div>

              <div style={{ paddingTop: 10 }}>
                <span>Approx Per Person Cost: {Math.ceil(perPlayerCost)}/-</span>
              </div>
            </div>
          </div>
        </Spin>

        <Modal title="Add New Player" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Input size="middle" placeholder="Player Name" prefix={<UserOutlined />} onChange={(e) => { setNewPlayer(e.target.value) }} value={newPlayer} />
        </Modal>

      </div>
  )
}

export default Players;