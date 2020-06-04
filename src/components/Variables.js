import React from "react";
import { Input, Button } from "semantic-ui-react";
import styled from "styled-components";

const Cointainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fit));
    row-gap:10px;
    text-align:center;
    
`;
const Variables = ({ obj }) => {
  return (
    <Cointainer>
      <h3 style={{ marginTop: "auto" }}>Name </h3>
      <h3 style={{ marginTop: "auto" }}>Value</h3>
      <Input placeholder="$name" />
      <Input placeholder="2" />
      <div></div>
      <Button primary style={{ width: "160px", justifySelf: "right" }}>
        Add Param
      </Button>
    </Cointainer>
  );
};

export default Variables;
