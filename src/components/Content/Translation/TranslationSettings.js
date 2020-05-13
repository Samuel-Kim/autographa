import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import BackupIcon from "@material-ui/icons/Backup";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import GetAppIcon from "@material-ui/icons/GetApp";
import SaveIcon from "@material-ui/icons/Save";
import SettingsIcon from "@material-ui/icons/Settings";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  IconButton,
  Typography,
  Button,
  TextField,
  Paper,
} from "@material-ui/core";
import TranslationImport from "./TranslationImport";
const lookupsDb = require(`${__dirname}/../../../core/data-provider`).lookupsDb();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    width: 500,
  },
  fullList: {
    width: "auto",
  },
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function TranslationSettings() {
  const classes = useStyles();
  var listArray = [];
  const [dir, setDir] = React.useState("LTR");
  const [state, setState] = useState({
    right: false,
  });
  const [language, setlanguage] = useState("");
  const [languageCode, setlanguageCode] = useState("");
  const [langVersion, setlangVersion] = useState("");
  const [location, setlocation] = useState("");
  const [open, setOpen] = React.useState(true);
  const [tab2, setTab2] = useState(false);
  const [helperText, sethelperText] = useState("");
  const [helperTextVersion, sethelperTextVersion] = useState("");
  const [islangcodevalid, setIslangcodevalid] = useState(false);
  const [islanvervalid, setIslangvervalid] = useState(false);
  const [listlang, setListlang] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (helperText !== "") {
      setIslangcodevalid(true);
    } else if (helperTextVersion !== "") {
      setIslangvervalid(true);
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };
  const ExpandTab2 = () => {
    setTab2(!tab2);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };
  const toggleDrawerClose = (anchor, open) => (event) => {
    handleSubmit(event);
    if (helperText === "" && helperTextVersion === "") {
      setState({ ...state, [anchor]: open });
    }
  };
  const handleDirChange = (event) => {
    setDir(event.target.value);
  };

  const setMessage = (msgid, isValid) => {
    sethelperText(msgid);
    setIslangcodevalid(isValid);
    return isValid;
  };

  const listLanguage = (val) => {
    setlanguage(val);
    if (val.length >= 2) {
      var autoCompleteResult = matchCode(val);
      autoCompleteResult.then((res) => {
        if (res != null) {
          listArray = Object.entries(res).map((e) => ({
            title: e[1] + " (" + [e[0]] + ")",
          }));
          if (listArray) {
            setListlang(listArray);
          }
        }
      });
    }
  };

  const matchCode = (input) => {
    var filteredResults = {};
    return lookupsDb
      .allDocs({
        startkey: input.toLowerCase(),
        endkey: input.toLowerCase() + "\uffff",
        include_docs: true,
      })
      .then(function (response) {
        if (response !== undefined && response.rows.length > 0) {
          Object.keys(response.rows).map((index, value) => {
            if (response.rows) {
              if (
                !filteredResults.hasOwnProperty(
                  response.rows[index].doc["lang_code"]
                )
              ) {
                filteredResults[response.rows[index].doc["lang_code"]] =
                  response.rows[index].doc["name"];
              } else {
                let existingValue =
                  filteredResults[response.rows[index].doc["lang_code"]];
                filteredResults[response.rows[index].doc["lang_code"]] =
                  existingValue + " , " + response.rows[index].doc["name"];
              }
            }
            return null;
          });
          return filteredResults;
        } else {
          return [];
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    const target_setting = (lang, langVersion) => {
      const regExp = /\(([^)]+)\)/;
      let langCode;
      let _langCode = regExp.exec(lang);
      if (_langCode) {
        langCode = _langCode[1];
      } else langCode = language;
      setlanguageCode(langCode);
      let version = langVersion;
      // let path = folderPath;
      if (langCode === null || langCode === "") {
        sethelperText("The Bible language code is required.");
      } else if (langCode.match(/^\d/)) {
        sethelperText(
          "The Bible language code length should be between 2 and 8 characters and can’t start with a number."
        );
      } else if (/^([a-zA-Z0-9_-]){2,8}$/.test(langCode) === false) {
        sethelperText(
          "The Bible language code length should be between 2 and 8 characters and can’t start with a number"
        );
      }
      // else if (path === null || path === "") {
      //   isValid = this.setMessage("dynamic-msg-bib-path-validation", false);
      // }
      else {
        setIslangcodevalid(false);
        sethelperText("");
      }
      if (version === null || version === "") {
        sethelperTextVersion("The Bible version is required");
      } else {
        setIslangvervalid(false);
        sethelperTextVersion("");
      }
    };
    target_setting(language, langVersion);
    if (setIslangcodevalid === false && language !== undefined) {
      sethelperText("");
    }
  }, [language, langVersion]);

  const list = (anchor) => (
    <div className={clsx(classes.list)} role="presentation">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Settings
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary="Translation Settings" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
                <form
                  className={classes.container}
                  onSubmit={toggleDrawerClose("right", false)}
                >
                  <div>
                    <Autocomplete
                      options={listlang ? listlang : language}
                      getOptionLabel={(option) =>
                        option.title ? option.title : language
                      }
                      value={language || ""}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setlanguage(newValue.title);
                        }
                      }}
                      noOptionsText={helperText}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={islangcodevalid}
                          helperText={helperText}
                          label="Language Code"
                          margin="normal"
                          className={classes.margin}
                          variant="outlined"
                          onInput={(e) => {
                            listLanguage(e.target.value);
                          }}
                        />
                      )}
                    />
                    <TextField
                      className={classes.margin}
                      variant="outlined"
                      id="input-with-icon-textfield"
                      label="Version"
                      error={islanvervalid}
                      helperText={helperTextVersion}
                      placeholder="NET-S3"
                      value={langVersion}
                      onInput={(e) => setlangVersion(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InsertDriveFileIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      className={classes.margin}
                      variant="outlined"
                      id="input-with-icon-textfield"
                      style={{ width: "70%" }}
                      label="Export Folder Location"
                      required
                      value={location}
                      placeholder="Path of folder for saving USFM files"
                      onInput={(e) => setlocation(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BackupIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormControl
                      className={classes.margin}
                      component="fieldset"
                    >
                      <FormLabel component="legend">Script Direction</FormLabel>
                      <RadioGroup
                        aria-label="Script Direction"
                        name="dir"
                        value={dir}
                        onChange={handleDirChange}
                      >
                        <FormControlLabel
                          value="LTR"
                          control={<Radio />}
                          label="LTR"
                        />
                        <FormControlLabel
                          value="RTL"
                          control={<Radio />}
                          label="RTL"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="medium"
                    style={{
                      float: "right",
                      marginRight: "33px",
                    }}
                    className={classes.button}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                </form>
              </Paper>
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={ExpandTab2}>
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText primary="Translation Import" />
          {tab2 ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={tab2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem className={classes.nested}>
              <Paper className={classes.root}>
                <TranslationImport
                  langCode={languageCode}
                  langVersion={langVersion}
                />
              </Paper>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <IconButton color="inherit" onClick={toggleDrawer("right", true)}>
          <SettingsIcon />
        </IconButton>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onOpen={toggleDrawer("right", true)}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}