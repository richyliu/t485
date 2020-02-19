import React from "react"
import { Link } from "gatsby";
import Layout from "../../../components/layout/layout"
import SEO from "../../../components/seo"
import { Spinner, Button, Form } from "react-bootstrap";
import { FirebaseContext, useFirebase } from "gatsby-plugin-firebase";

const PLCVotingPage = function () {
  const firebase = React.useContext(FirebaseContext);
  const [name, setName] = React.useState("");
  const [page, setPage] = React.useState("loading");
  const [user, setUser] = React.useState(null);
  const [voterId, setVoterId] = React.useState("");
  const [data, setData] = React.useState([]);
  const [campaignName, setCampaignName] = React.useState();

  useFirebase((fb) => {
    if (!fb) return;
    if (user) return;
    fb.auth().onAuthStateChanged((fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        fb.firestore()
          .collection("plcvoting")
          .doc("metadata")
          .get()
          .then((data) => {
            if (!data.data().activeCampaign || data.data().activeCampaign.toLowerCase() === "none") {
              setPage("closed");
              return;
            }
            setCampaignName(data.data().activeCampaign);
            setPage("auth");
            fb
              .firestore()
              .collection("plcvoting")
              .doc(data.data().activeCampaign)
              .get()
              .then((data) => {
                let options = data.data().options;
                setData(options);
              });
          })


      } else {
        firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(error);
        });
      }
    });
  }, []);
  let onAuthSubmit = () => {
    let voterId = firebase
      .firestore()
      .collection("plcvoting")
      .doc(campaignName)
      .collection("devices")
      .doc(user.uid)
      .collection("voters")
      .doc()
      .id;
    setVoterId(voterId);
    setName((oldName) => {
      let trimmedName = oldName.trim();

      firebase
        .firestore()
        .collection("plcvoting")
        .doc(campaignName)
        .collection("devices")
        .doc(user.uid) //deviceid
        .set({
          voteInProgress:{
            startTimestamp:firebase.firestore.FieldValue.serverTimestamp(),
            name: trimmedName,
            voterId:voterId
          },
          currentlyVoting:true,
        }, {merge:true}); // The field contains data pertinent to the unsubmitted data. The collection("submissions").doc() is the finished votes
      // NOTE: merge is a shallow merge, which is what we want

      return trimmedName;
    });
    setPage("vote");
    let startTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
    firebase
      .firestore()
      .collection("plcvoting")
      .doc(campaignName)
      .collection("events")
      .where("timestamp", ">=", startTimestamp)
      .orderBy("timestamp", "asc") // we want the earliest ones to be processed first. This is only important for persistent events
      // (e.g. their timestamp is set to a time that is not when the message is triggered, but one a while after)
      .where("target", "in", [user.uid, "everyone"])
      .onSnapshot(function(querySnapshot) {
        querySnapshot
          .docChanges()
          .forEach((change) => {
            if (change.type === "added") {
              let data = change.doc.data();

              switch (data.type) {
                case "rickroll":
                  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                  break;
                case "popup":
                  alert(data.popupText || "An error occurred displaying this message. Code:PayloadNotSet");
                  break;
                case "voteOptionUpdate":
                  alert("Sorry, but a new voting option was added. This page will now reload so you can vote again.");
                  window.location.reload();
                  break;

                case "showFraudMessage":
                  setPage("fraudDetected");
                  break;
                case "hideFraudMessage":
                  setPage("vote");
                  break;

              }
            }
          })
      });

  };
  return (
    <Layout admin={true}>
      <SEO title="PLC Voting" />
      <h1>PLC Voting</h1>
      <p>
        Welcome to the PLC Voting Portal!&nbsp;
        {name.trim() ? (<>You are voting as <b>{name.trim()}</b>.</>) : ""}
      </p>
      <p>Looking for the results instead? <Link to="/plc/voting/results">Click Here</Link>.</p>
      <hr />
      {
        {
          loading:<div className="text-center"><p>Awaiting verification...</p><Spinner animation="border" /></div>,
          closed:<p>Sorry, but voting is currently closed.</p>,
          auth:<>
            <Form.Group controlId="name">
              <Form.Label>Your Name: </Form.Label>
              <Form.Control type="text" placeholder="Enter your name..." name="full-name" value={name} onChange={(e) => setName(e.target.value)} />
              <Form.Text className="text-muted">
                Enter your real, full name, or your vote will be removed. Voting fraud corrupts headcounts and constitutes grounds for a three month voting ban.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" block disabled={name.trim().length === 0} className="mt-2" onClick={onAuthSubmit}>{name.trim().length === 0 ? "Enter your name to begin voting" : "Begin Voting"}</Button>
          </>,
          vote:data ?
            <VoteComponent campaignName={campaignName} voterId={voterId} user={user} name={name} data={data} onSubmitted={() => setPage("done")} onCancel={() => setPage("auth")} />
            : <p>Loading...</p>,
          done:<>
            <h3>Thanks, {name}!</h3>
            <p>Your vote has been registered. You may now:</p>
            <ul>
              <li><a href="/plc/voting" onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }
              }>Hand your device to somebody else to allow them to vote</a></li>
              <li><Link to="/plc/voting/results/">View Live Results</Link></li>
            </ul>
          </>,
          fraudDetected:<div style={{
            backgroundColor:"red",
            height:"50vh",
            padding:"3vw",
          }}>
            <h1>Voting Fraud Detected!</h1>
            <p>bruhh.</p>
            <p> Your vote was not counted. Give this to the SPL or webmaster to try again</p>
            <button onClick={() => window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>SPL/webmaster click here</button>
            <p>ID: {(user && user.uid) || "NAUTH"}</p>
            {/*<input placeholder="override code" onChange={(e) => e.target.value === "webmasteroverride" ? setPage("auth") : null} type="password" />*/}
          </div>
        }[page]
      }

    </Layout>
  )};

const VoteComponent = function ({name, data, onSubmitted, onCancel, user, voterId, campaignName}) {
  const firebase = React.useContext(FirebaseContext);

  const [vote, setVote] = React.useState(Array(data.length).fill([]));
  const [valid, setValid] = React.useState(Array(data.length).fill(true));
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState("vote");

  // Update the mode on the server each time it changes
  React.useEffect(
    () => {
      firebase
        .firestore()
        .collection("plcvoting")
        .doc(campaignName)
        .collection("devices")
        .doc(user.uid)
        .set({
          voteInProgress:{
          status: {

            mode: mode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }
          }
        }, {merge:true})
    }, [mode]
  )
  const isEmptyVote = (voteArr) => {
    // Check if every single vote is false.
    for (let i = 0; i < voteArr.length; i ++) {
      for (let j = 0; j < voteArr[i].length; j ++) {
        if (voteArr[i][j]) return false;
      }
    }
    return true;
  };

  const onSubmit = () => {
    setLoading(true);
    let batch = firebase
      .firestore()
      .batch();
    let batchRef = firebase
      .firestore()
      .collection("plcvoting")
      .doc(campaignName);

    batch.set(
      batchRef
      .collection("devices")
      .doc(user.uid), {
        currentlyVoting:false
      });
    batch.set(
      batchRef
      .collection("devices")
      .doc(user.uid)
      .collection("votes")
      .doc(voterId),
      {
        vote:JSON.stringify(vote),
        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
        name:name,
        device:user.uid
      });

    // update the counters
    for (let i = 0; i < vote.length; i ++) {
      let update = {};
      for (let j = 0; j < vote[i].length; j ++) {
        if (vote[i][j]) {
          update[j] = firebase.firestore.FieldValue.increment(1);
        }
      }
      batch
        .set(batchRef
          .collection("counters")
          .doc("1"), update, {merge: true});

    }

    batch.commit().then(() => {
      setLoading(false);
      onSubmitted();
    }).catch((error) => {
      console.log(error);
      alert("Error: " + error.message);
    });

  }
  return (
    <>
      {
        {vote:<div>
            <Button variant="link" className="p-0" onClick={() => {onCancel()}}>Cancel and return to login page</Button>

            {
              data.map( (category, i) =>
                <div key={i}>
                  <h3>{category.name}</h3>
                  <VoteGroup
                    id={i}
                    options={category.choices}
                    maxVotes={category.maxVotes}
                    onValidityChange={function (validity) {
                      setValid(function(oldValid) {
                        let newValid = oldValid.slice();
                        newValid[i] = validity;
                        return newValid;
                      });
                    }}
                    initialState={vote[i].slice()}
                    onChange={function(newState) {
                      setVote(function(oldVote) {
                        let newVote = oldVote.slice();
                        newVote[i] = newState;
                        return newVote;
                      });
                    }}
                    disabled={loading}

                  />
                </div>
              )}
            <Button block variant="primary" disabled={valid.filter((x) => !x).length > 0} onClick={() => setMode("verify")}>{ (valid.filter((x) => !x).length === 0) ? "Review Choices" : "You voted more than the limit in at least one category"}</Button>
          </div>,
          verify:<div>
            <h3>Confirm your vote</h3>

            {
              isEmptyVote(vote) ?
                <div>
                  <b>You haven't voted for anything!</b>
                  <p>Are you sure you want to do this? If you submit, your name will be added to the headcounts, but you will not impact the selected teachings in any way.</p>
                  <b>You will NOT be allowed to vote again.</b>
                </div>
                :
                data.map( (category, i) =>
                  <p key={i}>
                    <b>{category.name}</b>: {
                    vote[i].filter(x => x).length === 0 ?
                      <i>None Selected</i> :
                      vote[i].map((selected, i) => {

                        if (selected) {
                          return category.choices[i] + ", ";
                        } else {
                          return "";
                        }
                      }).join("").slice(0, -2) //remove the last comma and space

                  }
                  </p>
                )
            }
            <div className="text-center">
              <Button variant="link" className="p-0" disabled={loading} onClick={() => setMode("vote")}>Edit Your Selection</Button>
            </div>
            <Button block variant="primary" disabled={loading} onClick={onSubmit}>{
              loading ?
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Loading...</span>
                </>: "Submit Vote"
            }</Button>

          </div>
        }[mode]
      }

    </>
  );
};

const VoteGroup = function({ id, options, maxVotes, onChange, onValidityChange: onValidityUpdate, initialState, disabled }) {
  const isValid = (arr) => {
    return arr.filter(x => x).length <= maxVotes; // 1. Remove all 'false' elements from the array, 2. compare new length to max
  };
  const [checked, setChecked] = React.useState(initialState || Array(options.length).fill(false));
  const [valid, setValid] = React.useState(true);

  React.useEffect( () => {
    onChange(checked);
    setValid(isValid(checked));


  }, [checked]);
  React.useEffect(() => {
    onValidityUpdate(valid)
  }, [valid]);

  return  (
    <>
      <p className={checked.filter((x) => x).length > maxVotes ? "text-danger" : "text-muted"}><b>{checked.filter((x) => x).length} of {maxVotes}</b> vote{maxVotes === 1 ? "" : "s"} used. You are not required to use all of your votes.</p>
      <Form onSubmit={() => null}>

        <Form.Group controlId={id} key={id}>
          {
            options.map( (name, j ) =>
              <div key={j}>
                <ControlledCustomCheck
                  id={id + "" + j}
                  name={options[j]}
                  initialChecked={initialState[j]}
                  disabled={disabled}
                  onChange={(checkboxState) => {
                    setChecked(oldChecked => {
                      let newChecked = oldChecked.slice();
                      newChecked[j] = checkboxState;
                      return newChecked;
                    });
                  }}
                />
              </div>)
          }
        </Form.Group>
      </Form>
    </>
  )

}

const ControlledCustomCheck= ({initialChecked, id, name, disabled, onChange, ...passthroughProps}) => {
  const [checked, setChecked] = React.useState(initialChecked || false);
  React.useEffect( () => {
    onChange(checked);
  }, [checked]);
  return (
    <Form.Check
      custom
      type="checkbox"
      id={id} // required by react bootstrap for some weird reason
      label={name}
      disabled={disabled}
      checked={checked}
      onChange={() => {
        setChecked(function(beforeChange) {
          return !beforeChange;
        });
      }}

      {...passthroughProps} // passthroughProps may not be required by Form.Check

    />
  )
}

export default PLCVotingPage
