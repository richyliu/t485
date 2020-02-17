import React from "react"

import Layout from "../../../components/layout/layout"
import SEO from "../../../components/seo"
import {Pie} from 'react-chartjs-2';
import randomColor from "randomcolor";
import { useFirebase } from "gatsby-plugin-firebase";
const Chart = ({voteData, title, seed}) => {
    const data = {
        labels: voteData.map(option => option.name),
        datasets: [{
            data: voteData.map(option => option.value),
            backgroundColor: randomColor({
                seed: seed,
                count:voteData.length,


            }),
        }]
    };
    const options = {
        legend: {
            onClick: () => null // The default functionality is it will toggle the visibility of the element. That doesn't make sense for this purpose.
        },
        title: {
            display: true,
            text: title
        }

    }
    return (
      <Pie data={data} options={options} />
    );
}
const VotingResultsPage = () => {
    const campaign = "test";
    useFirebase((firebase) => {
        if (!firebase) return;
    })

return (
  <Layout>
    <SEO title="PLC Voting | Results" />
    <h1>Live Voting Results</h1>
    <i>Note: Results may be corrected pending a full audit at the conclusion of voting.</i>
    <p>You just hit a route that doesn't exist... the sadness.</p>
      <Chart
        title="Scout Skills"
        seed={campaign} /*so the colors are the same for each campaign*/
         voteData={[
              {
                  name:"Beanbag Toss",
                  value:5
              },
              {
                  name:"Trampoline Pit",
                  value:13
              },
              {
                  name:"Rickrolling",
                  value:1
              }

          ]}/>
  </Layout>
)};

export default VotingResultsPage
