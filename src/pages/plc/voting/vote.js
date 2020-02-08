import React from "react"

import Layout from "../../../components/layout"
import SEO from "../../../components/seo"

import { Alert, Button, Form } from "react-bootstrap";

const VoteComponent = function ({name, data}) {
  const [vote, setVote] = React.useState(Array(data.length).fill([]));
  const [valid, setValid] = React.useState(Array(data.length).fill(true));
  return (
    <>
      <p>Commence the voting, {name}!</p>
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
              onChange={function(newState) {
                setVote(function(oldVote) {
                  let newVote = oldVote.slice();
                  newVote[i] = newState;
                  return newVote;
                });
              }}

            />
          </div>
        )
      }
      <Button block variant="primary" disabled={valid.filter((x) => !x).length > 0} onClick={() => console.log(vote)}>{ (valid.filter((x) => !x).length === 0) ? "Submit" : "You voted more than the limit in at least one category"}</Button>
    </>
  );
};

const VoteGroup = function({ id, options, maxVotes, onChange, onValidityChange, initialState }) {
  const [checked, setChecked] = React.useState(initialState || options.map(() => false));
  let [valid, setValid] = React.useState(true);
  return  (
    <>
      <p className={checked.filter((x) => x).length > maxVotes ? "text-danger" : "text-muted"}><b>{checked.filter((x) => x).length} of {maxVotes}</b> vote{maxVotes === 1 ? "" : "s"} used. You are not required to use all of your votes.</p>
    <Form>

      <Form.Group controlId={id} key={id}>
        {
          options.map( (name, j ) =>
            <div key={j}>
              <Form.Check
                custom
                type="checkbox"
                id={id + "" + j} // required by react bootstrap for some stupid reason
                label={name}

                checked={checked[j]}
                onChange={() => {
                  setChecked(function(beforeChange) {
                    let newState = beforeChange.slice();
                    newState[j] = !newState[j];
                    onChange && onChange(newState); // Only call onChange if onChange exists
                    if ((newState.filter((x) => x).length <= maxVotes) !== valid) {
                      setValid(newState.filter((x) => x).length <= maxVotes); // valid may not be immediately updated, so don't rely on it for the event
                      onValidityChange && onValidityChange(newState.filter((x) => x).length <= maxVotes);
                    }
                    return newState;
                  })
                }
                }

              />
            </div>)
        }

      </Form.Group>
    </Form>
      </>
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
        vote:<VoteComponent name={name} data={data} />
      }[page]
    }

  </Layout>
)};

export default PLCVotingPage
