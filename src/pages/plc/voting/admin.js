import React from "react"

import Layout from "../../../components/layout/layout"
import SEO from "../../../components/seo"
import { Table } from "react-bootstrap";
import { FirebaseContext, useFirebase } from "gatsby-plugin-firebase";

const PLCVotingAdminPage = () => {
  const [devices, setDevices] = React.useState({});
  const firebase = React.useContext(FirebaseContext);

  useFirebase(firebase => {
    setDevices({});// this is ok because useFirebase only gets called once
    firebase
      .firestore()
      .collection("plcvoting")
      .doc("test")
      .collection("devices")
      .onSnapshot(function(querySnapshot) {
        console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
          let deviceId = doc.id;
          let currentVoter = doc.data();
          if (currentVoter.currentlyVoting) {
            setDevices(oldDevices => {
              let newDevices = Object.assign({}, oldDevices);
              if (!newDevices[deviceId]) newDevices[deviceId] = {};
              newDevices[deviceId]["currentlyVoting"] = {
                name: currentVoter.voteInProgress.name,
                status:{
                  vote:"Voting",
                  verify:"Reviewing Selection",
                  Unknown:"Unknown"
                }[currentVoter.voteInProgress && currentVoter.voteInProgress.status ? currentVoter.voteInProgress.status.mode || "Unknown" : "Unknown"] || "Unknown",
                statusColor:"warning",
                voterId: currentVoter.voteInProgress.voterId,
              }
              return newDevices;
            })
          }

          firebase
            .firestore()
            .collection("plcvoting")
            .doc("test")
            .collection("devices")
            .doc(deviceId)
            .collection("votes")
            .onSnapshot((voterQueryShapshot) => {
              voterQueryShapshot.forEach(voter => {
                let voterId = voter.id;
                setDevices(oldDevices => {
                  let newDevices = Object.assign({}, oldDevices);
                  if (!newDevices[deviceId]) newDevices[deviceId] = {};
                  newDevices[deviceId][voterId] = {
                    name: voter.data().name,
                    status: "Done",
                    statusColor:"success"
                  }
                  return newDevices;
                })

              });
            })


        })
      });
  }, []);


  let table = [];
  console.log(devices);
  if(devices) {
    for (let [deviceid, docs] of Object.entries(devices)) {
      if (docs) {

        for (let [docid, data] of Object.entries(docs)) {
          console.log(docid, data.voterId, data.voterId && docs[data.voterId])
          if (docid === "currentlyVoting" && data.voterId && !!docs[data.voterId]) continue;
          // data.voterId only exists on unassigned users.
          table.unshift(<tr key={deviceid + "" + docid}>
              <td>{deviceid}</td>
              <td>{data.voterId || docid}</td>
              <td>{data.name}</td>
              <td className={"text-" + data.statusColor}>{data.status}</td>
            </tr>)
        }
      }
    }
  }
  return (
    <Layout>
      <SEO title="PLC Voting | Admin" />
      <h1>PLC Voting Admin</h1>
      <b>Devices</b>
      <Table responsive hover>
        <thead>
        <tr>
          <th>Device ID</th>
          <th>Voter ID</th>
          <th>Name</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {table}
        </tbody>
      </Table>
    </Layout>
  )
}

export default PLCVotingAdminPage;
