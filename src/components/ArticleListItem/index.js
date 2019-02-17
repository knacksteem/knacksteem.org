import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Row, Col, Avatar } from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import { reserveArticle, approveArticle, rejectArticle } from '../../actions/articles';
import { truncateString, prettyDate } from '../../services/functions';
import './index.css';
import VotingSlider from '../../components/VotingSlider';


class ArticleListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sliderVisible: false,
      votingDirection: 100,
      sliderValue: 100
    };
  }

  onReserveClick = () => {
    const { data, status, dispatch } = this.props;
    // In case supervisor clicked on reserve for review in the Home page.
    // status undefined means it is not on approved or review page;
    if (status === undefined)
      dispatch(reserveArticle(data.permlink, 'approved'));
    else
      dispatch(reserveArticle(data.permlink, status));
  };

  //reject the current article
  onRejectClick = () => {
    const { data, status, dispatch } = this.props;
    dispatch(rejectArticle(data.permlink, status));
  };

  //Give Voting Slider on Approve Click
  onApproveClick = () => {
    const {sliderVisible} = this.state;
    if(!sliderVisible) {
      this.setState({
        sliderVisible: true
      });
    }
  };

  onCancel = () => {
    this.setState({
      sliderVisible: false
    });
  };

  //approve the current article with the Given Score
  onConfirm = () => {
    const { data, status, dispatch } = this.props;
    const { sliderValue } = this.state;
    dispatch(approveArticle(data.permlink, status, sliderValue));
  };

  // Since we are using the same Voting Slider as of Vote
  // We need to devide it by 100
  changeVotePower = (votePower) => {
    this.setState({sliderValue: votePower / 100});
  }

  render() {
    const { data, user, status, onUpvoteSuccess } = this.props;
    const {votingDirection, sliderVisible} = this.state;
    const showVoteWorth = false;
    return (
      <Row className="ant-list-item list-item-article">
        <Row type="flex" align="middle">
          <Col style={{ marginLeft: '10px' }}>
            <a title="Visit profile" href="/home">
              <Avatar size="small" src={`${data.authorImage}`} icon="user" />
            </a>
          </Col>
          <Col >
            <p className="my-auto"><a title="Visit Profile" href={'/@' + data.author}><b>{data.author}</b></a> ({data.authorReputation})</p>
          </Col>
          <Col >
            <p className="my-auto">in {data.tags[1]}</p>
          </Col>
          <Col >
            <p className="my-auto">{prettyDate(data.postedAt)}</p>
          </Col>
        </Row>
        <Row className="article-item-list-container" type="flex" style={{ overflow: 'hidden' }}>
          {data.coverImage &&
            <Link style={{ width: 'inherit', height: 'auto' }} to={`/articles/${data.author}/${data.permlink}`}>
              <Row className="article-image-container" style={{
                backgroundImage: `url(https://steemitimages.com/640x480/${data.coverImage})`
              }}>
              </Row>
            </Link>
          }
          <Col className="article-details" gutter={0} >
            <Col>
              <Link to={`/articles/${data.author}/${data.permlink}`}>
                <h3 className="article-title">{data.title}</h3>
              </Link>
              <Link to={`/articles/${data.author}/${data.permlink}`}>
                <div className="ant-list .article-content-wrapper">{truncateString(data.description, 140)}</div>
              </Link>
            </Col>
          </Col>
        </Row>
        <ArticleMetaBottom data={data} onUpdate={onUpvoteSuccess} user={user} />
        {((status === 'pending' || (data.moderation && data.moderation.approved && user.isSupervisor)) && data.author !== user.username) &&
          <div className="mod-functions">
            <Button size="small" type="primary" onClick={this.onReserveClick}>Reserve for review</Button>
          </div>
        }
        {(status === 'reserved' && (user.username !== data.moderation.reservedBy)) &&
          <div className="reservedBy">Reserved for review by <Link to={`/@${data.moderation.reservedBy}`}>{data.moderation.reservedBy}</Link></div>
        }
        {(status === 'reserved' && user.username === data.moderation.reservedBy) &&
          <div className="mod-functions">
            <Button size="small" type="primary" onClick={this.onApproveClick}>Approve</Button>
            <Button size="small" type="danger" onClick={this.onRejectClick}>Reject</Button>
          </div>
        }
        { sliderVisible &&
          <div>
            <VotingSlider onCancel={this.onCancel} onConfirm={this.onConfirm} onVotePowerChange={this.changeVotePower} votingDirection={votingDirection} showVoteWorth={showVoteWorth} />
          </div>
        }
      </Row>
    );
  };
}

ArticleListItem.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object, //JSON object for the article data
  status: PropTypes.string, //status flag for article (pending, approved, ...)
  onUpvoteSuccess: PropTypes.func.isRequired
};

export default connect()(ArticleListItem);
