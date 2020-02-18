import React from "react"

import Layout from "../../../components/layout/layout"
import SEO from "../../../components/seo"
import { Spinner,  Table, Button, ButtonGroup, Form, FormControl, InputGroup } from "react-bootstrap";
import { FirebaseContext, useFirebase } from "gatsby-plugin-firebase";

const CampaignManagement = ({firebase, campaign}) => {
  const [devices, setDevices] = React.useState({});
  const sendEvent = (type, id) => {
    let timestamp;
    if (type === "showFraudMessage" || type === "hideFraudMessage") {
      // the default TTL for a fraud message is 12 hours. They can be overridden by future messages, however
      timestamp = firebase.firestore.Timestamp.fromMillis(firebase.firestore.Timestamp.now().toMillis() + 1000 * 60 * 60 * 12);
    } else {
      timestamp = firebase.firestore.FieldValue.serverTimestamp();
    }
    firebase
      .firestore()
      .collection("plcvoting")
      .doc(campaign)
      .collection("events")
      .add({
        timestamp:timestamp,
        type:type,
        target:id,
      })
  }

  useFirebase(firebase => {
    setDevices({});// this is ok because useFirebase only gets called once
    firebase
      .firestore()
      .collection("plcvoting")
      .doc(campaign)
      .collection("devices")
      .onSnapshot(function(querySnapshot) {
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
                timestamp: currentVoter.voteInProgress.startTimestamp,
                submitted:false
              }
              return newDevices;
            })
          }

          firebase
            .firestore()
            .collection("plcvoting")
            .doc(campaign)
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
                    statusColor:"success",
                    timestamp:voter.data().timestamp,
                    stage:true
                  }
                  return newDevices;
                })

              });
            })


        })
      });
  }, []);


  let table = [];
  if(devices) {
    // Sort devices so the same general order is presented
    // all unsubmitted ones must be on top, but otherwise the newest ones should be earlier

    for (let [deviceId, docs] of Object.entries(devices)) {
      if (docs) {

        for (let [docId, data] of Object.entries(docs)) {
          let confirmed = !(docId === "currentlyVoting");
          if (!confirmed && data.voterId && !!docs[data.voterId]) continue;
          // data.voterId only exists on unassigned users.
          table.unshift(
            {
              submitted:data.submitted,
              timestamp:data.timestamp,
              element:<tr key={deviceId + "" + docId}>
                <td>{deviceId}</td>
                <td>{data.voterId || docId}</td>
                <td>{data.name}</td>
                <td className={"text-" + data.statusColor}>{data.status}</td>
                <td>{
                  confirmed ?
                    <Button variant="danger">Remove Vote</Button> :
                    <ButtonGroup>
                      <Button variant="danger" onClick={() => sendEvent("showFraudMessage", deviceId)}>J'Accuse!</Button>
                      <Button variant="danger" onClick={() => sendEvent("hideFraudMessage", deviceId)}>Un J'Accuse!</Button>
                      <Button variant="danger" onClick={() => sendEvent("rickroll", deviceId)}>Troll</Button>
                    </ButtonGroup>
                }</td>
              </tr>})
        }
      }
    }
    table.sort((a, b) => {
      if (a.submitted !== b.submitted) {
        return a.submitted ? 1 : -1; // a should be less than b to get sorted first
      }
      return b.timestamp - a.timestamp;
    });

  }
  return (
    <>
      <NuclearButton width="500" firebase={firebase} />
      <b>Devices</b>
      <p>{table.length} ballots tallied</p>
      <Table responsive hover>
        <thead>
        <tr>
          <th>Device ID</th>
          <th>Voter ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Manage</th>
        </tr>
        </thead>
        <tbody>
        {table.map(el => el.element)}
        </tbody>
      </Table>
    </>
  )
}

const NewCampaign = ({firebase, campaignNames, onCreated}) => {
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const createNewCampaign = () => {
    setSubmitting(true);
    if (campaignNames.indexOf(name) > -1) {
      return;
    }
    firebase
      .firestore()
      .collection("plcvoting")
      .doc("metadata")
      .set({
        campaigns: firebase.firestore.FieldValue.arrayUnion(name)
      }, {merge:true})
      .then(() => {
        setSubmitting(false);
        onCreated(name)
      }).catch((e) => {
        console.log(e);
        alert("Error: " + e.message);
    });
  }
  return (<div>
    <h3>Create new Campaign</h3>
    <Form.Group md="4" controlId="validationCustomUsername">
      <Form.Label>Campaign Name</Form.Label>
        <Form.Control
          type="text"
          required
          isInvalid={!submitting && campaignNames.indexOf(name) > -1}
          onChange={(e) => {
            setName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""));
          }}
          value={name}
        />
        <Form.Control.Feedback type="invalid">
          Name already exists
        </Form.Control.Feedback>
    </Form.Group>
    <Button block className="mt-3" disabled={submitting || name === "" || campaignNames.indexOf(name) > -1} onClick={(e) => createNewCampaign(name)}>{submitting ?
      <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    /> : "Submit"}</Button>
    <p className="text-muted">Only alphanumeric characters are allowed. All spaces and non alphanumeric characters will be removed.</p>
  </div>)
}

const NuclearButton = ({width, firebase}) => {
return (
  <div>
    <img
      src="https://www.mobygames.com/images/shots/l/761261-dumb-ways-to-die-ipad-screenshot-don-t-push-the-red-button.png"
      alt="Workplace" useMap="#workmap" width={width} />

    <map name="workmap">
      <area alt="clickable big red button" shape="rect" coords={[50,50,235,250].map(x => x*(width/400)).join(",")} href="#" onClick={(e) =>
      {
        if(window.confirm("Are you sure? Don't say I didn't warn you!")){
          firebase
            .firestore()
            .collection("plcvoting")
            .doc("test")
            .collection("events")
            .add({
              timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              type:"rickroll",
              target:"everyone",
            })
        }
      }} />
    </map>

  </div>)
}

const PLCVotingAdminPage = () => {
  const firebase = React.useContext(FirebaseContext);
  const [page, setPage] = React.useState("auth");
  const [campaigns, setCampaigns] = React.useState([]);
  const [campaign, setCampaign] = React.useState("");


  const onAuthenticated = () => {
    firebase
      .firestore()
      .collection("plcvoting")
      .doc("metadata")
      .onSnapshot((snapshot) => {
        console.log(snapshot, snapshot.data());
        setCampaigns(snapshot.data().campaigns)
      });
    setPage("campaignSelect")
  }

  return (

    <Layout admin={true}>
      <SEO title="PLC Voting | Admin" />
      <h1>PLC Voting Admin</h1>
      <Button variant="link" className="p-0" hidden={page === "auth" || page === "campaignSelect"} onClick={() => setPage("campaignSelect")}>Return to campaign select</Button>

      {
        {
          auth:<div>
            <h3>Authentication</h3>
            <FormControl type="password" placeholder="Enter Password..." onChange={(event) => event.target.value === "athoc595014" ? onAuthenticated() : null} />
          </div>,
          campaignSelect:<div>
            <h3>Select Campaign to Manage</h3>
            <ul>
              {
                campaigns.map( (name) =>
                  <li key={name}><Button className="p-0" variant="link" onClick={() => {
                    setCampaign(name);
                    setPage("manage");
                  }}>{name}</Button></li>

                )
              }
              <li><Button className="p-0" variant="link" onClick={() => setPage("newCampaign")}>Create New</Button></li>
            </ul>
          </div>,
          newCampaign:<NewCampaign firebase={firebase} campaignNames={campaigns} onCreated={(name) => {
            setCampaign(name);
            setPage("manage");
          }}/>,
          manage: <CampaignManagement campaign={campaign} firebase={firebase} />
        }[page]
      }
    </Layout>
  )
}

export default PLCVotingAdminPage;
