import React from "react";
import { Dropdown } from "semantic-ui-react";

const DropdownExampleSearchSelection = ({ name, list, handler }) => (
  <Dropdown
    fluid
    selection
    onChange={(_, data) => {
      console.log(data.value);
      handler(data.value);
    }}
    options={list}
    defaultValue={name}
  />
);

export default DropdownExampleSearchSelection;
