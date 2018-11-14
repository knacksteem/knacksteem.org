import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Row } from 'antd';
import coverFallbackImage from '../../../assets/images/cover.jpg';
import './ProfileHero.css';

let styles = {
  heroContainer: {},
};

/**
 * Displays the information about a user in a prominent hero area.
 * 
 * @param {Object}  Object.style      - Style attributes.
 * @param {String}  Object.name       - Profile user's name.
 * @param {String}  Object.username   - Profile user's username.
 * @param {Integer} Object.reputation - Profile user's reputation score.
 * @param {String}  Object.coverImage - Profile user's cover image URL.
 * 
 * @return {Object<JSXElement>}
 */
const ProfileHero = ({
  style,
  name,
  username,
  reputation,
  coverImage
}) => {

  if (typeof coverImage === 'undefined' || coverImage === '') {
    coverImage = coverFallbackImage;
  }

  styles.heroContainer.backgroundImage = `url(${coverImage})`;
  
  return (
    <Row  type="flex" style={{...styles.heroContainer, minWidth: '100%',...style}} className="hero-container">
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
                  <Button className="inline-element" size="small">
                    <strong style={{ fontSize: '18px' }}>{reputation}</strong>
                  </Button>
                </span>
              </div>
              <span className="hero-title-sub">@{username}</span>

            </section>

          </div>
        </div>
      </Layout>
    </Row>
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