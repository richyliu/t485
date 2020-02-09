import React from "react"
import { Link } from "gatsby";
import Layout from "../../../components/layout"
import SEO from "../../../components/seo"

import { Spinner, Button, Form } from "react-bootstrap";
//TODO: change name
const VoteComponent = function ({name, data, onSubmitted, onCancel}) {
  const [vote, setVote] = React.useState(Array(data.length).fill([]));
  const [valid, setValid] = React.useState(Array(data.length).fill(true));
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState("vote");
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
              options={category.options}
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
            data.map( (category, i) =>
              <p key={i}>
                <b>{category.name}</b>: {
                vote[i].filter(x => x).length === 0 ?
                  <i>None Selected</i> :
                    vote[i].map((selected, i) => {

                      if (selected) {
                        return category.options[i] + ", ";
                      } else {
                        return ""
                      }
                    }).join("").slice(0, -2) //remove the last comma and space

              }
              </p>
            )
          }

          <Button variant="link" block className="p-0" disabled={loading} onClick={() => setMode("vote")}>Edit Your Selection</Button>

          <Button block variant="primary" disabled={loading} onClick={() => {setLoading(true); setTimeout(() => {onSubmitted()}, 1500)}}>{
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

const VoteGroup = function({ id, options, maxVotes, onChange, onValidityChange, initialState, disabled }) {
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
    console.log(valid, 1133);
    onValidityChange(valid)
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
  console.log(disabled);
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

const PLCVotingPage = function () {
  const [name, setName] = React.useState("");
  const [page, setPage] = React.useState("auth");
  let data = [
    {
      name:"Scout Skill",
      maxVotes:2,
      options:[
        "Rum on the beach",
        "Wine Making",
        "Underwater basket weaving"
      ]
    },
    {
      name:"Game",
      maxVotes:1,
      options:[
        "Apples",
        "Oranges"
      ]
    }
  ]

 return (
  <Layout>
    <SEO title="PLC Voting" />
    <h1>PLC Voting</h1>
    <p>
      Welcome to the PLC Voting Portal!&nbsp;
    {name.trim() ? (<>You are voting as <b>{name.trim()}</b>.</>) : ""}
    </p>
    <hr />
    {
      {
        auth:<>
          <Form.Group controlId="name">
            <Form.Label>Your Name: </Form.Label>
            <Form.Control type="text" placeholder="Enter your name..." value={name} onChange={(e) => setName(e.target.value)} />
            <Form.Text className="text-muted">
              Enter your real, full name, or your vote will be removed. Voting fraud corrupts headcounts and constitutes grounds for a three month voting ban.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" block className="mt-2" onClick={function() { setPage("vote"); setName(name.trim());}}>Begin Voting</Button>
        </>,
        vote:<VoteComponent name={name} data={data} onSubmitted={() => setPage("done")} onCancel={() => setPage("auth")} />,
        done:<>
          <h3>Thanks, {name}!</h3>
          <p>Your vote has been registered. You may now:</p>
          <ul>
            <li><a href="/plc/voting" onClick={(e) => {
            e.preventDefault();
            window.location.reload();
            }
            }>Hand your device to somebody else to allow them to vote</a></li>
            <li><Link to="/plc/voting/">View Live Results</Link></li>
          </ul>
        </>
      }[page]
    }

  </Layout>
)};

export default PLCVotingPage
