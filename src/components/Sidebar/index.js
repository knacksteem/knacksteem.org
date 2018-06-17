import React from 'react';
import {withRouter} from 'react-router-dom';
import {Layout, Menu, Icon} from 'antd';
const {Sider} = Layout;

const CustomSidebar = ({history, location}) => {
	const handleMenuClick = (evt) => {
    console.log(evt.key);
		history.push(evt.key);
	};
	return (
		<Sider
			width={200}
			breakpoint="lg"
			collapsedWidth="0"
			onCollapse={(collapsed, type) => {console.log(collapsed, type);}}
		>
			{/*<div className="logo"><img src="static/svg/logo.svg" alt="MAM Logo" /></div>*/}
			<div className="labelMenu">LS Steem Admin</div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]} style={{height: '100%', borderRight: 0, marginTop: '20px'}} onClick={handleMenuClick}>
				<Menu.Item key="/">
					<Icon type="area-chart" />
					<span className="nav-text">Dashboard</span>
				</Menu.Item>
				<Menu.Item key="/category/test1">
					<Icon type="trophy" />
					<span className="nav-text">Test1</span>
				</Menu.Item>
				<Menu.Item key="/category/test2">
					<Icon type="user" />
					<span className="nav-text">Test2</span>
				</Menu.Item>
			</Menu>
		</Sider>
	);
};

export default withRouter(CustomSidebar);
