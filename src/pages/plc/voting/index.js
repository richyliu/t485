import React from "react"
import {navigate} from "gatsby";


const VoteIndexPage = () => {
  React.useEffect(() => {
    navigate("/plc/voting/vote");

  })
  return <p>Loading</p>;

}

export default VoteIndexPage
