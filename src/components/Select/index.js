import React from "react";
import {Select} from "antd";
const Option = Select.Option;

export const KnackSelect = props => {
    return  (
        <Select defaultValue="Categories" style={{ width: 120 }}>
            <Option value="Graphic">Graphic</Option>
            <Option value="Vlog">Vlog</Option>
            <Option value="Art" >Art</Option>
            <Option value="Tech Trend">Tech Trend</Option>
            <Option value="Knack">Knack</Option>
        </Select>
    )
    
}

