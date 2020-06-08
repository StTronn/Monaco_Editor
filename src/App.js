import React, { useRef, useState, useEffect } from "react";
import DropdownExampleSearchSelection from "./components/DropDown";
import Output from "./components/Output";
import Variables from "./components/Variables";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { URL } from "./utils";
import _ from "lodash";

const Cointainer = styled.div`
  display: grid;
  margin-left: 200px;
  margin-right: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
  grid-template-rows: 40px 40vh 40px;
  row-gap: 10px;
`;
const VariableCointainer = styled.div`
  display: grid;
  margin: 0 200px;
`;
const ButtonCointainer = styled.div`
  display: grid;
  justify-self: right;
  grid-template-columns: 100px 100px;
  column-gap: 10px;
  justify-content: center;
`;

function App() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("dark");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [varList, setVarList] = useState([{ $i: 1 }]);
  const valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  let updater = (index, obj) => {
    let arr = [...varList];
    arr[index] = obj;
    console.log(arr);
    setVarList(arr);
  };

  let createNewFeild = (obj) => {
    let arr = [...varList];
    arr.push(obj);
    setVarList(arr);
  };

  let fetchdata = (path) => {
    let types = { python: "python", javascript: "node", php: "php" };
    let varObj = {};
    for (let i = 0; i < varList.length; i++) {
      let key = Object.keys(varList[i])[0];
      if (key === "$") continue;
      let name = key.startsWith("$") ? key : "$" + key;
      varObj[name] = Object.entries(varList[i])[0][1];
    }
    console.log(valueGetter.current());
    let d = {
      name: types[language],
      var_obj: varObj,
      text: valueGetter.current(),
    };
    console.log("hello fetch");
    setLoading(true);

    fetch(URL + path, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(d),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOutput(data.output);
        setLoading(false);
      })
      .catch(function (res) {
        console.log(res);
        setLoading(false);
      });
  };

  return (
    <>
      <VariableCointainer>
        <Variables
          varList={varList}
          createNewFeild={createNewFeild}
          updater={updater}
        />
      </VariableCointainer>
      <Cointainer>
        <ButtonCointainer>
          <DropdownExampleSearchSelection
            name={theme}
            handler={setTheme}
            list={["dark", "light"].map((i) => ({ key: i, text: i, value: i }))}
          />
          <DropdownExampleSearchSelection
            name={language}
            handler={setLanguage}
            list={["javascript", "python", "php"].map((i) => ({
              key: i,
              text: i,
              value: i,
            }))}
          />
        </ButtonCointainer>
        <Editor
          value={""}
          language={language}
          theme={theme}
          editorDidMount={handleEditorDidMount}
        />
        <div>
          <Button
            style={{
              width: "160px",
              display: "inline",
              justifySelf: "right",
            }}
            primary={!loading}
            onClick={() => {
              fetchdata("/dryRun");
            }}
            disabled={!isEditorReady}
          >
            {loading ? "Running" : "Run"}
          </Button>
          <Button
            style={{
              width: "160px",
              display: "inline",
              justifySelf: "right",
            }}
            primary={!loading}
            onClick={() => {
              fetchdata("/uploadCode");
            }}
            disabled={!isEditorReady}
          >
            {loading ? "Uploading" : "Upload"}
          </Button>
        </div>
        <h1>Output</h1>
        <Output style={{ minWidth: "40px" }}>{output}</Output>
      </Cointainer>
    </>
  );
}
export default App;
