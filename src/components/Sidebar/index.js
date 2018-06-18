import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import './index.css';
import logo from '../../assets/images/logo.png';
const {Sider} = Layout;

const menuElements = [
  {key: '/', name: 'All'},
  {key: '/categories/vlog', name: 'VLog'},
  {key: '/categories/graphics', name: 'Graphics'}
];

const CustomSidebar = ({history, location}) => {
  const handleMenuClick = (evt) => {
    //history.push(evt.key);
  };
  return (
    <Sider
      width={200}
      breakpoint="lg"
      collapsedWidth="0"
      onCollapse={(collapsed, type) => {console.log(collapsed, type);}}
    >
      <div className="logo"><img src={logo} alt="Knacksteem Logo" /></div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]} style={{height: '100%', borderRight: 0, marginTop: '20px'}} onClick={handleMenuClick}>
        {menuElements.map((elem, index) => {
          return (
            <Menu.Item key={elem.key}>
              <Link to={elem.key}>{elem.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default withRouter(CustomSidebar);
