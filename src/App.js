import React, { useRef, useState, useEffect } from "react";
import DropdownExampleSearchSelection from "./components/DropDown";
import Output from "./components/Output";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import axios from "axios";

const Cointainer = styled.div`
  display: grid;
  margin-left: 90px;
  margin-right: 90px;
  margin-top: 20px;
  margin-bottom: 20px;
  grid-template-rows: 40px 80vh 40px;
  row-gap: 10px;
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
  const valueGetter = useRef();

  function handleEditorDidMount(_valueGetter) {
    setIsEditorReady(true);
    valueGetter.current = _valueGetter;
  }

  let fetchData = async () => {
    setLoading(true);
    console.log("hello");
    let res = await axios.post("http://localhost:8080/parser", {
      var_obj: {},
      text: valueGetter.current(),
      filename: "node",
    });
    setLoading(false);
    setOutput(res.data.status);
  };

  function handleShowValue() {
    fetchData();
  }

  return (
    <>
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
          value={"// write your code here"}
          language={language}
          theme={theme}
          editorDidMount={handleEditorDidMount}
        />
        <Button
          style={{ width: "160px", justifySelf: "right" }}
          primary={!loading}
          onClick={handleShowValue}
          disabled={!isEditorReady}
        >
          {loading ? "Running" : "Run"}
        </Button>
        <h1>Output</h1>
        <Output style={{ minWidth: "40px" }}>{output}</Output>
      </Cointainer>
      {!loading && <div>{output}</div>}
      {loading && <h1> Loading</h1>}
    </>
  );
}
export default App;
