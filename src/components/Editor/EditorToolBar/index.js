import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Menu, Dropdown, Icon, Row, Col } from 'antd';  
import './index.css';

const tooltip = (description, shortcut) =>
  (<span>
    {description}
    <br />
    <b>
      {shortcut}
    </b>
  </span>);

const EditorToolbar = ({ onSelect }) => {
  const menu = (
    <Menu onClick={e => onSelect(e.key)}>
      <Menu.Item key="h1"><h1>Heading 1</h1></Menu.Item>
      <Menu.Item key="h2"><h2>Heading 2</h2></Menu.Item>
      <Menu.Item key="h3"><h3>Heading 3</h3></Menu.Item>
      <Menu.Item key="h4"><h4>Heading 4</h4></Menu.Item>
      <Menu.Item key="h5"><h5>Heading 5</h5></Menu.Item>
      <Menu.Item key="h6"><h6>Heading 6</h6></Menu.Item>
    </Menu>
  );

  return (
    <Row  type="flex" align="middle" justify="center" style={{ marginLeft: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px'}} justify="left" className="EditorToolbar">
      <Col>
        <Dropdown overlay={menu}>
          <Button className="EditorToolbar__button">
            <i className="fas fa-angle-down" /> 
          </Button>
        </Dropdown>
      </Col>
      
      <Col style={{display: 'flex', alignItems: 'center'}}>
        <Tooltip title={'Ctrl+b'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('b')}>
            <i className="fas fa-bold" />
          </Button>
        </Tooltip>
      
        <Tooltip title={'Ctrl+i'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('i')}>
            <i className="fas fa-italic" />
          </Button>
        </Tooltip>
        <Tooltip title={'Ctrl+q'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('q')}>
            <i className="fas fa-angle-left" />
          </Button>
        </Tooltip>
        <Tooltip title={'Ctrl+k'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('link')}>
            <i className="fas fa-link" />
          </Button>
        </Tooltip>

        <Tooltip title={'Ctrl+m'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('image')}>
            <i className="fas fa-image" />
          </Button>
        </Tooltip>
        <Tooltip title={'Ctrl+n'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('code')}>
            <i className="fas fa-code" />
          </Button>
        </Tooltip>
        <Tooltip title={'Ctrl+shift+l'}>
          <Button className="EditorToolbar__button" onClick={() => onSelect('unorderedlist')}>
            <i className="fas fa-list-ul" />
          </Button>
        </Tooltip>
      </Col>
    </Row>
  );
};

EditorToolbar.propTypes = {
  onSelect: PropTypes.func,
};

export default EditorToolbar;
 