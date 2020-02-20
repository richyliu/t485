import React from "react"

import Layout from "../../../components/layout/layout"
import SEO from "../../../components/seo"
import { Spinner,  Table, Button, ButtonGroup, Form, FormControl, Row, Col, Alert, InputGroup } from "react-bootstrap";
import { FirebaseContext, useFirebase } from "gatsby-plugin-firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'


const CampaignManagement = ({firebase, campaign}) => {
  const [devices, setDevices] = React.useState({});
  const [detailedDeviceView, setDetailedDeviceView] = React.useState(false);
  const sendEvent = (type, id) => {
    let timestamp;
    if (type === "showFraudMessage" || type === "hideFraudMessage") {
      // the default TTL for a fraud message is 12 hours. The message can be overridden by future messages, however
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
  //TODO: either hide the device/voter id's on the non detailed view, or use some sort of table where you can toggle visibility (ideal)
  // TODO: see https://react-bootstrap-table.github.io/
  return (
    <>
       &nbsp;| <a className="d-inline" className="p-0" onClick={() => setDetailedDeviceView((before) => !before)}> {detailedDeviceView ? "Disable" : "Enable"} Detailed Device View</a> | <p className="d-inline">{table.length} ballots tallied</p>
    <Row>
      <Col lg={3} hidden={detailedDeviceView} className="ml-0">
        <h3>Manage</h3>
        <VotingStatus firebase={firebase} originalStatus={0} />
        <div className="pt-3">
          <h3>Emergencies Only</h3>
          <b>Don't click the red button!</b>
          <NuclearButton width="200" firebase={firebase} />
        </div>
      </Col>
      <Col lg={detailedDeviceView ? 12 : 6}>

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
      </Col>
      <Col lg={3} hidden={detailedDeviceView}>

        <h3>Voting Options</h3>
        <VotingOptions firebase={firebase} editable={true} />
      </Col>
    </Row>
    </>
  )
}

const VotingStatus = ({firebase, originalStatus}) => {
  const [serverStatus, setServerStatus] = React.useState(originalStatus);
  const [status, setStatus] = React.useState(originalStatus);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const statusOptions = ["Open", "Closed to New", "Closed"];

  const onSubmit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setServerStatus(status);
      setTimeout(() => {
        setSaved(false);
      }, 5000)
    }, 1000)
  }
  return (
    <>
      <b>Voting Status</b>
      <ButtonGroup>
        {
          statusOptions.map((name, i) => {

            return (
              <Button key={i} disabled={saving} variant={status == i ? "primary" : "secondary"} onClick={() => {setStatus(i);setSaved(false);}}>{name}</Button>
            )
          })
        }

      </ButtonGroup>
      {
        !saving && !saved ?
          <>
            <Button className="mt-3" hidden={status === serverStatus} block variant="primary" onClick={onSubmit}>Save Changes</Button>
            <Button hidden={status === serverStatus} block onClick={() => setStatus(serverStatus)} variant="secondary">Reset</Button>
          </> :
          saving ?
          <div class="text-center my-2">
            <Spinner animation="border" />
          </div>
            : <span className="text-success">Saved!</span>
      }
    </>
  )
}

const VotingOptions = ({firebase, editable}) => {
  const [options, setOptions] = React.useState([
    {
      name:"Game",
      maxVotes:2,
      options:[
        "G1",
        "Game2",
        "Game Game Game"
      ]
    },
    {
      name:"Scout Skill",
      maxVotes:2,
      options:[
        "Skill 1",
        "Skill 2",
        "Skill Skill Skill 3"
      ]
    }
  ]);
  const [newOptions, setNewOptions] = React.useState(new Array(options.length).fill(""));
  return (
    <>
      {
        options.map((opt, i) => (
          <div key={i}>
            <h4>{opt.name}</h4>
            <p className="text-muted">Max Votes: <b>{opt.maxVotes}</b> <span hidden={!editable}>(<a>Change</a>)</span></p>
            <ul>
              {
                opt.options.map(name => (
                  <li key={name}>{name}</li>
                ))

              }
              <li hidden={!editable}>
                <InputGroup className="mb-3">
                <FormControl placeholder="Add new option..." value={newOptions[i]} onChange={(e) => {
                  let value = e.target.value;
                  setNewOptions((old) => {
                    let newArr = old.slice();
                    newArr[i] = value;
                    return newArr;
                  })
                }}/>
                <InputGroup.Append>
                  <Button variant="outline-primary" disabled={newOptions[i].replace(/\s/g, "") === ""} onClick={() => {
                    setOptions(old => {
                      let newObj = Object.assign([], old);
                      newObj[i].options.push(newOptions[i]);
                      setNewOptions((old) => {
                        let newArr = old.slice();
                        newArr[i] = "";
                        return newArr;
                      })
                      return newObj;
                    })
                  }}><FontAwesomeIcon icon={faPlus} /></Button>
                </InputGroup.Append>
              </InputGroup>
              </li>
            </ul>
          </div>
        ))
      }
      <h4><a>New Category</a></h4>
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
            setName(e.target.value.replace(/[^a-z0-9]/g, ""));
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
    <p className="text-muted">Only lowercase letters and numbers are allowed. All spaces and non alphanumeric characters will be removed.</p>
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
          alert("Denied. Not time yet!");
          {
            // firebase
            //   .firestore()
            //   .collection("plcvoting")
            //   .doc("test")
            //   .collection("events")
            //   .add({
            //     timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            //     type:"rickroll",
            //     target:"everyone",
            //     startTime:firebase.firestore.Timestamp.fromMillis(new Date().getTime() + 3000)
            //   })
          }
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
      <a hidden={page === "auth" || page === "campaignSelect"} onClick={() => setPage("campaignSelect")}>Return to campaign select</a>

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
                  <li key={name}><a onClick={() => {
                    setCampaign(name);
                    setPage("manage");
                  }}>{name}</a></li>

                )
              }
              <li><a onClick={() => setPage("newCampaign")}>Create New</a></li>
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
