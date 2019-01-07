import React from 'react';
import {Layout} from 'antd';
import './index.css';
const {Content} = Layout;

const FAQs = () => {
  return (
    <div className='faq-container'>
      <Content>
        <h1>FAQs</h1>
        <p>This is the list of Frequently asked questions for Knacksteem. It is intended to serve as a self-service utility document for new contributors or already existing contributors on the platform. This document may be updated from time to time to suit any new changes to the project as the project is highly dynamic and new developments or changes are likely to be implemented occasionally.</p>
        <h4>What is Knacksteem?</h4>
        <p>Knacksteem is a platform that aims at exposing and rewarding original and creative talents of contributors via a decentralized voting based reward system built on the Steem blockchain.</p>

        <h4>Who can use Knacksteem?</h4>
        <p>Anyone with a creative talent and is passionate about it. Knacksteem is a platform with no restriction to gender locale or race. However Knacksteem restricts its services from minors under the age of 13. Read <a href="https://knacksteem.org/tos">Knacksteem Terms of Service.</a></p>

        <h4>How do I sign up on Knacksteem?</h4>
        <p>Knacksteem requires a steem account to sign in. Your steem account is also your Knacksteem account.  You can get your steem account <a href="https://signup.steemit.com">here</a> ( Steem account creation may take up to two weeks before it is activated. However, you have the option of waiting in queue or instantly creating an account by using third-party tools (<a href="https://steemfounders.com/">Steemfounders</a>, <a href="https://blocktrades.us/create-steem-account">Blocktrades</a>, and <a href="https://anon.steem.network/">Anonsteem</a>).</p>

        <h4>Is it safe to login with my private keys?</h4>
        <p>Knacksteem utilizes steemconnect v2 for secure log-in. Your private information is never stored by the developer and nobody has any means of access to that information except the location where you stored it for safekeeing is compromised. Hence you are adviced to store passwords offline as no means of storage on the internet is 100% secured.</p>

        <h4>Is Knacksteem free to use?</h4>
        <p>Yes, Knacksteem is completely free to use.  Anyone with a Steem account can log in to Knacksteem and start contributing. There are no fees attached to use the Knacksteem platform.</p>

        <h4>How do I use Knacksteem?</h4>
        <p>To use Knacksteem simply means to contribute on Knacksteem platform. Log in with your Steem account and start making contributions to the available categories in accordance to Knacksteem's <a href="https://knacksteem.org/guidelines">guidelines</a>. To ensure the contribution is properly submitted into the feed, ensure the right tags are used.</p>

        <h4>What are tags?</h4>
        <p> Tags provide a useful way to group related posts together and also to give community members who might read the post what it's about. </p>

        <h4>How do I tag my contribution on Knacksteem and what is the maximum number of tags?</h4>
        <p>The maximum number of tags on Knacksteem is five(5). The first two tags are reserved for successful entry to knacksteem feed. The first tag is Knacksteem automatically while the second tag is the category which you want to contribute to. The rest 3 slots are free for you to decide. However, use tags relevant to your contribution to gain the attraction of other community members.</p>

        <h4>How do I get rewarded using knacksteem?</h4>
        <p>To reward the contributor’s rewards, Knacksteem will utilize the Steem blockchain. Which means the money generated would be in the form of a cryptocurrency called STEEM which is the token of the Steem blockchain and this is done through community voting. </p>

        <h4>What categories are available for contribution on Knacksteem?</h4>
        <p>These are the categories available on Knacksteem; <b>DIY, ART, ALTRUISM, FASHION, TECH TREND, MUSIC, JOKE and HUMOR, GAMING</b></p>


        <h4>My skillset/talent is not found on the category list, how else can I contribute?</h4>
        <p>Contact us at <a href="https://discord.gg/rSjQWcK">discord</a>, tell us about your skill and it'll be considered if adequate reasons why the category should be added is provided and if the category will add some value to the community.</p>

        <h4>Who are supervisors moderators/mavens?</h4>
        <p>Mavens are trusted community members who are in charge of verifying and reviewing the quality of contributions and scoring contributions. They also assist community members and offer help to new contributors who find it difficult contributing on Knacksteem.
        Supervisors are also team members who supervise the activities of moderators/mavens to ensure their reviews of a contribution is accurate.  Supervisors can also moderate/review contributions when necessary.</p>

        <h4>How long will it take my contribution to pass review?</h4>
        <p>The review may take up to 48-72 hours depending on the number of contributions in the feed.</p>

        <h4>Is there a limit to the number of contributions on Knacksteem?</h4>
        <p>There are no limits to contributions on Knacksteem.</p>

        <h4>What are the benefits of using Knacksteem?</h4>
        <p>Knacksteem is a decentralized platform not requiring the services of third parties and mediators. This means that whatever rewards you earn on a contribution is paid directly to your Steem wallet. However, it's good to know that 15% of rewards generated are "Beneficiary rewards".</p>
        <p>Knacksteem will lead to income generation for you by merely sharing your talents, passions, and areas of expertise.</p>
        <p>Knacksteem will be a hub where your awesome content is showcased to a broader community, thereby receiving a lot of support and leading to improvements via feedback and constructive criticisms.</p>

        <h4>What is a Beneficiary reward?</h4>
        <p>Beneficiary rewards are rewards reserved for Sponsors and team members of Knacksteem who are either supervisors or moderators. The Beneficiary reward is 15% of total rewards generated from a contribution on Knacksteem. 12% is reserved and sent to Knacksteem sponsors. The sponsor's reward is directly proportional to the amount of steem power(SP) they delegate to Knacksteem. The other 3% is used to reward Knacksteem supervisors and moderators for their hard work in verifying and reviewing the quality of content submitted by community members on Knacksteem.</p>

        <h4>I need help, how can I contact the Knacksteem team?</h4>
        <p>Join us on our <a href="https://discord.gg/rSjQWcK">discord</a> server and chat with other community members. Supervisors and moderators are available to listen to any complaints you might have and offer help and solutions to them.</p>
      </Content>
    </div>
  );
};

export default FAQs;
