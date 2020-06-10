import React, { useState } from "react";
import { Input, Button } from "semantic-ui-react";
import styled from "styled-components";

const Cointainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fit));
    row-gap:10px;
    text-align:center;
    
`;
const Variables = ({ varList, updater, createNewFeild }) => {
  return (
    <Cointainer>
      <h3 style={{ marginTop: "auto" }}>Name </h3>
      <h3 style={{ marginTop: "auto" }}>Value</h3>
      {varList.map((obj, i) => (
        <Pair obj={obj} index={i} updater={updater} />
      ))}
      <div></div>
      <Button
        onClick={() => {
          createNewFeild({ "": "" });
        }}
        primary
        style={{ width: "160px", justifySelf: "right" }}
      >
        Add Param
      </Button>
    </Cointainer>
  );
};

const Pair = ({ obj, updater, index }) => {
  let [value, setValue] = useState(obj);
  return (
    <>
      <Input
        placeholder="$name"
        value={Object.keys(value)[0]}
        onChange={(e) => {
          setValue({ [e.target.value]: Object.entries(value)[0][1] });
          updater(index, { [e.target.value]: Object.entries(value)[0][1] });
        }}
      />
      <Input
        value={Object.entries(value)[0][1]}
        placeholder="2"
        onChange={(e) => {
          setValue({ [Object.keys(value)[0]]: e.target.value });
          updater(index, { [Object.keys(value)[0]]: e.target.value });
        }}
      />
    </>
  );
};

export default Variables;
