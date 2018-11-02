import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout } from 'antd';
import coverFallbackImage from '../../../assets/images/cover.jpg';
import './ProfileHero.css';

let styles = {
  heroContainer: {},
  counterDisplay: {
    marginTop: '-25px'
  }
};

const ProfileHero = (props) => {
  let {
    style,
    name,
    username,
    reputation,
    coverImage
  } = props;

  if (typeof coverImage === 'undefined' || coverImage === '') {
    coverImage = coverFallbackImage;
  }

  styles.heroContainer.backgroundImage = `url(${coverImage})`;
  
  return (
    <div style={{...styles.heroContainer, ...style}} className="hero-container">
      <Layout id="content-layout">
        <div className="hero-container-inner">
          <div className="hero-content">
            <img className="hero-avatar" alt={username} src={`https://steemitimages.com/u/${username}/avatar`} />
            <section className="inline-element">
              <div className="inline-element">
                <h1 className="inline-element hero-title">
                  {name}
                </h1>
                <span style={styles.counterDisplay}>
                  <Button className="inline-element" size="large">
                    <strong style={{ fontSize: '18px' }}>{reputation}</strong>
                  </Button>
                </span>
              </div>
              <span className="hero-title-sub">@{username}</span>

            </section>

          </div>
        </div>
      </Layout>
    </div>
  );
};

ProfileHero.propTypes = {
  style: PropTypes.object,
  username: PropTypes.string,
  name: PropTypes.string,
  coverImage: PropTypes.string,
  reputation: PropTypes.number
};

export default ProfileHero;