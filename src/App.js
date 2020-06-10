import React, { useRef, useState } from "react";
import DropdownExampleSearchSelection from "./components/DropDown";
import Output from "./components/Output";
import Variables from "./components/Variables";
import Editor from "@monaco-editor/react";
import { Button } from "semantic-ui-react";
import { URL } from "./utils";
import { Cointainer, VariableCointainer, ButtonCointainer } from "./AppStyled";

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
    let types = { python: "python", javascript: "javascript", php: "php" };
    let varObj = {};
    for (let i = 0; i < varList.length; i++) {
      let key = Object.keys(varList[i])[0];
      if (key === "$") continue;
      let name = key.startsWith("$") ? key : "$" + key;
      varObj[name] = Object.entries(varList[i])[0][1];
    }

    let d = {
      id: "1234",
      lang: types[language],
      vars: varObj,
      code: valueGetter.current(),
    };

    console.log(d);
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
