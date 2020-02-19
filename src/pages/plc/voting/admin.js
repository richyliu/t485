import React from "react"

import Layout from "../../../components/layout/layout"
import SEO from "../../../components/seo"
import { Spinner,  Table, Button, ButtonGroup, Form, FormControl, Switch } from "react-bootstrap";
import { FirebaseContext, useFirebase } from "gatsby-plugin-firebase";
import CreatableSelect from 'react-select/creatable';

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


class CampaignSelect extends React.Component {

  static isValidInput = (inputValue) =>{
    return !(/[^a-z0-9]/g.test(inputValue));
  };
  static OPTION_NONE = {
    label:"None",
    value:"none"
  };

  state = {
    isLoading: false,
    options: [CampaignSelect.OPTION_NONE,...this.props.options.map(label => {

      return {
        label:label,
        value:label,
      }
    })].sort((a, b) =>
    {
      // ensure that none is always first
      // and that the active campaign is always second
      if (a.value === CampaignSelect.OPTION_NONE.value) {
      return -1;
      } else if (b.value === CampaignSelect.OPTION_NONE.value) {
        return 1;
      }
      let x = a.value.toLowerCase(), y = b.value.toLowerCase();

      return x < y ? -1 : x > y ? 1 : 0;
    }),
    value: CampaignSelect.OPTION_NONE,
    open: this.props.open
  };
  handleChange = (newValue) => {
    this.setState({ value: newValue });
  };
  handleCreate = (inputValue) => {
    if (!CampaignSelect.isValidInput(inputValue)) return;
    this.setState({ isLoading: true });
    this.props.firebase
      .firestore()
      .collection("plcvoting")
      .doc("metadata")
      .set({
        campaigns: this.props.firebase.firestore.FieldValue.arrayUnion(inputValue)
      }, {merge:true})
      .then(() => {
        const { options } = this.state;
        const newOption = {label:inputValue, value:inputValue};
        this.setState({
          isLoading: false,
          options: [...options, newOption],
          value: newOption,
        });
      }).catch((e) => {
        console.log(e);
        alert("Error: " + e.message);
      });
  };

  render() {
    const { isLoading, options, value } = this.state;
    return (
      <>

          <h3>Select Campaign to Manage</h3>

        <CreatableSelect
          isClearable
          isDisabled={isLoading}
          isLoading={isLoading}
          onChange={this.handleChange}
          onCreateOption={this.handleCreate}
          options={options}
          value={value}
          formatCreateLabel={(inputValue) => {
            if (CampaignSelect.isValidInput(inputValue)) {
              return `Create "${inputValue}"`
            } else {
              return `Cannot create "${inputValue}" because it is not a lowercase letter or a number.`
            }
          }}
        />
        <Button block variant="primary" className="mt-3" onClick={() => alert("(unimplemented) Switching to " + this.state.value)}>Save Changes</Button>
        <Button block variant="secondary" onClick={() => this.setState({value: CampaignSelect.OPTION_NONE})}>Reset Changes</Button>
      </>
    );
  }
}
const PLCVotingAdminPage = () => {
  const firebase = React.useContext(FirebaseContext);
  const [page, setPage] = React.useState("auth");
  const [campaigns, setCampaigns] = React.useState([]);
  const [campaign, setCampaign] = React.useState("");

  const onAuthenticated = () => {
    setPage("loading");
    firebase
      .firestore()
      .collection("plcvoting")
      .doc("metadata")
      .onSnapshot((snapshot) => {
        let data = snapshot.data();
        setCampaigns(data.campaigns);
        setCampaign(data.activeCampaign);
        console.log(data.activeCampaign);
        // TODO: if there is a open campaign, show that. Within that page, you can close the voting for that campaign.
        // If the coting for that campaign is closed, then the user is able to switch the campaign to a different one, or create one.
        // If there are no open campaigns, the user is forced to switch to one
        // TODO: allow administrative audit: you can still manage campaigns if it's not the active campaign, but only if other campaigns are closed(?)
        if (data.activeCampaign && data.activeCampaign.toLowerCase() !== "none") {
          setPage("manage")
        } else {
        setPage("campaignSelect");
          }

      });
  }

  return (

    <Layout admin={true}>
      <SEO title="PLC Voting | Admin" />
      <h1>PLC Voting Admin</h1>
      {
        {
          auth:<div>
            <h3>Authentication</h3>
            <FormControl type="password" autofill="password" placeholder="Enter Password..." onChange={(event) => event.target.value === "athoc595014" ? onAuthenticated() : null} />
            <p className="text-muted">Upon entering the correct password, you will be immediately logged in.</p>
          </div>,
          loading:<><br /><Spinner animation="border"></Spinner></>,
          campaignSelect:<CampaignSelect activeCampaign={campaign} options={campaigns} firebase={firebase} />,
          manage: <CampaignManagement campaign={campaign} firebase={firebase} />
        }[page]
      }
    </Layout>
  )
}

export default PLCVotingAdminPage;
