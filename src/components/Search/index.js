import React from "react";
import {Input} from "antd";
const Search = Input.Search;

export const KnackSearch = props => {
        return(
            <Search
                placeholder="Search through Knacksteem"
                style={{width: 300}}
                onSearch={props.onSearch}
                
            >    
            </Search>
        )
}
