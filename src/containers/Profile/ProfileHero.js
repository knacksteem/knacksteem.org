import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout } from 'antd';
import coverFallbackImage from '../../assets/images/cover.jpg';
import {getUserCoverImage} from '../../services/functions';
import './ProfileHero.css';

let styles = {
  heroContainer: {},
  counterDisplay: {
    marginTop: '-25px'
  }
};

const ProfileHero = (props) => {
  const {style, user} = props;
  let coverImage = getUserCoverImage(user);

  if (typeof coverImage === 'undefined' || coverImage === '') {
    coverImage = coverFallbackImage;
  }

  styles.heroContainer.backgroundImage = `url(${coverImage})`;
  
  return (
    <div style={{...styles.heroContainer, ...style}} className="hero-container">
      <Layout id="content-layout">
        <div className="hero-container-inner">
          <div className="hero-content">
            <img className="hero-avatar" alt={user.username} src={`https://steemitimages.com/u/${user.username}/avatar`} />
            <section className="inline-element">
              <div className="inline-element">
                <h1 className="inline-element hero-title">
                  RoundedHexagon
                </h1>
                <span style={styles.counterDisplay}>
                  <Button className="inline-element" size="large">
                    <strong style={{ fontSize: '18px' }}>64</strong>
                  </Button>
                </span>
              </div>
              <span className="hero-title-sub">@creatrixity</span>

            </section>

          </div>
        </div>
      </Layout>
    </div>
  );
};

ProfileHero.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object
};

export default ProfileHero;